---
date: 2025-05-05
tags:
  - AI编程
  - Skills实战
  - OpenSpec
  - Superpowers
  - SDD
cover: /covers/cover-skills-practice-openspec.webp
---
# OpenSpec + Superpowers 持续迭代 — 项目知识不丢失

> 🧩 三周前 AI 帮你做了登录功能，现在你说"加个第三方登录"。AI："登录系统是怎么设计的？让我读 2000 行代码猜猜看……" —— 这就是项目知识丢失的代价。OpenSpec 补全了这个短板。

---

## 🎯 场景与挑战

你有一个博客系统，三周前用 Superpowers 实现了用户注册登录功能。现在你需要进行**第二次迭代**——添加评论功能。

**痛点**：

```
你: 帮我给博客加一个评论功能，支持嵌套回复。
AI: 好的……（开始读代码）
    这个 User 表是什么结构？有 role 字段吗？
    Token 验证用的哪种方式？JWT 还是 Session？
    API 路由的命名约定是什么？

你: 上次不是做过了吗……
AI: 对不起，我没有上次的上下文。让我看看代码——
    （读了 2000 行代码，理解了 60%）
    （改了一个不该改的地方，引入了新 Bug）
```

**根本问题**：Superpowers 的 brainstorming 设计文档和任务计划是**一次性的**。任务完成后，这些上下文散落在 Git 历史里，下次开发时 AI 只能从代码逆推设计意图——效率低还容易出错。

**OpenSpec 的价值**：它维护一份持久化的项目规格目录（`openspec/specs/`），让 AI 每次开发前都能读取完整的项目设计规格，像有了"项目记忆"。

---

## 🧰 Skills 组合

| Skill | 职责 | 解决什么问题 |
|:---:|:---|:---|
| 📜 OpenSpec `/opsx:propose` | 创建变更提案和规格 | 定义"要做什么、不做什么" |
| 🧠 Superpowers `brainstorming` | 基于已有规格深化技术细节 | 不从零开始，基于现有规格讨论 |
| 🔴 Superpowers `TDD` | 先写测试后写代码 | 保障实现质量 |
| ✅ Superpowers `verification` | 完成前验证 | 确保通过测试 |
| 📦 OpenSpec `/opsx:archive` | 归档变更到主规格 | 知识不丢失 |

```
工作流（持续迭代循环）：
OpenSpec 提案 → Superpowers 编码 → OpenSpec 归档 → 下次迭代继续……
```

---

## 🛠️ 实战过程

### 前提：项目已有规格

上一次开发完登录功能后，`openspec/specs/` 目录中已经有：

```
openspec/
├── specs/
│   ├── auth.md          # 认证模块规格
│   └── user.md          # 用户模块规格
└── changes/
    └── archive/
        └── 2025-04-20-add-auth/  # 历史变更记录
```

**auth.md 内容示例**：
```markdown
# 认证模块规格

## 技术方案
- JWT Token 认证
- Access Token 有效期 15 分钟
- Refresh Token 有效期 7 天
- Token 存储在 httpOnly Cookie 中

## 数据模型
User {
  id: UUID
  email: string (unique)
  passwordHash: string
  role: 'user' | 'admin'
  createdAt: Date
}

## API 接口
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
```

> **关键**：这些规格是上一次迭代归档后留下的。AI 可以直接读取，不需要从代码中逆推。

---

### Step 1：OpenSpec 提案 — 定义变更范围

```
你: /opsx:propose add-blog-comments
```

OpenSpec 在创建提案前，会先读取 `openspec/specs/` 中的全部现有规格文件，然后生成：

**`openspec/changes/add-blog-comments/proposal.md`**：
```markdown
# 添加博客评论功能

## 已有项目上下文（自动从 specs/ 读取）
- 认证方式：JWT Token（see auth.md）
- 用户模型：User { id, email, role }（see user.md）

## 变更范围
- 新增 Comment 数据模型
- 新增评论 CRUD API（需要认证）
- 新增评论列表 UI 组件
- 支持嵌套回复（最多 3 层）

## 不做什么
- 不做实时推送（后续迭代）
- 不做评论审核系统（后续迭代）
- 不修改现有认证逻辑
```

