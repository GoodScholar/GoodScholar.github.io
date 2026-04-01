---
date: 2025-04-26
tags:
  - OpenSpec
  - Superpowers
  - AI编程
  - 规格驱动开发
  - SDD
cover: /covers/cover-07-openspec-superpowers.webp
---
# Superpowers 实战指南 | 第7期 - OpenSpec + Superpowers：规格驱动开发的终极组合

> 🧩 OpenSpec 管「想清楚」，Superpowers 管「做到位」。当这两套框架同时装进你的 AI 编程助手，你得到的不是 1 + 1 = 2，而是一条从需求到上线的全自动高速公路。

---

## 为什么需要把它们组合在一起？

如果你读过本系列前几期，你已经知道 Superpowers 的能力：头脑风暴、TDD、子代理驱动开发、系统化调试……它是一套让 AI 遵守工程纪律的技能包。

但 Superpowers 有一个「盲区」——**它不管理规格文档的生命周期**。

来看一个真实场景：

```
第一周：你用 Superpowers 让 AI 实现了用户登录功能。
第三周：你说"加一个第三方登录"。
AI：我不知道第一周的登录系统是怎么设计的，让我看看代码……
（然后它看了 2000 行代码，理解了 60%，改了一个不该改的地方）
```

**问题出在哪？** Superpowers 的设计产物（头脑风暴文档、任务计划）是一次性的。一旦任务完成，这些上下文就散落在 Git 历史里，下次开发时 AI 无法高效参考。

**OpenSpec 恰好填补了这个空缺。** 它维护一份持久化的项目规格文件（`openspec/specs/`），让每次功能变更都有据可查、有文档可依。AI 下次开发时，可以直接读取规格了解项目全貌，而不是从零猜测。

---

## OpenSpec 60 秒速览

OpenSpec 是 Fission AI 开源的**规格驱动开发（SDD）框架**，GitHub 35k+ Stars，支持 20+ 款 AI 编码工具。

### 核心理念

> **先对齐需求，再写代码。** 每次改动都经过提案 → 规格 → 任务 → 归档的标准化流程。

### 三阶段工作流

```
/opsx:propose "添加暗黑模式"
     ↓
① 提案阶段（Propose）
   └── 生成 proposal.md / specs/ / design.md / tasks.md
     ↓
/opsx:apply
② 实施阶段（Apply）
   └── 按 tasks.md 逐项实现代码
     ↓
/opsx:archive
③ 归档阶段（Archive）
   └── 将 delta specs 合入主规格目录，变更文件入库
```

### 项目目录结构

```
项目根目录/
├── openspec/
│   ├── specs/              # 📜 项目规格的"唯一事实来源"
│   │   ├── auth.md         #    ← 认证模块规格
│   │   ├── user.md         #    ← 用户模块规格
│   │   └── ...
│   └── changes/            # 🔄 活跃的变更提案
│       ├── add-dark-mode/  #    ← 当前正在开发的功能
│       │   ├── proposal.md
│       │   ├── design.md
│       │   ├── tasks.md
│       │   └── specs/
│       └── archive/        # 📦 已归档的历史变更
│           └── 2025-04-26-add-dark-mode/
```

### 安装

```bash
# 全局安装 CLI
npm install -g @fission-ai/openspec@latest

# 在项目中初始化（选择你的 AI 工具）
cd your-project
openspec init
```

> **提示**：`openspec init` 会自动检测你的开发工具（Cursor、Claude Code、Gemini CLI 等），并注入对应的斜杠命令。

---

## Superpowers vs OpenSpec：各自的领地

在组合之前，先搞清楚它们各自擅长什么：

