---
date: 2025-02-05
---
# 🔌 Node.js 技术选型（五）：API 设计范式 — RESTful vs GraphQL vs tRPC

> **系列导读**：API 是前后端的"握手协议"，设计好坏直接影响联调效率和系统可维护性。
> 本篇对比 **RESTful / GraphQL / tRPC** 三种主流范式，
> 帮你为不同场景选择最合适的接口设计方案。

---

## 📊 1. 三种范式一表对比

| 维度 | RESTful | GraphQL | tRPC |
|------|---------|---------|------|
| 设计理念 | 资源导向 + HTTP 动词 | 查询语言 + 单端点 | TypeScript 函数调用 |
| 传输协议 | HTTP（GET/POST/PUT/DELETE） | HTTP POST（单端点） | HTTP（自动推导） |
| 数据格式 | JSON | JSON | JSON（类型自动推导） |
| 类型安全 | ❌ 需额外工具（OpenAPI） | 🟡 Schema 级别 | ✅ 编译时端到端类型安全 |
| Over-fetching | 🟡 常见（返回多余字段） | ✅ 精确查询 | ✅ 类型约束 |
| Under-fetching | 🟡 常见（需多次请求） | ✅ 一次查询多资源 | ✅ 组合调用 |
| 学习成本 | 🟢 低 | 🟡 中等 | 🟢 低（需懂 TS） |
| 生态成熟度 | 🟢 最成熟 | 🟢 成熟 | 🟡 成长中 |
| 适用场景 | 通用 API / 开放平台 | 复杂数据关系 / BFF | 全栈 TS 项目 / 内部 API |

---

## 🌐 2. RESTful API 设计最佳实践

### 2.1 URL 设计规范

```
✅ 正确示例：
GET    /api/v1/users              # 获取用户列表
GET    /api/v1/users/123          # 获取单个用户
POST   /api/v1/users              # 创建用户
PUT    /api/v1/users/123          # 全量更新用户
PATCH  /api/v1/users/123          # 部分更新用户
DELETE /api/v1/users/123          # 删除用户
GET    /api/v1/users/123/posts    # 获取用户的文章列表

❌ 错误示例：
GET    /api/getUsers               # 不用动词
POST   /api/deleteUser/123         # 不用 POST 做删除
GET    /api/v1/user                # 用复数不用单数
GET    /api/v1/Users               # 小写不要大写
```

### 2.2 统一响应格式

```typescript
// 成功响应
{
  "code": 200,
  "message": "success",
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 156
    }
  }
}

// 错误响应
{
  "code": 400,
  "message": "参数验证失败",
  "errors": [
    { "field": "email", "message": "邮箱格式不正确" },
    { "field": "password", "message": "密码至少 8 位" }
  ]
}
```

### 2.3 版本管理

```typescript
// 方式一：URL 路径版本（推荐）
// /api/v1/users
// /api/v2/users

// 方式二：Header 版本
// Accept: application/vnd.myapi.v2+json

// 方式三：查询参数
// /api/users?version=2

// NestJS 版本控制
// main.ts
app.enableVersioning({
  type: VersioningType.URI,     // URL 路径版本
  defaultVersion: '1',
})

// controller
@Controller({ path: 'users', version: '2' })
export class UsersV2Controller {
  @Get()
  findAll() { /* v2 逻辑 */ }
}
```

### 2.4 OpenAPI / Swagger 文档

```typescript
// NestJS + Swagger 自动生成 API 文档
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const config = new DocumentBuilder()
  .setTitle('用户管理 API')
  .setDescription('RESTful API 文档')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('api-docs', app, document)

// DTO 装饰器自动生成文档
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ description: '用户邮箱', example: 'test@example.com' })
  email: string

  @ApiProperty({ description: '用户名', minLength: 2 })
  name: string

  @ApiPropertyOptional({ description: '头像 URL' })
  avatar?: string
}
```

---

## 🔮 3. GraphQL 深入解析

### 3.1 Schema 定义

```graphql
# schema.graphql
type User {
  id: ID!
  email: String!
  name: String
  role: Role!
  posts(published: Boolean): [Post!]!
  postCount: Int!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String
  published: Boolean!
  author: User!
  tags: [Tag!]!
}

type Tag {
  id: ID!
  name: String!
}

enum Role {
  USER
  ADMIN
  EDITOR
}

# 查询
type Query {
  users(page: Int, pageSize: Int, role: Role): UserConnection!
  user(id: ID!): User
  posts(published: Boolean): [Post!]!
}

# 变更
type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

# 订阅（实时推送）
type Subscription {
  postCreated: Post!
}

# 分页
type UserConnection {
  nodes: [User!]!
  totalCount: Int!
  pageInfo: PageInfo!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

input CreateUserInput {
  email: String!
  name: String!
  password: String!
}

input UpdateUserInput {
  name: String
  avatar: String
}
```

### 3.2 NestJS + GraphQL

