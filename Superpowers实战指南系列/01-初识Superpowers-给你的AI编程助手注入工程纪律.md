---
date: 2025-04-20
---
# Superpowers 实战指南 | 第1期 - 初识 Superpowers：给你的 AI 编程助手注入工程纪律

> 🛡️ AI 编程最大的敌人不是能力不足，而是"放任"。当 AI 不受约束地写代码，你得到的不是效率，而是灾难。Superpowers 就是那套让 AI 从"天马行空"变成"纪律严明"的工程框架。

---

## 为什么你需要 Superpowers？

如果你已经深度使用了 Claude Code 或 Gemini CLI，你一定经历过这样的痛苦：

**场景一**：你说"帮我加个用户管理功能"，AI 哗哗写了 500 行代码。看起来能跑，但三天后你发现——有个空指针 Bug，而且根本没有测试。

**场景二**：你让 AI 修个 Bug，它改了一行代码说"搞定了"。你问它测试了吗？它说"应该没问题"。结果上线后原来的 Bug 修好了，新 Bug 又出来了。

**场景三**：你让 AI 重构一个模块，它一口气改了 20 个文件，PR 看得你头晕。但其中有 3 个文件是不该动的，它顺手"优化"了一下。

这些问题的根源都是一样的：**AI 缺乏工程纪律。**

