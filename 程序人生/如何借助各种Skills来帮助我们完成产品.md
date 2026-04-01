---
date: 2026-03-24
tags:
  - AI编程
  - Skills
  - 产品开发
  - Vibe Coding
  - 工作流
cover: /covers/cover-skills-driven-product.webp
---
# 如何借助各种 Skills 来帮助我们完成产品

> 🧩 一个人 + 一套 Skills = 一个虚拟开发团队。关键不是你会多少技术，而是你能调度多少技能。

---

## 从"写代码"到"编排能力"

过去做产品，你需要一个团队：产品经理定义需求、设计师出设计稿、前端写页面、后端写接口、测试保质量。每个人负责一个环节，交接中消耗大量沟通成本。

现在，AI 可以承担绝大部分执行工作。但**裸奔的 AI 就像一个没有 SOP 的新员工**——能力不差，就是不知道你的规矩。

Skills 就是你给 AI 准备的一整套 SOP。

```
传统团队做产品：                    Skills 驱动做产品：
                                   
PM → 设计师 → 开发 → 测试          你 + AI（装载了各种 Skills）
 ↓      ↓       ↓      ↓              ↓
PRD   设计稿   代码   报告          PRD → 设计 → 代码 → 测试 → 部署
                                        ↑ 全部由 Skills 约束质量
3-4 周                              3-5 天
```

这篇文章不讲 Skills 是什么（那是入门篇的事），而是讲**在一个真实产品的生命周期中，每个环节需要什么 Skills，怎么编排它们产生最大效果**。

---

## 产品全生命周期的 Skills 地图

一个产品从想法到上线，大致经历 5 个阶段。每个阶段都有对应的核心 Skills：

```
┌─────────────┬─────────────────────────────────────────────┐
│   阶段       │   核心 Skills                               │
├─────────────┼─────────────────────────────────────────────┤
│ 1. 需求定义  │ brainstorming · writing-plans               │
│ 2. 架构设计  │ architecture · coding-style                 │
│ 3. 功能开发  │ executing-plans · framework-specific skills │
│ 4. 质量保障  │ systematic-debugging · code-review · TDD    │
│ 5. 交付上线  │ verification · CI/CD · deployment           │
└─────────────┴─────────────────────────────────────────────┘
```

接下来逐阶段展开。

---

## 阶段一：需求定义 — 用 AI 把想法变成可执行的文档

### 🎯 对应 Skills

| Skill | 作用 | 什么时候用 |
|-------|------|-----------|
| `brainstorming` | 结构化头脑风暴 | 产品想法初期，功能规划 |
| `writing-plans` | 编写实施计划 | 头脑风暴完成后，转化为文档 |

### 🔑 为什么这一步最关键

大多数人用 AI 做产品的失败，不是败在代码质量，而是**败在需求不清**。

没有清晰的需求文档，AI 每次对话都在"猜"你要什么。做出来的东西一定是碎片化的。

### 📝 实际操作

**第一步：触发 brainstorming**

```
你：/brainstorm 我想做一个个人记账 App，主要面向大学生，
    要简单好用，能分类统计每月开支。
```

brainstorming Skill 会引导 AI 做以下事情（而不是直接写代码）：

1. **澄清目标用户**：大学生群体有什么特殊需求？生活费管理？AA 制分账？
2. **功能脑暴**：列出所有可能的功能，标注优先级
3. **技术方案对比**：Flutter vs RN？本地存储 vs 云同步？
4. **风险识别**：隐私合规、数据安全、竞品分析
5. **输出 MVP 清单**：第一版只做哪些功能

**第二步：触发 writing-plans**

```
你：/write-plan 根据头脑风暴的结论，写出完整的实施计划
```

writing-plans Skill 会生成：

- 带优先级的功能清单
- 分阶段的开发里程碑
- 技术栈决策记录（ADR）
- 数据模型设计
- 页面和 API 接口清单

> 💡 **关键原则**：在这个阶段，你和 AI 之间的对话应该是"讨论"而不是"指令"。brainstorming Skill 的价值就在于——它强制 AI 在动手之前先思考，而不是拿到需求就开写。

---

## 阶段二：架构设计 — 用 Skills 锁定技术边界

### 🎯 对应 Skills

