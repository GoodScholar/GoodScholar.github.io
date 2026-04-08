---
date: 2025-05-06
tags:
  - AI编程
  - Skills实战
  - Workflow
  - 自动化
  - Superpowers
cover: /covers/cover-skills-practice-workflow.webp
---
# Skills 流水线实战 — 从零搭建 Skill + Workflow 自动化开发体系

> 🏭 你有 10 个 Skills，每次开发还是手动告诉 AI "先加载这个、再加载那个"。这就像你买了一整套智能家居，每天还要挨个按开关。**Workflow 就是那个"回家自动开灯开空调"的场景联动——一句话触发，Skills 自动编排。**

---

## 🎯 场景与挑战

你是一个 Vue 3 + TypeScript 全栈开发者。经过几个月的积累，你已经有了这些 Skills：

```
.agent/skills/
├── vue3-component/        # Vue 组件规范
├── api-request/           # 接口请求封装规范
├── form-validation/       # 表单校验规范
├── rbac-permission/       # 权限控制规范
├── typescript-model/      # 数据模型定义规范
├── git-commit/            # Commit Message 规范
├── code-review/           # 代码审查清单
└── unit-test/             # 单元测试规范
```

**8 个 Skills，覆盖了日常开发的方方面面。但问题来了——**

每次接到一个新模块的开发任务（比如"做一个用户管理的 CRUD 页面"），你的操作是这样的：

```
你: 帮我做用户管理页面。
    先加载 typescript-model 规范，定义 User 类型。
AI: 好的…（定义完类型）

你: 再加载 api-request 规范，封装 useUserList hook。
AI: 好的…（写完接口）

你: 现在加载 vue3-component + form-validation + rbac-permission，
    写用户列表页和编辑表单。
AI: 好的…（写完页面）

你: 最后加载 unit-test 规范写测试，然后用 code-review 审查一遍，
    用 git-commit 规范提交。
AI: 好的…（全部完成）

总耗时：反复切换指令 + 等待响应，光"指挥 AI"就花了 20 分钟。
```

**核心痛点**：你变成了"人肉调度器"——每一步都要手动告诉 AI 加载哪个 Skill、做什么事、什么顺序。**Skills 有了，编排没有。**

---

## 🧰 解决方案：Workflow 自动编排

| 概念 | 类比 | 作用 |
|:---:|:---|:---|
| **Skill** | 工具箱里的单把螺丝刀 | 解决单一问题 |
| **Workflow** | 组装说明书 | 按顺序调用多个 Skills |
| **AGENTS.md** | 工厂的基础规章 | 全局约束和默认行为 |

```
没有 Workflow：                      有 Workflow：
┌──────────┐                       ┌──────────┐
│ 你手动指挥 │ ← 8 次指令           │ 你说一句话 │ ← 1 次指令
│ 加载 Skill │                      │ "新建用户  │
│ → 执行    │                      │  管理模块" │
│ → 加载下一个│                      └────┬─────┘
│ → 执行    │                           │
│ → ...     │                      ┌────▼─────┐
└──────────┘                       │ Workflow  │
                                   │ 自动编排   │
                                   │ 8个Skills │
                                   └──────────┘
```

> **Skill 管"怎么做"，Workflow 管"按什么顺序做"。Skill 是肌肉，Workflow 是大脑。**

---

## 🛠️ 实战过程

### Phase 1：梳理开发流程 — 5 分钟画清楚"标准动作"

在写 Workflow 之前，先想清楚你开发一个新模块的"标准流程"是什么。

以 CRUD 后台管理模块为例，回顾过去 10 次开发经验，你会发现每次都是这个顺序：

```
Step 1: 定义数据模型  →  用 TypeScript interface 描述实体
Step 2: 封装 API      →  基于模型创建增删改查 hooks
Step 3: 搭建列表页    →  Table + 搜索 + 分页 + 权限控制
Step 4: 搭建表单      →  Dialog/Drawer + 校验 + 提交
Step 5: 写单元测试    →  覆盖核心逻辑
Step 6: 代码审查      →  自动审查 + 修复
Step 7: 提交代码      →  规范 Commit Message
```

**7 步，每步对应 1-2 个 Skills。** 这就是你的"标准动作"——可以被 Workflow 固化下来。

---

### Phase 2：创建 Workflow 文件 — 10 分钟写完"说明书"

在 `.agent/workflows/` 目录下创建文件：

```bash
mkdir -p .agent/workflows
touch .agent/workflows/new-crud-module.md
```

