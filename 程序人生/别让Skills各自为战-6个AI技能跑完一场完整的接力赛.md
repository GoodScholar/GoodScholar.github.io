---
date: 2026-04-04
tags:
  - AI编程
  - Skills
  - Superpowers
  - 工程化
  - 全生命周期
cover: /covers/cover-skills-relay-race.webp
---
# 别让 Skills 各自为战 — 6 个 AI 技能跑完一场完整的接力赛

> 🏃 你有 brainstorming，有 TDD，有 debugging，有 code-review……单个都很强。但你有没有想过：**它们从来没有在同一个需求里，从头到尾接力跑完一整场比赛？**

---

## 你可能正在经历的事

你学会了 Superpowers 的各种 Skills。brainstorming 聊过了，TDD 练过了，debugging 用过了。每个都体验了一遍，感觉不错。

但当一个真实需求落到你手上——

```
PM: "给后台系统加一个操作日志模块。
     要求：记录关键操作、支持筛选搜索、有详情弹窗、管理员可导出。"
```

你打开终端，对 AI 说了一句话，接下来……

```
你的实际工作流：
1. 让 AI 直接写代码（跳过了 brainstorming）
2. 写到一半发现需求没想清楚，返工
3. 写完了没有测试，手动点了几下"看起来没问题"
4. 上线后发现一个 Bug，随手改了改
5. 同事 Review 时发现了 3 个问题
6. 又改了一圈，终于合并
```

**你拥有 6 把好刀，但只用了 1 把在砍柴。其余 5 把生锈了。**

> **Skills 的真正威力不在于单个有多强，而在于它们能不能像接力赛一样，一棒接一棒地把需求从"想法"跑到"交付"。**

---

## 🔍 1. 全景图：6 个 Skills 的接力赛道

先看一张全景图，理解在一个需求的**完整生命周期**中，每个 Skill 负责跑哪一棒：

```
需求进来
   ↓
┌─ 第 1 棒：brainstorming ─────────── 想清楚 ──────────┐
│  "做什么、不做什么、技术方案怎么选"                     │
└───────────────────────────────────────────────────────┘
   ↓
┌─ 第 2 棒：writing-plans ─────────── 拆清楚 ──────────┐
│  "拆成几个原子任务，每个任务的输入输出是什么"           │
└───────────────────────────────────────────────────────┘
   ↓
┌─ 第 3 棒：TDD + subagent ────────── 做清楚 ──────────┐
│  "先写测试，后写代码，子代理并行执行"                   │
└───────────────────────────────────────────────────────┘
   ↓
┌─ 第 4 棒：systematic-debugging ──── 修清楚 ──────────┐
│  "遇到 Bug 不要猜，四阶段根因追踪"                     │
└───────────────────────────────────────────────────────┘
   ↓
┌─ 第 5 棒：code-review ──────────── 审清楚 ──────────┐
│  "对抗性审查，找出你自己看不到的问题"                   │
└───────────────────────────────────────────────────────┘
   ↓
┌─ 第 6 棒：verification ─────────── 验清楚 ──────────┐
│  "最后一道关卡，确认所有指标达标才允许交付"              │
└───────────────────────────────────────────────────────┘
   ↓
交付完成 ✅
```

| 棒次 | Skill | 一句话职责 | 输出物 |
|:---:|:---:|:---|:---|
| 第 1 棒 | `brainstorming` | 把模糊需求变成清晰设计 | 设计文档 |
| 第 2 棒 | `writing-plans` | 把设计拆成可执行的原子任务 | 任务清单 |
| 第 3 棒 | `TDD` + `subagent` | 先测试后编码，并行执行 | 通过测试的代码 |
| 第 4 棒 | `systematic-debugging` | 系统化排查遇到的问题 | 根因 + 修复 |
| 第 5 棒 | `code-review` | 对抗性审查找隐藏缺陷 | 审计报告 |
| 第 6 棒 | `verification` | 最终验收确认交付质量 | ✅ / ❌ |

> **上一棒的输出，就是下一棒的输入。** 断了任何一棒，后面的质量就无法保障。

---

## 🛠️ 2. 完整实战：操作日志模块全生命周期

我们用一个真实需求，完整走一遍 6 棒接力：

