---
date: 2025-04-13
---
# GStack 实战指南 | 第1期 - 初识 GStack：把 Claude Code 变成你的虚拟开发团队

> 🚀 在 AI 编程时代，最大的陷阱就是把 AI 当成一个打字机。真正的提效，是让 AI 按照团队角色来行动。GStack 就是为此而生的利器。

---

## 为什么你需要 GStack？

如果你已经深度使用了 Cursor 或者 Claude Code，你会发现一个规律：短平快的代码修改非常顺畅，但当你想要 **从零到一做一个产品** 时，AI 经常开始"胡言乱语"——文件乱建、架构跑偏、状态管理一团糟。

导致这种现象的根本原因是：**你把产品规划、架构设计、编码实现、质量保障、发版上线的压力，全都压在了一次 prompt 上。**

Y Combinator 现任 CEO **Garry Tan** 基于在硅谷初创公司的丰富工程经验，开源了 **GStack** 项目。它的核心思想极度克制：

> **给 AI 分配特定的角色指令，让它在每个阶段只干对应的事。**

它将 Claude Code 升级成了一个由虚拟角色组成的开发流水线：

| 角色 | 对应指令 | 职责 |
|:---:|:---:|:---|
| 🧑‍💼 CEO / 产品经理 | `/plan-ceo-review` | 砍掉你的边缘需求，守住 MVP |
| 🏗️ 技术总监 | `/plan-eng-review` | 不写代码，只规划数据流与接口 |
| 👨‍💻 开发工程师 | 正常 Prompt | 根据架构方案老实写代码 |
| 🛡️ 代码审计员 | `/review` | 对抗性审查，揪出隐藏 Bug |
| 🤖 QA 测试员 | `/qa` + `/browse` | 用无头浏览器亲自点击你的页面 |
| 📦 发版经理 | `/ship` | 自动提交、生成 PR、一键发版 |

---

## GStack 的极速安装

GStack 需要基于 Anthropic 官方的 CLI 工具 **Claude Code** 运行。

### 第一步：安装 Claude Code

如果还没有 Claude Code，首先安装它（Mac / Linux 环境）：

```bash
# 全局安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

### 第二步：克隆 GStack 技能包

将 Garry 团队写好的 GStack 技能克隆到 Claude Code 的默认技能目录中：

```bash
# 克隆到技能目录
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack

# 进入目录并执行初始化
cd ~/.claude/skills/gstack
./setup
```

> **⚠️ 注意**：`./setup` 会自动安装 Playwright 浏览器引擎（Chromium），这是后续 `/qa` 和 `/browse` 端到端测试能力的基础依赖。首次安装可能需要几分钟时间。

### 第三步：GStack 目录结构一览

安装完成后，来看看 GStack 的技能包长什么样：

```
~/.claude/skills/gstack/
├── SKILL.md              # 主入口：定义所有斜杠命令
├── setup                 # 环境初始化脚本
├── skills/
│   ├── plan-ceo-review/  # CEO 产品评审技能
│   │   └── SKILL.md
│   ├── plan-eng-review/  # 技术架构评审技能
│   │   └── SKILL.md
│   ├── review/           # 对抗性代码审查技能
│   │   └── SKILL.md
│   ├── qa/               # 自动化 QA 测试技能
│   │   └── SKILL.md
│   ├── browse/           # 无头浏览器控制技能
│   │   └── SKILL.md
│   └── ship/             # 一键发版技能
│       └── SKILL.md
└── scripts/              # 辅助脚本（浏览器控制等）
```

每个 `SKILL.md` 就是一段精心设计的系统提示词（System Prompt），它定义了 Claude 在该角色下的行为准则、思考方式和输出格式。

### 第四步：注册到你的项目

在你的项目根目录，创建 `CLAUDE.md`——这是 Claude Code 的最高"指挥棒"：

```markdown
# 项目开发规范

本项目强制使用 ~/.claude/skills/gstack 中的 GStack 技能集合。

## 命令体系