| Skill | 作用 | 什么时候用 |
|-------|------|-----------|
| `architecture` | 架构约束规则 | 项目初始化之前 |
| `coding-style` | 编码风格规范 | 贯穿整个开发过程 |
| 框架专属 Skill | 特定技术栈的最佳实践 | 编码阶段自动加载 |

### 🏗️ 为什么架构要"写成 Skill"

如果架构决策只存在你脑子里，AI 是不会遵守的。它每次对话都是从零开始的"新员工"。

**把架构决策固化为 Skill**，等于给 AI 装了一个永远不会忘记的"长期记忆"：

```markdown
# architecture Skill

## 目录结构
所有功能模块遵循 Feature-First 架构：
lib/
├── core/          # 全局共享：主题、路由、网络、工具
├── features/      # 按功能分模块
│   ├── auth/
│   │   ├── data/         # 数据层：API、本地存储
│   │   ├── domain/       # 领域层：实体、用例
│   │   └── presentation/ # 展示层：页面、组件、状态
│   └── home/
│       ├── data/
│       ├── domain/
│       └── presentation/
└── main.dart

## 状态管理
- 使用 Riverpod 3.x，禁止使用 setState 管理跨组件状态
- 所有 Provider 使用 @riverpod 注解生成
- 异步操作统一返回 AsyncValue

## 依赖注入
- 通过 Provider 实现，禁止使用 get_it 等服务定位器
- Repository 接口定义在 domain 层，实现在 data 层
```

### 🎨 编码风格 Skill 的实际效果

有了 `coding-style` Skill 后，无论你让 AI 写哪个模块，代码风格都高度一致：

```
✅ 有 coding-style Skill：

  文件 A（auth 模块）     文件 B（profile 模块）
  ├── 命名规范一致          ├── 命名规范一致
  ├── 错误处理模式一致      ├── 错误处理模式一致
  ├── 注释风格一致          ├── 注释风格一致
  └── 代码结构一致          └── 代码结构一致

❌ 没有 coding-style Skill：

  文件 A                  文件 B
  ├── camelCase           ├── snake_case
  ├── try-catch           ├── Result 模式
  ├── 有注释               ├── 无注释
  └── 150 行               └── 500 行
```

### 🧩 框架专属 Skills 推荐

| 技术栈 | 推荐 Skill | 核心约束 |
|--------|-----------|---------|
| Flutter | `flutter-riverpod-arch` | Riverpod 3.x + Clean Architecture |
| React Native | `react-native-expert` | 最新的 New Architecture 实践 |
| Next.js | `nextjs-expert` | App Router + Server Components |
| Vue 3 | `vue3-composition` | Composition API + Pinia |
| NestJS | `nestjs-enterprise` | 模块化 + 依赖注入 + Guard |

---

## 阶段三：功能开发 — 分阶段执行，用 Skills 保持节奏

### 🎯 对应 Skills

| Skill | 作用 | 什么时候用 |
|-------|------|-----------|
| `executing-plans` | 按计划分阶段执行 | 进入编码阶段 |
| 框架 Skills | 代码生成质量保障 | 写每一行代码时 |
| `using-superpowers` | 调度入口，协调多个 Skills | 贯穿全流程 |

### 📋 executing-plans 如何控制开发节奏

没有 `executing-plans` Skill 的情况：

```
你：帮我实现记账 App 的所有功能
AI：好的！（一口气生成 3000 行代码...前后矛盾、风格混乱、Bug 满天飞）
```

有 `executing-plans` Skill 的情况：

```
AI 的行为变成了：

Step 1: 检查计划文档
  → 读取之前生成的 implementation_plan.md
  → 识别当前阶段：Phase 1 - 基础设施

Step 2: 创建任务追踪
  → 生成 task.md，列出当前阶段的所有子任务
  → [ ] 项目初始化
  → [ ] 主题系统
  → [ ] 路由框架
  → [ ] 网络层封装

Step 3: 逐个完成
  → [x] 项目初始化 ✓
  → [/] 主题系统（进行中）
  → [ ] 路由框架
  → [ ] 网络层封装

Step 4: 阶段验收
  → 所有子任务完成后，运行验证
  → 确认无误后推进到 Phase 2
```

> 💡 **核心价值**：executing-plans 把"一锅炖"的开发变成了"流水线"——每一步都可追踪、可验证、可回退。

### 🧠 框架 Skills 在开发阶段的角色

