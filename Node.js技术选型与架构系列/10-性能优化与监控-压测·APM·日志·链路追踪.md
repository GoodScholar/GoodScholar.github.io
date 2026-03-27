# 📊 Node.js 技术选型（十）：性能优化与监控 — 压测 · APM · 日志 · 链路追踪

> **系列导读**：完结篇！系统上线不是终点，持续的**性能优化和监控**才是。
> 本篇从 **压力测试、Node.js Profiling、日志体系、链路追踪**四个维度，
> 帮你建立一套完整的可观测性体系。

---

## 🎯 1. 可观测性三大支柱

```
┌────────────────────────────────────────────────┐
│              可观测性（Observability）           │
├────────────┬───────────────┬───────────────────┤
│   Metrics  │    Logging    │     Tracing       │
│   指标     │    日志       │     链路追踪       │
│            │              │                    │
│  CPU/内存   │  结构化日志   │  请求全链路        │
│  QPS/延迟   │  错误堆栈    │  微服务调用链      │
│  错误率     │  访问日志    │  耗时分析          │
│            │              │                    │
│ Prometheus │  ELK / Loki  │  Jaeger / Zipkin  │
│ Grafana    │  Winston     │  OpenTelemetry    │
└────────────┴───────────────┴───────────────────┘
```

---

## ⚡ 2. 压力测试

### 2.1 压测工具对比

| 工具 | 语言 | 特点 | 推荐场景 |
|------|------|------|---------|
| autocannon | Node.js | 轻量、命令行即用 | 快速基准测试 |
| k6 | Go | 脚本化、支持复杂场景 | 完整负载测试 |
| Artillery | Node.js | YAML 配置、支持 WebSocket | 功能/压力综合测试 |
| wrk | C | 极高性能 | 极限并发测试 |

### 2.2 autocannon 快速压测

```bash
# 安装
npm install -g autocannon

# 基础压测：10 个连接 30 秒
autocannon -c 10 -d 30 http://localhost:3000/api/users

# 结果示例
# ┌─────────┬────────┬────────┬────────┬────────┬──────────┐
# │ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg      │
# ├─────────┼────────┼────────┼────────┼────────┼──────────┤
# │ Latency │ 0 ms   │ 1 ms   │ 3 ms   │ 5 ms   │ 1.23 ms  │
# └─────────┴────────┴────────┴────────┴────────┴──────────┘
# │ Req/Sec │ 7500   │ 8200   │ 8800   │ 9000   │ 8150     │
# │ Bytes   │ 2.1 MB │ 2.3 MB │ 2.5 MB │ 2.6 MB │ 2.3 MB   │
```

### 2.3 k6 脚本化压测

```javascript
// k6-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

// 负载阶段配置
export const options = {
  stages: [
    { duration: '30s', target: 20 },    // 预热：30s 增到 20 并发
    { duration: '1m', target: 100 },    // 加压：1min 增到 100 并发
    { duration: '2m', target: 100 },    // 稳定：保持 100 并发 2min
    { duration: '30s', target: 0 },     // 降压：30s 降到 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],   // 95% 请求 < 200ms
    http_req_failed: ['rate<0.01'],     // 错误率 < 1%
  },
}

const BASE_URL = 'http://localhost:3000'

export default function () {
  // 登录
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'test@test.com',
    password: 'password123',
  }), { headers: { 'Content-Type': 'application/json' } })

  check(loginRes, { '登录成功': (r) => r.status === 200 })
  const token = loginRes.json('accessToken')

  // 获取用户列表
  const usersRes = http.get(`${BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  check(usersRes, {
    '状态码 200': (r) => r.status === 200,
    '返回数据': (r) => r.json('data.users').length > 0,
  })

  sleep(1)
}
```

```bash
# 运行
k6 run k6-test.js

# 输出到 Grafana
k6 run --out influxdb=http://localhost:8086/k6 k6-test.js
```

---

## 🔍 3. Node.js 性能调优

### 3.1 常见性能瓶颈

| 瓶颈类型 | 症状 | 排查工具 |
|---------|------|---------|
| CPU 密集 | Event Loop 阻塞，延迟飙升 | `--prof` / Clinic.js |
| 内存泄漏 | 内存持续增长不释放 | `--inspect` / heapdump |
| I/O 瓶颈 | 数据库/Redis 响应慢 | 慢查询日志、APM |
| Event Loop 延迟 | 所有请求延迟增加 | `monitorEventLoopDelay` |
| 连接池耗尽 | 数据库连接超时 | 连接池监控 |

### 3.2 Event Loop 监控

```typescript
import { monitorEventLoopDelay } from 'perf_hooks'

