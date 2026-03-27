---
date: 2025-02-04
---
# 🗄 Node.js 技术选型（四）：数据库选型与 ORM — MySQL · PostgreSQL · MongoDB · Prisma

> **系列导读**：数据库是后端的心脏，选错了轻则性能瓶颈，重则数据丢失。
> 本篇从**关系型 vs 文档型**对比出发，深入 **Prisma / TypeORM / Mongoose** 三大 ORM，
> 帮你为项目选对数据存储方案。

---

## 📊 1. 数据库类型总览

| 类型 | 代表 | 数据模型 | 适用场景 |
|------|------|---------|---------|
| 关系型（RDBMS） | MySQL / PostgreSQL | 表 + 行 + 列 + 关系 | 强一致性、复杂查询、事务 |
| 文档型（NoSQL） | MongoDB | JSON 文档 + 集合 | 灵活 Schema、快速迭代 |
| 键值型 | Redis | Key-Value | 缓存、会话、排行榜 |
| 时序型 | InfluxDB / TimescaleDB | 时间戳 + 指标 | 监控、IoT、日志 |
| 图数据库 | Neo4j | 节点 + 边 | 社交关系、知识图谱 |

---

## 🆚 2. MySQL vs PostgreSQL vs MongoDB

### 2.1 核心对比

| 维度 | MySQL | PostgreSQL | MongoDB |
|------|-------|-----------|---------|
| 类型 | 关系型 | 关系型（对象关系型） | 文档型 |
| 协议 | GPL v2 | PostgreSQL License | SSPL |
| JSON 支持 | 🟡 JSON 类型（基础） | 🟢 JSONB（高级索引） | 🟢 原生 JSON |
| 事务 | ✅ ACID | ✅ ACID | ✅ 多文档事务（4.0+） |
| 复杂查询 | 🟢 优秀 | 🟢 极其强大（CTE/窗口函数） | 🟡 聚合管道 |
| 全文搜索 | 🟡 基础 | 🟢 内置支持 | 🟢 Atlas Search |
| 扩展性 | 🟡 主从复制 | 🟡 逻辑复制 / Citus 分布式 | 🟢 原生分片 |
| 性能（读） | 🟢 极快（简单查询） | 🟢 快 | 🟢 极快 |
| 性能（写） | 🟢 快 | 🟡 中等 | 🟢 极快 |
| 生态成熟度 | 🟢 最广泛 | 🟢 增长最快 | 🟢 NoSQL 第一 |

### 2.2 选型决策树

```
你的数据结构是什么样的？
│
├── 结构固定、关系复杂（用户-订单-商品）
│   ├── 需要高级 SQL（CTE、窗口函数、JSONB） → ✅ PostgreSQL
│   ├── 团队熟悉 MySQL + 追求极简部署 → ✅ MySQL
│   └── 需要 GIS 地理信息查询 → ✅ PostgreSQL（PostGIS）
│
├── 结构灵活、快速迭代（内容管理、配置中心）
│   └── ✅ MongoDB
│
├── 混合场景（部分结构固定 + 部分灵活）
│   └── ✅ PostgreSQL（JSONB 兼顾结构化和半结构化）
│
└── 超高并发写入 + 水平扩展
    └── ✅ MongoDB（原生分片）
```

---

## 🔧 3. ORM 选型：Prisma vs TypeORM vs Mongoose

### 3.1 一表对比

| 维度 | Prisma | TypeORM | Mongoose |
|------|--------|---------|----------|
| 支持数据库 | PG / MySQL / SQLite / MongoDB | PG / MySQL / SQLite / Oracle | MongoDB 专用 |
| Schema 定义 | `.prisma` DSL 文件 | TypeScript 装饰器/Entity | Schema + Model |
| 类型安全 | 🟢 编译时类型推导（极强） | 🟡 运行时（依赖装饰器） | 🟡 需手动泛型 |
| Migration | 🟢 自动生成 | 🟡 需手动管理 | ❌ Schema-less |
| API 风格 | 函数式链式调用 | Repository/ActiveRecord | 链式查询构建器 |
| 学习曲线 | 🟢 低 | 🟡 中等 | 🟢 低 |
| NestJS 集成 | ✅ @nestjs/prisma | ✅ @nestjs/typeorm | ✅ @nestjs/mongoose |
| Star ⭐ | 42k+ | 35k+ | 27k+ |

### 3.2 Prisma — 类型安全王者

```prisma
// schema.prisma — 声明式数据模型
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String?
  role      Role      @default(USER)
  posts     Post[]    // 一对多关系
  profile   Profile?  // 一对一关系
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("users")  // 映射表名
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  published Boolean   @default(false)
  author    User      @relation(fields: [authorId], references: [id])
  authorId  Int
  tags      Tag[]     // 多对多关系
  createdAt DateTime  @default(now())

  @@index([authorId])
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  avatar String?
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

enum Role {
  USER
  ADMIN
  EDITOR
}
```