**需求**：给后台管理系统添加操作日志模块。
**技术栈**：Next.js 14 + PostgreSQL + Prisma + Tailwind CSS

---

### 🧠 第 1 棒：brainstorming — 想清楚

你对 AI 说出需求后，AI **不会**直接写代码。它自动激活 `brainstorming`，开始逐个确认关键决策：

```
AI: 操作日志要记录哪些信息？

   A) 仅记录操作类型和时间（轻量级）
   B) 记录操作类型 + 操作人 + 操作对象 + 变更前后值（标准级）
   C) 在 B 的基础上加 IP 地址、设备信息、请求耗时（审计级）

   推荐 B：覆盖了 "谁在什么时候对什么做了什么" 四要素，
   不需要额外采集设备信息的开发成本。C 留到安全合规需要时再迭代。

你: B。
```

```
AI: 日志的存储策略？

   A) 和业务表同库同表
   B) 同库独立表（简单，JOIN 方便）
   C) 独立库（隔离性好，但增加运维成本）

   推荐 B：MVP 阶段没必要拆库。独立表不影响业务表性能，
   且可以直接 JOIN user 表拿操作人信息。

你: B，同意。
```

```
AI: 前端的筛选维度？

   A) 仅按时间范围筛选
   B) 时间范围 + 操作类型 + 操作人
   C) B + 模糊搜索操作对象

   推荐 B：一般后台日志的核心筛选就是"谁在什么时间做了什么"。
   模糊搜索对数据库压力大，且日志场景不常用，后续迭代加。

你: B。
```

3 轮问答，5 分钟。AI 生成设计文档：

```markdown
📋 [Brainstorming] 设计文档已保存：
   docs/superpowers/specs/operation-log-design.md

   确认的设计决策：
   ✅ 标准级日志（操作类型 + 操作人 + 对象 + 变更值）
   ✅ 同库独立表，Prisma schema 扩展
   ✅ 筛选维度：时间范围 + 操作类型 + 操作人
   ✅ 详情弹窗展示变更前后 Diff
   ✅ 导出为 CSV（仅管理员权限）
   ❌ 不做：设备信息采集、独立数据库、模糊搜索
```

> **这 5 分钟的刹车，避免了后面至少 2 小时的返工。** brainstorming 的产出是清晰的设计文档，直接传给下一棒。

---

### 📋 第 2 棒：writing-plans — 拆清楚

`brainstorming` 完成后，AI 自动进入 `writing-plans`，把设计文档拆解为原子化的 TDD 任务清单：

```markdown
# 操作日志模块 — 实施计划

### Task 1: 数据模型 + 数据库迁移
- [ ] 写测试 — OperationLog 模型字段校验
- [ ] 🔴 运行测试确认失败
- [ ] 实现 Prisma schema + migration
- [ ] 🟢 运行测试确认通过
- [ ] 提交

### Task 2: 日志写入服务
- [ ] 写测试 — 创建日志记录
- [ ] 🔴 运行测试确认失败
- [ ] 实现 createLog() 服务函数
- [ ] 🟢 运行测试确认通过
- [ ] 写测试 — 记录变更前后值的 Diff
- [ ] 🔴 确认失败
- [ ] 实现 Diff 序列化逻辑
- [ ] 🟢 确认通过
- [ ] 提交

### Task 3: 日志查询 API
- [ ] 写测试 — 按时间范围筛选
- [ ] 🔴 → 🟢
- [ ] 写测试 — 按操作类型筛选
- [ ] 🔴 → 🟢
- [ ] 写测试 — 按操作人筛选
- [ ] 🔴 → 🟢
- [ ] 写测试 — 分页查询
- [ ] 🔴 → 🟢
- [ ] 提交

### Task 4: 前端日志列表页
- [ ] 写测试 — 列表渲染日志卡片
- [ ] 🔴 → 🟢
- [ ] 实现筛选组件（时间、类型、操作人）
- [ ] 实现详情弹窗（Diff 可视化）
- [ ] 提交

### Task 5: CSV 导出
- [ ] 写测试 — 导出包含正确的列头和数据
- [ ] 🔴 → 🟢
- [ ] 写测试 — 非管理员返回 403
- [ ] 🔴 → 🟢
- [ ] 提交
```