const histogram = monitorEventLoopDelay({ resolution: 20 })
histogram.enable()

// 每 10 秒输出 Event Loop 延迟
setInterval(() => {
  console.log({
    min: `${(histogram.min / 1e6).toFixed(2)}ms`,
    max: `${(histogram.max / 1e6).toFixed(2)}ms`,
    mean: `${(histogram.mean / 1e6).toFixed(2)}ms`,
    p99: `${(histogram.percentile(99) / 1e6).toFixed(2)}ms`,
  })
  histogram.reset()
}, 10000)

// 健康阈值：
// mean < 10ms  → 🟢 健康
// mean 10-50ms → 🟡 注意
// mean > 50ms  → 🔴 Event Loop 被阻塞
```

### 3.3 内存泄漏排查

```typescript
// 方式一：V8 堆快照
// 1. 启动时加 --inspect
// node --inspect dist/main.js
// 2. Chrome DevTools → Memory → Take heap snapshot
// 3. 对比两次快照，找到增长的对象

// 方式二：代码中主动监控
setInterval(() => {
  const usage = process.memoryUsage()
  console.log({
    rss: `${(usage.rss / 1024 / 1024).toFixed(1)}MB`,      // 总占用
    heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(1)}MB`,
    heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(1)}MB`,
    external: `${(usage.external / 1024 / 1024).toFixed(1)}MB`,
  })
}, 30000)

// 常见泄漏原因：
// 1. 全局变量积累（Map/Set 只加不删）
// 2. 未清理的事件监听器
// 3. 闭包引用大对象
// 4. 未关闭的数据库连接/流
```

### 3.4 Clinic.js 一键分析

```bash
# 安装
npm install -g clinic

# CPU 火焰图（找 CPU 热点）
clinic flame -- node dist/main.js
# 施压后 Ctrl+C → 自动生成火焰图 HTML

# Event Loop 分析
clinic doctor -- node dist/main.js

# I/O 分析（找 I/O 瓶颈）
clinic bubbleprof -- node dist/main.js
```

---

## 📝 4. 结构化日志体系

### 4.1 Winston 日志配置

```typescript
// logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common'
import * as winston from 'winston'

@Injectable()
export class AppLogger implements LoggerService {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),  // 结构化 JSON 输出
      ),
      defaultMeta: {
        service: 'api-server',
        env: process.env.NODE_ENV,
      },
      transports: [
        // 控制台（开发环境）
        new winston.transports.Console({
          format: process.env.NODE_ENV === 'development'
            ? winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              )
            : undefined,
        }),
        // 文件（生产环境）
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 10 * 1024 * 1024,  // 10MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 10 * 1024 * 1024,
          maxFiles: 10,
        }),
      ],
    })
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context })
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context })
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context })
  }
}
```

### 4.2 请求日志中间件

```typescript
// request-logger.middleware.ts
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now()
    const requestId = req.headers['x-request-id'] || crypto.randomUUID()

    // 注入 requestId 到请求上下文
    req['requestId'] = requestId
    res.setHeader('X-Request-Id', requestId)

    res.on('finish', () => {
      const duration = Date.now() - startTime
      this.logger.log(JSON.stringify({
        type: 'access',
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        userId: req['user']?.id,
      }))
    })

    next()
  }
}
```

### 4.3 ELK 日志平台

```
应用 → Winston JSON 日志
         ↓
Filebeat（日志收集）
         ↓
Logstash（解析/过滤/转换）
         ↓
Elasticsearch（存储/索引）
         ↓
Kibana（可视化/搜索/告警）
```

---

## 🔗 5. 链路追踪（OpenTelemetry）

### 5.1 为什么需要链路追踪

```
用户反馈"接口慢"，如何定位？

没有链路追踪：
  接口耗时 2s → 哪里慢？数据库？Redis？第三方 API？→ 🤷

有链路追踪：
  Trace ID: abc123
  ├── API Gateway → 5ms
  ├── 用户服务 /api/users → 15ms
  │   ├── Redis 查询缓存 → 1ms（命中）
  │   └── 返回
  ├── 订单服务 /api/orders → 1800ms ← 🔴 瓶颈在这里！
  │   ├── MongoDB 查询 → 1500ms ← 🔴 慢查询
  │   └── 组装数据 → 300ms
  └── 总耗时: 1820ms
```

### 5.2 OpenTelemetry 集成

```typescript
// tracing.ts（在 main.ts 之前加载）
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://jaeger:4318/v1/traces',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // 自动注入追踪到：
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-pg': { enabled: true },
      '@opentelemetry/instrumentation-redis': { enabled: true },
      '@opentelemetry/instrumentation-mongodb': { enabled: true },
    }),
  ],
  serviceName: 'api-server',
})