```typescript
// Prisma 查询 — 全程类型安全
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 创建用户（带关联）
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'Alice',
    profile: {
      create: { bio: '前端工程师' }    // 嵌套创建
    },
    posts: {
      create: [
        { title: 'Hello Prisma', content: '...' }
      ]
    }
  },
  include: {
    profile: true,
    posts: true
  }
})

// 复杂查询
const users = await prisma.user.findMany({
  where: {
    AND: [
      { role: 'ADMIN' },
      { posts: { some: { published: true } } }  // 关联过滤
    ]
  },
  select: {
    id: true,
    name: true,
    _count: { select: { posts: true } }  // 关联计数
  },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 20,
})

// 事务
const [order, payment] = await prisma.$transaction([
  prisma.order.create({ data: { ... } }),
  prisma.payment.create({ data: { ... } }),
])
```

### 3.3 TypeORM — 装饰器驱动

```typescript
// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm'
import { Post } from './post.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  name: string

  @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
  role: string

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]

  @CreateDateColumn()
  createdAt: Date
}

// 查询
const users = await userRepository.find({
  where: { role: 'ADMIN' },
  relations: ['posts'],
  order: { createdAt: 'DESC' },
  skip: 0,
  take: 20,
})

// QueryBuilder（复杂查询）
const result = await userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'post')
  .where('user.role = :role', { role: 'ADMIN' })
  .andWhere('post.published = :published', { published: true })
  .orderBy('user.createdAt', 'DESC')
  .skip(0)
  .take(20)
  .getManyAndCount()
```

### 3.4 Mongoose — MongoDB 专属

```typescript
// user.schema.ts（NestJS 风格）
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  email: string

  @Prop()
  name: string

  @Prop({ enum: ['USER', 'ADMIN'], default: 'USER' })
  role: string

  @Prop({ type: [{ type: Object }] })
  addresses: Record<string, any>[]  // 嵌套灵活结构
}

export const UserSchema = SchemaFactory.createForClass(User)

// 查询
const users = await this.userModel
  .find({ role: 'ADMIN' })
  .sort({ createdAt: -1 })
  .skip(0)
  .limit(20)
  .populate('posts')    // 填充关联文档
  .exec()

// 聚合管道
const stats = await this.userModel.aggregate([
  { $match: { role: 'ADMIN' } },
  { $lookup: { from: 'posts', localField: '_id', foreignField: 'authorId', as: 'posts' } },
  { $addFields: { postCount: { $size: '$posts' } } },
  { $sort: { postCount: -1 } },
])
```

---

## 🔄 4. Migration（数据迁移）对比

| 维度 | Prisma | TypeORM | Mongoose |
|------|--------|---------|----------|
| 迁移生成 | `prisma migrate dev` 自动生成 SQL | `typeorm migration:generate` | 无（Schema-less） |
| 迁移文件 | `.sql` 文件 | TypeScript 文件 | 不适用 |
| 回滚 | ✅ 支持 | ✅ 支持 | 不适用 |
| 生产环境 | `prisma migrate deploy` | `typeorm migration:run` | 无需迁移 |
| 种子数据 | `prisma db seed` | 手动脚本 | 手动脚本 |

```bash
# Prisma 迁移工作流
npx prisma migrate dev --name add_user_table   # 开发环境
npx prisma migrate deploy                       # 生产环境
npx prisma db seed                               # 填充种子数据
npx prisma studio                                # 可视化数据管理
```

---

## 📋 5. ORM 选型决策

```
你用什么数据库？
│
├── MongoDB
│   └── ✅ Mongoose（MongoDB 专用最佳选择）
│
├── PostgreSQL / MySQL
│   ├── 追求极致类型安全 + 现代化 API → ✅ Prisma
│   ├── 需要复杂原始 SQL + 灵活性 → ✅ TypeORM
│   └── NestJS 项目 + 团队无偏好 → ✅ Prisma（推荐）
│
└── 多数据库混合
    └── ✅ Prisma（2024 已支持 MongoDB + SQL 混用）
```

---

## ⚠️ 6. 常见踩坑

| 错误 | 后果 | 建议 |
|-----|------|------|
| 表设计没有加索引 | 数据量大时查询卡死 | WHERE/JOIN 字段必须建索引 |
| MongoDB 存关系复杂数据 | 关联查询性能差 | 关系密集用关系型数据库 |
| ORM 查询 N+1 问题 | 一个列表 N 次数据库查询 | 用 include/populate 预加载 |
| Prisma 不用 select 过滤 | 返回所有字段，浪费带宽 | 用 select 只取需要的字段 |
| 不用事务做关联操作 | 数据不一致 | 关联写入必须用事务 |

---

## ✅ 本篇重点 Checklist

- [ ] 区分关系型（MySQL/PostgreSQL）和文档型（MongoDB）的适用场景
- [ ] 掌握 PostgreSQL JSONB 的混合方案优势
- [ ] 了解 Prisma / TypeORM / Mongoose 的 API 风格差异
- [ ] 会用 Prisma Schema 定义数据模型和关系
- [ ] 掌握 Migration 迁移工作流
- [ ] 理解 N+1 问题及解决方案

---

> 数据库选得好，半夜不加班。
> 下一篇我们聊 **API 设计范式 — RESTful vs GraphQL vs tRPC**。

---
*📝 作者：NIHoa ｜ 系列：Node.js技术选型与架构系列 ｜ 更新日期：2025-02-04*