```markdown
---
description: 新建一个标准 CRUD 后台管理模块，自动编排完整的开发流程
---

# 新建 CRUD 管理模块

当用户要求新建一个后台管理模块（如用户管理、商品管理、订单管理）时，
严格按以下 7 步执行。**每完成一步必须暂停等待用户确认后再继续。**

## Step 1: 数据模型定义

1. 加载 `typescript-model` Skill
2. 根据用户描述的实体，在 `src/types/` 下创建对应的 TypeScript interface
3. 包含以下字段类型：基础字段、审计字段（createdAt, updatedAt）、关联字段
4. 同时创建 `CreateXxxDTO` 和 `UpdateXxxDTO` 类型

**产出**：`src/types/user.ts`（以用户管理为例）
**完成后**：展示类型定义，等待确认。

## Step 2: API 接口封装

1. 加载 `api-request` Skill
2. 在 `src/api/` 下创建接口文件
3. 必须包含 5 个标准接口：`getList`, `getDetail`, `create`, `update`, `delete`
4. 使用项目统一的 `useRequest` hook 封装
5. 列表接口必须支持分页和搜索参数

**产出**：`src/api/user.ts`
**完成后**：展示接口定义，等待确认。

## Step 3: 列表页面

1. 加载 `vue3-component` + `rbac-permission` Skill
2. 在 `src/views/` 下创建模块目录和列表页
3. 必须包含：Table 展示、搜索栏、分页器、操作按钮（新增/编辑/删除）
4. 操作按钮必须用 `<Permission>` 组件包裹，控制角色权限
5. 列表数据通过 Step 2 的 hook 获取

**产出**：`src/views/user/UserList.vue`
**完成后**：展示页面代码，等待确认。

## Step 4: 表单组件

1. 加载 `vue3-component` + `form-validation` Skill
2. 创建新增/编辑共用的表单组件
3. 表单校验规则必须与 DTO 类型对齐
4. 支持新增模式和编辑模式切换

**产出**：`src/views/user/UserForm.vue`
**完成后**：展示表单代码，等待确认。

## Step 5: 单元测试

1. 加载 `unit-test` Skill
2. 为 API hook 编写测试（mock 请求）
3. 为表单校验逻辑编写测试
4. 运行测试确认全部通过

**产出**：`src/__tests__/user.test.ts`
**完成后**：展示测试结果，等待确认。

## Step 6: 代码审查

1. 加载 `code-review` Skill
2. 按审查清单逐项检查本次所有新增代码
3. 自动修复可修复的问题
4. 列出需要人工判断的问题

**产出**：审查报告
**完成后**：展示审查结果，等待确认。

## Step 7: 规范提交

1. 加载 `git-commit` Skill
2. 将所有改动按类型拆分 commit
3. 格式：`feat(user): add user management CRUD module`

**产出**：Git commit
**完成后**：展示 commit 信息，完成。
```

---

### Phase 3：试跑 Workflow — 一句话触发全流程

现在你只需要说一句话：

```
你: 新建一个商品管理模块，实体字段包括：
    名称、价格、分类、库存、上架状态。
```

AI 识别到你的请求匹配 `new-crud-module` Workflow，**自动按 7 步执行**：

```
🤖 匹配 Workflow: new-crud-module
   开始执行 Step 1/7: 数据模型定义

   加载 Skill: typescript-model ✅

   生成文件: src/types/product.ts
   ─────────────────────────────
   interface Product {
     id: string
     name: string
     price: number
     categoryId: string
     stock: number
     isOnShelf: boolean
     createdAt: string
     updatedAt: string
   }

   interface CreateProductDTO {
     name: string
     price: number
     categoryId: string
     stock: number
     isOnShelf?: boolean  // 默认 false
   }

   ⏸️ Step 1 完成，请确认后继续。

你: 继续

🤖 开始执行 Step 2/7: API 接口封装
   加载 Skill: api-request ✅

   生成文件: src/api/product.ts
   ────────────────────────────
   export function useProductList(params: ListParams) { ... }
   export function useProductDetail(id: string) { ... }
   export function useCreateProduct() { ... }
   export function useUpdateProduct() { ... }
   export function useDeleteProduct() { ... }

   ⏸️ Step 2 完成，请确认后继续。
```

**就这样一步一步地走下去。** 你全程只需要说"继续"或"这里改一下 XX"。

---

### Phase 4：进阶优化 — 让 Workflow 更智能