| 命令 | 用途 |
|------|------|
| `/plan-ceo-review` | 产品方向评审，砍需求 |
| `/plan-eng-review` | 技术架构规划 |
| `/review` | 提交前代码深度审计 |
| `/qa` | 自动化端到端验收测试 |
| `/browse` | 无头浏览器网页研究 |
| `/ship` | 整合提交并创建 PR |

## 研发纪律

- 任何新功能必须先过 `/plan-ceo-review`
- 架构设计必须先过 `/plan-eng-review`
- 代码提交前必须通过 `/review`
- 涉及 UI 交互的功能必须通过 `/qa` 验收
```

---

## 从 "Prompt" 到 "Role-chaining" 的范式转换

### 传统模式 vs GStack 模式

```
传统模式（一锅端）：
┌──────────────────────────────────────────────┐
│ "帮我写一个 Todo 应用的登录界面，要好看，     │
│  要有表单校验，要能记住密码，要适配移动端……" │
└──────────────────────────────────────────────┘
              ↓ AI 一次性输出
         ❌ 代码质量不可控
         ❌ 架构混乱
         ❌ 功能遗漏

GStack 模式（角色链式调度）：
┌───────────┐    ┌───────────┐    ┌───────┐
│ CEO 评审   │ →  │ 架构规划   │ →  │ 编码   │
│ 砍掉冗余   │    │ 定好接口   │    │ 填肉   │
└───────────┘    └───────────┘    └───────┘
                                       ↓
┌───────────┐    ┌───────────┐    ┌───────┐
│ 发版上线   │ ←  │ QA 验收   │ ←  │ 审计   │
│ /ship     │    │ /qa       │    │/review│
└───────────┘    └───────────┘    └───────┘
```

### 实际操作流程

以做一个 Todo 登录页面为例，GStack 模式下你的操作顺序是：

**① 唤起 CEO 角色**
```bash
/plan-ceo-review 我打算为 Todo 应用添加用户登录功能，
包括邮箱登录、GitHub 第三方登录、记住密码。
```

→ CEO 可能会砍掉 GitHub 登录（MVP 阶段不需要），保留邮箱登录 + 记住密码。

**② 唤起架构角色**
```bash
/plan-eng-review 根据 CEO 评审通过的需求，
请规划登录模块的数据流和组件结构。
```

→ Tech Lead 会输出组件树、状态管理方案、API 接口定义，但不写具体代码。

**③ 编写代码**

根据架构方案，让 Claude 逐个实现组件。每完成一个小模块：

**④ 代码审计**
```bash
/review 检查刚才写的登录表单校验逻辑。
```

**⑤ QA 验收**
```bash
/qa 打开 http://localhost:3000/login，
输入错误密码检查是否正确显示错误提示。
```

**⑥ 一键发版**
```bash
/ship 登录功能开发完毕，提交并创建 PR。
```

---

## GStack 与其他方案的对比

| 维度 | 裸用 Claude Code | Cursor Rules | GStack |
|:---:|:---:|:---:|:---:|
| 角色分离 | ❌ 没有 | ⚠️ 单一规则 | ✅ 6 个专业角色 |
| 产品约束 | ❌ 无 | ❌ 无 | ✅ CEO 评审 |
| 架构审查 | ❌ 无 | ⚠️ 手动 | ✅ Tech Lead 评审 |
| 端到端测试 | ❌ 无 | ❌ 无 | ✅ 无头浏览器 |
| 自动发版 | ❌ 无 | ❌ 无 | ✅ /ship 一键 |
| 学习成本 | 低 | 中 | 中 |

---

## 小结

GStack 利用 Claude Code 的指令扩展能力（Skills 特性），硬生生地套上了一层软件工程的团队化协作流程。它的本质不是让 AI 写更多代码，而是 **让 AI 在正确的阶段做正确的事**。

在下一篇文章中，我们将详细展开最有趣的环节：**如何在不写一行代码前，用 `/plan-ceo-review` 与 `/plan-eng-review` 把项目地基钉死。**

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 系列：GStack实战指南系列 ｜ 更新日期：2025-04-13*
