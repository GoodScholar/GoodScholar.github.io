---
date: 2025-04-23
---
# Superpowers 实战指南 | 第4期 - 系统化调试：四阶段根因追踪，告别碰运气式修 Bug

> 🔍 "我觉得可能是这里的问题，改一下试试？" —— 如果你正在这么做，请立刻停下来。Superpowers 的 `systematic-debugging` 有一条铁律：**没有完成根因调查，不允许提出任何修复方案。**

---

## 为什么"猜测式修 Bug"是灾难？

### 一个真实的调试悲剧

```
你：登录接口报 500 了。
AI：可能是数据库连接超时，我加个重试机制。（修改 1）
你：还是 500。
AI：那可能是 Redis 缓存过期了，清一下缓存。（修改 2）
你：换了个报错，现在是 403 了。
AI：前端的 token 没传对，让我改改。（修改 3）
你：现在登录能用了，但注册又挂了！
AI：呃……
```

**复盘**：3 次修改，引入了 1 个新 Bug，花了 2 小时。而真正的根因其实是——环境变量文件多了一个空行导致数据库 URL 被截断。如果一开始看看日志，5 分钟就解决了。

### 数据说话

Superpowers 团队对调试方式做过统计对比：

| | 系统化调试 | 猜测式修复 |
|:---|:---:|:---:|
| 平均修复时间 | **15-30 分钟** | 2-3 小时 |
| 一次修复成功率 | **95%** | 40% |
| 引入新 Bug 概率 | **约 0%** | 30%+ |

---

## 铁律与红线

### The Iron Law

```
没有完成根因调查 → 不允许提出修复方案
```

### 红旗（出现以下想法请立刻停下）

如果你或 AI 的脑子里出现了以下任何一句话：

```
❌ "快速修一下，以后再查原因"
❌ "试着改改 X 看看行不行"
❌ "多改几处一起测一下"
❌ "跳过测试，我手动验一下"
❌ "我觉得可能是 X，改了再说"
❌ "我不太确定但这个应该能行"
❌ "已经失败 2 次了，再试一次"
```

**所有这些都意味着：停下来。回到 Phase 1。**

---

## 四阶段调试协议

Superpowers 将调试分为 4 个阶段，每个阶段必须完成后才能进入下一个：

### Phase 1: 根因调查

**在尝试任何修复之前，做这 5 件事：**

#### 1️⃣ 仔细阅读错误信息

```markdown
❌ 扫一眼报错就开始改代码
✅ 逐行阅读完整的错误信息和堆栈追踪
```

```bash
# 例子：真正读懂这条报错
TypeError: Cannot read properties of undefined (reading 'map')
    at ArticleList (./src/components/ArticleList.tsx:28:18)
    at renderWithHooks (./node_modules/react-dom/...)
    
# 信息提取：
# - 是 TypeError，不是网络错误
# - undefined 没有 .map 方法
# - 发生在 ArticleList.tsx 第 28 行
# - 这说明某个数组变量是 undefined
```

#### 2️⃣ 稳定复现

```markdown
✅ 能稳定触发 Bug → 继续调查
❌ 不能稳定触发 → 先收集更多数据，不要猜
```

#### 3️⃣ 检查最近变更

```bash
# 查看最近的代码变更
git log --oneline -10

# 查看具体改了什么
git diff HEAD~3

# 思考：这些变更中有什么可能导致这个 Bug？
```

#### 4️⃣ 在多组件系统中收集证据

如果你的系统有多个组件（前端 → API → 数据库），**在每一层添加诊断日志**：

```typescript
// Layer 1: 前端
console.log('=== 前端发送的请求 ===');
console.log('URL:', url);
console.log('Body:', JSON.stringify(body));

// Layer 2: API 路由
console.log('=== API 收到的请求 ===');
console.log('Headers:', req.headers);
console.log('Body:', req.body);

// Layer 3: 数据库查询
console.log('=== 数据库查询 ===');
console.log('SQL:', query);
console.log('Params:', params);
```

**跑一次，看日志。** 它会清楚地告诉你数据在哪一层断了。

#### 5️⃣ 追踪数据流

```markdown
✅ 从报错位置开始，往回追溯：
   谁传了 undefined？→ 那个函数谁调用的？→ 参数从哪来的？
   像侦探查案一样，一路追到源头。

❌ 在报错位置加个 if 判断就完事了（这是治标不治本）
```

---

### Phase 2: 模式分析

找到问题的"形状"：

#### 1️⃣ 寻找正常工作的参照物

```markdown
代码库里有没有类似的功能是好的？
比如 UserList 组件正常工作，但 ArticleList 出错了。
两者有什么区别？
```

#### 2️⃣ 逐项对比差异

```markdown
UserList（正常）：
- 用了 useSWR 获取数据
- 有 loading 状态处理
- 有空数组 fallback

ArticleList（出错）：
- 用了 useEffect + useState
- ❌ 没有 loading 状态处理
- ❌ 没有空数组 fallback  ← 找到了！
```

#### 3️⃣ 理解依赖关系

```markdown
这段代码依赖什么？
- 环境变量？→ 检查是否正确设置
- 外部 API？→ 检查是否可达
- 数据库状态？→ 检查数据是否存在
```