框架 Skills 不需要你主动调用，它们是**被动生效**的。只要你的 AI 环境中装了对应的 Skill，AI 在写代码时就会自动遵循规范。

**对比示例——创建一个新的"交易记录"功能模块**：

没有框架 Skill：
```
AI 可能：
- 把所有代码塞进一个文件
- 直接在 UI 层调用 API
- 不做错误处理
- 用老旧的状态管理方式
```

有 `flutter-riverpod-arch` Skill：
```
AI 自动：
- 按 data/domain/presentation 三层创建文件
- 在 domain 层定义 TransactionEntity 和 TransactionRepository 接口
- 在 data 层实现 API 调用和本地缓存
- 在 presentation 层用 @riverpod 注解创建 Controller
- 统一使用 AsyncValue 处理加载/成功/失败状态
```

---

## 阶段四：质量保障 — 用 Skills 建立自动化防线

### 🎯 对应 Skills

| Skill | 作用 | 什么时候用 |
|-------|------|-----------|
| `systematic-debugging` | 四阶段系统化调试 | 遇到 Bug 时 |
| `code-review` | 对抗性代码审查 | 功能完成后 |
| `TDD` | 测试驱动开发 | 编码阶段同步进行 |

### 🐛 systematic-debugging：告别"碰运气式修 Bug"

这是 Superpowers 工作流中我认为**最有价值**的一个 Skill。

没有这个 Skill 时，AI 修 Bug 的方式是：

```
遇到报错
  → 猜一个原因
  → 改一下试试
  → 没修好？再猜一个
  → 反复折腾 N 轮
  → 终于蒙对了（或者越改越烂）
```

有了 `systematic-debugging` Skill，AI 被强制按以下流程排查：

```
Phase 1: 假设生成
  ├── 根据症状列出所有可能原因
  ├── 按概率排序
  └── 输出假设列表

Phase 2: 信息收集
  ├── 针对每个假设收集证据
  ├── 读取相关代码
  ├── 检查日志和报错信息
  └── 缩小嫌疑范围

Phase 3: 根因定位
  ├── 用证据排除不成立的假设
  ├── 锁定根本原因
  └── 解释为什么是这个原因

Phase 4: 精准修复
  ├── 只修改造成问题的代码
  ├── 不动无关代码
  ├── 运行测试验证修复
  └── 确认无回归
```

> 🎯 **一个数据**：使用 systematic-debugging 后，Bug 修复的平均轮数从 5-8 轮降到 1-2 轮。因为它不猜——它排查。

### 🔍 code-review：AI 审查 AI 的代码

code-review Skill 的独特之处在于——它让 AI 以**审查者**而非**编写者**的视角重新审视自己写的代码。

审查清单通常包括：

```markdown
## Code Review Checklist

### 架构合规
- [ ] 是否遵循 Feature-First 目录结构？
- [ ] Domain 层是否有对 Data 层的直接依赖？（不应该有）
- [ ] 新增的 Provider 是否使用了 @riverpod 注解？

### 代码质量
- [ ] 是否有超过 300 行的文件？
- [ ] 是否有超过 50 行的函数？
- [ ] 错误处理是否完整（没有空的 catch 块）？

### 安全性
- [ ] 是否有硬编码的密钥或密码？
- [ ] 用户输入是否做了校验？
- [ ] API 调用是否有超时和重试？

### 性能
- [ ] 列表是否使用了延迟加载？
- [ ] 是否有不必要的 State 重建？
- [ ] 图片是否有缓存机制？
```

### 🧪 TDD Skill：先写测试，再写实现

TDD Skill 的核心规则很简单：

> **不能给没有失败测试的功能写代码。**

```
正确的开发节奏（有 TDD Skill）：

1. 写一个测试 → ❌ 测试失败（因为功能还没实现）
2. 写最少的代码让测试通过 → ✅ 测试通过
3. 重构代码，保持测试通过 → ✅ 测试仍然通过
4. 重复 1-3

错误的开发节奏（没有 TDD Skill）：

1. 写一大堆代码
2. 跑一下，不报错就算完成
3. 上线后 Bug 铺天盖地
```

---

## 阶段五：交付上线 — 最后一公里的 Skills

### 🎯 对应 Skills

| Skill | 作用 | 什么时候用 |
|-------|------|-----------|
| `verification-before-completion` | 完成前全面验证 | 任务结束前 |
| CI/CD Skills | 自动化部署流水线 | 准备上线时 |

