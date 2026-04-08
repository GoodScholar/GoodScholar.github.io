---
date: 2025-05-08
tags:
  - AI编程
  - Skills实战
  - AGENTS.md
  - Workflow
  - 工程化
cover: /covers/cover-skills-practice-trident.webp
---
# 三剑客合璧 — Skills + AGENTS.md + Workflow 构建你的 AI 开发操作系统

> ⚔️ 你有了 Skills（技能包），有了 AGENTS.md（全局规章），也试过 Workflow（流水线）。但它们各自为战——Skills 不知道 AGENTS.md 的全局约束，Workflow 不知道 Skills 的详细规范。**当三者真正协同起来，你的 AI 助手就不再是"工具"，而是一个有规矩、有技能、有流程的"数字员工"。**

---

## 🎯 场景与挑战

你有一个 Taro + Vue 3 的跨端小程序项目，团队 3 个人。你遇到了以下痛点：

```
痛点 1：全局规范不统一
  - 张三让 AI 用 Options API，李四让 AI 用 Composition API
  - 同一个项目里两种风格共存，代码审查吵架

痛点 2：Skills 有但没人遵守
  - 写了 8 个 Skills，但新来的同事不知道有这些 Skills
  - 老同事也经常忘记让 AI 加载对应的 Skill

痛点 3：重复性工作没自动化
  - 每次新建页面都要：创建目录 → 写模板代码 → 注册路由 → 写接口 → 写测试
  - 5 个步骤，每次手动指挥
```

**根本问题**：三个工具各管各的，没有形成体系。

```
现状（各自为战）：

Skills → AI 有时加载有时忘
AGENTS.md → 写了但 AI 不会主动参照
Workflow → 有流程但和 Skills 脱节

理想（协同体系）：

AGENTS.md  →  全局"宪法"，定义底线和默认行为
    ↓
Skills     →  各领域的"专业规范"，被 AGENTS.md 索引
    ↓
Workflow   →  标准"作业流程"，自动调用 Skills
```

---

## 🧰 三剑客各司其职

| 层级 | 工具 | 类比 | 管什么 |
|:---:|:---:|:---|:---|
| **L1 宪法层** | AGENTS.md | 公司章程 | 全局约束、默认行为、底线红线 |
| **L2 技能层** | Skills | 岗位技能手册 | 各领域的具体规范和标准 |
| **L3 流程层** | Workflow | 标准作业流程 | 多步骤任务的执行编排 |

```
三层架构：

┌─────────────────────────────────────────────┐
│ L1: AGENTS.md（宪法）                        │
│  "所有代码必须用 TypeScript"                  │
│  "所有组件必须遵循 vue3-component Skill"       │
│  "新建页面必须走 new-page Workflow"            │
└──────┬──────────────────────────┬───────────┘
       │                          │
┌──────▼──────┐           ┌───────▼──────┐
│ L2: Skills  │           │ L3: Workflow │
│ ┌─────────┐ │           │ Step 1 → S1 │
│ │vue3-comp│ │           │ Step 2 → S2 │
│ ├─────────┤ │           │ Step 3 → S3 │
│ │api-req  │ │ ◄─────── │ Step 4 → S4 │
│ ├─────────┤ │  调用     │ Step 5 → S5 │
│ │taro-nav │ │           └──────────────┘
│ └─────────┘ │
└─────────────┘
```

> **AGENTS.md 定义"必须做什么"，Skills 定义"怎么做"，Workflow 定义"按什么顺序做"。三者缺一不可。**

---

## 🛠️ 实战过程

### Phase 1：搭建 AGENTS.md — 定义全局"宪法"

在项目根目录创建 `AGENTS.md`：

