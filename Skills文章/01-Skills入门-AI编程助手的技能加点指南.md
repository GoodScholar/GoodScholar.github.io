---
date: 2026-03-25
tags:
  - AI编程
  - Skills
  - 入门指南
cover: /covers/cover-skills-01-intro.webp
---
# Skills 入门 — AI 编程助手的「技能加点」指南

> 🎮 如果你的 AI 编程助手是一个 RPG 角色，那 Skills 就是它的技能树。加对了点，战斗力翻倍；不加点，你就是在用满级装备打新手村。

---

## 📌 一句话理解 Skills

**Skills 是用 Markdown 写的「AI 操作手册」——告诉 AI 在特定场景下该怎么做、做到什么标准、遵循什么规范。**

它之于 AI 助手，就像：
- 🧩 插件之于 VS Code —— 按需安装，即插即用
- 📖 SOP 之于新员工 —— 给出操作手册，立刻上手专业工作
- 🎯 提示词模板之于 ChatGPT —— 但更结构化、更可复用、更强大

---

## Part 1：为什么需要 Skills？

### 😤 没有 Skills 的日常

你有没有经历过这些场景？

- 让 AI 写个 Flutter 页面，结果用了过时的状态管理方案
- 让 AI 生成代码，每次风格都不一样，项目越写越乱
- 同一个问题，每次都要重新告诉 AI 你的偏好和约束

### ✅ 有了 Skills 之后

| 对比维度 | ❌ 没有 Skills | ✅ 装了 Skills |
|---------|--------------|--------------|
| 代码规范 | 每次生成风格都不同 | 始终遵循团队规范 |
| 框架用法 | 可能用过时 API | 使用最新最佳实践 |
| 上下文理解 | 需要反复说明项目背景 | 自动理解项目架构 |
| 工作流程 | 杂乱无章，想到啥做啥 | 结构化流程，步步为营 |
| 任务准确率 | ~60%，常需人工返工 | ~90%，一次到位 |

### 🎬 真实案例对比

#### 没有 Skills，让 AI 生成 Flutter 登录页：

```dart
// ❌ AI 可能生成的代码：用了已过时的 StateNotifierProvider
final loginProvider = StateNotifierProvider<LoginNotifier, LoginState>(
  (ref) => LoginNotifier(),
);

class LoginNotifier extends StateNotifier<LoginState> {
  LoginNotifier() : super(LoginState.initial());
  // ...过时的 2.x 写法
}
```

#### 装了 `flutter-riverpod-arch` Skill 之后：

```dart
// ✅ AI 自动使用 Riverpod 3.x 最新写法
@riverpod
class LoginController extends _$LoginController {
  @override
  AsyncValue<LoginResponse?> build() => const AsyncData(null);

  Future<void> login({required String email, required String password}) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(loginUsecaseProvider).call(email: email, password: password),
    );
  }
}
```

> 💡 **关键区别**：装了 Skill 后，AI 知道 Riverpod 3.x 已经废弃了 `StateNotifierProvider`，自动使用 `@riverpod` 注解 + `Notifier` 的正确写法。这就是 Skills 的威力。

---

## Part 2：Skills 的工作原理

### 📁 SKILL.md —— 一切的核心

每个 Skill 的灵魂就是一个 `SKILL.md` 文件，它使用 **YAML 头信息 + Markdown 正文** 的格式：

```markdown
---
name: my-awesome-skill
description: >
  一句话描述这个 Skill 做什么、什么时候该被触发。
  当用户提到"xxx"、"yyy"关键词时自动激活。
---

# Skill 标题

## 使用规则
- 规则 1：永远用 Xxx 框架的最新版本
- 规则 2：遵循 Yyy 架构模式

## 代码模板
（AI 会按照这里的模板生成代码）

## 参考资料
- `references/xxx.md` —— 补充文档
- `scripts/xxx.sh` —— 辅助脚本
```

### 🧠 YAML 头信息的关键字段

| 字段 | 作用 | 示例 |
|------|------|------|
| `name` | Skill 的唯一标识符 | `flutter-riverpod-arch` |
| `description` | 触发描述，AI 据此判断是否激活 | `当用户提到 Flutter、Riverpod 时使用此 skill` |

