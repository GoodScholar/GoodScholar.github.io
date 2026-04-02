---
date: 2025-05-02
tags:
  - AI编程
  - Skills实战
  - Superpowers
  - debugging
  - TDD
cover: /covers/cover-skills-practice-debug.webp
---
# 生产 Bug 排查实录 — systematic-debugging 四阶段根因追踪

> 🔍 "改一下试试看？" —— 如果你正在这么做，请立刻停下来。这篇文章用一个**真实的 API 偶发超时 Bug**，完整演示 `systematic-debugging` 的四阶段调试协议如何在 15 分钟内定位根因。

---

## 🎯 场景与挑战

你维护一个博客系统的后端 API。周五下午，监控告警响了：

```
⚠️ POST /api/articles 接口偶发 504 超时
   - 过去 1 小时内出现 5 次
   - 大部分请求正常（200ms 内返回）
   - 超时请求耗时 30s+
```

**你的第一反应是什么？**

```
❌ 大多数人的反应：
   "可能是数据库慢了？加个索引试试。"
   "Redis 缓存是不是挂了？重启一下。"
   "应该是网络问题吧？等一会看看。"
```

这些都是**猜测式修复**——改一个东西试试看，不行再换一个。Superpowers 的 `systematic-debugging` 对此有一条铁律：

> **没有完成根因调查，不允许提出任何修复方案。**

---

## 🧰 Skills 组合

| Skill | 职责 | 用在哪 |
|:---:|:---|:---|
| 🔍 `systematic-debugging` | 四阶段调试主流程 | 从症状到根因的系统化追踪 |
| 🔴 `test-driven-development` | 修 Bug 前先写失败测试 | 确保修复有效且不回归 |

```
工作流：
systematic-debugging（找到根因）→ TDD（写失败测试复现 Bug）→ 修复 → 验证
```

---

## 🛠️ 实战过程

### Phase 1：根因调查 — 先看证据，不要猜

AI 激活 `systematic-debugging` 后，严格按照以下 5 步执行：

#### 1️⃣ 仔细阅读错误日志

```bash
# 查看最近的超时请求日志
[18:32:04] POST /api/articles 200 - 120ms
[18:32:15] POST /api/articles 200 - 98ms
[18:32:28] POST /api/articles 504 - 30001ms   ← 超时！
[18:32:45] POST /api/articles 200 - 135ms
[18:33:12] POST /api/articles 504 - 30002ms   ← 又超时！
[18:33:30] POST /api/articles 200 - 110ms
```

**信息提取**：
- 不是所有请求都超时，是**偶发的**
- 超时时间精确是 30s（说明是超时限制被触发，不是网络抖动）
- 超时请求之间没有规律性的时间间隔

#### 2️⃣ 检查最近变更

```bash
$ git log --oneline -5
abc1234 feat: add AI summary generation on article create    ← 3天前
def5678 fix: correct article date format
ghi9012 chore: update dependencies
jkl3456 feat: add article categories
mno7890 fix: pagination offset bug
```

**可疑点**：`abc1234` 在创建文章时新增了 AI 摘要生成功能。时间线吻合——告警是这周才开始出现的。

#### 3️⃣ 稳定复现

```bash
# 尝试创建一篇短文章
curl -X POST /api/articles -d '{"title":"Test","content":"Hello"}' 
# → 200 OK, 130ms ✅

# 尝试创建一篇长文章（5000+ 字符）
curl -X POST /api/articles -d @long-article.json
# → 504 Timeout, 30001ms ❌  ← 复现了！

# 再试一次短文章
curl -X POST /api/articles -d '{"title":"Test2","content":"Short"}' 
# → 200 OK, 95ms ✅
```

**关键发现**：长文章稳定超时，短文章一直正常。

#### 4️⃣ 分层诊断日志

在 API 路由中添加计时点，精确定位哪一层慢：

```typescript
// 在 API 路由中添加分层计时
console.time('total');

console.time('db-insert');
await db.articles.create(data);
console.timeEnd('db-insert');

console.time('ai-summary');
const summary = await generateSummary(data.title, data.content);
console.timeEnd('ai-summary');

console.time('db-update');
await db.articles.update(id, { summary });
console.timeEnd('db-update');

console.timeEnd('total');
```

**用长文章触发一次超时后，看日志**：
```
db-insert: 45ms
ai-summary: 29850ms    ← 罪魁祸首！
db-update: --           ← 没执行到（已超时）
total: 29901ms
```

**铁证**：AI 摘要生成耗时 29.8 秒，几乎吃掉了全部 30 秒超时。

#### 5️⃣ 追踪数据流

