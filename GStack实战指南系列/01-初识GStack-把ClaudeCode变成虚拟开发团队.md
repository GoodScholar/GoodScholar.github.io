# 01-初识GStack：把 Claude Code 变成你的虚拟开发团队

> 🚀 在 AI 编程时代，最大的陷阱就是把 AI 当成一个打字机。真正的提效，是让 AI 按照团队的角色来行动。GStack 就是为此而生的利器。

---

## 1. 为什么你需要 GStack？

如果你已经深度使用了 Cursor 或者 Claude Code，你会发现一个规律：短平快的代码修改非常顺畅，但当你想要**从零到一个产品**时，AI 经常会开始“胡言乱语”。

导致这种现象的原因是：你把产品、架构、测试、上线的压力全都压在了一次 prompt 上。

Y Combinator 的 CEO Garry Tan 基于丰富的初创公司工程经验，开源了 **GStack** 项目。它的核心思想极度克制：**给 AI 分配特定角色指令，让它在每个阶段只干对应的事。**

它将 Claude Code 升级成了一个由虚拟角色组成的开发流水线：
▪️ **产品经理**（砍掉你的边缘需求）
▪️ **技术总监**（不写代码，只规划流与接口）
▪️ **开发工程师**（根据规矩填肉）
▪️ **测试开发**（用无头浏览器亲自点你的网页）

---

## 2. GStack 的极速安装

GStack 需要基于 Anthropic 官方的强大 CLI 工具 **Claude Code** 运行。

### 第一步：安装工具链

如果还没有 Claude Code，首先安装它（Mac/Linux 环境下）：
```bash
npm install -g @anthropic-ai/claude-code
```

接着，将 Garry 团队写好的 GStack 技能克隆到默认的技能包检索目录中：
```bash
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack
# 运行环境配置（例如 Playwright 的初始安装）
./setup
```

### 第二步：夺舍 Claude Code (`CLAUDE.md`)

在你的项目根目录，创建一个非常核心的文件：`CLAUDE.md`。这相当于 Claude 的最高“指挥棒”。在这里要把 GStack 技能注册给它：

```markdown
# 我们的极客团队说明
项目中应当强制调用 ~/.claude/skills/gstack 中的技能集合。
- 当你需要执行网页研究或抓取任务时，必须使用 GStack 提供的 `/browse`，而不是默认的。
- 本项目遵循 GStack 的五大命令体系：
  - `/plan-ceo-review`: 审评产品。
  - `/plan-eng-review`: 设计技术架构。
  - `/review`: 提交前代码审计。
  - `/qa`: 自动化验收测试。
  - `/ship`: 整合并打包提交。
```

---

## 3. 从“Prompt”到“Role-chaining”的工作流

当你完成安装后，你的开发模式将被彻底颠覆。
以前你的输入是：
> “帮我写一个 Todo 应用的登入界面，要好看。”

现在在 GStack 流下，你的开发流程（Role-chaining）变成了：

1. **唤起 CEO 角色**：`/plan-ceo-review 我打算做一个 Todo 登入。`
2. **唤起架构角色**：`/plan-eng-review 根据上的产品结论，规划数据层。`
3. **纯粹敲打代码**：根据架构单，编写前端业务。
4. **唤起 QA 角色**：`/qa 检查该登录按钮点击后是否真的弹出预期报错。`

---

## 🎯 小结

GStack 利用 Claude Code 的指令扩展能力（Skills 特性），硬生生地套上了一层软件工程的团队化协作流程。

在下一篇文章中，我们将详细展开最有趣的环节：**如何在不写一行代码前，用 `/plan-ceo-review` 与 `/plan-eng-review` 把项目地基于基石钉死。**

---
*📝 作者：NIHoa ｜ 系列：GStack 实战指南系列 ｜ 更新日期：2026-01-01*