| 维度 | OpenSpec | Superpowers |
|:---:|:---|:---|
| **核心定位** | 需求规格管理 — "想清楚要做什么" | 工程纪律执行 — "保证做得好" |
| **触发方式** | 手动斜杠命令（`/opsx:propose`） | 全自动（AI 自动判断技能） |
| **输出产物** | `proposal.md` / `specs/` / `design.md` | 设计文档 / 任务计划 / 测试代码 |
| **持久化** | ✅ 规格文件长期存在于 `specs/` 目录 | ❌ 产物是会话级，完成即散落 |
| **上下文管理** | ✅ `specs/` 目录作为 AI 的长期记忆 | ❌ 依赖 Git 历史和当前代码 |
| **测试** | 不涉及 | ✅ TDD 铁律 |
| **调试** | 不涉及 | ✅ 四阶段系统化调试 |
| **代码审查** | 不涉及 | ✅ 完成前验证 |
| **适合阶段** | 开发前（规划） | 开发中 + 开发后（执行 + 验证） |

用一句话总结：

> **OpenSpec 是项目的「大脑」，记住每个功能长什么样；Superpowers 是项目的「肌肉」，保证每行代码都经过考验。**

---

## 组合方案：完整工作流

当两套框架同时装在项目中，你的开发流程变成了这样：

```
         OpenSpec 领地                    Superpowers 领地
┌─────────────────────────┐     ┌─────────────────────────────┐
│ ① /opsx:propose         │     │                             │
│    生成提案 + 规格 + 任务 │     │                             │
│         ↓                │     │                             │
│ ② 人工审查 proposal.md  │     │                             │
│    确认需求和设计方向     │     │                             │
└─────────┬───────────────┘     │                             │
          │ tasks.md 交接       │                             │
          ↓                     │                             │
┌─────────────────────────┐     │                             │
│ ③ Superpowers 自动激活   │ ──→ │ brainstorming 深入细节      │
│    深化 OpenSpec 的设计   │     │ writing-plans 拆分原子任务  │
│         ↓                │     │         ↓                   │
│ ④ 子代理逐任务执行       │     │ TDD 先写测试后写代码        │
│    控制器传递 specs/ 上下文│     │ systematic-debugging        │
│         ↓                │     │ verification 跑过才算完     │
└─────────────────────────┘     └───────────┬─────────────────┘
                                            │
          ↓                                 │
┌─────────────────────────┐                 │
│ ⑤ /opsx:archive         │ ←──────────────┘
│    归档变更，更新 specs/  │
│    项目知识库同步更新     │
└─────────────────────────┘
```

### 关键交接点

| 阶段 | 谁主导 | 做什么 |
|:---:|:---:|:---|
| 提案与规格 | **OpenSpec** | 定义变更范围、生成规格文档和任务清单 |
| 设计深化 | **Superpowers** | 头脑风暴深入技术细节，生成更精细的实施计划 |
| 编码执行 | **Superpowers** | 子代理驱动开发 + TDD，控制器将 `specs/` 中的相关规格作为上下文传递给子代理 |
| 质量验证 | **Superpowers** | 系统化调试 + 完成前验证 |
| 知识归档 | **OpenSpec** | 将变更合入主规格，更新项目知识库 |

---

## 实战演练：给博客系统添加评论功能

让我们用一个完整的例子来演示这个组合工作流。

### 第一步：OpenSpec 提案

```
你: /opsx:propose add-blog-comments
```

OpenSpec 自动生成以下文件：

**`openspec/changes/add-blog-comments/proposal.md`**：
```markdown
# 添加博客评论功能

## 动机
用户希望能在文章下方发表评论，增加社区互动。

## 变更范围
- 新增评论数据模型
- 新增评论列表 UI 组件
- 支持嵌套回复（最多 3 层）
- 支持评论的编辑和删除

## 不做什么
- 不做实时推送（后续迭代）
- 不做评论审核系统（后续迭代）
```

**`openspec/changes/add-blog-comments/tasks.md`**：
```markdown
## 任务清单

- [ ] 1.1 创建 Comment 数据模型和 Prisma migration
- [ ] 1.2 实现评论 CRUD API
- [ ] 2.1 创建 CommentList 组件
- [ ] 2.2 创建 CommentForm 组件
- [ ] 2.3 实现嵌套回复 UI
- [ ] 3.1 集成到文章详情页
- [ ] 3.2 错误处理和边界情况
```

