---
date: 2025-05-01
tags:
  - AI编程
  - Skills实战
  - Superpowers
  - brainstorming
  - TDD
cover: /covers/cover-skills-practice-cli.webp
---
# 从零搭建 CLI 工具 — brainstorming + TDD + writing-plans 防翻车三件套

> 🛡️ "帮我写个 CLI 工具" → AI 哗哗输出 500 行代码 → 跑不起来 → 改了 3 小时 → 还是不对。听起来熟悉吗？这篇文章教你用三个 Skills 组合，让 AI 从"冲动型选手"变成"靠谱的工程搭档"。

---

## 🎯 场景与挑战

你想开发一个 **Markdown 链接检查器** CLI 工具（`mdlink-check`），它能：

- 扫描 `.md` 文件中的所有超链接
- 并发检测链接是否存活（HTTP 状态码）
- 输出一份报告：哪些链接是死链

听起来很简单对吧？但如果你直接告诉 AI "帮我写一个 Markdown 链接检查器"，大概率会翻车：

```
❌ 翻车场景一：AI 一口气写了 400 行代码，但没处理相对链接
❌ 翻车场景二：HTTP 请求没有超时控制，遇到慢站点直接卡死
❌ 翻车场景三：输出格式是纯文本，不支持 JSON 输出，后续自动化没法用
❌ 翻车场景四："完成了"——但根本没跑过测试
```

**核心问题**：AI 不是能力不够，而是"没有约束"地写代码。

---

## 🧰 Skills 组合

本篇用到 Superpowers 的三个核心 Skills：

| Skill | 职责 | 解决什么问题 |
|:---:|:---|:---|
| 🧠 `brainstorming` | 在写代码前逐步澄清需求 | 防止"需求没想清楚就动手" |
| 📋 `writing-plans` | 把需求拆成原子化的 TDD 任务 | 防止"AI 一口气写完改不动" |
| 🔴 `test-driven-development` | RED-GREEN-REFACTOR 循环 | 防止"代码写了但没验证" |

```
工作流：
brainstorming（想清楚）→ writing-plans（拆清楚）→ TDD（做清楚）
```

---

## 🛠️ 实战过程

### Phase 1：brainstorming — 在写代码前踩刹车

你对 AI 说出需求：

```
我想做一个 Markdown 链接检查器 CLI 工具。
```

→ AI **不会**直接写代码。它会自动激活 `brainstorming`，开始逐个问你问题：

**AI 第一个问题：**
```
链接检查的范围包括哪些？

A) 仅 HTTP/HTTPS 外部链接
B) 外部链接 + 本地文件链接（相对路径）
C) 外部链接 + 本地链接 + 锚点链接（#section）

我推荐选 B，理由是：
- A 太窄，文档项目的相对链接失效同样痛苦
- C 过于复杂，锚点检查需要解析目标文件的标题结构
- MVP 先覆盖最常见的场景
```

**你回答：** B，同意。

**AI 第二个问题：**
```
HTTP 请求的并发策略用哪种？

A) 串行请求（简单但慢）
B) 固定并发池（如最多 10 个并发请求）
C) 自适应并发（根据目标域名限速）

推荐 B，固定并发池。理由：
- 实现简单，够用
- 用 p-limit 库一行代码搞定
- 后续可以升级为 C
```

**你回答：** B。

**AI 第三个问题：**
```
输出格式支持什么？

A) 纯文本（人类可读）
B) JSON（机器可读）
C) 两者都支持，用 --format 参数切换

推荐 C。理由：
- 终端使用时看纯文本
- CI/CD 集成时解析 JSON
- 用 commander.js 的 option 即可实现
```

**你回答：** C。

经过 3 轮问答，AI 生成设计文档并提交到 Git：

```
🧠 [Brainstorming] 设计文档已保存：
   docs/superpowers/specs/mdlink-check-design.md

   需求确认：
   ✅ 检查 HTTP/HTTPS 外部链接
   ✅ 检查本地文件相对链接
   ✅ 固定并发池（p-limit, 10并发）
   ✅ 双输出格式（text/JSON, --format 参数）
   ✅ 支持 glob 模式指定扫描目录
   ✅ 超时设置（默认 10s, --timeout 参数）
```

> 💡 **关键价值**：3 轮提问花了 5 分钟，但帮你避免了后面至少 2 小时的返工。代价极低，收益极高。

---

### Phase 2：writing-plans — 把设计拆成原子任务

`brainstorming` 完成后，AI 自动进入 `writing-plans`，基于设计文档生成实施计划：

