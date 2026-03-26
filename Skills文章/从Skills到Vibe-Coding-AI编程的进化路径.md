---
draft: true
---

# 从 Skills 到 Vibe Coding — AI 编程的进化路径

> 如果你已经读过我之前的 Skills 系列文章，你可能会问：Skills 和 Vibe Coding 是什么关系？它们是不同的东西还是同一个趋势的不同侧面？这篇文章就是来回答这个问题的——它是串联两个系列的桥梁。

---

## 📐 先理清关系

简单一句话：

> **Vibe Coding 是飞行模式，Skills 是飞行手册。**

没有 Skills，你也能 Vibe Coding——就像没有飞行手册你也能起飞。但起飞和安全着陆是两码事。

| | 没有 Skills 的 Vibe Coding | 有 Skills 的 Vibe Coding |
|--|---------------------------|--------------------------|
| 代码风格 | 每次不一样 | 始终一致 |
| 架构决策 | AI 随性发挥 | 遵循预设规范 |
| 质量保障 | 全靠运气 | 有系统性防线 |
| 工作流程 | 想到哪做到哪 | 结构化推进 |
| 上手门槛 | 任何人可以开始 | 任何人可以开始，但做得更好 |
| 可复制性 | 每次体验不同 | 可持续、可复制 |

**Skills 解决的是 Vibe Coding 最大的痛点：不可控。**

---

## 🔄 两条演进线的交汇

### AI 编程的演进线

```
提示词 (2023) → Rules (2024) → Skills (2025) → Vibe + Skills (2026)
```

这条线的主题是：**如何更好地指导 AI**。

- 提示词：每次手动输入
- Rules：固化为项目级配置
- Skills：模块化 + 按需加载 + 跨平台

### 编程范式的演进线

```
手写代码 → Copilot 补全 → AI 辅助编程 → Vibe Coding
```

这条线的主题是：**人在编程中的角色变化**。

### 交汇点：Skills + Vibe Coding

两条线在 2025-2026 年交汇了。

Skills 为 Vibe Coding 提供了急需的**约束层**：
- 你 Vibe 的时候不需要每次都说「用 TypeScript」「遵循 Clean Architecture」——Skills 替你说了。
- 你 Vibe 的时候不担心代码质量——Skills 里的规范替你把关了。
- 你换了 AI 工具也不怕——SKILL.md 标准是跨平台的。

---

## 🎯 Skills 在 Vibe Coding 中的五大角色

### 角色 1：建筑规范 📐

就像建筑法规规定了墙的最小厚度、承重结构的标准，编码 Skills 规定了代码的最低质量。

```markdown
# 安全编码 Skill（摘要）
- ❌ 不在前端硬编码密钥
- ✅ 所有用户输入做 sanitization
- ✅ API 密钥通过环境变量引入
```

当你 Vibe Coding 时说「做一个用户注册」，AI 会自动遵循这些安全规范——你不需要每次重复说。

### 角色 2：飞行手册 ✈️

Superpowers 等工作流 Skills 定义了 AI 工作的 SOP。

```
brainstorming → writing-plans → executing-plans → verification
```

没有这个流程，AI 收到需求就直接乱写。有了这个流程，AI 会先分析需求、制定计划、分步执行、最后验证。

**对比效果**：

| 步骤 | 没有 Superpowers | 有 Superpowers |
|------|-----------------|----------------|
| 收到需求 | 立即开始写代码 | 先做头脑风暴 |
| 开始编码 | 边想边写 | 先写执行计划 |
| 遇到难点 | 随意发挥 | 按调试流程排查 |
| 说「完成了」| 就真的结束了 | 先跑验证清单 |

### 角色 3：团队记忆 🧠

团队的编码规范、技术选型偏好、踩过的坑——这些知识以前靠口口相传，现在沉淀在 Skills 里。

```
.agent/skills/
├── our-react-convention/     # 团队的 React 编码规范
│   └── SKILL.md
├── our-api-design/           # 团队的 API 设计规范
│   └── SKILL.md
└── our-common-pitfalls/      # 团队踩过的坑
    └── SKILL.md
```

新人入职，装上这些 Skills，他的 AI 助手立刻就有了「老员工」的规范意识。

### 角色 4：质量门禁 🚧

前一篇文章讲过「三道质量防线」，Skills 就是最重要的第三道——架构约束。

```markdown
# 性能规范 Skill
## 必须
- 列表超过 20 条必须做分页
- 图片必须做懒加载
- 请求必须有超时设置（默认 10s）

## 禁止
- 不在循环中发请求
- 不在 useEffect 中做无限递归
- 不将大对象存在 state 中
```

### 角色 5：经验传承 💎

**你自己写的 Skills 是最有价值的。**

因为它们包含了你独特的经验：

- 你在某个技术栈上踩过的坑
- 你偏好的代码风格和架构模式
- 你对「什么是好代码」的审美标准
- 你的工作流习惯

这些东西，别人的 Skills 代替不了。

---

## 🔗 Superpowers 在 Vibe Coding 中的最佳实践

Superpowers 是目前最流行的工作流 Skills 集合。在 Vibe Coding 场景下，以下几个模块特别有价值：