> **你此时要做的**：审查 `proposal.md`，确认需求范围和设计方向。不满意就直接修改文件，AI 下次会读取最新版本。

---

### 第二步：Superpowers 接管执行

审查完毕后，你说：

```
按照 openspec/changes/add-blog-comments/ 中的提案和任务，
开始实现评论功能。
```

→ Superpowers 自动激活 `brainstorming`，但这次它不是从零开始，而是**基于 OpenSpec 已生成的 proposal.md 和 specs/ 进行深化**：

```
AI: 我已阅读提案。关于嵌套回复的实现，有两个技术方案：
    方案 A：邻接表（每条评论存 parentId）
    方案 B：物化路径（每条评论存完整路径 "1/3/7"）
    嵌套 3 层的场景下，方案 A 查询更简单但需要递归，
    方案 B 查询更快但路径更新复杂。
    你倾向哪个？
```

确认后 → Superpowers 自动进入 `writing-plans`，将 OpenSpec 的 7 个任务进一步拆分为更精细的原子任务。

→ 进入 `subagent-driven-development`，控制器在分派每个子代理时，会将 `openspec/specs/` 中的相关规格作为上下文传递给子代理，让其了解项目已有的数据模型和 API 设计，避免冲突。

→ 每个子代理遵循 `TDD` 铁律：先写测试，测试失败，写代码，测试通过。

→ 所有任务完成后，`verification-before-completion` 确保测试全部通过。

---

### 第三步：OpenSpec 归档

所有代码通过验证后：

```
你: /opsx:archive add-blog-comments
```

OpenSpec 将：
- 把 `changes/add-blog-comments/specs/` 中的变更合入 `openspec/specs/`
- 将完整的变更文件夹移入 `changes/archive/2025-04-26-add-blog-comments/`
- 主规格目录更新，后续开发时 AI 可以直接读取

```
AI: 已归档到 openspec/changes/archive/2025-04-26-add-blog-comments/
    specs 已更新：
      ✓ comment.md — 评论模块规格（新增）
      ✓ post.md — 文章模块规格（更新，添加评论关联）
    准备开发下一个功能！
```

---

## 配置指南

### 同时安装两套框架

```bash
# 1. 安装 OpenSpec（全局 CLI）
npm install -g @fission-ai/openspec@latest

# 2. 在项目中初始化 OpenSpec
cd your-project
openspec init
# 选择你的 AI 工具（Claude Code / Cursor / Gemini CLI 等）

# 3. 安装 Superpowers（以 Claude Code 为例）
# Claude Code
/plugin install superpowers@claude-plugins-official

# Gemini CLI
gemini extensions install https://github.com/obra/superpowers

# Cursor
/add-plugin superpowers
```

### 可用命令速查

| 来源 | 命令 | 用途 |
|:---:|:---|:---|
| OpenSpec | `/opsx:propose <name>` | 创建变更提案 |
| OpenSpec | `/opsx:apply` | 按规格实施变更 |
| OpenSpec | `/opsx:archive <name>` | 归档变更并更新规格 |
| OpenSpec | `/opsx:verify` | 校验规格一致性 |
| OpenSpec | `/opsx:sync` | 同步规格与代码状态 |
| OpenSpec | `/opsx:onboard` | 引导 AI 快速了解项目 |
| Superpowers | （自动） | brainstorming / TDD / debugging / verification |
| Superpowers | `/brainstorm` | 手动触发头脑风暴 |
| Superpowers | `/write-plan` | 手动触发计划编写 |
| Superpowers | `/execute-plan` | 手动触发计划执行 |

---

## 最佳实践

### ✅ 推荐做法

▪️ **OpenSpec 先行**：任何新功能开发，先用 `/opsx:propose` 定义范围，再让 Superpowers 接管执行