#### 优化 1：自动检测已有文件，跳过重复步骤

```markdown
## Step 1: 数据模型定义

> ⚡ 优化：如果 `src/types/` 下已存在目标实体的类型文件，
> 直接读取并跳过本步骤，在控制台提示"已检测到现有类型定义，跳过 Step 1"。
```

#### 优化 2：根据复杂度自动调整

```markdown
## 自适应规则

- 如果实体字段 ≤ 5 个 → 跳过 Step 4（用 inline 表单替代独立组件）
- 如果用户说"不需要权限控制" → Step 3 不加载 `rbac-permission` Skill
- 如果用户说"快速出一版" → 跳过 Step 5 和 Step 6
```

#### 优化 3：加入 Turbo 模式

在不需要每步确认的场景，加上 `// turbo-all` 标记：

```markdown
---
description: 快速新建 CRUD 模块（全自动，不暂停）
---

// turbo-all

# 快速 CRUD 模块
（同上流程，但去掉所有"等待确认"步骤）
```

---

## 📊 效果对比

| 维度 | 手动指挥 Skills | **Workflow 自动编排** |
|:---:|:---|:---|
| 指令次数 | 8 次（每步一次） | **1 次** |
| 切换 Skill 的心智负担 | 需要记住哪步用哪个 Skill | **零负担，Workflow 自动加载** |
| 遗漏风险 | 容易漏掉权限控制或测试 | **流程固化，不会遗漏** |
| 新人上手成本 | 需要培训"8 个 Skills 的用法" | **说一句话就行** |
| 团队一致性 | 每个人调用顺序不同 | **所有人走同一条流水线** |
| 开发一个 CRUD 模块耗时 | ~40 分钟 | **~15 分钟** |

---

## 💎 从零搭建流水线的 5 步方法论

如果你想为自己的项目搭建 Workflow 流水线，照着这 5 步来：

### Step 1：盘点你的 Skills

列出你已有的 Skills 和它们各自解决的问题。如果某个环节还没有 Skill，先补上。

### Step 2：画出标准流程

回顾你过去 10 次做类似开发的经验，提炼出固定的步骤。**如果你连续 3 次都用了同样的顺序，那就是可以被固化的流程。**

### Step 3：按步骤关联 Skills

每个步骤关联 1-2 个 Skills。注意：**一个步骤不要加载超过 3 个 Skills**，否则上下文太重，质量下降。

### Step 4：加入暂停点

关键决策点（如数据模型确认、UI 布局确认）必须暂停等用户确认。非关键步骤可以用 `// turbo` 跳过。

### Step 5：试跑 + 迭代

写完后立刻试跑一遍。你会发现：
- 某些步骤的顺序可以优化
- 某些 Skill 的产出需要微调
- 某些步骤可以合并或拆分

**Workflow 和 Skill 一样，不是写完就不管了，而是在实战中持续迭代。**

---

## ✅ / ❌ 最佳实践清单

| | 做法 |
|:---:|:---|
| ✅ | 每个步骤有明确的**输入和输出** |
| ✅ | 关键步骤设置暂停点，让人类确认 |
| ✅ | 每个步骤只加载 1-2 个相关 Skills |
| ✅ | Workflow 文件放到 `.agent/workflows/`，跟项目一起提交 Git |
| ✅ | 根据复杂度设置自适应规则 |
| ❌ | 所有步骤一口气跑完，出了问题才发现 |
| ❌ | 一个步骤塞 5+ 个 Skills，导致上下文爆炸 |
| ❌ | Workflow 只有你自己能用，团队不知道 |
| ❌ | 写完一次就不迭代了 |

---

## 🚀 行动指南

想立刻开始？复制这个最简模板：

```bash
mkdir -p .agent/workflows
cat > .agent/workflows/my-first-workflow.md << 'EOF'
---
description: 我的第一个 Workflow — [描述你的场景]
---

# [流程名称]

## Step 1: [第一步名称]
1. 加载 `[skill-name]` Skill
2. [具体操作]
3. **产出**：[文件或结果]
4. **完成后**：展示结果，等待确认。

## Step 2: [第二步名称]
1. 加载 `[skill-name]` Skill
2. [具体操作]
3. **产出**：[文件或结果]
4. **完成后**：展示结果，等待确认。
EOF
```

> **你不需要一开始就搭建完美的流水线。先把最常重复的 3 步写成 Workflow，立刻就能感受到"不用当人肉调度器"的快乐。**

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 更新日期：2025-05-06*