```markdown
发文请求 → 数据库插入（45ms）→ AI 摘要生成（29850ms！）→ 超时

追溯 generateSummary() 的调用链：
→ 它把 data.content 完整发送给 OpenAI API
→ 长文章内容 5000+ 字符
→ OpenAI 处理长文本时间急剧增长
```

**根因确认**：`generateSummary()` 没有截取内容长度，把完整的文章内容发给了 OpenAI。短文章没问题，长文章直接触发超时。

---

### Phase 2：模式分析 — 找到问题的"形状"

```markdown
正常请求：文章内容 < 1000 字符 → AI 生成 100-500ms → 总耗时 200ms 内
超时请求：文章内容 > 3000 字符 → AI 生成 15-30s → 总耗时超过 30s

关键变量：文章内容长度
阈值：约 3000 字符以上开始出现显著延迟
```

---

### Phase 3：假设与验证 — 科学方法

```markdown
假设：将发送给 OpenAI 的内容限制在前 1000 字符，
     可以让所有请求在 30s 内完成。

验证方式：只修改一处代码，用长文章测试。
```

**最小验证**：
```typescript
// 只改一行
const truncatedContent = data.content?.slice(0, 1000);
const summary = await generateSummary(data.title, truncatedContent);
```

```bash
# 再次用长文章测试
curl -X POST /api/articles -d @long-article.json
# → 200 OK, 380ms ✅

# 连续测试 5 次长文章
# → 全部 200 OK, 平均 350ms ✅
```

**假设成立！** 进入修复阶段。

---

### Phase 4：实施修复 — TDD 先行

#### 先写失败测试（TDD 铁律！）

```typescript
// tests/article-api.test.ts
test('创建长文章不应该超时', async () => {
  const longContent = 'A'.repeat(5000); // 5000 字符的长文章

  const start = Date.now();
  const result = await createArticle({
    title: '长文章测试',
    content: longContent,
  });
  const duration = Date.now() - start;

  expect(result.status).toBe(200);
  expect(duration).toBeLessThan(10000); // 10s 内完成
  expect(result.data.summary).toBeTruthy(); // 摘要不为空
});
```

#### 实施修复

```typescript
// src/lib/ai.ts
const MAX_CONTENT_LENGTH = 1000;

export async function generateSummary(
  title: string,
  content?: string
) {
  // 截取内容前 1000 字符，避免长文本导致 API 超时
  const truncatedContent = content?.slice(0, MAX_CONTENT_LENGTH);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `请为以下文章生成一句话摘要：\n标题：${title}\n内容：${truncatedContent || '无内容'}`,
    }],
    timeout: 15000, // 额外加一层超时保护
  });

  return response.choices[0]?.message?.content || '暂无摘要';
}
```

#### 验证修复

```bash
$ npm test article-api
PASS: 创建长文章不应该超时 (380ms)
PASS: 创建短文章正常工作 (120ms)
PASS: 空内容文章使用标题生成摘要 (200ms)

Test Suites: 1 passed
Tests:       3 passed
```

✅ **Bug 修复完毕。** 从发现到修复，总耗时 15 分钟。

---

## 📊 效果对比

| 维度 | 猜测式修复 | systematic-debugging |
|:---:|:---|:---|
| 第一步 | "加个索引试试" | **看日志、查变更、分层计时** |
| 定位耗时 | 2-3 小时（试了 3 种错误假设） | **10 分钟** |
| 修复次数 | 改了 4 次 | **一次修复成功** |
| 引入新 Bug | 第 2 次修改误删了缓存逻辑 | **0 个新 Bug** |
| 有没有测试 | 没有 | **写了失败测试再修复** |
| 总耗时 | ~3 小时 | **~15 分钟** |

---

## 💡 实战心得

### 1. "看日志"不是废话，是纪律

90% 的人看到报错后的第一反应是"猜原因"。但如果你强迫自己先花 2 分钟看完完整日志，你会发现答案往往就写在那里。

### 2. 分层计时是调试利器

在多层系统中（前端 → API → 数据库 → 第三方服务），在每一层加 `console.time()` 是最简单有效的定位方式。比你猜测 10 次都准。

### 3. "只改一处"原则

验证假设时，**只改一处代码**。如果同时改了 3 个地方，你不知道是哪个修复起了作用。科学实验的基本原则——控制变量。

### 4. 三次失败就停

Superpowers 有个规则：如果连续 3 次修复都失败了，说明这不是"假设错了"的问题，而是"架构有问题"的信号。必须停下来重新审视。

### 5. 适用场景

`systematic-debugging` 适合：
- ✅ 偶发性 Bug（不稳定复现的最需要系统化方法）
- ✅ 多层系统的性能问题
- ✅ 线上告警排查
- ⚠️ 明显的语法错误不需要四阶段协议（那直接改就好了）

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 更新日期：2025-05-02*