> ⚡ `description` 是最重要的字段！AI 正是通过阅读 description 来判断「这个 Skill 跟当前任务有没有关系」。写得好，Skill 就能精准触发；写得差，Skill 就躺在文件夹里落灰。

### 🔄 按需加载机制

Skills 并不是一次性全部塞进 AI 的上下文。它的工作流程是：

```
用户发来消息
   ↓
AI 扫描所有 Skill 的 description（仅 YAML 头信息，约 100 tokens）
   ↓
匹配到相关 Skill？
   ├── 是 → 加载完整 SKILL.md 内容 → 按指令执行
   └── 否 → 正常回复
```

这种「渐进式加载」设计既节省了上下文窗口，又保证了 Skill 在需要时随时可用。

### 🌍 全局 Skills vs 项目 Skills

| 类型 | 存放位置 | 适用范围 | 适合场景 |
|------|---------|---------|---------|
| 全局 Skills | `~/.agent/skills/` | 所有项目 | 编码规范、工作流程、通用工具 |
| 项目 Skills | `项目根目录/.agent/skills/` | 仅当前项目 | 项目特定架构、团队约定 |

> 💡 建议：通用的编码规范和工作流（如 Superpowers）装为全局 Skills，项目特定的架构约束装为项目 Skills。

---

## Part 3：5 分钟上手

### 📦 方式一：直接克隆 GitHub 仓库

这是最直接的方式。以安装热门的 Superpowers Skills 为例：

```bash
# 1. 创建全局 Skills 目录
mkdir -p ~/.agent/skills

# 2. 克隆 Superpowers（14 个模块化工作流技能的集合）
cd ~/.agent/skills
git clone https://github.com/NickAiCC/superpowers.git
```

安装完成后的目录结构：

```
~/.agent/skills/superpowers/
├── skills/
│   ├── brainstorming/          # 头脑风暴
│   ├── writing-plans/          # 编写计划
│   ├── executing-plans/        # 执行计划
│   ├── systematic-debugging/   # 系统化调试
│   ├── verification-before-completion/  # 完成前验证
│   ├── using-superpowers/      # 入口技能（控制调度）
│   └── ...共 14 个模块
```

### 📦 方式二：用 npx 快捷安装（部分 Skills 支持）

```bash
# 安装 Flutter Skills
npx skills add flutter/skills
```

### ✅ 验证 Skills 已生效

安装完后，在你的 AI 编程助手中试试这些操作：

**在 Cursor 中**：
1. 打开设置 → Features → Rules
2. 添加 Skills 目录路径到 Rules 中
3. 在对话中输入 `/brainstorm 我想做一个待办事项 App`

**在 Claude Code 中**：
1. Skills 自动从 `.agent/skills/` 目录发现
2. 直接在终端输入需求，AI 会自动匹配并加载对应 Skill

**在 Gemini CLI / Antigravity 中**：
1. 将 Skills 配置到用户规则（User Rules）中
2. Skills 元数据在会话开始时自动加载

### 🔍 判断 Skill 是否生效的标志

当 Skills 正常工作时，AI 会在回复中表现出明显不同：

| 行为 | 没有 Skills | 有 Skills |
|------|-----------|---------|
| 开始新任务时 | 直接开写代码 | 先走头脑风暴流程 |
| 遇到 Bug 时 | 随机猜测修改 | 按「假设→验证→定位→修复」流程排查 |
| 写 Flutter 代码时 | 使用默认/过时模式 | 遵循 Riverpod 3.x + Clean Architecture |
| 完成任务时 | 说「完成了」就结束 | 自动执行验证清单，确认无遗漏 |

---

## Part 4：社区生态速览

Skills 生态正在爆发式增长。以下是目前最值得关注的资源：

### 🔥 4 大热门 GitHub 仓库

