---
date: 2026-03-26
tags:
  - AI编程
  - Skills
  - 提示词
cover: /covers/cover-skills-02-evolution.webp
---
# 从提示词到 Skills — AI 编程的进化之路

> 2026 年，92% 的美国开发者每天使用 AI 编程工具，AI 生成的代码已占所有生产代码的近 27%。但大多数人还停留在「对话框里问一句，AI 回一段代码」的阶段。这篇文章聊聊 AI 编程正在经历的三次范式跃迁，以及你为什么该关注「Skills」这个概念。

---

## 🔄 三次范式跃迁

### 第一阶段：提示词时代（2023-2024）

这是大多数人接触 AI 编程的起点。

**典型场景**：打开 ChatGPT / Copilot Chat，用自然语言描述需求，AI 返回代码片段。

```
你："帮我写一个 React 登录表单，带邮箱和密码验证"
AI："好的，这是一个使用 useState 的登录组件..."
```

**痛点**：

| 问题 | 表现 |
|------|------|
| 😩 上下文丢失 | 每次对话都要重新说明项目背景 |
| 🔄 风格不一致 | 今天用 class 组件，明天用 hooks |
| 📉 准确率不稳定 | 同一个问题，问法不同结果差别很大 |
| ⏰ 效率瓶颈 | 花在"调教 AI"上的时间 > 自己写代码 |

### 第二阶段：Rules / 系统提示词时代（2024-2025）

开发者们意识到：**与其每次都写几百字的 prompt，不如把常用指令固化下来。**

Cursor 率先推出了 `.cursorrules` 文件的概念——在项目根目录放一个规则文件，AI 每次对话自动读取。

```markdown
# .cursorrules 示例
你是一个资深 React 开发者。
- 始终使用 TypeScript
- 使用函数式组件 + Hooks
- 状态管理用 Zustand
- 样式用 Tailwind CSS
- 每个组件必须有 Props 接口定义
```

**进步**：AI 终于有了"记忆"，同一项目内生成的代码风格一致了。

**新痛点**：规则是「平铺」的，一个文件要写几千行。复杂项目需要的规则太多，上下文窗口装不下。

### 第三阶段：Skills 时代（2025-2026）

Skills 是对 Rules 的结构化升级。它解决了 Rules 的所有痛点：

| 维度 | Rules | Skills |
|------|-------|--------|
| 组织方式 | 一个大文件 | 模块化目录，每个 Skill 独立 |
| 加载策略 | 全量加载 | 按需加载，只在相关时激活 |
| 复用性 | 项目间难复用 | 可跨项目、跨工具复用 |
| 标准化 | 各平台格式不同 | `SKILL.md` 开放标准，跨平台通用 |
| 功能深度 | 仅文字规则 | 可包含脚本、模板、参考文档 |
| 社区生态 | 零散分享 | 50 万+ Skills 生态，有专门市场 |

---

## 🎯 什么是 Skills？一个类比就够了

**Skills 之于 AI 编程助手 = App 之于手机。**

你的手机（AI 助手）出厂时就很强大，但装了 App（Skills）之后才能做专业的事：

- 装了「相机」App → 手机会拍照了
- 装了 `flutter-riverpod-arch` Skill → AI 会写符合洁净架构的 Flutter 代码了
- 装了 `superpowers` Skill → AI 会按结构化流程做需求分析和系统化调试了

**更精确一点**：每个 Skill 的核心是一个 `SKILL.md` 文件，它用 Markdown 写成，告诉 AI：

1. **什么时候该用我**（通过 `description` 字段触发匹配）
2. **具体该怎么做**（通过 Markdown 正文详细说明）
3. **有哪些参考资料**（通过 `references/` 目录补充细节）

```yaml
# SKILL.md 头部示例
---
name: systematic-debugging
description: >
  当用户提到 bug、问题、报错、失败、不工作等关键词时，
  使用此 skill 进行系统化调试。
---
```

这段描述就像 App Store 里的应用介绍——AI 读了它就知道「哦，用户在调试 bug，我应该用这个 Skill 的流程」。

---

## ⚡ Skills 为什么突然火了？

### 1. SKILL.md 成为跨平台开放标准

最初由 Anthropic 为 Claude Code 设计的 SKILL.md 格式，现在已被几乎所有主流 AI 编程工具采纳：

| 工具 | Skills 支持 | 存放目录 |
|------|-----------|---------|
| Claude Code | ✅ 原生支持 | `.agent/skills/` |
| Cursor | ✅ Rules + SKILL.md | `.cursor/rules/` |
| Gemini CLI | ✅ 原生支持 | `.agent/skills/` |
| Antigravity IDE | ✅ 原生支持 | `.agent/skills/` |
| OpenAI Codex CLI | ✅ 兼容 | `.agent/skills/` |
| GitHub Copilot | ⚠️ 部分（通过 Instructions） | `.github/` |