```typescript
// user.resolver.ts
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Query(() => [User])
  async users(
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('pageSize', { defaultValue: 20 }) pageSize: number,
  ) {
    return this.userService.findAll({ page, pageSize })
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string) {
    return this.userService.findById(id)
  }

  // 字段级解析器 — 解决 N+1 问题
  @ResolveField(() => [Post])
  async posts(
    @Parent() user: User,
    @Args('published', { nullable: true }) published?: boolean,
  ) {
    return this.postService.findByAuthor(user.id, { published })
  }

  @ResolveField(() => Int)
  async postCount(@Parent() user: User) {
    return this.postService.countByAuthor(user.id)
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input)
  }
}
```

### 3.3 客户端查询示例

```graphql
# 一次请求获取所有需要的数据（不多不少）
query GetUserProfile {
  user(id: "123") {
    name
    email
    posts(published: true) {
      title
      tags {
        name
      }
    }
    postCount
  }
}

# 对比 REST：需要 3 次请求
# GET /api/users/123
# GET /api/users/123/posts?published=true
# GET /api/users/123/posts/count
```

---

## 🔗 4. tRPC — 全栈 TypeScript 的终极方案

### 4.1 核心理念

```
传统方式：
前端 ──HTTP 请求──→ 后端
     ← JSON 响应 ←
     手动定义类型 / 手动解析

tRPC 方式：
前端 ──函数调用──→ 后端
     ← 自动推导类型 ←
     编译时类型检查 / 0 代码生成
```

### 4.2 服务端定义

```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(authMiddleware)

// server/routers/user.ts
export const userRouter = router({
  // 查询
  list: publicProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),
      role: z.enum(['USER', 'ADMIN']).optional(),
    }))
    .query(async ({ input, ctx }) => {
      const users = await ctx.prisma.user.findMany({
        where: input.role ? { role: input.role } : undefined,
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      })
      const total = await ctx.prisma.user.count()
      return { users, total }
    }),

  // 查询单个
  byId: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({ where: { id: input } })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' })
      return user
    }),

  // 变更
  create: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(2),
      password: z.string().min(8),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.create({ data: input })
    }),
})

// server/routers/_app.ts
export const appRouter = router({
  user: userRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter  // 导出类型给客户端
```

### 4.3 客户端调用

```typescript
// client/trpc.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../server/routers/_app'

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({ url: 'http://localhost:3000/trpc' }),
  ],
})

// 调用就像普通函数
const result = await trpc.user.list.query({ page: 1, pageSize: 10 })
//    ^? { users: User[], total: number }  ← 类型自动推导！

const user = await trpc.user.byId.query('123')
//    ^? User | null  ← 编译时就知道返回类型！

const newUser = await trpc.user.create.mutate({
  email: 'test@test.com',
  name: 'Alice',
  password: '12345678',
})

// 如果传了错误的参数，编译时就会报错 ❌
// trpc.user.create.mutate({ email: 123 })
// Type 'number' is not assignable to type 'string'
```

---

## 🎯 5. 选型决策树

```
你的 API 需要服务谁？
│
├── 开放平台 / 第三方对接 / 多语言客户端
│   └── ✅ RESTful（最通用、最易理解）
│
├── 前端数据需求复杂 / 多端差异化查询
│   ├── 需要实时订阅 → ✅ GraphQL（Subscription）
│   └── 复杂关联查询多 → ✅ GraphQL
│
├── 全栈 TypeScript 项目 / 内部系统
│   └── ✅ tRPC（类型安全 + 零样板代码）
│
└── 混合方案
    ├── 对外 RESTful + 对内 tRPC
    └── RESTful + GraphQL BFF 层
```

---

## 📋 6. 常见踩坑

| 错误 | 后果 | 建议 |
|-----|------|------|
| GraphQL 无限嵌套查询 | 服务端内存爆炸 | 限制查询深度（depth limit） |
| REST 不做版本管理 | 老客户端接口崩溃 | 上线即定 v1，规划升级路径 |
| tRPC 用于对外 API | 非 TS 客户端无法使用 | 对外用 REST/GraphQL |
| GraphQL N+1 问题 | 数据库查询爆炸 | 使用 DataLoader 批量加载 |
| REST 不写文档 | 前端猜接口参数 | Swagger / OpenAPI 自动生成 |

---

## ✅ 本篇重点 Checklist

- [ ] 理解 REST / GraphQL / tRPC 三种范式的设计理念差异
- [ ] 掌握 RESTful URL 设计规范和版本管理
- [ ] 了解 GraphQL Schema 定义和字段解析器
- [ ] 理解 tRPC 端到端类型安全的实现原理
- [ ] 能用决策树为项目选择合适的 API 范式
- [ ] 知道 GraphQL 查询深度限制和 DataLoader 的必要性

---

> API 设计得好，前后端才能"丝滑"协作。
> 下一篇我们聊 **认证与授权 — JWT · OAuth2 · RBAC 权限体系**。

---
*📝 作者：NIHoa ｜ 系列：Node.js技术选型与架构系列 ｜ 更新日期：2025-02-05*
