---
date: 2025-04-15
tags:
  - AI编程
  - GStack
  - Claude Code
cover: /covers/cover-gstack-03-review.webp
---
# GStack 实战指南 | 第3期 - 对抗性审查：深入探索 `/review` 代码深度审计防线

> 🛡️ 很多初学者误以为大模型生成的代码是完美的。资深开发者知道，AI 生成的代码往往充满了"看起来很对"的隐患。在代码合入主干前，`/review` 是你必须要过的一道鬼门关。

---

## 什么是"对抗性审查"？

### 普通审查 vs 对抗性审查

如果你用普通提示词让 AI 审查代码：

> "帮我看看这段代码有没有 Bug？"

AI 通常回答："这段代码看起来很好，只是一些语法可以优化……" 这是 **讨好型人格** 的回复，毫无价值。

GStack 的 `/review` 完全不同。它的系统设定是：

> **假设这批代码对安全性、扩展性和业务鲁棒性有直接威胁。你的任务是找出每一个潜在的问题，不放过任何角落。**

| 维度 | 普通 Code Review | GStack `/review` |
|:---:|:---:|:---:|
| 态度 | 友善、鼓励 | 严厉、挑刺 |
| 关注点 | 语法风格 | 安全、性能、鲁棒性 |
| 输出格式 | 随意建议 | 结构化报告（致命/警告/建议） |
| 上下文 | 只看当前代码 | 结合架构方案对比 |
| 是否自动修复 | ❌ | ✅ 可直接生成 Diff 补丁 |

---

## `/review` 的工作原理

当你在 Claude Code 中输入 `/review` 时，GStack 背后的工作流是：

```
┌──────────────────────────────────────────────────────┐
│                   /review 触发                        │
└──────────────────┬───────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────────────┐
│ Step 1: 获取 Git Diff                                 │
│ 读取未提交（unstaged/staged）或未合并分支的变更        │
│ → 只关注你刚刚修改的部分，不看无关文件                 │
└──────────────────┬───────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────────────┐
│ Step 2: 加载架构上下文                                 │
│ 回溯 /plan-eng-review 阶段的工程规约和约定             │
│ → 检查代码是否偏离了原始架构方向                       │
└──────────────────┬───────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────────────┐
│ Step 3: 深度扫描                                      │
│ ▪️ 安全漏洞（XSS、注入、信息泄露）                      │
│ ▪️ 性能隐患（N+1 查询、内存泄漏、无节流）               │
│ ▪️ 代码坏味道（魔法数字、过度嵌套、职责不清）           │
│ ▪️ 架构偏离（不符合 eng-review 的约定）                 │
└──────────────────┬───────────────────────────────────┘
                   ↓
┌──────────────────────────────────────────────────────┐
│ Step 4: 生成结构化报告                                 │
│ 分为【🚨 致命问题】【⚠️ 警告】【💡 建议】三级         │
│ → 每个问题附带定位、原因分析和修复方案                 │
└──────────────────────────────────────────────────────┘
```

---

## 实战演示：一次完整的 Review 流程

### 场景设定

你正在开发一个博客系统的评论功能，刚写完了评论输入框和提交逻辑：

```bash
/review 请检查刚才添加的评论模块代码。
```

### AI 生成的审计报告

```markdown
# 📋 代码审计报告

审查范围：src/components/CommentBox.tsx, src/api/comments.ts
关联架构文档：docs/eng-review-v1.md

---

## 🚨 致命问题（必须修复）

### [CRITICAL-01] XSS 注入漏洞
📍 位置：`CommentBox.tsx:42`
```tsx
// ❌ 危险：直接用 dangerouslySetInnerHTML 渲染用户输入
<div dangerouslySetInnerHTML={{ __html: comment.content }} />
```

**风险**：攻击者可以提交 `<script>alert('xss')</script>` 作为评论内容，
窃取其他用户的 Cookie。

**修复方案**：
```tsx
// ✅ 使用 DOMPurify 消毒后再渲染，或直接用纯文本
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(comment.content)
}} />

// ✅ 更好的做法：如果不需要富文本，直接用 textContent
<p>{comment.content}</p>
```

### [CRITICAL-02] 内存泄漏
📍 位置：`CommentBox.tsx:18-25`
```tsx
// ❌ useEffect 监听了滚动事件但没有清理
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
}, []);
```

**修复方案**：
```tsx
// ✅ 返回清理函数
useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