**这意味着**：你写一套 Skills，可以在所有工具中通用。换 AI 编程助手不必重写规则。

### 2. 生态爆发

截至 2026 年 3 月，Skills 生态已经从零长到了惊人的规模：

- **SkillsMP** 收录 50 万+ Skills
- **Skills.Homes** 从 GitHub 抓取了 7 万+ Skills
- **Cursor Directory** 仍是最活跃的规则/Skills 社区
- **GitHub** 上 `awesome-agent-skills`、`awesome-cursorrules` 等合集仓库 Stars 破万

### 3. Agentic AI 需要 Skills

2026 年 AI 编程最大的范式转变是从「对话式 AI」到「Agentic AI」——AI 不再只是回答问题，而是自主完成多步骤任务。

一个 Agentic AI 的典型工作流：

```
接到任务: "给用户管理模块加上角色权限功能"
   ↓
1. 阅读现有代码库，理解架构（← 靠 Skill 指导怎么读）
2. 制定修改计划（← 靠 writing-plans Skill）
3. 跨多个文件编写代码（← 靠 flutter/react/vue Skill 规范）
4. 运行测试，修复失败（← 靠 systematic-debugging Skill）
5. 提交代码并请求 Code Review（← 靠 code-review Skill）
```

没有 Skills，AI 在每一步都只能"凭感觉"。有了 Skills，每一步都有结构化的操作手册。

---

## 🛠️ 5 个值得立即安装的 Skills

如果你是第一次接触 Skills，这 5 个能让你最快感受到差异：

### 1. Superpowers（工作流系列）

**解决什么问题**：让 AI 按结构化流程工作，而不是收到需求就乱写。

包含 14 个模块化子技能，最核心的 4 个：

| 技能 | 触发场景 | 做什么 |
|------|---------|--------|
| `brainstorming` | 收到新需求 | 先分析需求，产出思维导图，再动手 |
| `writing-plans` | 准备开发 | 将想法转化为可执行的分步计划 |
| `systematic-debugging` | 遇到 Bug | 按「假设→验证→定位→修复」流程排查 |
| `verification-before-completion` | 任务完成时 | 执行验证清单，确保无遗漏 |

**安装**：

```bash
mkdir -p ~/.agent/skills
cd ~/.agent/skills
git clone https://github.com/NickAiCC/superpowers.git
```

### 2. Cursor Directory 精选 Rules

不管你用不用 Cursor，[cursor.directory](https://cursor.directory) 上收集了大量按技术栈分类的 AI 规则，可以直接转化为 Skills 使用。

热门分类：
- React / Next.js / Vue 3 前端规范
- Python / FastAPI / Django 后端规范
- Flutter / React Native 移动端规范

### 3. 代码审查 Skill

让 AI 在你完成代码后自动执行代码审查，检查安全漏洞、性能隐患和代码风格问题。

### 4. Git Commit 规范 Skill

约束 AI 按 Conventional Commits 格式生成 commit message，自动添加类型前缀和 emoji。

### 5. 你所用框架的架构 Skill

这个因人而异。如果你是：
- **Flutter 开发者** → 安装 `flutter-riverpod-arch`，让 AI 遵循洁净架构 + 最新 Riverpod 3.x
- **React 开发者** → 安装 `senior-frontend`，规范 React + TypeScript 最佳实践
- **Vue 开发者** → 从 cursor.directory 找 Vue 3 + Composition API 规则

---

## 💡 一个改变认知的观点

> 传统认知：写代码的能力 = 开发者的竞争力
>
> 2026 认知：**定义 AI 该怎么写代码的能力** = 新的竞争力

当 AI 生成代码的速度比人快 10 倍时，瓶颈就不再是"写"，而是"指导"。Skills 正是你指导 AI 的最佳方式。

会写代码的人很多，但能**系统化地定义**代码规范、架构约束、开发流程，并把它变成可复用的 Skills 的人——这才是 AI 时代的高阶开发者。

---

## 🎯 下一步行动

1. **选一个 AI 编程工具**（Cursor / Claude Code / Gemini CLI），确认它支持 Skills
2. **安装 Superpowers**，体验结构化工作流
3. **安装你常用框架的 Skills**，感受代码质量的变化
4. **浏览 [cursor.directory](https://cursor.directory) 和 [skillsmp.com](https://skillsmp.com)**，发现更多宝藏
5. **想想你的团队/项目有哪些规范可以变成 Skill**

AI 编程工具每年都在迭代，但 Skills 作为「人类经验的结构化沉淀」，只会越来越有价值。

---

*📝 作者：NIHoa ｜ 系列：Skills 使用指南 ｜ 更新日期：2026-03-26*
