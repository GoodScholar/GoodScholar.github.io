---
date: 2025-02-08
---
# 🏛 Node.js 技术选型（八）：微服务架构 — 拆分策略 · 服务通信 · API Gateway

> **系列导读**：当单体应用变成"巨石"时，微服务是必经之路。
> 本篇从**何时拆分、怎么拆分、服务怎么通信、网关怎么设计**四个角度，
> 讲透 Node.js 微服务架构的核心要点。

---

## 🤔 1. 单体 vs 微服务

### 1.1 架构演进路径

```
阶段一：单体应用（Monolith）
┌──────────────────────────┐
│    API 层                │
│    业务逻辑层             │
│    数据访问层             │
│    所有功能在一个进程里    │
└──────────────────────────┘
         ↓ 团队 > 8人 / 部署频率 > 3次/周 / 模块耦合严重

阶段二：模块化单体（Modular Monolith）
┌──────────────────────────┐
│  ┌─────┐ ┌─────┐ ┌─────┐│
│  │用户 │ │订单 │ │支付 ││
│  │模块 │ │模块 │ │模块 ││
│  └─────┘ └─────┘ └─────┘│
│  共享进程，模块间明确边界  │
└──────────────────────────┘
         ↓ 模块需要独立部署 / 独立扩展 / 不同技术栈

阶段三：微服务（Microservices）
┌──────┐  ┌──────┐  ┌──────┐
│用户  │  │订单  │  │支付  │
│服务  │  │服务  │  │服务  │
│      │  │      │  │      │
│Node  │  │Node  │  │Go    │
│MySQL │  │Mongo │  │PG    │
└──────┘  └──────┘  └──────┘
  独立进程，独立数据库，独立部署
```

### 1.2 何时用微服务

| ✅ 适合微服务 | ❌ 不适合微服务 |
|-------------|---------------|
| 团队 > 8 人，需要并行开发 | 团队 < 5 人 |
| 模块需要独立伸缩（如搜索/推荐） | 业务逻辑简单 |
| 不同模块有不同技术需求 | 项目在早期探索阶段 |
| 故障需要隔离（支付不能影响浏览） | 没有 DevOps 能力 |
| 部署频率高（每天多次） | 没有容器化基础设施 |

---

## ✂️ 2. 服务拆分策略

### 2.1 按业务域拆分（DDD 领域驱动）

```
电商系统拆分示例：

┌─ 用户域 ───────────┐
│ 用户服务            │
│ - 注册/登录         │
│ - 个人信息管理       │
│ - 地址管理          │
└────────────────────┘

┌─ 商品域 ───────────┐
│ 商品服务            │
│ - 商品 CRUD         │
│ - 分类管理          │
│ - 搜索服务          │
└────────────────────┘

┌─ 交易域 ───────────┐
│ 订单服务            │
│ - 下单/取消         │
│ - 订单状态流转       │
│                     │
│ 支付服务            │
│ - 支付渠道对接       │
│ - 退款处理          │
│                     │
│ 库存服务            │
│ - 库存扣减/回滚      │
│ - 库存预警          │
└────────────────────┘

┌─ 通知域 ───────────┐
│ 通知服务            │
│ - 短信/邮件/推送     │
│ - 消息模板管理       │
└────────────────────┘
```

### 2.2 拆分原则

| 原则 | 说明 |
|------|------|
| 单一职责 | 每个服务只负责一个业务域 |
| 数据库独立 | 每个服务拥有自己的数据库（数据库隔离） |
| 接口契约 | 服务间通过明确的 API 或消息格式通信 |
| 独立部署 | 修改一个服务不需要重新部署其他服务 |
| 避免分布式单体 | 服务间不能同步循环依赖 |

---

## 📡 3. 服务通信方式

### 3.1 同步通信 — HTTP / gRPC

```
HTTP REST：
用户服务 ──GET /api/users/123──→ 订单服务
         ←── { user: {...} } ──

gRPC：
用户服务 ──protobuf 二进制──→ 订单服务
         ←── protobuf 响应 ──
```

| 维度 | HTTP REST | gRPC |
|------|-----------|------|
| 协议 | HTTP/1.1 | HTTP/2 |
| 数据格式 | JSON（文本） | Protobuf（二进制） |
| 性能 | 🟡 一般 | 🟢 快 3-10 倍 |
| 流式 | ❌ | ✅ 双向流 |
| 类型安全 | ❌ 手动维护 | ✅ .proto 文件自动生成 |
| 调试 | 🟢 curl/postman | 🟡 需要特殊工具 |
| 适用 | 外部 API / 简单调用 | 内部服务间高频通信 |

### 3.2 gRPC 实战

```protobuf
// user.proto
syntax = "proto3";

package user;

service UserService {
  rpc FindById (FindByIdRequest) returns (UserResponse);
  rpc FindMany (FindManyRequest) returns (UserListResponse);
}

message FindByIdRequest {
  int32 id = 1;
}

message FindManyRequest {
  int32 page = 1;
  int32 page_size = 2;
}

message UserResponse {
  int32 id = 1;
  string name = 2;
  string email = 3;
  string role = 4;
}

message UserListResponse {
  repeated UserResponse users = 1;
  int32 total = 2;
}
```

