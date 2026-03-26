# Superpowers 实战指南 | 第6期 - 完整实战：用 Superpowers 从零构建一个 Markdown 笔记应用

> 🎯 前五篇文章讲完了 Superpowers 的所有核心技能，现在正式进入"真刀真枪"的实战环节。本期我们将完整走通 Superpowers 的全流程，从零构建一个 **Markdown 笔记应用**——从头脑风暴到 PR 合并，一步不少。

---

## 项目简介

**NoteFlow** 是一个轻量级 Markdown 笔记应用，核心功能：

1. 用 Markdown 语法撰写笔记
2. 实时预览渲染效果（左写右看）
3. 笔记本地持久化（IndexedDB）
4. 按标签分类和搜索笔记

**技术栈**：Vite + React + TypeScript + Tailwind CSS

> 这个项目刚好体现了 Superpowers 的核心价值：它不复杂，但"看起来简单"的项目恰恰是最容易因为"不设计就动手"而翻车的。

---

## Phase 1：头脑风暴（`brainstorming`）

### 触发

```
你: 我想做一个 Markdown 笔记应用，支持实时预览和标签分类。
```

### AI 自动进入 Brainstorming 模式

```
🧠 [Brainstorming] 正在探索项目上下文...
   当前目录为空，这是一个全新项目。
   
🧠 [Brainstorming] 开始澄清需求...
```

### 逐个提问

**AI 问题 1：**
```
笔记编辑器的编辑体验优先级是什么？

A) 📝 纯文本区域 —— textarea 加 Markdown 渲染预览，最简单
B) 📝 代码编辑器风格 —— CodeMirror / Monaco，有代码高亮和行号
C) 📝 富文本编辑器 —— 像 Notion 一样的 Block 编辑器

我推荐选 A（纯文本 + 实时预览），理由是：
- MVP 阶段追求快速交付
- 纯 textarea 方案零依赖
- 后续可以无缝升级为 CodeMirror
```

**你回答：** A，先用最简单的方案。

**AI 问题 2：**
```
数据存储方案选什么？

A) 📦 LocalStorage —— 最简单，但容量限制 5MB
B) 📦 IndexedDB —— 容量大，支持结构化查询
C) 📦 后端 API（Supabase / Firebase）—— 支持多设备同步

我推荐选 B（IndexedDB），理由是：
- MVP 不需要多设备同步
- IndexedDB 容量比 LocalStorage 大得多
- 使用 Dexie.js 封装后 API 非常友好
```

**你回答：** B，同意。

**AI 问题 3：**
```
标签系统的交互方式？

A) 🏷️ 手动输入标签，逗号分隔
B) 🏷️ 预定义标签列表 + 自定义标签
C) 🏷️ AI 自动推荐标签

MVP 推荐选 A，零实现成本。
```

**你回答：** A。

### 设计方案展示

经过 3 轮问答，AI 分段展示设计：

```markdown
## NoteFlow 设计方案

### 架构概览
App
├── Header              ← 应用标题 + 搜索栏
├── Sidebar             ← 笔记列表 + 标签筛选
└── EditorPane
    ├── MarkdownEditor   ← 左侧：textarea 编辑器
    └── MarkdownPreview  ← 右侧：实时渲染预览

### 数据模型
Note {
  id: string (UUID)
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

### 技术选型
- Markdown 渲染：react-markdown + remark-gfm
- 数据库：Dexie.js（IndexedDB 封装）
- 代码高亮：highlight.js（预览中的代码块）
```

✅ 用户确认设计。

### 设计文档提交

```
🧠 [Brainstorming] 设计文档已保存到：
   docs/superpowers/specs/2025-04-25-noteflow-design.md
   已提交到 Git ✅
```

---

## Phase 2：编写计划（`writing-plans`）

### AI 自动启动计划编写

```
📋 [Writing Plans] 正在基于设计文档生成实施计划...
```

### 计划输出（精简展示核心任务）

