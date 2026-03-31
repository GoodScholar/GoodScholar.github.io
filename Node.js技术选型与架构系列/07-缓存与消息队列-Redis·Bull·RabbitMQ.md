---
date: 2025-02-07
tags:
  - Node.js
  - 后端架构
  - 技术选型
cover: /covers/cover-nodejs-07-cache.webp
---
# ⚡ Node.js 技术选型（七）：缓存与消息队列 — Redis · Bull · RabbitMQ

> **系列导读**：系统慢？流量大？异步处理成本高？
> 本篇深入 **Redis 缓存策略、Bull 任务队列、RabbitMQ 消息中间件**，
> 教你用缓存加速读取、用队列解耦写入，让系统扛住 10x 流量。

---

## 🎯 1. 为什么需要缓存和队列

```
没有缓存和队列：
用户请求 → API → 数据库查询（50ms）→ 返回
          所有请求都直接打数据库 → 高并发时数据库扛不住 💥

有缓存：
用户请求 → API → 查 Redis（0.5ms）→ 有？直接返回
                               → 没有？查数据库 → 写入 Redis → 返回
          90% 的请求被缓存拦截 → 数据库压力降低 10 倍

有队列：
用户下单 → API → 返回"下单成功" → 订单处理丢到队列
          后台 Worker 异步处理：扣库存 → 发通知 → 生成物流单
          用户不需要等待所有步骤完成
```

---

## 🔴 2. Redis 深入解析

### 2.1 数据结构与适用场景

| 数据结构 | 常用命令 | 适用场景 |
|---------|---------|---------|
| String | GET/SET/INCR/EXPIRE | 缓存、计数器、分布式锁 |
| Hash | HGET/HSET/HMGET | 对象缓存（用户信息） |
| List | LPUSH/RPOP/LRANGE | 消息队列、最新动态 |
| Set | SADD/SMEMBERS/SINTER | 标签、好友关系、去重 |
| Sorted Set | ZADD/ZRANGE/ZRANGEBYSCORE | 排行榜、延迟队列 |
| Stream | XADD/XREAD/XGROUP | 事件流、消息队列（消费组） |

### 2.2 NestJS + Redis 集成

```typescript
// redis.module.ts
import { Module, Global } from '@nestjs/common'
import { createClient } from 'redis'

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        })
        await client.connect()
        return client
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}

// cache.service.ts
import { Injectable, Inject } from '@nestjs/common'
import { RedisClientType } from 'redis'

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private redis: RedisClientType) {}

  // 基础缓存
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    return data ? JSON.parse(data) : null
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    await this.redis.setEx(key, ttlSeconds, JSON.stringify(value))
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key)
  }

  // 缓存穿透/击穿防护
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = 3600,
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached

    const data = await fetcher()
    if (data !== null && data !== undefined) {
      await this.set(key, data, ttl)
    } else {
      // 缓存空值，防止缓存穿透
      await this.set(key, null, 60)
    }
    return data
  }

  // 分布式锁
  async lock(key: string, ttlMs = 5000): Promise<boolean> {
    const result = await this.redis.set(`lock:${key}`, '1', {
      NX: true,            // 不存在才设置
      PX: ttlMs,           // 毫秒级过期
    })
    return result === 'OK'
  }

  async unlock(key: string): Promise<void> {
    await this.redis.del(`lock:${key}`)
  }
}
```

### 2.3 缓存策略

```
策略一：Cache Aside（旁路缓存）— 最常用
读：先查缓存 → 命中返回 → 未命中查 DB → 写入缓存
写：先更新 DB → 删除缓存

策略二：Read/Write Through（读写穿透）
读写都通过缓存层 → 缓存层自动同步 DB

策略三：Write Behind（异步写回）
写只写缓存 → 缓存异步批量写入 DB（最终一致性）
```

```typescript
// Cache Aside 实战
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async findById(id: number) {
    return this.cache.getOrSet(
      `user:${id}`,
      () => this.prisma.user.findUnique({ where: { id } }),
      1800, // 30 分钟
    )
  }

  async update(id: number, data: UpdateUserDto) {
    // 先更新数据库
    const user = await this.prisma.user.update({ where: { id }, data })
    // 再删除缓存（下次读取会重新加载）
    await this.cache.del(`user:${id}`)
    return user
  }
}
```

### 2.4 缓存常见问题

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| 缓存穿透 | 查询不存在的 key，请求打到 DB | 缓存空值 + 布隆过滤器 |
| 缓存击穿 | 热点 key 过期瞬间大量请求 | 互斥锁（分布式锁） |
| 缓存雪崩 | 大量 key 同时过期 | TTL 加随机偏移量 |
| 数据不一致 | 缓存和 DB 更新顺序问题 | 先更新 DB，再删缓存 |

---

## 📬 3. Bull 任务队列

### 3.1 为什么用 Bull

```
适用场景：
✅ 邮件发送（不需要实时等待）
✅ 图片处理 / 视频转码（CPU 密集）
✅ 定时任务（每天凌晨统计报表）
✅ 限流重试（第三方 API 调用）
✅ 延迟任务（下单 30 分钟未支付自动取消）
```

### 3.2 NestJS + BullMQ 集成

