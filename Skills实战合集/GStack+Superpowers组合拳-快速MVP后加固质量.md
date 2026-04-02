---
date: 2025-05-04
tags:
  - AI编程
  - Skills实战
  - GStack
  - Superpowers
cover: /covers/cover-skills-practice-combo.webp
---
# GStack + Superpowers 组合拳 — 快速 MVP 后加固质量

> 🥊 GStack 速度快但管不住质量，Superpowers 质量高但启动慢。把它们组合起来呢？**GStack 砍需求定架构，Superpowers 保质量做交付**——这才是最强组合。

---

## 🎯 场景与挑战

你要在一周内为公司做一个**内部工具**：员工日报生成器。需求方给了一堆要求：

```
原始需求清单（老板版）：
1. 员工登录系统
2. RSS 新闻源管理
3. AI 自动生成中文摘要
4. 日报排版页面
5. 邮件推送日报
6. 微信推送日报
7. 数据分析仪表盘
8. 多语言支持
9. 移动端适配
10. 暗黑模式
```

**挑战**：10 个功能，一周时间，一个人。

- 如果只用 GStack：快但容易写出没测试的代码
- 如果只用 Superpowers：质量高但 brainstorming 一个个问下来太慢
- 组合使用：**GStack 负责快速砍需求、定架构、QA 验收、一键发版；Superpowers 负责 TDD 编码和质量保障**

---

## 🧰 Skills 组合

| 阶段 | 谁主导 | Skills | 做什么 |
|:---:|:---:|:---|:---|
| 需求砍削 | **GStack** | `/plan-ceo-review` | 10 → 4 个功能 |
| 架构规划 | **GStack** | `/plan-eng-review` | 项目结构、数据库、API 设计 |
| 设计深化 | **Superpowers** | `brainstorming` | 技术细节确认 |
| 编码执行 | **Superpowers** | `TDD` + `subagent` | 先测试后写代码 |
| 代码审查 | **GStack** | `/review` | 对抗性代码审计 |
| QA 验收 | **GStack** | `/qa` | AI 操控浏览器做端到端测试 |
| 一键发版 | **GStack** | `/ship` | 规范 Commit + PR |

```
GStack 领地               Superpowers 领地              GStack 领地
┌──────────┐    ┌─────────────────────────┐    ┌──────────────┐
│ CEO 砍需求 │ →  │ brainstorming 深化设计    │ →  │ /review 审查  │
│ Eng 定架构 │    │ TDD + subagent 编码      │    │ /qa 验收     │
└──────────┘    └─────────────────────────┘    │ /ship 发版   │
                                                └──────────────┘
```

---

## 🛠️ 实战过程

### Phase 1：GStack `/plan-ceo-review` — 5 分钟砍掉 60% 需求

```
你: /plan-ceo-review
   我要做一个员工日报生成器，功能清单如下：
   1. 员工登录系统...（10 个功能）
   一周时间，一个人开发。
```

**CEO 判决**：

```markdown
## CEO 评审报告

✅ 通过（核心功能）：
- RSS 源管理
- AI 摘要生成
- 日报排版页面

❌ 拒绝：
- 登录系统 → 内部工具，先做单用户
- 邮件推送 → SMTP 配置复杂，后续迭代
- 微信推送 → 需要公众号资质，周期太长
- 数据分析 → 没有数据就没有分析，先有功能
- 多语言 → 内部员工都说中文
- 移动端 → 内部工具用电脑就够了

⚠️ 有条件通过：
- 暗黑模式 → Tailwind dark: 零成本，但优先级最低

MVP 定义：一个单用户的 RSS 聚合工具，AI 生成中文摘要，日报排版展示。
```

> **3 个功能**。这就是你这一周应该做的全部。

### Phase 2：GStack `/plan-eng-review` — 10 分钟定架构

```
你: /plan-eng-review
   根据 CEO 通过的 3 个功能，规划技术架构。
   技术栈：Next.js + Tailwind + Supabase + OpenAI。
```

**Tech Lead 输出**：项目结构、数据库设计、API 接口定义、防坑警告（RSS 解析兼容 Atom、OpenAI 需设 30s 超时、去重用 UNIQUE 约束）。

### Phase 3：Superpowers brainstorming — 深化技术细节

GStack 给出的架构是"骨架"，Superpowers 的 `brainstorming` 负责"填肉"：

```
AI: 关于 AI 摘要生成，有一个细节需要确认：
    当 RSS 源的文章是英文时，摘要应该：
    
    A) 直接生成中文摘要（翻译 + 摘要一步完成）
    B) 先翻译标题，再生成摘要（两步分离）
    
    推荐 A：一次 API 调用完成，省 Token，响应更快。

你: A，同意。
```