```markdown
# NoteFlow 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: 
> Use superpowers:subagent-driven-development

**Goal:** 构建一个支持 Markdown 实时预览和标签分类的笔记应用。
**Architecture:** React SPA + Dexie.js + react-markdown
**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, Dexie.js

---

### Task 1: 项目脚手架

- [ ] Step 1: 使用 Vite 创建 React + TypeScript 项目
- [ ] Step 2: 安装核心依赖（react-markdown, dexie, tailwindcss）
- [ ] Step 3: 配置 Tailwind CSS
- [ ] Step 4: 验证空项目启动成功
- [ ] Step 5: 提交

### Task 2: 数据层（Dexie.js）

- [ ] Step 1: 写测试 — 创建笔记并查询
- [ ] Step 2: 运行测试，确认失败
- [ ] Step 3: 实现 NoteDatabase 类和 CRUD 方法
- [ ] Step 4: 运行测试，确认通过
- [ ] Step 5: 提交

### Task 3: Markdown 编辑器组件

- [ ] Step 1: 写测试 — 输入文字后触发 onChange
- [ ] Step 2: 运行测试，确认失败
- [ ] Step 3: 实现 MarkdownEditor 组件
- [ ] Step 4: 运行测试，确认通过
- [ ] Step 5: 提交

### Task 4: Markdown 预览组件

- [ ] Step 1: 写测试 — 传入 Markdown 文本渲染为 HTML
- [ ] Step 2: 运行测试，确认失败
- [ ] Step 3: 实现 MarkdownPreview 组件
- [ ] Step 4: 运行测试，确认通过
- [ ] Step 5: 提交

### Task 5: 笔记列表与标签筛选

- [ ] Step 1: 写测试 — 显示笔记列表
- [ ] Step 2: 运行测试，确认失败
- [ ] Step 3: 实现 NoteList 和 TagFilter 组件
- [ ] Step 4: 写测试 — 按标签筛选笔记
- [ ] Step 5: 运行测试，确认失败
- [ ] Step 6: 实现标签筛选逻辑
- [ ] Step 7: 运行测试，确认全部通过
- [ ] Step 8: 提交

### Task 6: 主页面组装与搜索

- [ ] Step 1: 写测试 — 搜索筛选笔记
- [ ] Step 2: 运行测试，确认失败
- [ ] Step 3: 实现 App 主页面，组装所有组件
- [ ] Step 4: 实现搜索功能
- [ ] Step 5: 运行测试，确认通过
- [ ] Step 6: 提交
```

```
📋 [Writing Plans] 计划已保存到：
   docs/superpowers/plans/2025-04-25-noteflow.md

两种执行方式：
1. 子代理驱动（推荐）—— 每个任务派一个子代理执行
2. 内联执行 —— 在当前会话中逐步执行

选择哪种？
```

**你回答：** 1，子代理驱动。

---

## Phase 3：子代理驱动执行（`subagent-driven-development`）

### Task 1: 项目脚手架

```
🤖 [SubAgent] 派出实现子代理执行 Task 1...

子代理 A: DONE.
  - 使用 pnpm create vite@latest 创建项目
  - 安装了 react-markdown, remark-gfm, dexie, highlight.js
  - 配置了 Tailwind CSS 4.0
  - 验证 pnpm dev 启动成功
  - 已提交

[规格审查] ✅ 通过
[代码审查] ✅ 通过

✅ Task 1 完成
```

### Task 2: 数据层

```
🤖 [SubAgent] 派出实现子代理执行 Task 2...

子代理 B: DONE.
  - 写了 4 个测试：创建/查询/更新/删除笔记
  - 测试先全部失败（RED）✅
  - 实现了 NoteDatabase 类
  - 测试全部通过（GREEN）✅
  - 已提交

[规格审查] ✅ 通过

[代码审查] ❌ 不通过
  - 建议：数据库版本号应提取为常量
  - 建议：添加 JSDoc 注释

子代理 B: 已修复。

[代码审查重新审查] ✅ 通过

✅ Task 2 完成
```

### Task 3: Markdown 编辑器

```
🤖 [SubAgent] 派出实现子代理执行 Task 3...

子代理 C: DONE.
  - 写了 2 个测试：渲染 textarea / 输入触发 onChange
  - RED ✅ → 实现组件 → GREEN ✅
  - 已提交

[规格审查] ✅ 通过
[代码审查] ✅ 通过

✅ Task 3 完成
```

### Task 4: Markdown 预览（遇到 Bug）

```
🤖 [SubAgent] 派出实现子代理执行 Task 4...

子代理 D: DONE_WITH_CONCERNS.
  - 写了 3 个测试：普通文本 / 代码块 / GFM 表格
  - RED ✅ → 实现组件 → GREEN ✅
  - 疑虑：代码块高亮在 SSR 环境下可能有问题
  
主代理: 这是纯前端 SPA，不涉及 SSR，疑虑不影响。

[规格审查] ❌ 不通过
  - 缺失：规格要求支持 GFM 表格，但 remark-gfm 插件未配置

子代理 D: 已添加 remark-gfm 配置。测试通过 ✅

[规格审查重新审查] ✅ 通过
[代码审查] ✅ 通过

✅ Task 4 完成
```

### Task 5-6: 笔记列表 & 主页面组装

```
🤖 Tasks 5-6 顺利完成。
  - 13 个测试全部通过
  - 搜索功能支持标题和标签同时筛选
  - 所有组件通过双重审查

✅ 所有 6 个任务完成
```

---

## Phase 4：验证完成（`verification-before-completion`）

在声明"做完了"之前，Superpowers 会自动拦截：

```
✅ [Verification] 运行完整测试套件...

Running: pnpm test
  ✅ NoteDatabase: 4/4 passed
  ✅ MarkdownEditor: 2/2 passed
  ✅ MarkdownPreview: 3/3 passed
  ✅ NoteList: 3/3 passed
  ✅ TagFilter: 2/2 passed
  ✅ SearchBar: 2/2 passed
  ✅ App Integration: 3/3 passed

Test Suites: 7 passed, 7 total
Tests:       19 passed, 19 total

Running: pnpm lint
  ✅ 0 errors, 0 warnings

Running: pnpm build
  ✅ Build successful (2.3s)

📊 验证结果：
  - 19/19 测试通过
  - Lint 零警告
  - 构建成功
  - 所有任务需求已覆盖

✅ 验证通过。可以声明完成。
```

