---
date: 2026-04-03
tags:
  - AI编程
  - AGENTS.md
  - 项目配置
  - Skills
  - 开发者工具
cover: /covers/cover-agents-md-config.webp
---
# AGENTS.md 写不好，AI 就是提线木偶 — 项目级 AI 指令的正确姿势

> 🎭 同一个 AI 模型，在 A 项目里生成的代码能直接跑，在 B 项目里生成的全是垃圾。差距不在模型，在那个 B 项目根目录下缺少的一个文件。

---

## 你可能正在经历的事

你装了 Claude Code / Gemini CLI / Cursor，对着 AI 说："帮我加一个用户设置页面。"

AI 给你写了一版。你一看：

```
❌ 组件库用了 Ant Design，你项目用的是 Taroify
❌ 路由用了 react-router，你项目是 Taro 的页面路由
❌ 状态管理用了 Redux，你项目统一用 Zustand
❌ CSS 写了 Tailwind 类名，你项目用 CSS Modules
❌ 文件放在了 src/views/ 下，你的约定是 src/pages/
```

你叹口气，在 Prompt 里加了一堆说明，重新跑一次。好了一些，但 CSS 命名又不对了。

第三次，你把所有约定都塞进 Prompt 里。AI 终于生成了接近正确的代码——但你的 Prompt 写了 300 字，比生成的代码还长。

**明天你又要加一个新页面。又要重新写 300 字的 Prompt。**

这就是没有 AGENTS.md 的日常。

---

## 🎯 1. AGENTS.md 到底是什么

一句话：**AGENTS.md 是一份放在项目根目录的指令文件，AI 在每次对话开始时自动读取它，作为所有交互的基础上下文。**

| 对比 | Prompt | AGENTS.md |
|:---:|:---|:---|
| 生效时机 | 这一次对话 | 每一次对话 |
| 需要手动输入 | 是 | 否，自动加载 |
| 适合放什么 | 具体任务描述 | 项目级规范和约定 |
| 类比 | 一条临时指令 | 公司规章制度 |

不同工具的命名略有不同：

| AI 工具 | 文件名 | 位置 |
|:---:|:---:|:---|
| Claude Code | `CLAUDE.md` | 项目根目录 |
| Gemini CLI | `GEMINI.md` | 项目根目录 |
| Cursor | `.cursorrules` | 项目根目录 |
| 通用 | `AGENTS.md` | 项目根目录（多工具兼容） |

> **用 `AGENTS.md` 的好处**：它是工具无关的。Claude Code 和 Gemini CLI 都会读取 `AGENTS.md`，一份文件兼容多个工具。

---

## 🔍 2. 好 vs 差的 AGENTS.md 对比

### ❌ 差的 AGENTS.md（或者根本没有）

```markdown
# 项目说明
这是一个社交应用项目。
```

一行字。等于没写。AI 读完之后对你的项目一无所知。

### ❌ 稍好一点但仍然不够的

```markdown
# 项目配置
- 技术栈：Taro + Vue3 + TypeScript
- 组件库：NutUI
- 请使用 Pinia 做状态管理
```

有了基本信息，但缺少约定和禁令。AI 知道用什么，但不知道"不要用什么"。

### ✅ 真正好用的 AGENTS.md

```markdown
# 全局 Agent 指令

## 技术栈
- 框架：Taro 4.x + Vue 3 + TypeScript (strict)
- 组件库：@taroify/core（❌ 不要使用 NutUI、Vant 或 Ant Design）
- 状态管理：Pinia（❌ 不要使用 Vuex 或 Redux）
- 样式方案：CSS Modules + BEM 命名（❌ 不要使用 Tailwind 或内联样式）
- 网络请求：使用封装好的 useRequest Hook（❌ 不要直接使用 fetch 或 axios）

## 目录结构约定
- src/pages/       → 主包页面（❌ 不要使用 views/ 或 screens/）
- src/pages2/      → 分包页面
- src/components/  → 公共组件
- src/services/    → API 请求层
- src/hooks/       → 自定义 Hook
- src/stores/      → Pinia Store

## 已有公共组件（优先使用，不要重复实现）
- Layout：页面统一布局容器，所有页面必须使用
- CellItem：统一列表项，props: { label, value, onClick, arrow }
- DynamicCard：动态内容卡片
- VirtualList：长列表组件

## 代码风格
- 组件使用 <script setup lang="ts"> 语法
- Props 使用 defineProps<T>() 泛型定义
- 事件使用 defineEmits<T>() 泛型定义
- 文件命名：组件用 PascalCase，工具用 camelCase

## 文章系统规则（示例：领域特定规则）
- 文章日期不可大于当前日期
- 文章日期不可与已有文章重复
- 新文章需要自动生成封面图

## 语言
- 始终使用中文（简体）进行回复
```