```markdown
# mdlink-check 实施计划

### Task 1: 项目脚手架
- [ ] 初始化 Node.js 项目（TypeScript + Vitest）
- [ ] 安装依赖：commander, p-limit, node-fetch, glob
- [ ] 配置 tsconfig.json 和 vitest.config.ts
- [ ] 验证空项目跑通
- [ ] 提交

### Task 2: Markdown 链接提取器
- [ ] 写测试 — 从 Markdown 文本中提取所有链接
- [ ] 运行测试，确认失败 🔴
- [ ] 实现 extractLinks() 函数
- [ ] 运行测试，确认通过 🟢
- [ ] 写测试 — 区分外部链接和本地链接
- [ ] 运行测试，确认失败 🔴
- [ ] 实现链接分类逻辑
- [ ] 运行测试，确认通过 🟢
- [ ] 提交

### Task 3: HTTP 链接检查器
- [ ] 写测试 — 检查可达链接返回 200
- [ ] 运行测试，确认失败 🔴
- [ ] 实现 checkHttpLink() 函数
- [ ] 运行测试，确认通过 🟢
- [ ] 写测试 — 超时场景返回 timeout 错误
- [ ] 运行测试，确认失败 🔴
- [ ] 实现超时处理
- [ ] 运行测试，确认通过 🟢
- [ ] 提交

### Task 4: 本地链接检查器
- [ ] 写测试 — 检查存在的本地文件返回 ok
- [ ] 运行测试，确认失败 🔴
- [ ] 实现 checkLocalLink() 函数
- [ ] 运行测试，确认通过 🟢
- [ ] 写测试 — 不存在的文件返回 not-found
- [ ] 运行测试，确认失败 🔴
- [ ] 实现文件不存在处理
- [ ] 运行测试，确认通过 🟢
- [ ] 提交

### Task 5: CLI 入口与报告输出
- [ ] 写测试 — 文本格式输出包含状态标记
- [ ] 运行测试，确认失败 🔴
- [ ] 实现 CLI 入口和文本格式报告
- [ ] 运行测试，确认通过 🟢
- [ ] 写测试 — JSON 格式输出可被 JSON.parse
- [ ] 运行测试，确认失败 🔴
- [ ] 实现 JSON 格式输出
- [ ] 运行测试，确认通过 🟢
- [ ] 提交
```

> **注意看**：每个 Task 都严格遵循 TDD 步骤——先测试（🔴），后实现（🟢）。

---

### Phase 3：TDD 执行 — RED-GREEN-REFACTOR

以 Task 2（链接提取器）为例，展示 TDD 循环的实际过程：

**🔴 RED — 写失败测试**

```typescript
// tests/extract-links.test.ts
import { extractLinks } from '../src/extract-links';

test('从 Markdown 文本中提取所有链接', () => {
  const markdown = `
# 测试文档
这是一个 [外部链接](https://example.com)。
这是一个 [本地链接](./README.md)。
这是一个 [图片](https://img.example.com/photo.jpg)。
  `;

  const links = extractLinks(markdown);

  expect(links).toHaveLength(3);
  expect(links[0]).toEqual({
    text: '外部链接',
    url: 'https://example.com',
    type: 'external',
  });
  expect(links[1]).toEqual({
    text: '本地链接',
    url: './README.md',
    type: 'local',
  });
});
```

**确认失败**：
```bash
$ npx vitest run extract-links
FAIL: ReferenceError: extractLinks is not defined
```

✅ 好——测试因为"函数不存在"而失败，这正是我们期望的。

**🟢 GREEN — 写最小实现**

```typescript
// src/extract-links.ts
interface Link {
  text: string;
  url: string;
  type: 'external' | 'local';
}

export function extractLinks(markdown: string): Link[] {
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  const links: Link[] = [];
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    const [, text, url] = match;
    links.push({
      text,
      url,
      type: url.startsWith('http') ? 'external' : 'local',
    });
  }

  return links;
}
```

**确认通过**：
```bash
$ npx vitest run extract-links
PASS: 1/1
```

**🔵 REFACTOR — 整理代码**

代码已经很清晰了，暂时不需要重构。**继续下一个测试循环。**

---

**就这样一个一个 Task、一个一个测试循环地推进。** 每几分钟就有一个绿色的✅，像打怪升级一样。

最终产出：

```
📊 项目统计：
   - 5 个模块  
   - 12 个测试（全部通过）
   - 0 个"应该没问题"的声明
   - 每个功能都有对应的测试守护
```

---

## 📊 效果对比

| 维度 | 不用 Skills（直让 AI 写） | 用 brainstorming + TDD + plans |
|:---:|:---|:---|
| 需求遗漏 | 漏了本地链接检查、超时控制 | **3 轮问答覆盖全部需求** |
| 代码质量 | 一坨 400 行，改不动 | **5 个模块，单一职责** |
| 测试覆盖 | 0 个测试 | **12 个测试全绿** |
| 返工次数 | 改了 3 轮还有 Bug | **一路绿灯** |
| 总耗时 | ~3 小时（含反复修改） | **~1.5 小时** |
| 信心 | "应该能跑吧……" | **测试全绿，确认能跑** |

---

## 💡 实战心得

### 1. brainstorming 的 5 分钟值千金

很多人觉得"需求很简单，不用讨论"。但实际上，**越简单的需求越容易翻车**——因为你觉得"显然"的东西，AI 可能觉得"不确定"。花 5 分钟对齐需求，省 2 小时返工。

### 2. TDD 不是"写两倍代码"

TDD 的真正价值不在于"有了测试"，而在于：
- **强迫你先想清楚 API 长什么样**（因为你要先调用它）
- **小步快跑**，每几分钟就有一个绿色反馈
- **重构的底气**——测试绿色就大胆改

### 3. writing-plans 让"大象"可以被吃掉

一个 CLI 工具看起来不大，但一口气让 AI 写完就是灾难。拆成 5 个原子任务后，每个任务 15-20 分钟搞定，**心理压力和出错概率都直线下降**。

### 4. 适用场景

这套三件套组合适合：
- ✅ 从零开始的新项目
- ✅ 功能边界清晰的工具类应用
- ✅ 需要长期维护的代码（有测试才敢改）
- ⚠️ 探索性原型可以简化（跳过 TDD，只用 brainstorming + plans）

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 更新日期：2025-05-01*