**关键特征**：
- 每个 Task 都是**独立可交付**的单元
- 每个 Task 内部都严格遵循 **🔴→🟢** 的 TDD 节奏
- Task 1-3 后端、Task 4 前端、Task 5 独立功能——**可以分配给不同的子代理并行**

---

### 🔴🟢 第 3 棒：TDD + subagent — 做清楚

**做清楚**是整个接力赛中最长的一棒。这里是 `TDD` + `subagent` 的联合作战：

```
🤖 [主代理] 分析任务依赖：
   Task 1 → Task 2 依赖 Task 1 的数据模型（串行）
   Task 3 → 依赖 Task 2 的服务层（串行）
   Task 4 → 依赖 Task 3 的 API（串行）
   Task 5 → 仅依赖 Task 3 的查询 API（可与 Task 4 并行）

   执行策略：
   Phase A：Task 1 → Task 2 → Task 3（串行）
   Phase B：Task 4 + Task 5（并行）
```

Phase A 串行执行（以 Task 2 为例展示 TDD 循环）：

```typescript
// 🔴 RED — 先写失败测试
test('createLog 应该创建一条操作日志', async () => {
  const log = await createOperationLog({
    userId: 'user-1',
    action: 'UPDATE',
    target: 'Article',
    targetId: 'article-123',
    changes: {
      before: { title: '旧标题' },
      after: { title: '新标题' },
    },
  });

  expect(log.id).toBeDefined();
  expect(log.action).toBe('UPDATE');
  expect(log.changes.before.title).toBe('旧标题');
});
```

```bash
$ npx vitest run create-log
FAIL: createOperationLog is not defined   ← 🔴 预期的失败
```

```typescript
// 🟢 GREEN — 写最小实现
export async function createOperationLog(data: CreateLogInput) {
  return prisma.operationLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      target: data.target,
      targetId: data.targetId,
      changes: data.changes as Prisma.JsonObject,
    },
  });
}
```

```bash
$ npx vitest run create-log
PASS: 1/1   ← 🟢 通过
```

Phase B 并行执行——两个子代理同时干活：

```
🤖 [SubAgent] Task 4（前端日志列表）
   🔴 写测试：列表渲染 10 条日志
   🟢 实现 LogList 组件
   🔴 写测试：筛选器切换触发重新查询
   🟢 实现 LogFilter 组件
   🔴 写测试：详情弹窗展示 Diff
   🟢 实现 LogDetailModal 组件
   ✅ 4 个测试通过

🤖 [SubAgent] Task 5（CSV 导出）    ← 同时执行
   🔴 写测试：导出内容包含正确列头
   🟢 实现 exportToCSV() 函数
   🔴 写测试：非管理员返回 403
   🟢 实现权限校验中间件
   ✅ 2 个测试通过
```

**Task 1-5 完成后的战绩**：

```
📊 编码阶段统计：
   - 5 个 Task 全部完成
   - 14 个测试全部通过 ✅
   - 串行阶段：~45 分钟
   - 并行阶段：~15 分钟（省了 15 分钟）
   - 总编码耗时：~60 分钟
```

---

### 🔍 第 4 棒：systematic-debugging — 修清楚

编码阶段跑完测试全绿。但实际运行时发现了一个问题：

```
⚠️ 问题：日志列表页加载时，时间筛选默认显示"全部"，
   但接口返回了 10000+ 条记录，页面卡顿 3 秒。
```

如果是正常反应，你可能直接说"加个默认时间范围就好了"。但 `systematic-debugging` 不允许这样——**先找根因，再提方案**：

```markdown
🔍 [systematic-debugging] 四阶段启动：

阶段 1 — 收集证据
   - API 响应时间：120ms（正常）
   - 返回数据量：10247 条（异常！没有默认分页？）
   - 前端渲染耗时：2800ms（DOM 节点太多导致）

阶段 2 — 模式分析
   × 不是 API 慢——是前端一次性渲染了 1 万个 DOM 节点
   × 查询 API 的分页参数没有设默认值
   → 根因：API 默认返回全部数据 + 前端没有虚拟列表

阶段 3 — 假设验证
   假设：给 API 加默认分页（page=1, pageSize=20） + 前端加分页组件
   验证：只改 API 默认参数，页面加载时间从 3s → 200ms ✅

阶段 4 — 实施修复（TDD 先行！）
```