**差距在哪？** 好的 AGENTS.md 不光告诉 AI "用什么"，更告诉它 **"不要用什么"** 和 **"已有什么"**。

---

## 🧩 3. AGENTS.md 的五层架构

一份好的 AGENTS.md 应该包含五层信息，从上到下重要性递减：

```
┌─────────────────────────────────────────┐
│  Layer 1: 禁令层 — 什么不能做            │  ← 优先级最高
├─────────────────────────────────────────┤
│  Layer 2: 技术栈层 — 用什么              │
├─────────────────────────────────────────┤
│  Layer 3: 约定层 — 怎么组织              │
├─────────────────────────────────────────┤
│  Layer 4: 资产层 — 已有什么可复用         │
├─────────────────────────────────────────┤
│  Layer 5: 行为层 — AI 怎么和你交互       │  ← 优先级最低
└─────────────────────────────────────────┘
```

### Layer 1：禁令层 — 什么不能做

**这是最重要的一层。** 反直觉对不对？大多数人会优先写"用什么"，但实际上"不要用什么"的价值更大。

原因很简单：AI 的训练数据里有成百上千种技术方案。如果你不明确禁止，它会**随机**选一个。而你的项目只用其中一种。

```markdown
## 禁用项（AI 必须遵守）
- ❌ 不要使用 NutUI、Vant、Ant Design（项目统一使用 @taroify/core）
- ❌ 不要使用 Vuex、Redux、MobX（项目统一使用 Pinia）
- ❌ 不要使用 fetch、axios（使用封装好的 useRequest）
- ❌ 不要使用 Tailwind CSS（使用 CSS Modules + BEM）
- ❌ 不要把文件放在 views/ 或 screens/ 目录
- ❌ 不要使用 Options API（统一使用 Composition API）
```

> 这 6 行"不要做什么"，能消灭你日常 AI 编程中 **70% 的修正工作**。

### Layer 2：技术栈层 — 用什么

```markdown
## 技术栈
- 框架：Taro 4.x + Vue 3.4+
- 语言：TypeScript 5.x (strict 模式)
- 组件库：@taroify/core 0.3.x
- 状态管理：Pinia 2.x
- 样式：CSS Modules (.module.scss)
- 构建工具：Vite
- 包管理：pnpm
```

写版本号。AI 对不同版本的 API 可能生成不同的代码。

### Layer 3：约定层 — 怎么组织

```markdown
## 目录结构
- src/pages/       → 主包页面，路由在 app.config.ts 中注册
- src/pages2/      → 分包页面
- src/components/  → 公共组件
- src/services/    → API 请求层（一个模块一个文件）
- src/hooks/       → 自定义 Hook
- src/stores/      → Pinia Store（一个 Store 一个文件）
- src/utils/       → 工具函数
- src/types/       → 全局类型定义

## 命名规范
- 组件文件：PascalCase（UserProfile.vue）
- 工具/Hook：camelCase（useAuth.ts, formatDate.ts）
- 样式文件：与组件同名 + .module.scss 后缀
- Store：use + 名词 + Store（useUserStore.ts）
- Service：名词 + Service（userService.ts）
```

### Layer 4：资产层 — 已有什么可复用

```markdown
## 公共组件
| 组件名 | 用途 | 关键 Props |
|--------|------|-----------|
| Layout | 页面容器 | title, showBack, showNav |
| CellItem | 列表项 | label, value, onClick, arrow |
| Empty | 空状态 | type ('data' | 'network'), text |
| Loading | 加载态 | size, color |

## 公共 Hook
| Hook | 用途 | 返回值 |
|------|------|--------|
| useRequest | 网络请求 | { data, loading, error, run } |
| useAuth | 认证状态 | { isLoggedIn, user, login, logout } |
| useFormValidation | 表单校验 | { validate, errors, reset } |

## 工具函数
| 函数 | 用途 | 位置 |
|------|------|------|
| formatDate | 日期格式化 | src/utils/date.ts |
| showToast | 统一 Toast | src/utils/toast.ts |
| navigateTo | 路由跳转封装 | src/utils/router.ts |
```