### ✅ verification-before-completion：最后的守门员

这个 Skill 在你说"完成了"之前自动触发。AI 会执行一份最终验收清单：

```
🔍 最终验证清单

□ 编译检查
  ├── dart analyze 无错误
  ├── 无未解决的 warning
  └── 无未使用的 import

□ 测试检查
  ├── 所有测试通过
  ├── 新功能有对应测试
  └── 无回归失败

□ 功能完整性
  ├── PRD 中列出的所有功能是否实现
  ├── 边界场景是否处理
  └── 错误状态是否有 UI 反馈

□ 代码质量
  ├── 命名规范一致
  ├── 文件组织符合架构要求
  └── 无硬编码的魔法数字

□ 文档更新
  ├── README 是否更新
  ├── 路由表是否更新
  └── 数据模型变更是否记录
```

> 💡 **没有这个 Skill 的后果**：AI 说"我已经完成了所有修改"，你信了，结果上线后发现——路由没注册、导入没加、测试没跑。这种"虎头蛇尾"的问题，verification Skill 专治。

---

## 实战编排：一个产品的完整 Skills 工作流

把以上所有 Skills 串起来，一个完整的产品开发流程长这样：

```
                    ┌─────────────────────────┐
                    │   你（产品 + 决策者）     │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │   using-superpowers      │
                    │  （技能调度中心）          │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼───────┐    ┌─────────▼─────────┐   ┌────────▼────────┐
│ brainstorming │    │   writing-plans    │   │ executing-plans │
│  需求讨论      │ →  │   计划编写         │ →  │  分阶段执行     │
└───────────────┘    └───────────────────┘   └────────┬────────┘
                                                      │
                              ┌────────────────────────┤
                              │                        │
                    ┌─────────▼──────────┐   ┌────────▼────────┐
                    │   框架 Skills       │   │  coding-style   │
                    │ flutter/react/vue  │   │    编码规范      │
                    └─────────┬──────────┘   └────────┬────────┘
                              │                        │
                              └──────────┬─────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
          ┌─────────▼──────┐   ┌────────▼───────┐  ┌────────▼───────┐
          │ code-review    │   │ systematic-    │  │     TDD        │
          │  代码审查       │   │ debugging      │  │  测试驱动      │
          │                │   │  系统调试       │  │                │
          └────────────────┘   └────────────────┘  └────────────────┘
                                         │
                              ┌──────────▼──────────┐
                              │   verification-     │
                              │ before-completion   │
                              │    最终验证          │
                              └──────────┬──────────┘
                                         │
                                    ✅ 交付
```

### 时间线实例

以一个中型 App（5-8 个核心功能）为例：

| 天数 | 活动 | 使用的 Skills |
|------|------|-------------|
| Day 1 上午 | 需求讨论和功能规划 | `brainstorming` |
| Day 1 下午 | 生成 PRD 和实施计划 | `writing-plans` |
| Day 2 | 项目初始化 + 基础设施 | `executing-plans` + `architecture` + `coding-style` |
| Day 3-4 | 核心功能开发（Feature A/B/C） | `executing-plans` + 框架 Skills |
| Day 5 | 辅助功能开发 + 联调 | `executing-plans` + `systematic-debugging` |
| Day 6 | 代码审查 + Bug 修复 | `code-review` + `systematic-debugging` |
| Day 7 | 最终验证 + 打磨 + 上线 | `verification-before-completion` |

**传统团队完成同样体量的工作需要 3-4 周。**

---

## Skills 编排的进阶技巧

### 技巧一：用 AGENTS.md 做全局调度

在项目根目录放一个 `AGENTS.md`，定义 Skills 的触发优先级：

```markdown
# 项目级 AI 指令

## Skills 按需加载规则

| 用户请求包含                             | 读取技能                       |
| ---------------------------------------- | ------------------------------ |
| "新功能"、"实现"、"添加"、"创建"、"构建" | brainstorming                  |
| "bug"、"问题"、"报错"、"失败"、"不工作"  | systematic-debugging           |
| "审查"、"review"、"检查代码"             | code-review                    |
| "完成了"、"做好了"、"实现完了"           | verification-before-completion |

## 技能优先级
1. 流程技能优先（brainstorming, systematic-debugging）
2. 实现技能其次（framework skills, code-review）
```

