# Superpowers 实战指南 | 第3期 - TDD 铁律：没有失败的测试，就不许写代码

> 🔴 "先写代码再补测试"——这是程序员最常犯的错误，也是 AI 编程中最容易被放大的隐患。Superpowers 对此的回应简单粗暴：**先写了代码？删掉。从头来。**

---

## 为什么 AI 编程更需要 TDD？

### AI 不写测试的三大后果

当你让 AI "帮我实现一个用户注册功能" 时：

**后果一：假性自信**
AI 写完 200 行代码后说"完成了"。但它从未验证过这些代码能不能跑通。它的"自信"来源于语法正确，而非行为正确。

**后果二：补测的测试不可靠**
如果你事后说"帮我加个测试"，AI 写的测试会直接通过。一个直接通过的测试，你怎么知道它真的在测试你想测的东西？

**后果三：回归灾难**
没有测试的代码，每次修改都是一次赌博。第 10 次修改的时候，你连第 3 次修改引入了什么 Bug 都不知道。

### TDD 在 AI 编程中的新价值

传统开发中 TDD 是"最佳实践"，在 AI 编程中它是**必需品**：

| 场景 | 没有 TDD | 有 TDD |
|:---|:---|:---|
| AI 改了 5 个文件 | 不知道改坏了什么 | 瞬间知道哪个测试 break 了 |
| AI 声称"完成了" | 只能信它的话 | 跑测试，用事实说话 |
| 重构既有代码 | 不敢动 | 大胆重构，测试保底 |
| 换了一个 AI 模型 | 从头确认所有逻辑 | 测试全绿 = 逻辑没变 |

---

## Superpowers TDD 的铁律

### The Iron Law

```
没有失败的测试 → 不允许写实现代码
先写了代码再补测试 → 删掉代码，从头来过
```

**没有例外。** 以下都不是正当理由：

| 你的借口 | Superpowers 的回应 |
|:---|:---|
| "太简单了不需要测试" | 简单代码也会出 Bug，写个测试只要 30 秒 |
| "我先写完再补测试" | 补的测试直接通过，不能证明它在测正确的东西 |
| "我先保留代码当参考" | 你会"参考"着写测试，那就不是 TDD 了。删掉 |
| "删掉几小时的工作太浪费" | 沉没成本谬误。没测试的代码才是真浪费 |
| "TDD 太教条了，我更务实" | TDD 就是最务实的做法。猜测式开发才是最慢的 |
| "我手动测过了" | 手动测试是随机的、不可重复的、会遗忘的 |

---

## RED - GREEN - REFACTOR 循环详解

Superpowers 的 TDD 严格遵循经典的三步循环：

```
  ┌──────────┐
  │  🔴 RED   │  ← 写一个失败的测试
  └─────┬────┘
        ↓
  ┌──────────┐
  │ 确认失败  │  ← 跑测试，必须看到它失败（这一步不能省！）
  └─────┬────┘
        ↓
  ┌──────────┐
  │ 🟢 GREEN │  ← 写最少的代码让测试通过
  └─────┬────┘
        ↓
  ┌──────────┐
  │ 确认通过  │  ← 跑测试，必须看到它通过
  └─────┬────┘
        ↓
  ┌──────────┐
  │ 🔵 REFACTOR │  ← 整理代码（保持测试绿色）
  └─────┬────┘
        ↓
     下一个循环
```

### 实战演示：用 TDD 实现邮箱验证

**🔴 第一步：写失败测试**

```typescript
// tests/email-validator.test.ts
test('空邮箱应该被拒绝并返回错误信息', async () => {
  const result = await validateEmail('');
  expect(result.valid).toBe(false);
  expect(result.error).toBe('邮箱不能为空');
});
```

**确认失败**（必须做！）

```bash
$ npm test email-validator
FAIL: ReferenceError: validateEmail is not defined
```

✅ 好，测试因为"函数不存在"而失败——这正是我们期望的。

**🟢 第二步：写最小实现**

```typescript
// src/email-validator.ts
export async function validateEmail(email: string) {
  if (!email?.trim()) {
    return { valid: false, error: '邮箱不能为空' };
  }
  return { valid: true, error: null };
}
```

注意：我们**只写让当前测试通过的代码**。没有正则表达式，没有域名验证，因为还没有那些测试。

**确认通过**

```bash
$ npm test email-validator
PASS: 1/1
```

**🔵 第三步：重构（此时暂无需要整理的）**