> 这一层的价值在于**消除重复造轮子**。AI 看到你有 `useRequest`，就不会自己写一个 `fetch` 封装。

### Layer 5：行为层 — AI 怎么和你交互

```markdown
## 交互规则
- 始终使用中文（简体）回复
- 新的需求不能影响已有的业务逻辑
- 修改共享组件时，必须列出所有受影响的使用方
- 添加新依赖前，先说明理由并获得确认
```

---

## ⚔️ 4. 真实对比实验：有 vs 没有 AGENTS.md

我做了一个对比实验。同一个需求，同一个 AI 模型，唯一变量是有没有 AGENTS.md。

**需求**："在圈子详情页加一个成员列表，支持分页加载。"

| 维度 | 无 AGENTS.md | 有 AGENTS.md |
|:---:|:---|:---|
| 组件库选择 | 用了 Vant `<van-list>` ❌ | 用了 Taroify `<List>` ✅ |
| 网络请求 | 用了 `axios.get()` ❌ | 用了 `useRequest()` ✅ |
| 文件位置 | 放在 `src/views/circle/` ❌ | 放在 `src/pages/circle/` ✅ |
| 页面容器 | 没用 Layout 组件 ❌ | 自动包裹了 Layout ✅ |
| CSS 方案 | 内联 style ❌ | CSS Modules + BEM ✅ |
| 列表实现 | 原生 ScrollView ❌ | VirtualList 组件 ✅ |
| 空状态处理 | 没处理 ❌ | 使用 Empty 组件 ✅ |
| **可用率** | **约 20%** | **约 90%** |
| **修正时间** | 45 分钟 | 5 分钟 |

**同一个 AI，差距是 9 倍。** 唯一的区别是根目录下多了一个 200 行的 `.md` 文件。

---

## 🛠️ 5. 手把手写你的第一个 AGENTS.md

### 最小可用版本（10 分钟搞定）

如果你现在什么都没有，花 10 分钟写一个最小版本：

```markdown
# 全局 Agent 指令

## 技术栈
- [你的框架和版本]
- [你的组件库]（❌ 不要使用 [常见错误选择]）
- [你的状态管理]
- [你的样式方案]

## 目录结构
- [你的目录约定]

## 已有组件（优先使用）
- [列出 3-5 个最常用的公共组件]

## 已有 Hook
- [列出 2-3 个最常用的 Hook]

## 语言
- 使用中文回复
```

**就这么多。** 你可以在接下来的使用中逐步补充。

### 渐进式完善策略

不需要一次性写完完美的 AGENTS.md。用这个策略：

```
第 1 天：写技术栈 + 禁令（最小版本）
第 1 周：补充目录结构 + 命名规范
第 2 周：补充公共组件和 Hook 清单
第 1 月：补充领域特定规则和工作流
持续：每次 AI "犯错"，就补一条规则
```

> **最佳实践**：每次 AI 生成了不符合项目规范的代码，不要只是手动修改——顺手在 AGENTS.md 里补一条规则。日积月累，你的 AGENTS.md 会越来越精准。

---

## 📐 6. 进阶：AGENTS.md + Skills + OpenSpec 的分工

当你开始深入使用 AI 编程工具，你会发现有三种"配置 AI"的方式。它们不是替代关系，而是分工关系：

| 配置层 | 工具 | 管什么 | 粒度 | 持久性 |
|:---:|:---:|:---|:---:|:---:|
| 项目指令 | AGENTS.md | 全局约定、禁令、技术栈 | 粗 | 永久 |
| 技能定义 | Skills | 特定任务的执行流程 | 中 | 永久 |
| 项目规格 | OpenSpec specs/ | 各模块的详细设计规格  | 细 | 持续更新 |

形象地说：