```typescript
// 🔴 先写失败测试
test('不传分页参数时，默认返回前 20 条', async () => {
  const res = await request(app).get('/api/logs');
  const body = await res.json();

  expect(body.data.length).toBeLessThanOrEqual(20);
  expect(body.pagination.page).toBe(1);
  expect(body.pagination.pageSize).toBe(20);
});
```

```bash
$ npx vitest run log-api-pagination
FAIL: Expected 20, received 10247   ← 🔴 复现了 Bug
```

修复后：
```bash
$ npx vitest run log-api-pagination
PASS: 1/1   ← 🟢 修复确认
```

> **debugging 的关键纪律：不是直接修，而是先定位"根因是什么"，再用测试锁住 Bug，最后才动代码。**

---

### 👁️ 第 5 棒：code-review — 审清楚

编码和调试都完成了，现在进入 `code-review` 审查环节。AI 以**对抗性视角**审查所有变更文件：

```markdown
🔍 [Code Review] 审计报告

📁 审查范围：15 个文件变更

✅ 通过项：
   - 数据模型设计合理
   - TDD 覆盖到位（15 个测试）
   - 权限校验正确（导出接口限制管理员）

⚠️ [WARN-01] 日志写入缺少异步化
   位置：src/lib/log-service.ts L23
   问题：createOperationLog 在业务接口中同步调用，
        日志写入失败会导致业务接口 500
   建议：改为 fire-and-forget 模式，
        日志失败不应影响业务操作
   
   修复示例：
   - const log = await createOperationLog(data);
   + createOperationLog(data).catch(err =>
   +   console.error('日志写入失败', err)
   + );

⚠️ [WARN-02] CSV 导出没有限制最大行数
   位置：src/app/api/logs/export/route.ts L15
   问题：导出全部数据可能导致内存溢出
   建议：限制单次导出最多 10000 条，超出提示分批导出

💡 [INFO-01] LogDetailModal 的 Diff 展示可以用颜色区分
   建议：新增内容用绿色背景，删除内容用红色背景
```

**两个 WARN 级别问题是你自己大概率发现不了的**——这就是对抗性审查的价值。修复后继续。

---

### ✅ 第 6 棒：verification — 验清楚

最后一棒。`verification-before-completion` 是临门一脚的质量关卡：

```markdown
✅ [Verification] 最终验收

📋 检查清单：

1. 测试覆盖：
   ✅ 15/15 测试通过
   ✅ 新增 1 个 Bug 复现测试（分页默认值）
   ✅ 总计 16 个测试全绿

2. 构建验证：
   ✅ npm run build — 成功（4.2s）
   ✅ TypeScript 零错误
   ✅ ESLint 零警告

3. 功能验证：
   ✅ 日志列表正常加载（< 200ms）
   ✅ 三维筛选正常工作
   ✅ 详情弹窗展示 Diff
   ✅ CSV 导出（管理员）正常
   ✅ CSV 导出（普通用户）返回 403

4. Code Review 问题修复：
   ✅ WARN-01 已修复（异步日志写入）
   ✅ WARN-02 已修复（导出行数限制）

🎉 验证通过，可以交付。
```

---

## 📊 3. 有接力 vs 没接力：效果对比

| 维度 | "冲上去就写" | **6 棒接力** |
|:---:|:---|:---|
| 需求理解 | 边写边猜 PM 的意思 | **brainstorming 3 轮确认** |
| 任务拆分 | 没有，一口气搞完 | **writing-plans 5 个原子 Task** |
| 代码质量 | 没有测试 | **16 个测试全绿** |
| Bug 处理 | "加个判断试试" | **四阶段根因定位** |
| 隐藏缺陷 | 上线后才发现 | **code-review 提前拦截** |
| 交付信心 | "应该没问题吧" | **verification 全项达标** |
| 总耗时 | ~4 小时（含返工） | **~2 小时** |
| 返工次数 | 3-4 次 | **0 次** |

---

## 🧩 4. 接力赛的"交接棒"协议