```markdown
# 项目 AI 开发规范

## 技术栈
- 框架：Taro 4.x + Vue 3 + TypeScript
- UI 库：@taroify/core
- 状态管理：Pinia
- 请求：@taro-hooks/useRequest

## 全局红线（不可违反）
1. **所有 .vue 文件必须使用 `<script setup lang="ts">`**
2. **禁止使用 any 类型**，必须定义明确的接口
3. **禁止直接使用 Taro.request**，必须通过统一封装的请求层
4. **所有可交互元素必须有唯一 ID**，格式：`[页面]-[功能]-[元素]`
5. **Commit Message 必须遵循 Conventional Commits 格式**

## Skills 索引
在以下场景自动加载对应 Skill：

| 场景 | 自动加载的 Skill |
|------|----------------|
| 创建 Vue 组件 / 页面 | `vue3-component` |
| 使用 UI 组件 | `taroify-ui` |
| 编写接口请求 | `api-request` |
| 创建表单 | `form-validation` |
| 涉及页面导航 | `taro-navigation` |
| 代码审查 | `code-review` |

## Workflow 索引
在以下场景自动触发对应 Workflow：

| 用户请求 | 自动触发的 Workflow |
|---------|-------------------|
| "新建页面" / "创建页面" | `new-page` |
| "新建模块" / "CRUD" | `new-crud-module` |
| "发版" / "提交" | `ship-release` |

## 目录结构约定
src/
├── components/    # 公共组件（PascalCase 命名）
├── pages/         # 页面（kebab-case 目录）
│   └── [page-name]/
│       ├── index.vue          # 页面入口
│       ├── components/        # 页面私有组件
│       └── composables/       # 页面私有 hooks
├── api/           # 接口封装（按模块分文件）
├── types/         # TypeScript 类型定义
├── stores/        # Pinia stores
└── utils/         # 工具函数
```

**关键设计**：
- AGENTS.md 不写具体的代码规范细节（那是 Skills 的事）
- AGENTS.md 写的是**索引**——告诉 AI 在什么场景下去加载哪个 Skill
- AGENTS.md 写的是**红线**——无论加载了什么 Skill，这些规则不可违反

---

### Phase 2：搭建 Skills — 填充"技能手册"

在 `.agent/skills/` 目录下创建各 Skills。这里以 `taro-navigation` 为例（之前的文章没出现过的）：

```markdown
---
name: taro-navigation
description: >
  涉及 Taro 页面跳转、路由导航、TabBar 切换时使用。
  触发关键词：navigateTo、redirectTo、页面跳转、路由。
---

# Taro 导航规范

## 页面跳转
// ✅ 使用封装的导航工具函数
import { navigateTo, redirectTo } from '@/utils/navigation'
navigateTo('/pages/article-detail/index', { id: '123' })

// ❌ 禁止直接调用 Taro API
Taro.navigateTo({ url: '/pages/article-detail/index?id=123' })

## 路由参数
// ✅ 使用 useRouter 获取参数，类型安全
const router = useRouter()
const { id } = router.params as { id: string }

// ❌ 禁止用 getCurrentInstance 获取参数

## TabBar 页面
// ✅ TabBar 页面必须用 switchTab
switchTab('/pages/home/index')

// ❌ 禁止用 navigateTo 跳转到 TabBar 页面

## 返回上一页
// ✅ navigateBack(1)
// ❌ 禁止 Taro.navigateBack({ delta: 1 })

## 路由常量
所有页面路径定义在 src/constants/routes.ts：
export const ROUTES = {
  HOME: '/pages/home/index',
  ARTICLE_DETAIL: '/pages/article-detail/index',
  // ...
}
```

**与 AGENTS.md 的关系**：AGENTS.md 说"涉及页面导航时加载 taro-navigation"，具体怎么导航的细节在这个 Skill 里。

---

### Phase 3：搭建 Workflow — 串联全流程

创建 `.agent/workflows/new-page.md`：