## ⚠️ 警告（强烈建议修复）

### [WARN-01] N+1 查询问题
📍 位置：`comments.ts:31`
```ts
// ❌ 循环内逐条查询用户信息
for (const comment of comments) {
  comment.author = await db.users.findById(comment.userId);
}
```

**影响**：当评论达到 100+ 条时，将产生 100+ 次数据库查询，
响应时间从 50ms 飙升到 5000ms+。

**修复方案**：
```ts
// ✅ 批量查询，一次搞定
const userIds = [...new Set(comments.map(c => c.userId))];
const users = await db.users.findByIds(userIds);
const userMap = new Map(users.map(u => [u.id, u]));

for (const comment of comments) {
  comment.author = userMap.get(comment.userId);
}
```

### [WARN-02] 无输入防抖
📍 位置：`CommentBox.tsx:35`

提交按钮没有任何防重复点击处理。用户连续快速点击会发送多条重复评论。
建议添加 `loading` 状态锁或使用 `useDebouncedCallback`。

---

## 💡 建议（非必须但推荐）

### [INFO-01] 魔法数字
```tsx
// ⚠️ 200 是什么含义？
if (comment.content.length > 200) { ... }

// ✅ 建议抽取为常量
const MAX_COMMENT_LENGTH = 200;
```

### [INFO-02] 缺少乐观更新
当前的评论提交是先等接口返回再更新 UI，用户体验较差。
建议采用乐观更新策略：先在本地列表中展示新评论，接口失败时再回滚。

---

📊 **总计**：2 个致命问题 | 2 个警告 | 2 条建议
🔧 **是否需要我自动生成修复补丁？** 输入 `yes` 即可。
```

当你输入 `yes` 后，Claude Code 会直接修改你的源代码文件，应用上述所有修复。

---

## 审查维度清单

`/review` 会从以下 8 个维度扫描你的代码：

| 维度 | 检查内容 | 典型问题 |
|:---|:---|:---|
| 🔒 安全性 | XSS、SQL 注入、敏感信息泄露 | 用户输入未消毒 |
| ⚡ 性能 | N+1 查询、内存泄漏、大对象拷贝 | 循环内 await |
| 🏗️ 架构合规 | 是否符合 eng-review 方案 | 组件职责越界 |
| 🧹 代码质量 | 魔法数字、过度嵌套、重复代码 | 硬编码常量 |
| 🧪 可测试性 | 依赖注入、纯函数、Mock 友好 | 直接耦合外部服务 |
| 📦 依赖管理 | 多余依赖、版本冲突 | 引入了没用的包 |
| ♿ 无障碍 | ARIA 标签、键盘导航 | 按钮缺少 aria-label |
| 📱 响应式 | 移动端适配、触控区域 | 按钮点击区域过小 |

---

## 最佳实践：把 Review 编织进提交习惯

**❌ 错误做法**：功能全部做完，写了 1000 行再跑 `/review`。此时隐患盘根错节，AI 都无法准确追溯根因。

**✅ 正确做法**：每完成一个功能的最小闭环（1-2 小时的工作量），立刻执行 `/review`。

推荐的提交节奏：

```
编写数据层接口（1h）→ git add → /review → 修复 → git commit
    ↓
编写 UI 组件（1h）→ git add → /review → 修复 → git commit
    ↓
联调前后端（30min）→ git add → /review → 修复 → git commit
    ↓
/qa 端到端验收 → /ship 发版
```

这就像一位 **不会累、不会偷懒的 Senior 开发**，在你背后时刻守护着代码底线。

---

## 小结

▪️ `/review` 不是普通的代码检查，而是 **对抗性审计**——假设你的代码有问题
▪️ 它会结合 Git Diff 和架构文档进行 **上下文感知** 的深度扫描
▪️ 输出结构化的三级报告：致命 → 警告 → 建议，并可自动生成修复补丁
▪️ 最佳实践是 **小步提交、频繁审查**，不要攒到最后一起审

在下一篇文章中，我们将进入让许多开发者惊叹的环节：**让 AI 亲自打开浏览器"点点看"——`/qa` 自动化端到端测试。**

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 系列：GStack实战指南系列 ｜ 更新日期：2025-04-15*