```
AI: 日报页面的刷新策略：
    
    A) 手动点击"生成今日日报"按钮
    B) 定时自动生成（Vercel Cron, 每天早 8 点）
    C) 两者都支持
    
    MVP 推荐 A：零配置，先验证 AI 摘要质量。

你: A。
```

2 轮快速确认，进入编码：

### Phase 4：Superpowers TDD + subagent — 高质量编码

这里是与纯 GStack 最大的不同——**不是一口气写完所有代码**，而是每个模块都遵循 TDD：

```
🤖 [SubAgent] 派出子代理执行 Task 1（RSS 解析器）

  🔴 写测试：解析 RSS 2.0 格式
  🟢 实现 RSS 解析器
  🔴 写测试：解析 Atom 格式
  🟢 实现 Atom 兼容
  🔴 写测试：解析失败返回空数组
  🟢 实现错误处理
  
  ✅ 3 个测试通过，模块完成

🤖 [SubAgent] 派出子代理执行 Task 2（AI 摘要生成器）

  🔴 写测试：英文文章生成中文摘要
  🟢 实现 OpenAI 调用
  🔴 写测试：API 超时 fallback 为原始标题
  🟢 实现超时处理和 fallback
  
  ✅ 2 个测试通过，模块完成

🤖 [SubAgent] 派出子代理执行 Task 3（日报页面）

  🔴 写测试：页面渲染日报卡片列表
  🟢 实现 DigestCard 组件和页面
  
  ✅ 1 个测试通过，模块完成
```

三个子代理，6 个测试，全部绿色。

### Phase 5：GStack `/review` — 对抗性审查

```
你: /review 请检查刚完成的 RSS 解析器、AI 摘要生成器和日报页面。
```

```markdown
## 审计结果：1 个警告 + 1 个建议

⚠️ [WARN-01] AI 调用缺少重试机制
   OpenAI API 偶尔返回 429。建议添加指数退避重试。

💡 [INFO-01] DigestCard 缺少 aria-label
   建议添加无障碍访问支持。
```

**修复 WARN-01 后继续。**

### Phase 6：GStack `/qa` — AI 验收

```
你: /qa 打开 http://localhost:3000，执行以下测试：
   1. 首页日报列表正常渲染
   2. 添加 RSS 源 "Hacker News"
   3. 点击"手动抓取"
   4. 刷新后检查日报卡片是否出现
```

```
QA 报告：4/4 ✅ 全部通过
```

### Phase 7：GStack `/ship` — 一键发版

```
你: /ship 日报生成器 MVP 完成
```

```
✅ Commit: feat(digest): implement AI-powered daily digest MVP
✅ PR #12 已创建
```

---

## 📊 效果对比

| 维度 | 纯 GStack | 纯 Superpowers | **GStack + Superpowers** |
|:---:|:---|:---|:---|
| 需求精简 | ✅ CEO 砍需求 | ❌ 得自己判断 | ✅ **GStack 砍** |
| 架构规划 | ✅ Eng 评审 | ❌ 得自己规划 | ✅ **GStack 规划** |
| 编码质量 | ⚠️ 没有测试 | ✅ TDD 铁律 | ✅ **Superpowers TDD** |
| 代码审查 | ✅ /review | ✅ 子代理双审 | ✅ **两者都有** |
| QA 验收 | ✅ /qa 浏览器 | ❌ 靠跑测试 | ✅ **GStack /qa** |
| 发版体验 | ✅ /ship 一键 | ⚠️ 手动流程 | ✅ **GStack /ship** |
| 总耗时 | ~2 小时 | ~3 小时 | **~2.5 小时** |
| 测试覆盖 | 0 个 | 6 个 | **6 个** |

---

## 💡 实战心得

### 1. 各取所长，不要"二选一"

GStack 擅长**流程管理**（砍需求、定架构、审查、发版），Superpowers 擅长**编码纪律**（TDD、调试、验证）。组合起来覆盖了从产品到工程的全链路。

### 2. 切换点在"设计完成"

**GStack 负责宏观**（砍什么功能、架构长什么样）→ **设计确认后切换到 Superpowers**（怎么写代码） → **代码完成后切回 GStack**（审查、QA、发版）。

### 3. 适用场景

| 场景 | 推荐方案 |
|:---:|:---|
| 黑客松 / 极速 MVP | GStack 单独（追求速度） |
| 长期维护的项目 | Superpowers 单独（追求质量） |
| **一周交付的正式项目** | **GStack + Superpowers（速度 + 质量）** |

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 更新日期：2025-05-04*
