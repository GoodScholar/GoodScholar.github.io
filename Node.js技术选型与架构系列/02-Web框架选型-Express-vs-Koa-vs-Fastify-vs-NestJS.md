---
date: 2025-02-02
---
# 🏗 Node.js 技术选型（二）：Web 框架选型 — Express vs Koa vs Fastify vs NestJS

> **系列导读**：框架是后端项目的骨架，选错框架 = 架构负债。
> 本篇从**架构设计、中间件机制、性能基准、TypeScript 支持**四个维度，
> 对比 Express / Koa / Fastify / NestJS，帮你做出最适合团队的选择。

---

## 📊 1. 一表看懂四大框架

| # | 框架 | 首发 | 设计理念 | Star ⭐ | 适用场景 |
|---|------|------|---------|--------|---------|
| 1 | Express | 2010 | 简单、灵活、约定少 | 65k+ | 小型项目、快速原型 |
| 2 | Koa | 2013 | 精简内核、中间件组合 | 35k+ | 中型项目、团队有架构经验 |
| 3 | Fastify | 2016 | 极致性能、Schema 驱动 | 33k+ | 高性能 API、微服务 |
| 4 | NestJS | 2017 | 企业级、Angular 风格 | 70k+ | 大型项目、团队协作 |

---

## 🔍 2. 架构对比：四种完全不同的设计哲学

### Express — 自由主义

```javascript
const express = require('express')
const app = express()

// 中间件：use 注册，按顺序执行
app.use(express.json())

// 路由：直接挂载
app.get('/api/users', (req, res) => {
  res.json({ users: [] })
})

// 错误处理：4 参数中间件
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message })
})

app.listen(3000)
```

> Express 就像一盒乐高积木 — 给你最大自由度，
> 但项目规模大了之后，每个人拼出来的形状都不一样。

### Koa — 极简主义

```javascript
const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

// 洋葱模型中间件
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()  // 进入下一层
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)  // 回来时执行
})

app.use(bodyParser())

router.get('/api/users', async (ctx) => {
  ctx.body = { users: [] }
})

app.use(router.routes())
app.listen(3000)
```

> Koa 内核极小（~600 行代码），没有内置路由、没有 body 解析，
> 所有功能都通过中间件组合。适合对架构有追求的团队。

### Fastify — 性能至上

```javascript
const fastify = require('fastify')({ logger: true })

// Schema 驱动：自动验证 + 序列化 + 文档生成
const getUsersOpts = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1, default: 1 },
        pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' }
              }
            }
          },
          total: { type: 'integer' }
        }
      }
    }
  }
}

fastify.get('/api/users', getUsersOpts, async (request, reply) => {
  return { users: [], total: 0 }
})

fastify.listen({ port: 3000 })
```

> Fastify 通过 JSON Schema 做**编译时**序列化优化，
> `JSON.stringify` 比 Express 快 2-3 倍。

### NestJS — 企业级架构

```typescript
// user.controller.ts
import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { GetUsersDto } from './dto/get-users.dto'

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Query() query: GetUsersDto) {
    return this.userService.findAll(query)
  }
}

// user.service.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  async findAll(query: GetUsersDto) {
    // 业务逻辑
    return { users: [], total: 0 }
  }
}

// user.module.ts
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

> NestJS 借鉴 Angular 的 **Module + Controller + Service + DI** 架构，
> 强约束 = 团队代码风格一致 = 大项目可维护。

---

## 🧅 3. 中间件机制对比

### Express：线性模型

```
请求 → 中间件A → 中间件B → 中间件C → 路由处理 → 响应
         ↓          ↓          ↓
       next()     next()     next()
```

### Koa：洋葱模型

```
请求 → 中间件A（前半段）
         → 中间件B（前半段）
            → 中间件C（前半段）
               → 路由处理
            ← 中间件C（后半段）
         ← 中间件B（后半段）
       ← 中间件A（后半段）→ 响应
```

### Fastify：封装插件模型

```
请求 → Hook: onRequest
     → Hook: preParsing
     → Hook: preValidation
     → Hook: preHandler
     → 路由处理
     → Hook: preSerialization
     → Hook: onSend
     → 响应
     → Hook: onResponse
```

### NestJS：管道模型

```
请求 → Guard（守卫）
     → Interceptor（拦截器 - 前）
     → Pipe（管道验证/转换）
     → Controller → Service
     → Interceptor（拦截器 - 后）
     → Filter（异常过滤器）
     → 响应