[Jesse Vincent](https://blog.fsck.com)（Prime Radiant 创始人）基于长期的工程实践，创建了 **Superpowers**——一套结构化的工作流技能包。它的核心哲学极度克制：

> **在每个阶段，AI 只做对应的事，严格遵守流程，用证据说话。**

---

## Superpowers 的极速安装

Superpowers 支持多个主流 AI 编程平台，安装过程简单到令人发指。

### Claude Code（推荐）

```bash
# 方式一：官方插件市场（最简单）
/plugin install superpowers@claude-plugins-official

# 方式二：社区插件市场
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

### Gemini CLI

```bash
# 一键安装
gemini extensions install https://github.com/obra/superpowers

# 更新到最新版
gemini extensions update superpowers
```

### Cursor

```text
/add-plugin superpowers
```

> **⚠️ 关键差异**：与 GStack 等技能包不同，Superpowers 不需要你配置任何 `CLAUDE.md` 或手动注册命令。安装后，**技能会自动触发**——AI 根据你的对话内容智能判断该启用哪个技能。

---

## Superpowers 的技能全景图

安装完成后，你实际上获得了一整套模块化的工程能力：

| 技能 | 触发场景 | 核心职责 |
|:---:|:---|:---|
| 🧠 `brainstorming` | "新功能"、"实现"、"创建" | 在写代码前彻底想清楚要做什么 |
| 📋 `writing-plans` | brainstorming 完成后 | 生成傻瓜式的逐步实施计划 |
| 🤖 `subagent-driven-development` | 计划执行阶段 | AI 调度 AI，子代理逐任务执行 |
| 🔴 `test-driven-development` | 任何编码阶段 | 铁腕执行 TDD：先写测试后写代码 |
| 🔍 `systematic-debugging` | "bug"、"报错"、"失败" | 四阶段根因调试，禁止瞎猜 |
| ✅ `verification-before-completion` | AI 即将说"完成了" | 堵住 AI 的"幻觉谎言" |
| 🏁 `finishing-a-development-branch` | 所有任务完成后 | 规范收尾：合并/PR/清理 |
| 🌲 `using-git-worktrees` | 开始开发前 | 创建隔离工作区，保护主分支 |
| 🔀 `dispatching-parallel-agents` | 任务可并行执行时 | 派发多个子代理并行工作 |
| 📝 `requesting-code-review` | 任务完成后 | 按规范模板发起代码审查 |

---

## 从 "随意写代码" 到 "纪律型开发" 的范式转换

### 传统模式 vs Superpowers 模式

```
传统模式（AI 自由发挥）：
┌──────────────────────────────────────────────┐
│ "帮我加一个评论系统，要支持嵌套回复。"         │
└──────────────────────────────────────────────┘
              ↓ AI 一次性输出
         ❌ 没有经过设计讨论
         ❌ 代码没有测试
         ❌ "完成了"但没有验证
         ❌ 出了 Bug 靠猜

Superpowers 模式（纪律型开发）：
┌───────────┐    ┌───────────┐    ┌───────────┐
│ 头脑风暴   │ →  │ 编写计划   │ →  │ TDD 实现  │
│ 想清楚再做 │    │ 逐步拆解   │    │ 先测后写   │
└───────────┘    └───────────┘    └───────────┘
                                       ↓
┌───────────┐    ┌───────────┐    ┌───────────┐
│ 收尾分支   │ ←  │ 验证完成   │ ←  │ 系统调试   │
│ PR/合并    │    │ 跑过才算完 │    │ 根因为王   │
└───────────┘    └───────────┘    └───────────┘
```

### 一次完整的开发体验

以添加一个评论系统为例：

**① 你说出需求**
```
我想给博客加一个评论系统，支持嵌套回复。
```

→ AI **自动** 激活 `brainstorming`，开始逐个问你问题，而不是直接写代码。

**② 头脑风暴阶段**
```
AI: 评论需要支持匿名还是必须登录？
（等你回答后继续）
AI: 嵌套回复限制几层？无限嵌套会导致 UI 复杂度指数增长。
（等你回答后继续）
AI: 我推荐方案 A（基于 Supabase），原因是……你觉得呢？
```

→ 设计确认后，AI 写出设计文档，提交到 Git。

**③ 计划编写阶段**
→ AI **自动** 激活 `writing-plans`，把设计拆成 8 个原子任务，每个 2-5 分钟。

**④ 执行阶段**
→ AI **自动** 激活 `subagent-driven-development`，为每个任务派发一个全新的子代理。

**⑤ 遇到 Bug**
→ AI **自动** 激活 `systematic-debugging`，四阶段调试，不允许"试试看"。

**⑥ 所有任务完成**
→ AI **自动** 激活 `verification-before-completion`，必须跑测试，有证据才能说"完成"。

**⑦ 收尾**
→ AI **自动** 激活 `finishing-a-development-branch`，给你 4 个选项：合并/PR/保留/丢弃。

**全程自动、全程有纪律。你甚至不需要记住任何命令名。**

---

## Superpowers 与 GStack 的核心差异

| 维度 | GStack | Superpowers |
|:---:|:---:|:---:|
| 触发方式 | 手动输入斜杠命令 | **全自动**，AI 智能判断 |
| 核心风格 | 虚拟团队，快速交付 | 工程纪律，步步为营 |
| 测试体系 | 端到端 UI 测试（Playwright） | TDD 测试驱动开发 |
| Debugging | 代码审查中附带 | **独立的四阶段调试协议** |
| 执行引擎 | 在当前会话中执行 | **子代理驱动**，每任务新上下文 |
| 验证机制 | QA 报告 | **铁律式完成前验证** |
| 适合场景 | 黑客马拉松，快速 MVP | 大型项目，质量优先 |

---

## 小结

Superpowers 用一种"润物细无声"的方式，给你的 AI 编程助手注入了严格的工程纪律：

▪️ **自动触发**：不需要你记住任何命令，AI 自己判断该用什么技能
▪️ **全流程覆盖**：从构思到交付，每个阶段都有对应的技能守护
▪️ **证据为王**：任何结论都必须有验证证据，绝不允许"应该没问题"
▪️ **保护性开发**：TDD、隔离工作区、子代理——三重防线确保代码质量

在下一篇文章中，我们将详细展开 Superpowers 最有温度的环节：**`brainstorming` 头脑风暴——如何在不写一行代码前，就把设计想得明明白白。**

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 系列：Superpowers实战指南系列 ｜ 更新日期：2025-04-20*