**`openspec/changes/add-blog-comments/tasks.md`**：
```markdown
- [ ] 1. 创建 Comment 数据模型和 Prisma migration
- [ ] 2. 实现评论 CRUD API
- [ ] 3. 创建 CommentList 组件
- [ ] 4. 创建 CommentForm 组件
- [ ] 5. 实现嵌套回复 UI
- [ ] 6. 集成到文章详情页
```

> 注意：因为 OpenSpec 读取了 `auth.md`，它知道评论 API 需要 JWT 认证，而不是自己发明一套认证。

---

### Step 2：Superpowers 接管编码

审查完提案后，你说：

```
按照 openspec/changes/add-blog-comments/ 的提案，开始实现评论功能。
```

→ Superpowers 的 `brainstorming` 激活，但它**不是从零开始**，而是基于已有规格讨论技术细节：

```
AI: 我已阅读提案和现有规格。关于评论的嵌套回复，有两种方案：

    A) 邻接表（每条评论存 parentId）
       - 查询简单，但需递归加载
       - 与现有 User 关联通过 userId
       
    B) 物化路径（评论存完整路径 "1/3/7"）
       - 查询更快，但路径更新复杂
    
    A 方案与你现有的 Prisma + PostgreSQL 技术栈更匹配，
    且 3 层嵌套不需要担心递归性能。推荐 A。

你: A，同意。
```

→ 进入 TDD 编码。子代理在执行时，主代理会将 `openspec/specs/` 中的相关规格作为上下文传递：

```
主代理 → 子代理指令：
  "实现评论 CRUD API。
   上下文：
   - 认证方式：JWT Token（参见 auth.md 规格）
   - 现有 User 模型（参见 user.md 规格）
   - 评论需要关联 userId
   - API 接口需要验证 Token"
```

子代理因此能正确地复用现有认证中间件，而不是自己写一个新的。

---

### Step 3：OpenSpec 归档 — 知识入库

所有代码通过验证后：

```
你: /opsx:archive add-blog-comments
```

**OpenSpec 执行**：
```
✅ 归档到 openspec/changes/archive/2025-05-05-add-blog-comments/
   
specs 已更新：
  ✓ comment.md — 评论模块规格（新增）
  ✓ user.md — 用户模块规格（更新，添加评论关联说明）
```

现在 `openspec/specs/` 变成了：

```
openspec/specs/
├── auth.md       # 认证模块
├── user.md       # 用户模块（已更新）
└── comment.md    # 评论模块（新增）
```

> **下次迭代时**，AI 读取这 3 个文件就能完整了解项目现有功能，不需要从 2000 行代码中猜测。

---

## 📊 效果对比

| 维度 | 不用 OpenSpec（只有 Superpowers） | **OpenSpec + Superpowers** |
|:---:|:---|:---|
| AI 理解项目 | 读代码猜设计（耗时 20min, 理解 60%） | **读规格文件（耗时 1min, 理解 100%）** |
| 复用现有设计 | 可能重复发明已有功能 | **直接引用现有规格** |
| 认证集成 | 可能写了新的认证逻辑 | **正确复用 JWT 中间件** |
| 知识积累 | 散落在 Git 历史中 | **结构化归档到 specs/** |
| 第 N 次迭代成本 | 越来越高（代码越来越多） | **保持稳定（规格始终可读）** |

---

## 💡 实战心得

### 1. 归档是纪律，不是可选项

很多人用 OpenSpec 做提案很顺手，但做完功能后忘了 `/opsx:archive`。结果下次迭代时规格还是旧的,等于白用。**每次功能完成，立刻归档。**

### 2. specs/ 是给 AI 看的，不是给人看的

不需要写得很优美。关键是准确、完整、机器可读。AI 读取 specs/ 的效率比读源代码高 10 倍。

### 3. 控制器要主动传递规格

子代理不会自动去读 `openspec/specs/` 目录。主代理需要在任务指令中**主动把相关规格内容写进去**。这一步不能偷懒。

### 4. 适用场景

| 场景 | 推荐方案 |
|:---:|:---|
| 一次性项目 / 黑客松 | Superpowers 单独（不需要持久化知识） |
| **持续迭代的产品** | **OpenSpec + Superpowers（规格 + 质量）** |
| 接手遗留项目 | 先用 OpenSpec 逆向建立规格，再用 Superpowers 改造 |
| 多人协作项目 | OpenSpec 的规格文件是团队共识的载体 |

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 更新日期：2025-05-05*