### brainstorming（头脑风暴）

**触发**：当你说「我想做一个...」的时候

**Vibe 场景**：你刚有一个模糊的产品想法，还没想清楚该怎么做。

```
你：我想做一个基于 AI 的记忆卡片应用
↓ brainstorming Skill 激活
AI：好的，让我们先梳理一下。我会从以下维度分析你的想法：
   1. 核心价值：解决什么问题？
   2. 目标用户：谁在用？
   3. 核心功能：MVP 需要什么？
   4. 技术选型：用什么技术？
   5. 风险和挑战：可能的坑？
   → 生成结构化的分析文档
```

### writing-plans（编写计划）

**触发**：头脑风暴完成后，要开始动手之前

**Vibe 场景**：你已经想清楚要做什么了，需要一个执行计划。

```
AI 输出：
## 执行计划
### Phase 1：项目基础（Day 1）
- [ ] 初始化项目
- [ ] 搭建基础 UI 框架
- [ ] 配好数据模型

### Phase 2：核心功能（Day 2-3）
- [ ] 卡片 CRUD
- [ ] 记忆算法（间隔重复）
- [ ] AI 生成卡片内容

### Phase 3：打磨（Day 4）
- [ ] UI 动效
- [ ] 性能优化
- [ ] 部署
```

### systematic-debugging（系统化调试）

**触发**：遇到 Bug 时

**Vibe 场景**：AI 生成的代码有 Bug，你说「这里不对」。没有 Skill 的话，AI 会随便改改碰运气。有了 Skill，AI 会按流程排查：

```
1. 复现问题 → 确认 Bug 表现
2. 提出假设 → 列出可能的原因
3. 验证假设 → 逐一排除
4. 定位根因 → 找到真正的问题
5. 修复 + 验证 → 确保修复有效且不引入新问题
```

### verification-before-completion（完成前验证）

**触发**：AI 说「完成了」的时候

**Vibe 场景**：防止 AI 随便糊弄你。这个 Skill 会让 AI 自动跑一遍验证清单：

```
✅ 功能是否满足原始需求
✅ 代码是否通过 lint 和类型检查
✅ 关键路径是否有测试覆盖
✅ 是否有安全风险
✅ 是否有明显的性能问题
```

---

## 🎯 打通两个系列：行动路线

如果你是**先读了 Skills 系列**来到这里的：

```
1. 你已经懂了 Skills ← 很好
2. 现在学习 Vibe Coding 的理念 ← 读这个系列的第 1、2 篇
3. 在 Vibe Coding 中使用你已有的 Skills ← 你已经在正确的路上
4. 根据 Vibe Coding 的经验，持续完善你的 Skills ← 迭代循环
```

如果你是**先读了 Vibe Coding 系列**来到这里的：

```
1. 你已经懂了 Vibe Coding ← 很好
2. 现在理解 Skills 如何让 Vibe 更可控 ← 读 Skills 系列
3. 安装 Superpowers 和技术栈 Skills ← 立即行动
4. 开始写你自己的 Skills ← 最终目标
```

**无论从哪边进来，最终都会走到同一个地方：**

> **Vibe Coding（高效创造）+ Skills（质量约束）= AI 时代的最佳编程实践。**

---

## 💡 最后的思考

Skills 和 Vibe Coding 不是两个独立的趋势。它们是同一枚硬币的两面：

- **Vibe Coding 释放了创造力**——让你更快地把想法变成现实
- **Skills 提供了约束力**——让创造出来的东西靠谱、可维护

就像音乐一样：自由即兴是 Vibe，但音阶、和弦、节奏就是 Skills。最好的爵士乐手不是完全随心所欲——他们在深厚的基本功之上自由飞翔。

**最好的 AI 时代开发者也是如此：在坚实的 Skills 基础上，自由 Vibe。**

---

## 📚 相关阅读

### Skills 系列
- [Skills 入门 — AI 编程助手的「技能加点」指南](./01-Skills入门-AI编程助手的技能加点指南.md)
- [从提示词到 Skills — AI 编程的进化之路](./从提示词到Skills-AI编程的进化之路.md)
- [10 分钟打造你的第一个 AI Skill](./10分钟打造你的第一个AI-Skill.md)
- [AI 编程工具三国杀](./AI编程工具三国杀-Cursor-vs-ClaudeCode-vs-Gemini.md)

### Vibe Coding 系列
- [Vibe Coding 不是「让 AI 写代码」这么简单](./Vibe-Coding不是让AI写代码这么简单.md)
- [我用 Vibe Coding 从零做了一个 AI 推理游戏](./我用Vibe-Coding从零做了一个AI推理游戏.md)
- [Vibe Coding 工具怎么选](./Vibe-Coding工具怎么选-Cursor-vs-ClaudeCode-vs-Bolt.md)
- [不看代码行不行？Vibe Coding 的质量红线](./不看代码行不行-Vibe-Coding的质量红线.md)
- [Vibe Coding 时代，程序员的新技能树](./Vibe-Coding时代程序员的新技能树.md)

---

*📝 作者：NIHoa ｜ 系列：Vibe Coding 深度解读（番外篇） ｜ 更新日期：2026-01-14*