**继续下一个循环——测试邮箱格式：**

**🔴 写测试**
```typescript
test('无效邮箱格式应该被拒绝', async () => {
  const result = await validateEmail('abc');
  expect(result.valid).toBe(false);
  expect(result.error).toBe('邮箱格式无效');
});
```

**确认失败**
```bash
$ npm test
FAIL: expected false, got true
```

✅ 测试因为"缺少格式验证"而失败——正确。

**🟢 最小实现**
```typescript
export async function validateEmail(email: string) {
  if (!email?.trim()) {
    return { valid: false, error: '邮箱不能为空' };
  }
  if (!email.includes('@')) {
    return { valid: false, error: '邮箱格式无效' };
  }
  return { valid: true, error: null };
}
```

**确认通过**
```bash
$ npm test
PASS: 2/2
```

**就这样一个一个循环下去。** 每个行为都是先测试再实现，确保每一行代码都有存在的理由。

---

## "看到测试失败"为什么如此重要？

很多人觉得"测试通过不就行了嘛？"但 Superpowers 坚持你必须**亲眼看到测试失败**：

### 反例：不看失败的危险

```typescript
// 假设你先写了实现代码，再补测试
test('验证邮箱格式', () => {
  const result = validateEmail('user@example.com');
  expect(result.valid).toBe(true);  // ← 这个测试直接通过了
});
```

这个测试永远是绿色的。但它真的在测"格式验证"吗？如果你把格式验证逻辑全部删掉，这个测试仍然通过——因为你只测了一个**合法**的邮箱。

### 正确的做法

```typescript
// TDD 方式：先测非法邮箱
test('无效邮箱格式应该被拒绝', () => {
  const result = validateEmail('abc');
  expect(result.valid).toBe(false);  // ← 先看到它失败
});
```

先看到它失败（因为还没写格式验证），再写代码让它通过——你就**确认了这个测试确实在测格式验证**。

---

## 与 Superpowers 其他技能的协作

TDD 不是孤立存在的，它与 Superpowers 的其他技能紧密配合：

```
brainstorming → 确定要实现什么功能
     ↓
writing-plans → 每个任务都包含 TDD 步骤
     ↓
subagent-driven-development → 子代理严格遵循 TDD
     ↓
systematic-debugging → Bug 修复前先写失败测试
     ↓
verification-before-completion → 跑完整测试套件
```

### 在计划中的 TDD 步骤

`writing-plans` 生成的每个任务都长这样：

```markdown
### Task 3: 实现邮箱验证器

- [ ] Step 1: 写空邮箱的失败测试
- [ ] Step 2: 运行测试，确认失败
- [ ] Step 3: 写最小实现让测试通过
- [ ] Step 4: 运行测试，确认通过
- [ ] Step 5: 写无效格式的失败测试
- [ ] Step 6: 运行测试，确认失败
- [ ] Step 7: 补充格式验证实现
- [ ] Step 8: 运行测试，确认全部通过
- [ ] Step 9: 提交代码
```

---

## TDD 的常见困境及应对

| 困境 | 解决方案 |
|:---|:---|
| 不知道怎么测 | 先写你"期望的 API"。如果 API 都定不下来，说明设计还没想清楚 |
| 测试太复杂 | 说明你的代码太复杂。简化接口，不要硬写测试 |
| 必须 Mock 一切 | 代码耦合太紧。用依赖注入解耦 |
| 测试 Setup 太长 | 抽取 Helper 函数。还是太长？简化设计 |

> 💡 **核心洞察**：测试难写不是 TDD 的问题，而是**设计的信号**。难以测试 = 难以使用。

---

## 小结

▪️ Superpowers 的 TDD 不是"建议"，而是**铁律**——没有失败测试就不准写代码
▪️ RED-GREEN-REFACTOR 循环确保每一行代码都有对应的测试守护
▪️ **必须亲眼看到测试失败**——这是唯一能证明测试在测正确的东西的方式
▪️ 先写了代码？删掉。这不是惩罚，而是保护你免受"假性测试"的侵害
▪️ TDD 在 AI 编程时代不是"最佳实践"，而是**必需品**

在下一篇文章中，我们将进入 Superpowers 最硬核的调试体系：**`systematic-debugging` 系统化调试——四阶段根因追踪，告别"碰运气式"修 Bug。**

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 系列：Superpowers实战指南系列 ｜ 更新日期：2025-04-22*