---

## Phase 5：收尾分支（`finishing-a-development-branch`）

```
🏁 [Finishing] 所有任务完成，测试验证通过。

选项：
  1. 本地合并到 main
  2. 推送并创建 Pull Request
  3. 保持分支现状
  4. 丢弃此次工作

你选择: 2
```

### 自动创建的 PR

```markdown
## 📝 Pull Request: NoteFlow - Markdown 笔记应用

### 变更概述
从零构建了一个轻量级 Markdown 笔记应用，支持实时预览、
IndexedDB 持久化、标签分类和全文搜索。

### 变更文件清单

| 文件 | 类型 | 说明 |
|:---|:---:|:---|
| src/db/NoteDatabase.ts | 🆕 | IndexedDB 数据层（Dexie.js） |
| src/components/MarkdownEditor.tsx | 🆕 | Markdown 文本编辑器 |
| src/components/MarkdownPreview.tsx | 🆕 | 实时 Markdown 渲染预览 |
| src/components/NoteList.tsx | 🆕 | 笔记列表组件 |
| src/components/TagFilter.tsx | 🆕 | 标签筛选组件 |
| src/components/SearchBar.tsx | 🆕 | 搜索栏组件 |
| src/App.tsx | ✏️ | 主页面组装 |

### 测试状态
- ✅ 19 个单元测试全部通过
- ✅ ESLint 零警告
- ✅ 生产构建成功（2.3s）

### 设计文档
- 设计规格：docs/superpowers/specs/2025-04-25-noteflow-design.md
- 实施计划：docs/superpowers/plans/2025-04-25-noteflow.md
```

✅ **PR 已创建成功！**

---

## 全流程总结

| 阶段 | 技能 | 耗时 | 产出 |
|:---:|:---:|:---:|:---|
| 头脑风暴 | `brainstorming` | 10 min | 3 轮问答 → 完整设计文档 |
| 编写计划 | `writing-plans` | 5 min | 6 个 TDD 任务，每步 2-5 分钟 |
| 子代理执行 | `subagent-driven-development` | 1.5 h | 6 个子代理完成 + 12 次审查 |
| 验证完成 | `verification-before-completion` | 3 min | 19 测试 ✅ + Lint ✅ + Build ✅ |
| 收尾分支 | `finishing-a-development-branch` | 2 min | PR 自动创建 |
| **总计** | | **~2 小时** | **功能完备、测试充分的 MVP** |

### 关键数字

```
📊 代码统计：
  - 7 个组件/模块
  - 19 个自动化测试
  - 12 次代码审查（每个任务 2 次）
  - 0 个未经验证的功能
  - 0 次"应该没问题"的声明
```

---

## 与 GStack 完整实战的对比

同样是从零构建一个 MVP，两者的关注点截然不同：

| 维度 | GStack（AI 日报生成器） | Superpowers（NoteFlow） |
|:---:|:---|:---|
| 设计阶段 | CEO 评审（砍需求） | 头脑风暴（共创设计） |
| 计划阶段 | Tech Lead 架构方案 | TDD 原子任务计划 |
| 执行阶段 | 在同一会话中写代码 | **子代理逐任务执行** |
| 质量保障 | `/review` 统一审查 | **每个任务双重审查** |
| 测试方式 | `/qa` 端到端 UI 测试 | **TDD 单元测试** |
| 验证方式 | QA 报告 | **铁律式完成前验证** |
| 发版方式 | `/ship` 一键发版 | 4 选项收尾 |
| 核心优势 | 速度快，一键交付 | 质量高，每步都有证据 |

---

## 系列总结

恭喜你完成了 **Superpowers 实战指南系列** 的全部 6 期旅程！🎉

让我们来回顾一下你学到的所有技能：

```
📘 第 1 期：认识 Superpowers 的自动触发机制和全景技能图
📘 第 2 期：brainstorming —— 在写代码前逐步共创设计方案
📘 第 3 期：TDD 铁律 —— RED-GREEN-REFACTOR，没测试不许写代码
📘 第 4 期：systematic-debugging —— 四阶段根因调试协议
📘 第 5 期：subagent-driven-development —— AI 管理 AI 的全新范式
📘 第 6 期：完整实战 —— 从头脑风暴到 PR 合并的全过程
```

> 💡 **最终忠告**：Superpowers 和 GStack 不是对立的。在项目初期用 **GStack** 快速搭建并验证 MVP，进入稳定开发和长期维护后切换到 **Superpowers** 保障质量——这才是最强组合。

去创造你的下一款高质量应用吧！🚀

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发。Bye~

---
*📝 作者：NIHoa ｜ 系列：Superpowers实战指南系列 ｜ 更新日期：2025-04-25*