```typescript
// NestJS gRPC 服务端
@Controller()
export class UserGrpcController {
  @GrpcMethod('UserService', 'FindById')
  async findById(data: { id: number }) {
    return this.userService.findById(data.id)
  }

  @GrpcMethod('UserService', 'FindMany')
  async findMany(data: { page: number; pageSize: number }) {
    return this.userService.findMany(data)
  }
}

// NestJS gRPC 客户端
@Injectable()
export class OrderService implements OnModuleInit {
  private userService: UserServiceClient

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService')
  }

  async getOrderWithUser(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } })
    const user = await this.userService.findById({ id: order.userId }).toPromise()
    return { ...order, user }
  }
}
```

### 3.3 异步通信 — 消息队列

```
事件驱动架构：

订单服务 ──发布事件──→ 消息队列 ──→ 库存服务（扣减库存）
                              ──→ 支付服务（创建支付单）
                              ──→ 通知服务（发送通知）

优点：服务完全解耦，互不依赖
缺点：最终一致性（非实时），调试复杂
```

---

## 🚪 4. API Gateway（API 网关）

### 4.1 网关的职责

```
客户端
  │
  ▼
┌────────────────────────────────┐
│         API Gateway            │
│                                │
│  ┌──────┐ ┌──────┐ ┌────────┐ │
│  │ 路由  │ │ 认证  │ │ 限流   │ │
│  │ 转发  │ │ 鉴权  │ │ 熔断   │ │
│  └──────┘ └──────┘ └────────┘ │
│  ┌──────┐ ┌──────┐ ┌────────┐ │
│  │ 日志  │ │ 监控  │ │ 聚合   │ │
│  │ 追踪  │ │ 告警  │ │ 响应   │ │
│  └──────┘ └──────┘ └────────┘ │
└──────┬────────┬────────┬──────┘
       ▼        ▼        ▼
  用户服务   订单服务   支付服务
```

### 4.2 网关实现方案

| 方案 | 类型 | 适用场景 |
|------|------|---------|
| Nginx | 反向代理 | 简单路由转发 |
| Kong | API 网关 | 企业级，插件丰富 |
| APISIX | API 网关 | 高性能，国产开源 |
| NestJS 自建 | 代码级 | 小规模，深度定制 |

### 4.3 NestJS 简单网关示例

```typescript
// gateway/src/app.module.ts
import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
})
export class GatewayModule {}

// gateway/src/proxy.controller.ts
@Controller()
export class ProxyController {
  constructor(private httpService: HttpService) {}

  // 路由聚合：一个请求调用多个服务
  @Get('api/dashboard')
  async getDashboard(@Headers('authorization') auth: string) {
    const [user, orders, notifications] = await Promise.all([
      this.httpService.axiosRef.get('http://user-service:3001/profile', {
        headers: { authorization: auth },
      }),
      this.httpService.axiosRef.get('http://order-service:3002/recent', {
        headers: { authorization: auth },
      }),
      this.httpService.axiosRef.get('http://notification-service:3003/unread', {
        headers: { authorization: auth },
      }),
    ])

    return {
      user: user.data,
      recentOrders: orders.data,
      unreadNotifications: notifications.data,
    }
  }
}
```

---

## 🔧 5. 服务发现与配置中心

### 5.1 服务发现

```
问题：微服务实例的 IP 和端口是动态的，怎么找到对方？

方案一：客户端发现（推荐用 Consul）
  服务启动 → 注册到 Consul
  调用方 → 查询 Consul → 获取目标地址 → 直接调用

方案二：服务端发现（K8s Service）
  K8s 自动管理 → 通过 Service 名称 + kube-dns 解析
  调用方 → 直接用 http://user-service:3001
```

### 5.2 常用工具

| 工具 | 职责 | 特点 |
|------|------|------|
| Consul | 服务发现 + 配置中心 | 健康检查、KV 存储 |
| etcd | 配置中心 | K8s 底层使用 |
| Nacos | 服务发现 + 配置 | 阿里开源，国内常用 |
| K8s Service | 服务发现 | 容器编排内置 |

---

## ⚠️ 6. 微服务常见踩坑

| 错误 | 后果 | 建议 |
|-----|------|------|
| 过早拆分微服务 | 分布式复杂度爆炸 | 先做模块化单体，再渐进拆分 |
| 服务间同步调用链过长 | 延迟叠加、级联故障 | 超过 3 层调用考虑异步化 |
| 没做熔断降级 | 一个服务挂全部挂 | 使用 Circuit Breaker 模式 |
| 共享数据库 | 耦合回去了 | 每个服务独占数据库 |
| 没有统一日志追踪 | 排查问题大海捞针 | 接入链路追踪（下篇详述） |
| 忽略数据一致性 | 订单已创建但库存未扣 | Saga 模式处理分布式事务 |

---

## ✅ 本篇重点 Checklist

- [ ] 理解单体 → 模块化单体 → 微服务的演进路径
- [ ] 掌握按业务域拆分的原则
- [ ] 了解 HTTP REST 和 gRPC 的区别与选型
- [ ] 理解同步通信和异步通信（消息队列）的适用场景
- [ ] 了解 API Gateway 的职责和实现方案
- [ ] 知道服务发现的两种方式（客户端 / 服务端）

---

> 微服务不是银弹，而是一把双刃剑。
> 下一篇我们聊 **DevOps 与部署 — Docker · CI/CD · PM2 · K8s 入门**。

---
*📝 作者：NIHoa ｜ 系列：Node.js技术选型与架构系列 ｜ 更新日期：2025-02-08*