```
AGENTS.md  = "公司规章制度"    → 所有人都要遵守的基本规则
Skills     = "岗位操作手册"    → 特定角色在特定场景下怎么做
OpenSpec   = "项目设计文档"    → 每个功能模块的详细蓝图
```

### 它们怎么配合

```
AI 收到任务
  ↓
① 读 AGENTS.md → 知道项目用什么技术栈、什么不能做
  ↓
② 匹配 Skills → 知道这个任务应该走什么流程（TDD？brainstorming？）
  ↓
③ 读 OpenSpec specs/ → 知道相关模块的详细设计、避免冲突
  ↓
开始执行
```

**不要把所有东西都塞进 AGENTS.md。** AGENTS.md 放全局通用的，Skills 放任务特定的，OpenSpec 放模块细节的。各司其职。

---

## 🚨 7. 常见错误与修复

| # | 错误 | 后果 | 修复 |
|:---:|:---|:---|:---|
| 1 | 写了"用什么"但没写"不要用什么" | AI 依然随机选择其他方案 | 每个技术选型后面加 ❌ 禁令 |
| 2 | 组件清单只写了名字没写用途 | AI 不知道什么场景该用哪个 | 补充 Props 和适用场景 |
| 3 | 文件太长（500+ 行） | AI 注意力稀释，后面的规则被忽略 | 核心规则放前面，细节用 Skills 拆分 |
| 4 | 只写了一次就不管了 | 项目演进后 AGENTS.md 过时 | 定期更新，每次架构变更同步修改 |
| 5 | 用了模糊措辞 | AI 按自己的理解执行 | 用具体版本号、文件路径、组件名 |
| 6 | 多个配置文件冲突 | AI 不知道听谁的 | 统一用 AGENTS.md，其他工具 include 它 |

### 错误 #3 的特别说明：AGENTS.md 的长度控制

AI 处理长文档时，**前 100 行的注意力远高于第 300 行之后的内容。** 所以：

```
✅ 正确做法：
AGENTS.md（100-200 行）→ 放禁令、技术栈、核心约定
Skills 文件（按需加载）→ 放详细的任务流程
OpenSpec specs/（按需读取）→ 放模块设计细节

❌ 错误做法：
AGENTS.md（800 行）→ 把所有东西都塞进去
```

> **经验法则：AGENTS.md 控制在 200 行以内。** 超过 200 行的内容，用 Skills 或 OpenSpec 分流。

---

## ✅ 检查清单：你的 AGENTS.md 够好吗？

### 禁令层
- [ ] 列出了不要使用的组件库（附替代方案）
- [ ] 列出了不要使用的状态管理方案
- [ ] 列出了不要使用的样式方案
- [ ] 列出了不要使用的目录名称

### 技术栈层
- [ ] 框架名称 + 版本号
- [ ] 语言 + 严格模式说明
- [ ] 组件库 + 版本号
- [ ] 构建工具

### 约定层
- [ ] 目录结构完整
- [ ] 命名规范覆盖（文件、组件、变量）
- [ ] Git 提交规范

### 资产层
- [ ] 列出了 3+ 个公共组件（含关键 Props）
- [ ] 列出了 2+ 个公共 Hook（含用途说明）
- [ ] 列出了常用工具函数

### 行为层
- [ ] 指定了回复语言
- [ ] 指定了修改共享代码时的确认规则
- [ ] 指定了添加依赖时的审批流程

---

## 一个反直觉的结论

很多人花大量时间研究"哪个 AI 模型最强"、"Cursor 和 Claude Code 哪个好用"。

但真正决定 AI 编程效率的，不是模型和工具——**是你根目录下那个 .md 文件写得好不好。**

一个配了好 AGENTS.md 的 Gemini CLI（免费），可以吊打一个没有任何配置的 Claude Code（$200/月）。

因为好的 AGENTS.md 做了一件事：**把你脑子里"在这个项目里事情应该怎么做"的隐性知识，变成了 AI 每次对话都能读到的显性规则。**

> **同一个 AI，有没有 AGENTS.md，就是提线木偶和专业开发者的区别。**

花 10 分钟，给你的项目根目录加一个 AGENTS.md。这可能是你在 AI 编程上做过的投入产出比最高的一件事。

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 系列：程序人生 ｜ 更新日期：2026-04-03*