---

### Phase 3: 假设与验证

**科学方法：**

#### 1️⃣ 提出单一假设

```markdown
假设：ArticleList 在 API 数据返回之前就尝试了 .map()，
     因为初始状态是 undefined 而不是空数组 []。

依据：Phase 2 对比中发现缺少空数组 fallback。
```

#### 2️⃣ 做最小验证

```typescript
// 最小修改来验证假设
// 只改一个变量的初始值
const [articles, setArticles] = useState(undefined);
// 改为
const [articles, setArticles] = useState([]);
```

**只改一处！** 不要顺手"优化"其他东西。

#### 3️⃣ 验证结果

```markdown
✅ 改成空数组后不报错了 → 假设成立，进入 Phase 4
❌ 还是报错 → 回到 Phase 1，收集新信息，提出新假设
```

---

### Phase 4: 实施修复

#### 1️⃣ 先写失败测试（对，TDD 又出现了！）

```typescript
test('文章列表在数据加载前不应该崩溃', () => {
  // 模拟 API 还没返回的状态
  render(<ArticleList articles={undefined} />);
  
  // 应该显示加载状态而不是崩溃
  expect(screen.getByText('加载中...')).toBeInTheDocument();
});
```

```bash
$ npm test
FAIL: ArticleList crashes with TypeError
```

✅ 测试失败了——正好重现了这个 Bug。

#### 2️⃣ 修复根因

```typescript
function ArticleList({ articles }: { articles?: Article[] }) {
  if (!articles) {
    return <div>加载中...</div>;
  }
  
  return (
    <ul>
      {articles.map(article => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}
```

#### 3️⃣ 验证修复

```bash
$ npm test
PASS: 所有测试通过
```

✅ Bug 修复完毕，且有测试保障不会回归。

---

## 三次失败保险机制

Superpowers 有一个独特的规则：**如果连续 3 次修复失败，停下来。**

```markdown
第 1 次修复失败 → 回到 Phase 1，重新分析
第 2 次修复失败 → 回到 Phase 1，考虑是否遗漏了什么
第 3 次修复失败 → ⛔ 停下来！

3 次失败意味着：
- 这不是一个"假设错了"的问题
- 这是一个"架构本身有问题"的信号
- 必须与团队讨论架构变更
- 不要尝试第 4 次修复
```

**识别架构问题的信号：**
- 每次修复都暴露出不同位置的新问题
- 修复需要"大规模重构"才能实施
- 每次修复都在其他地方产生副作用

---

## 实战场景：调试一个诡异的 API 超时

### 症状
```
POST /api/articles 偶尔超时（30s），但大部分情况下正常（200ms 内返回）。
```

### Phase 1：根因调查

```bash
# 1. 看日志
[18:32:04] POST /api/articles 200 - 120ms
[18:32:15] POST /api/articles 200 - 98ms
[18:32:28] POST /api/articles 504 - 30001ms  ← 超时！
[18:32:45] POST /api/articles 200 - 135ms

# 2. 检查最近变更
git log --oneline -5
# abc1234 feat: add AI summary generation on article create  ← 可疑！

# 3. 添加分层诊断日志
```

```typescript
// 在 API 路由中添加
console.time('total');
console.time('db-insert');
await db.articles.create(data);
console.timeEnd('db-insert');

console.time('ai-summary');
const summary = await generateSummary(data.title, data.content);
console.timeEnd('ai-summary');
console.timeEnd('total');
```

```bash
# 跑一次超时场景后看日志：
db-insert: 45ms
ai-summary: 29850ms  ← 罪魁祸首！
total: 29901ms
```

### Phase 2：模式分析

```markdown
正常请求：AI 摘要生成 100-500ms
超时请求：AI 摘要生成 29000ms+

区别：超时的文章内容特别长（5000+ 字符）
正常的文章通常在 1000 字以内
```

### Phase 3：假设与验证

```markdown
假设：当文章内容超过 3000 字符时，OpenAI API 处理时间急剧增长，
      导致整个请求超时。

验证：限制发送给 OpenAI 的内容为前 1000 字符。
```

### Phase 4：修复

```typescript
// 修复：截取内容前 1000 字符
const truncatedContent = data.content?.slice(0, 1000);
const summary = await generateSummary(data.title, truncatedContent);
```

✅ 一次修复成功。15 分钟搞定。

---

## 小结

▪️ `systematic-debugging` 的铁律：**没有根因调查就不允许提出修复**
▪️ 四阶段协议：根因调查 → 模式分析 → 假设验证 → 实施修复
▪️ 3 次修复失败 = 架构问题信号，必须停下来讨论
▪️ 系统化调试 15 分钟解决的问题，猜测式修复可能折腾 3 小时
▪️ 修 Bug 也要 TDD：先写失败测试复现 Bug，再修复

在下一篇文章中，我们将探索 Superpowers 最前沿的执行引擎：**`subagent-driven-development` 子代理驱动开发——AI 管理 AI 写代码的全新范式。**

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 系列：Superpowers实战指南系列 ｜ 更新日期：2025-04-23*