▪️ **specs/ 是真相来源**：告诉 AI "先阅读 `openspec/specs/` 了解项目现有功能"，避免重复发明

▪️ **归档是纪律**：每次功能完成后必须 `/opsx:archive`，保证规格文件与代码同步

▪️ **Superpowers 深化 OpenSpec**：OpenSpec 生成的 `tasks.md` 是粗粒度的，让 Superpowers 的 `writing-plans` 进一步细化

▪️ **主动传递规格**：在 Superpowers 分派子代理时，需手动将 `openspec/specs/` 中的相关规格内容作为上下文传递给子代理，子代理不会自动读取规格目录

### ❌ 避免做法

▪️ **不要跳过 OpenSpec 直接编码**：没有提案就没有规格，没有规格就没有长期记忆

▪️ **不要忘记归档**：未归档的变更 = 项目知识库的知识黑洞

▪️ **不要在两个框架中重复定义需求**：OpenSpec 管需求范围，Superpowers 管实施细节，各司其职

▪️ **不要手动编辑 `specs/` 主目录**：规格更新应通过 `changes/` 流程，保证变更可追溯

---

## 组合 vs 单独使用：场景选择

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 长期大型项目 | ✅ OpenSpec + Superpowers | 需要规格持久化 + 高质量执行 |
| 短期 MVP / 黑客松 | Superpowers 单独 | 追求速度，规格管理是额外负担 |
| 文档驱动团队 | OpenSpec 单独 | 已有自己的代码质量体系 |
| 接手遗留项目 | ✅ OpenSpec + Superpowers | 先用 OpenSpec 建立规格，再用 Superpowers 改造 |
| 独立开发者原型验证 | Superpowers 单独 | 灵活轻量，快速迭代 |
| 多人协作项目 | ✅ OpenSpec + Superpowers | 规格文件是团队共识的载体 |

---

## 与其他方案的对比

| 方案 | 规格管理 | 工程纪律 | 持久化上下文 | 学习成本 |
|:---:|:---:|:---:|:---:|:---:|
| 纯聊天（Vibe Coding） | ❌ | ❌ | ❌ | 零 |
| OpenSpec 单独 | ✅ | ❌ | ✅ | 低 |
| Superpowers 单独 | ❌ | ✅ | ❌ | 中 |
| **OpenSpec + Superpowers** | **✅** | **✅** | **✅** | **中** |
| Spec Kit（GitHub） | ✅ | ❌ | ✅ | 高（重量级） |
| Kiro（AWS） | ✅ | 部分 | ✅ | 高（锁定 IDE） |

---

## 项目信息

| 项目 | OpenSpec | Superpowers |
|------|---------|-------------|
| 仓库地址 | [github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | [github.com/obra/superpowers](https://github.com/obra/superpowers) |
| Stars | 35k+ | — |
| 开源许可 | MIT | MIT |
| 安装命令 | `npm install -g @fission-ai/openspec@latest` | 各平台插件安装 |
| 支持工具 | 20+ 款 AI 编码助手 | Claude Code / Gemini CLI / Cursor |

---

## 小结

OpenSpec + Superpowers 的组合，解决了 AI 辅助开发中最难啃的两个骨头：

▪️ **上下文消失问题**：OpenSpec 的 `specs/` 目录让项目知识持久化，AI 每次开发都能读取完整规格
▪️ **工程质量问题**：Superpowers 的 TDD、系统化调试、完成前验证三重防线，保证代码质量

两套框架各司其职、无缝衔接：OpenSpec 管「规划与记忆」，Superpowers 管「执行与验证」。装上之后，你的 AI 编程助手就从「无头苍蝇」进化为「有规格手册、有工程纪律的专业开发者」。

如果你已经在用 Superpowers，强烈建议加上 OpenSpec 补全规格管理的短板。只需 `openspec init` 一条命令，就能给你的项目装上「持久记忆」。

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 系列：Superpowers实战指南系列 ｜ 更新日期：2025-04-26*