这样 AI 就知道**什么时候该用什么 Skill**，不会乱糊。

### 技巧二：用参考实现做"教学"

规则是抽象的，示例是具体的。在每个框架 Skill 中加入**一个完整的参考模块**：

```markdown
## 参考实现
请严格参考 `lib/features/auth/` 模块的代码结构和编码风格。

新功能的文件组织、命名方式、状态管理模式、错误处理方式
都应与 auth 模块保持一致。
```

AI 看到一个活生生的例子，远比看 10 页规则文档更有效。

### 技巧三：定期"升级" Skills

Skills 不是写完就不管了。每当你发现 AI 犯了一个"本不该犯的错"，就问自己：

> "我的 Skills 里缺了什么规则，导致它犯了这个错？"

然后补上这条规则。这是一个**持续优化的飞轮**：

```
AI 犯错
  → 分析根因
  → 补充 Skill 规则
  → AI 不再犯同样的错
  → AI 犯新的错
  → 继续补充...
  → Skills 越来越完善
  → AI 表现越来越好
```

### 技巧四：组合 Skills 套装

不同类型的产品，需要不同的 Skills 组合。把常用组合固化下来：

| 产品类型 | Skills 套装 |
|---------|------------|
| Flutter App | `superpowers` + `flutter-riverpod-arch` + `coding-style` |
| Next.js Web | `superpowers` + `nextjs-expert` + `tailwind-mastery` |
| 小程序 | `superpowers` + `taro-vue3` + `miniprogram-best-practice` |
| 全栈项目 | `superpowers` + 前端 Skill + `nestjs-enterprise` + `docker-expert` |

---

## 常见问题

### Q1：Skills 会不会消耗太多上下文窗口？

不会。好的 Skills 系统采用**按需加载**机制。AI 只在检测到相关触发词时才加载对应 Skill 的完整内容。平时只扫描 YAML 头信息（约 100 tokens）。

### Q2：我的项目已经做了一半了，现在加 Skills 有用吗？

有用。Skills 对增量开发同样有效。你可以：
1. 先写 `architecture` Skill，把已有代码的架构规则固化下来
2. 再写 `coding-style` Skill，统一后续新代码的风格
3. 已有的不规范代码，可以后续用 `code-review` Skill 逐步重构

### Q3：不同 AI 工具的 Skills 能通用吗？

`SKILL.md` 格式正在成为跨平台的开放标准。同一套 Skills 可以在 Cursor、Claude Code、Gemini CLI / Antigravity 中复用。具体的加载位置略有不同，但核心内容通用。

### Q4：如何判断一个 Skill 写得好不好？

三个标准：
1. **触发准确**：description 写得够精确，该触发时触发、不该触发不干扰
2. **规则明确**：指令具体到 AI 不需要"猜"你的意思
3. **有参考实现**：给了具体的代码示例或模板，而非只有抽象描述

### Q5：我自己不会写 Skills 怎么办？

不用自己从零写。起步路径：
1. **先用社区 Skills**：Superpowers 开箱即用，覆盖 80% 的开发工作流需求
2. **在社区基础上定制**：复制一份，改成适合你项目的版本
3. **逐步积累**：每次 AI 犯错，加一条规则。半年后你就有了一套非常完善的个人 Skills 库

---

## 写在最后

Skills 不是什么高深的黑科技。它的本质就是**把你的经验和规矩翻译成 AI 能理解的格式**。

一个有经验的开发者，脑子里早已有了一套完整的开发规范：
- 代码怎么组织
- 错误怎么处理
- Bug 怎么排查
- 交付前检查什么

Skills 做的事情，就是把这些**隐性知识显性化**，让 AI 也能按照同样的标准工作。

一旦你的 Skills 体系建立起来，你会发现一个有趣的变化：

> **你花在"写代码"上的时间越来越少，花在"设计规则"上的时间越来越多。而产品的产出速度和质量，反而比以前更高了。**

这就是从"程序员"到"AI 工程师"的转变——你管理的不是代码，而是生成代码的系统。

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发。Bye~

---

**标签**：`#AI编程` `#Skills` `#产品开发` `#VibeCoding` `#工作流`

---

*📝 作者：NIHoa ｜ 系列：程序人生 ｜ 更新日期：2026-03-24*