```

---

## ⚡ 4. 性能基准对比

> 测试场景：简单 JSON 响应，autocannon 压测，10 个连接，30 秒

| 框架 | 请求/秒 (RPS) | 延迟 (P99) | 内存占用 |
|------|-------------|-----------|---------|
| Fastify | 🟢 ~78,000 | ~1.2ms | ~45MB |
| Koa | 🟡 ~54,000 | ~1.8ms | ~40MB |
| Express | 🟡 ~42,000 | ~2.3ms | ~50MB |
| NestJS (Fastify) | 🟢 ~72,000 | ~1.4ms | ~55MB |
| NestJS (Express) | 🟡 ~38,000 | ~2.5ms | ~60MB |

```
性能排名：Fastify > NestJS+Fastify >> Koa > Express > NestJS+Express

💡 NestJS 底层可选 Express 或 Fastify 作为 HTTP 适配器
   选 Fastify 适配器可获得接近原生 Fastify 的性能
```

---

## 📦 5. 生态与 TypeScript 支持

| 维度 | Express | Koa | Fastify | NestJS |
|------|---------|-----|---------|--------|
| npm 周下载量 | 🟢 3000w+ | 🟡 200w+ | 🟡 400w+ | 🟢 500w+ |
| TypeScript | ⚠️ @types 社区维护 | ⚠️ @types 社区维护 | ✅ 内置类型 | ✅ TS 原生设计 |
| 中间件/插件数量 | 🟢 极其丰富 | 🟡 中等 | 🟢 丰富 | 🟢 丰富（官方模块） |
| 官方 ORM 集成 | ❌ 无 | ❌ 无 | ❌ 无 | ✅ TypeORM/Prisma/Mongoose |
| 官方 WebSocket | ❌ 第三方 | ❌ 第三方 | ✅ 插件 | ✅ @nestjs/websockets |
| 官方 GraphQL | ❌ 第三方 | ❌ 第三方 | ✅ Mercurius | ✅ @nestjs/graphql |
| 微服务支持 | ❌ 无 | ❌ 无 | ❌ 无 | ✅ @nestjs/microservices |
| 文档质量 | 🟡 基础 | 🟡 基础 | 🟢 优秀 | 🟢 极其完善 |

---

## 🎯 6. 技术选型决策树

```
你的项目是什么规模？
│
├── 小型项目 / 快速原型 / 个人项目
│   ├── 需要极致性能 → ✅ Fastify
│   └── 快速上手优先 → ✅ Express
│
├── 中型项目（3-8 人团队）
│   ├── 团队有架构能力，想自由组装 → ✅ Koa
│   ├── 想要开箱即用 + 高性能 → ✅ Fastify
│   └── 需要规范化约束 → ✅ NestJS
│
└── 大型项目 / 企业级（8+ 人团队）
    ├── 需要微服务架构 → ✅ NestJS
    ├── 需要 GraphQL → ✅ NestJS 或 Fastify+Mercurius
    └── 团队 Java/Angular 背景 → ✅ NestJS（DI 模式熟悉）
```

---

## 🔄 7. 从 Express 迁移到其他框架

### Express → Fastify（API 风格接近，迁移成本低）

```javascript
// Express
app.get('/users', (req, res) => {
  res.json({ users: [] })
})

// Fastify（几乎一样）
fastify.get('/users', async (request, reply) => {
  return { users: [] }  // 直接 return 即可
})
```

### Express → NestJS（渐进式迁移）

```typescript
// 1. NestJS 底层默认就是 Express
// 2. 可以直接在 NestJS 中使用 Express 中间件
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as compression from 'compression'

const app = await NestFactory.create(AppModule)
app.use(compression())  // Express 中间件直接用
await app.listen(3000)
```

---

## 📋 8. 常见踩坑

| 错误 | 后果 | 建议 |
|-----|------|------|
| 小项目用 NestJS | 过度工程化，开发速度慢 | 小项目用 Express/Fastify |
| 大项目用 Express 不做分层 | 路由文件几千行，无法维护 | 大项目用 NestJS 或自建分层 |
| 忽略 Fastify Schema | 白白浪费性能优化 | 写 Schema，获取验证+序列化+文档三重收益 |
| NestJS 不理解 DI | 到处 new 实例，绕过 IoC 容器 | 学好依赖注入原理再用 NestJS |
| Koa 不做错误统一处理 | 异步错误吞掉，接口静默失败 | 最外层中间件 try-catch |

---

## ✅ 本篇重点 Checklist

- [ ] 理解四大框架的设计哲学差异
- [ ] 掌握线性/洋葱/插件/管道四种中间件模型
- [ ] 了解各框架性能基准（Fastify 最快）
- [ ] 知道 NestJS 可切换 Fastify 适配器
- [ ] 能用决策树为项目选择合适的框架
- [ ] 了解从 Express 迁移到其他框架的路径

---

> 框架是骨架，业务才是灵魂。选对框架只是第一步，
> 下一篇我们深入 **NestJS 企业级架构**，看看大型项目应该怎么分层。

---
*📝 作者：NIHoa ｜ 系列：Node.js技术选型与架构系列 ｜ 更新日期：2025-02-02*