| 仓库 | Stars | 说明 |
|------|-------|------|
| [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | 15k+ | Cursor Rules 精选合集，涵盖 React、Vue、Python 等主流技术栈 |
| [JackyST0/awesome-agent-skills](https://github.com/JackyST0/awesome-agent-skills) | 热门 | Agent Skills 大全，收录 Claude Code、Gemini 等多平台 Skills |
| [NickAiCC/superpowers](https://github.com/NickAiCC/superpowers) | 热门 | 14 个模块化工作流技能，覆盖开发全流程 |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | 官方 | Claude Code 官方仓库，含 Skills 规范和示例 |

### 🌐 4 大在线平台

| 平台 | 网址 | 亮点 |
|------|------|------|
| **Cursor Directory** | [cursor.directory](https://cursor.directory) | 最老牌的 Cursor Rules 社区，支持 AI 生成规则和 MCP 服务器浏览 |
| **SkillsMP** | [skillsmp.com](https://skillsmp.com) | Agent Skills 大型市场，收录 50 万+ Skills，支持 SKILL.md 开放标准 |
| **Skills.Homes** | [skills.homes](https://skills.homes) | 从 GitHub 抓取了 7 万+ Skills，支持智能分类和搜索 |
| **Skills Directory** | [skillsdirectory.com](https://skillsdirectory.com) | 提供 AI 代理技能浏览与搜索，按类别分类 |

### 🗂️ 按开发方向分类的推荐 Skills

| 方向 | 推荐 Skills | 解决什么问题 |
|------|-----------|------------|
| 🎨 前端开发 | `senior-frontend`、`nextjs-expert`、`tailwind-mastery` | React/Next.js 最佳实践、CSS 框架深度使用 |
| 📱 移动开发 | `flutter-riverpod-arch`、`react-native-expert` | Flutter/RN 架构规范、状态管理 |
| 🤖 AI 开发 | `prompt-engineer`、`rag-builder`、`mcp-server-builder` | Prompt 优化、RAG 搭建、MCP Server 开发 |
| ⚙️ DevOps | `github-actions`、`docker-expert`、`terraform` | CI/CD 流水线、容器化、基础设施即代码 |
| 🔧 工作流 | `superpowers`（含 brainstorming、debugging 等） | 结构化开发流程、系统化调试 |

---

## Part 5：Skills 的各平台支持情况

不同 AI 编程助手对 Skills 的支持方式略有不同，但核心概念一致：

| 平台 | Skills 位置 | 配置格式 | 触发方式 |
|------|-----------|---------|---------|
| **Cursor** | `.cursor/rules/` | Rules + SKILL.md | 按规则自动匹配 |
| **Claude Code** | `.agent/skills/` | SKILL.md | 工具调用（Skill tool） |
| **Gemini CLI / Antigravity** | `.agent/skills/` 或用户规则 | SKILL.md | 元数据加载 + 按需激活 |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Markdown | 自动包含在上下文中 |

> 💡 **好消息**：`SKILL.md` 正在成为跨平台的开放标准。同一套 Skills 可以在不同 AI 助手中复用，换工具不必重写规则。

---

## 🎯 结尾 Checklist

读完这篇文章，看看你是否达成了以下目标：

- [ ] 💡 理解了 Skills 的概念 —— 它是用 Markdown 写的「AI 操作手册」
- [ ] 🔧 了解了 SKILL.md 的结构 —— YAML 头信息 + Markdown 正文
- [ ] 📦 知道如何安装第一个 Skill —— 克隆 GitHub 仓库到 `.agent/skills/`
- [ ] 🌐 知道去哪里找更多 Skills —— 4 大仓库 + 4 大平台
- [ ] 🎮 理解了 Skills 为什么重要 —— 让 AI 从「通用选手」变成「专项专家」

---

## 📚 下篇预告

> **第 2 篇：从提示词到 Skills — AI 编程的进化之路**
>
> 我们将回顾 AI 编程经历的三次范式跃迁——从提示词、到 Rules、再到 Skills——帮你理解 Skills 为什么突然火了、它和传统 Prompt 有什么本质区别、以及你应该立即安装的 5 个 Skills。

---

*📝 作者：NIHoa ｜ 系列：Skills 使用指南 ｜ 更新日期：2026-03-25*