sdk.start()

// 自定义 Span
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('custom')

async function processOrder(orderId: string) {
  return tracer.startActiveSpan('processOrder', async (span) => {
    span.setAttribute('order.id', orderId)

    try {
      await validateOrder(orderId)
      await deductInventory(orderId)
      await createPayment(orderId)
      span.setStatus({ code: 1 })
    } catch (error) {
      span.setStatus({ code: 2, message: error.message })
      span.recordException(error)
      throw error
    } finally {
      span.end()
    }
  })
}
```

### 5.3 Prometheus + Grafana 指标监控

```typescript
// metrics.service.ts
import { Injectable } from '@nestjs/common'
import * as client from 'prom-client'

@Injectable()
export class MetricsService {
  private httpRequestDuration: client.Histogram
  private httpRequestTotal: client.Counter
  private activeConnections: client.Gauge

  constructor() {
    // 收集默认指标（CPU/内存/Event Loop）
    client.collectDefaultMetrics()

    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP 请求耗时',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    })

    this.httpRequestTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'HTTP 请求总数',
      labelNames: ['method', 'route', 'status_code'],
    })

    this.activeConnections = new client.Gauge({
      name: 'active_connections',
      help: '当前活跃连接数',
    })
  }

  recordRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestDuration.labels(method, route, String(statusCode)).observe(duration)
    this.httpRequestTotal.labels(method, route, String(statusCode)).inc()
  }

  async getMetrics() {
    return client.register.metrics()
  }
}

// metrics.controller.ts
@Controller('metrics')
export class MetricsController {
  constructor(private metrics: MetricsService) {}

  @Get()
  @Public()
  async getMetrics(@Res() res: Response) {
    res.set('Content-Type', 'text/plain')
    res.send(await this.metrics.getMetrics())
  }
}
```

---

## 🛡 6. 性能优化清单

| 方向 | 优化手段 | 效果 |
|------|---------|------|
| **数据库** | 加索引、慢查询优化 | 查询速度提升 10-100x |
| **缓存** | Redis 热点数据缓存 | 读请求降低 DB 压力 90% |
| **序列化** | Fastify JSON Schema | JSON.stringify 快 2-3x |
| **压缩** | gzip/brotli 响应压缩 | 传输体积减少 60-80% |
| **连接池** | 数据库/Redis 连接池 | 避免频繁建连开销 |
| **CDN** | 静态资源走 CDN | 全球加速、减少服务器压力 |
| **Worker** | CPU 密集任务用 worker_threads | 不阻塞 Event Loop |
| **流式** | 大文件用 Stream 处理 | 内存占用恒定 |

---

## ✅ 全系列学习 Checklist

### 基础篇（第 1 篇）
- [ ] 理解 V8 编译流水线和 Event Loop
- [ ] 掌握 libuv 线程池和异步 I/O 模型

### 框架篇（第 2-3 篇）
- [ ] 能对比选择 Express/Koa/Fastify/NestJS
- [ ] 掌握 NestJS Module/DI/装饰器体系

### 数据篇（第 4 篇）
- [ ] 能选择合适的数据库和 ORM
- [ ] 掌握 Prisma 数据模型和迁移

### API 篇（第 5 篇）
- [ ] 掌握 RESTful/GraphQL/tRPC 三种范式
- [ ] 能设计规范的 API 接口

### 安全篇（第 6 篇）
- [ ] 实现 JWT 双 Token 认证
- [ ] 设计 RBAC 权限体系

### 中间件篇（第 7 篇）
- [ ] 使用 Redis 实现缓存策略
- [ ] 使用 Bull 实现异步任务队列

### 架构篇（第 8 篇）
- [ ] 理解微服务拆分策略
- [ ] 掌握服务通信和 API Gateway

### 运维篇（第 9-10 篇）
- [ ] 会用 Docker 容器化 Node.js 应用
- [ ] 会配置 CI/CD 流水线
- [ ] 建立完整的可观测性体系

---

> 🎉 **恭喜完成「Node.js 技术选型与架构」全部 10 篇系列！**
>
> 从 V8 引擎到 Kubernetes，从单体到微服务，
> 你已经建立了完整的 Node.js 后端架构知识体系。
> **现在，打开编辑器，开始动手搭建你的第一个企业级项目吧！**

---

*本文是「Node.js 技术选型与架构」系列第 10 篇（完结篇），共 10 篇。*

---
*📝 作者：NIHoa ｜ 系列：Node.js技术选型与架构系列 ｜ 更新日期：2025-02-10*