6 个 Skills 能无缝协作的秘密在于——**每一棒的输出格式，恰好是下一棒的输入格式**。这不是巧合，这是 Superpowers 的设计：

| 交接点 | 上一棒输出 | 下一棒输入 |
|:---:|:---|:---|
| 1→2 | brainstorming 输出**设计文档** | writing-plans 读取设计文档生成**任务清单** |
| 2→3 | writing-plans 输出**TDD 任务清单** | TDD 按清单逐项执行**红绿循环** |
| 3→4 | TDD 执行中遇到**失败测试 / 运行异常** | debugging 启动**四阶段排查** |
| 4→5 | debugging 修复后**代码变更** | code-review 审查**所有变更文件** |
| 5→6 | code-review 输出**审计报告** | verification 检查**报告中的问题是否已修复** |

```
brainstorming        writing-plans        TDD + subagent
     │                    │                    │
     ▼                    ▼                    ▼
 设计文档 ──────→ 任务清单 ──────→ 代码 + 测试
                                               │
                              ┌─ 有 Bug ───────┤
                              ▼                 │
                        debugging               │
                              │                 │
                              ▼                 │
                         修复代码 ◄────── 无 Bug ┘
                              │
                              ▼
                        code-review
                              │
                              ▼
                        verification
                              │
                              ▼
                          交付 ✅
```

---

## ⚡ 5. 什么时候可以"跳棒"

**不是每个需求都需要跑完 6 棒。** 根据需求复杂度，你可以灵活跳过部分环节：

| 需求类型 | 需要跑哪几棒 | 跳过什么 |
|:---:|:---|:---|
| 复杂新功能（本文示例） | 全部 6 棒 | 无 |
| 中等功能（加个弹窗） | 1→2→3→6 | 跳过 debugging 和 review |
| 简单 Bug 修复 | 4→3→6 | 直接从 debugging 开始 |
| 紧急 Hotfix | 4→6 | 只做调试和验证 |
| 探索性原型 | 1→3 | 只做 brainstorming 和编码 |

> **原则：前 3 棒（想、拆、做）是必须的，后 3 棒（修、审、验）按风险等级决定。** 上生产环境的代码，6 棒全跑。内部原型，跑前 3 棒就够了。

---

## ✅ 自检清单：你的 Skills 协作到位了吗

### 交接质量
- [ ] brainstorming 的设计文档被 writing-plans 正确引用
- [ ] writing-plans 的每个 Task 都是 TDD 格式（先写测试）
- [ ] debugging 产生的修复有对应的回归测试
- [ ] code-review 的 WARN 级别问题全部修复后才进入 verification
- [ ] verification 的检查覆盖了测试、构建、功能、审计四个维度

### 常见断点
- [ ] ❌ brainstorming 想清楚了但没有存成文档 → writing-plans 不知道设计决策
- [ ] ❌ TDD 写了测试但没有运行 → 假绿灯
- [ ] ❌ 遇到 Bug 直接改代码 → 没有走 debugging 的根因分析
- [ ] ❌ code-review 的建议标记了"知道了"但没有改 → verification 放行了
- [ ] ❌ verification 只检查了"测试通过"没检查"构建成功" → 部署时才发现错误

---

## 一个关于"快"和"稳"的认知

很多人觉得 6 棒接力太慢了，**"直接写不香吗？"**

但数据说的是另一个故事：

| 指标 | 直接写代码 | 6 棒接力 |
|:---:|:---:|:---:|
| 编码时间 | 快 ⚡ | 稍慢 |
| 返工时间 | 长 🐌 | 接近 0 |
| Bug 修复时间 | 长 🐌 | 短（有测试兜底） |
| Review 修复时间 | 长 🐌 | 短（review 前就解决了大部分） |
| **总交付时间** | **慢** | **快** |

> **单独写代码是快的。但"写代码 + 返工 + Debug + Review 修改"这个总包是慢的。接力赛慢在每一棒，快在不用跑第二圈。**

编码时间只占总交付时间的 30%。剩下 70% 是返工、调试、Review 修改、重新验证。6 棒接力把这 70% 几乎压缩成了 0。

> **Skills 不是让你"写代码"更快，而是让你"交付"更快。**

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 系列：程序人生 ｜ 更新日期：2026-04-04*