```markdown
---
description: 在 Taro + Vue 3 项目中新建一个标准页面
---

# 新建页面

当用户要求新建一个页面时，严格按以下步骤执行。

## Step 1: 创建目录结构

1. 在 `src/pages/` 下创建页面目录（kebab-case 命名）
2. 创建以下文件：
   ```
   src/pages/[page-name]/
   ├── index.vue          # 页面入口
   ├── index.config.ts    # Taro 页面配置
   ├── components/        # 页面私有组件目录
   └── composables/       # 页面私有 hooks 目录
   ```
3. **必须** 在 `app.config.ts` 的 pages 数组中注册新页面
4. **必须** 在 `src/constants/routes.ts` 中添加路由常量

**完成后**：展示目录结构，等待确认。

## Step 2: 编写页面骨架

1. 加载 `vue3-component` + `taroify-ui` Skill
2. 在 index.vue 中生成页面骨架代码
3. 页面必须包含：
   - 导航栏配置（自定义标题）
   - 下拉刷新支持（如果是列表页）
   - 空状态处理
   - 加载状态处理

**完成后**：展示页面代码，等待确认。

## Step 3: 接口对接（如需要）

1. 加载 `api-request` Skill
2. 在 `src/api/` 下创建或复用接口文件
3. 在页面中通过 hook 引入接口数据

**完成后**：展示接口代码，等待确认。

## Step 4: 路由联通

1. 加载 `taro-navigation` Skill
2. 确认入口页面已添加跳转到新页面的入口
3. 如果需要从其他页面跳转过来，补充 navigateTo 调用

**完成后**：展示路由配置，等待确认。

## Step 5: 验证

1. 确认 `app.config.ts` 中已注册页面
2. 确认 `routes.ts` 中已添加常量
3. 确认从入口页面可以跳转到新页面
4. 如果是列表页，确认搜索/分页/空状态都正常

**完成后**：展示验证结果，完成。
```

**与 Skills 的关系**：Workflow 的每个步骤都指定了要加载哪个 Skill。Workflow 是指挥官，Skills 是执行者。

**与 AGENTS.md 的关系**：AGENTS.md 说"用户说'新建页面'时自动触发 new-page Workflow"。用户不需要知道 Workflow 的名字。

---

### Phase 4：三剑客协同演示 — 一句话的魔法

**你说**：

```
帮我新建一个文章详情页。
```

**幕后发生的事**：

```
🤖 Step 0: 读取 AGENTS.md
   → 匹配"新建页面" → 触发 new-page Workflow
   → 记住全局红线（TypeScript 必须、禁止 any、统一请求层等）

🤖 Step 1: 创建目录结构
   → 遵循 AGENTS.md 的目录约定
      src/pages/article-detail/
      ├── index.vue
      ├── index.config.ts
      ├── components/
      └── composables/
   → 在 app.config.ts 注册页面 ✅
   → 在 routes.ts 添加常量 ✅

   ⏸️ 展示目录结构，等待确认。

你: 继续

🤖 Step 2: 编写页面骨架
   → 加载 vue3-component Skill → script setup + TypeScript ✅
   → 加载 taroify-ui Skill → 使用 @taroify/core 组件 ✅
   → 全局红线检查：有 any 吗？→ 没有 ✅
   → 全局红线检查：元素 ID 有吗？→ 有 ✅

   ⏸️ 展示页面代码，等待确认。

你: 继续

🤖 Step 3: 接口对接
   → 加载 api-request Skill → useRequest hook ✅
   → 全局红线检查：用了 Taro.request 吗？→ 没有 ✅

   ⏸️ 展示接口代码，等待确认。

你: 继续

🤖 Step 4: 路由联通
   → 加载 taro-navigation Skill → 使用 navigateTo 工具函数 ✅
   → 使用 ROUTES.ARTICLE_DETAIL 常量 ✅
   → 全局红线检查：直接用了 Taro.navigateTo 吗？→ 没有 ✅

   ⏸️ 展示路由代码，等待确认。

你: 继续

🤖 Step 5: 验证
   → app.config.ts 已注册 ✅
   → routes.ts 已添加 ✅
   → 入口页面有跳转链接 ✅

   ✅ 全部完成！
```