```typescript
// app.module.ts
import { BullModule } from '@nestjs/bullmq'

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'media' },
    ),
  ],
})
export class AppModule {}

// email.producer.ts（生产者：发送任务）
import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  // 普通任务
  async sendWelcomeEmail(userId: number, email: string) {
    await this.emailQueue.add('welcome', {
      userId,
      email,
      template: 'welcome',
    }, {
      attempts: 3,           // 最多重试 3 次
      backoff: {
        type: 'exponential',
        delay: 2000,          // 重试间隔：2s → 4s → 8s
      },
    })
  }

  // 延迟任务
  async sendPaymentReminder(orderId: string) {
    await this.emailQueue.add('payment-reminder', {
      orderId,
    }, {
      delay: 30 * 60 * 1000,  // 30 分钟后执行
    })
  }

  // 定时重复任务
  async scheduleDaily Report() {
    await this.emailQueue.add('daily-report', {}, {
      repeat: {
        pattern: '0 8 * * *',  // 每天 8:00 执行
      },
    })
  }
}

// email.consumer.ts（消费者：处理任务）
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

@Processor('email')
export class EmailConsumer extends WorkerHost {
  async process(job: Job) {
    switch (job.name) {
      case 'welcome':
        await this.sendEmail(job.data.email, '欢迎加入！', 'welcome')
        break
      case 'payment-reminder':
        await this.checkAndRemind(job.data.orderId)
        break
      case 'daily-report':
        await this.generateReport()
        break
    }

    return { success: true }
  }

  private async sendEmail(to: string, subject: string, template: string) {
    // 调用邮件服务发送
    console.log(`发送邮件到 ${to}: ${subject}`)
  }

  private async checkAndRemind(orderId: string) {
    // 检查订单是否已支付，未支付则发送提醒
  }

  private async generateReport() {
    // 生成日报并发送
  }
}
```

---

## 🐰 4. RabbitMQ 消息中间件

### 4.1 Bull vs RabbitMQ

| 维度 | Bull（BullMQ） | RabbitMQ |
|------|---------------|----------|
| 底层 | Redis | Erlang（AMQP 协议） |
| 定位 | 任务队列 | 消息中间件 |
| 消息模式 | 简单队列 | 发布/订阅、路由、Topic、RPC |
| 持久化 | Redis 持久化 | 磁盘持久化 |
| 消息确认 | ✅ 支持 | ✅ 支持（ACK 机制） |
| 管理界面 | Bull Board | 🟢 Management UI（强大） |
| 适用场景 | 单应用内的异步任务 | 微服务间的消息通信 |
| 复杂度 | 🟢 低 | 🟡 中等 |

### 4.2 RabbitMQ 交换机模式

```
Direct Exchange（直连）：
  消息 → Exchange → 精确匹配 routing_key → Queue → Consumer

Fanout Exchange（广播）：
  消息 → Exchange → 所有绑定的 Queue → 所有 Consumer
  适用：通知广播、日志分发

Topic Exchange（主题）：
  消息 → Exchange → 模式匹配 routing_key → Queue → Consumer
  示例：order.created / order.paid / order.*

Headers Exchange（头部）：
  消息 → Exchange → 匹配 header 属性 → Queue → Consumer
```

### 4.3 NestJS + RabbitMQ

```typescript
// 微服务生产者
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'

@Injectable()
export class OrderService {
  private client: ClientProxy

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'order_queue',
        queueOptions: { durable: true },
      },
    })
  }

  async createOrder(data: CreateOrderDto) {
    // 创建订单
    const order = await this.prisma.order.create({ data })

    // 发送消息到队列
    this.client.emit('order.created', {
      orderId: order.id,
      userId: data.userId,
      amount: data.amount,
    })

    return order
  }
}

// 微服务消费者
@Controller()
export class NotificationController {
  @EventPattern('order.created')
  async handleOrderCreated(data: { orderId: string; userId: string }) {
    // 发送订单确认通知
    await this.notificationService.sendPush(
      data.userId,
      `订单 ${data.orderId} 创建成功`
    )
    // 发送邮件
    await this.emailService.send(data.userId, 'order-created', data)
  }
}
```

---

## 🎯 5. 选型决策

```
你需要解决什么问题？
│
├── 加速数据读取
│   └── ✅ Redis 缓存
│
├── 单应用内的异步任务
│   ├── 邮件/短信发送 → ✅ Bull（简单，Redis 即可）
│   ├── 定时任务 → ✅ Bull（Cron 表达式）
│   └── 延迟任务 → ✅ Bull（delay 参数）
│
├── 微服务间的消息通信
│   ├── 简单发布/订阅 → ✅ Redis Pub/Sub
│   └── 可靠消息传递 + 复杂路由 → ✅ RabbitMQ
│
└── 大规模事件流处理
    └── ✅ Kafka（本篇不详述）
```

---

## ✅ 本篇重点 Checklist

- [ ] 掌握 Redis 6 种数据结构及适用场景
- [ ] 理解 Cache Aside 缓存策略
- [ ] 了解缓存穿透/击穿/雪崩的原因和解决方案
- [ ] 会用 BullMQ 实现异步任务、延迟任务、定时任务
- [ ] 了解 RabbitMQ 四种交换机模式
- [ ] 能根据场景选择 Bull 或 RabbitMQ

---

> 缓存是读的加速器，队列是写的减压阀。
> 下一篇我们聊 **微服务架构 — 拆分策略 · 服务通信 · API Gateway**。

---
*📝 作者：NIHoa ｜ 系列：Node.js技术选型与架构系列 ｜ 更新日期：2025-02-07*