**注意三层约束是如何协同的**：
- **AGENTS.md**（L1 宪法）：全程检查红线（TypeScript、禁止 any、统一请求层）
- **Skills**（L2 技能）：每一步的具体编码规范（组件结构、UI 用法、导航方式）
- **Workflow**（L3 流程）：5 步执行顺序 + 每步加载哪个 Skill

---

## 📊 效果对比

| 维度 | 只有 Skills | 只有 AGENTS.md | **三剑客协同** |
|:---:|:---|:---|:---|
| 全局一致性 | ⚠️ 取决于有没有加载 | ✅ 有但缺细节 | ✅ **宪法 + 细则双保险** |
| 编码规范 | ✅ 详细但要手动加载 | ❌ 太粗不够具体 | ✅ **AGENTS.md 索引自动加载** |
| 流程自动化 | ❌ 没有流程概念 | ❌ 没有编排能力 | ✅ **Workflow 自动编排** |
| 新人上手 | ⚠️ 需要知道有哪些 Skills | ✅ 读 AGENTS.md 就行 | ✅ **一句话触发，零学习成本** |
| 团队协作 | ⚠️ 各用各的 Skills | ✅ 全局统一 | ✅ **规范 + 技能 + 流程 = 统一标准** |
| 遗漏率 | 高（忘记加载） | 中（缺少细节） | **低（三层互补）** |

---

## 💡 实战心得

### 1. AGENTS.md 写"什么不能做"，Skills 写"怎么做"

AGENTS.md 最大的价值是**红线和索引**。不要在 AGENTS.md 里写具体的代码规范（那太长了），而是写"什么场景加载什么 Skill"。

```markdown
# ❌ 不要在 AGENTS.md 里写这些
所有 Vue 组件必须使用 defineProps 配合 TypeScript 接口，
接口名用 Props 后缀，使用 withDefaults 设置默认值……（500 行）

# ✅ 在 AGENTS.md 里写索引
创建 Vue 组件时，自动加载 `vue3-component` Skill。
```

### 2. Workflow 是"可选加速器"

不是所有场景都需要 Workflow。**只有你发现自己重复执行 3 次以上相同流程时**，才值得写 Workflow。不要为了自动化而自动化。

### 3. 三者的维护频率不同

| 工具 | 维护频率 | 谁来维护 |
|:---:|:---|:---|
| AGENTS.md | 低（技术栈变更时） | Tech Lead |
| Skills | 中（发现新的规范需求时） | 各领域负责人 |
| Workflow | 低（流程变更时） | 任何人 |

### 4. 适用场景

| 场景 | 推荐方案 |
|:---:|:---|
| 个人独立项目 | Skills 足够，AGENTS.md 可选 |
| 2-5 人小团队 | **三剑客完整体系** |
| 开源项目 | AGENTS.md + Skills（贡献者规范） |
| 一次性演示项目 | 都不需要 |

---

## 🚀 行动清单：搭建你的三剑客体系

```bash
# 1. 创建三个目录
mkdir -p .agent/skills .agent/workflows
touch AGENTS.md

# 2. 先写 AGENTS.md
#    - 列出技术栈
#    - 写 5 条全局红线
#    - 写 Skills 索引表
#    - 写 Workflow 索引表

# 3. 创建第一个 Skill
#    - 从你最常指导 AI 的规范开始
#    - 包含 ✅/❌ 对比示例

# 4. 创建第一个 Workflow
#    - 从你最常重复的流程开始
#    - 每步关联 1-2 个 Skills

# 5. 提交到 Git，团队共享
git add AGENTS.md .agent/
git commit -m "feat: add AI development governance - agents, skills, workflows"
```

> **AGENTS.md 是宪法，Skills 是法律，Workflow 是标准作业程序。三者合一，你的 AI 助手就从"临时工"升级为"正式员工"。**

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 更新日期：2025-05-08*
