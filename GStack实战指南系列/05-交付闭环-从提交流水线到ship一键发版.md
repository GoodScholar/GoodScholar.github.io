# GStack 实战指南 | 第5期 - 交付闭环：从提交流水线到 `/ship` 一键发版

> 📦 当一切尘埃落定，那些为了发版需要繁重合并分支、跑 CI/CD 流程、写 Commit Message 甚至发版日志的日子，都被浓缩进了一个单词：`/ship`。

---

## 发版之痛：那些年我们踩过的坑

当我们辛苦用 AI 做了几天功能之后，发版时常常面临这些琐碎又容易出错的环节：

| 问题 | 后果 | 频率 |
|:---|:---|:---:|
| 未提交的文件散落各处，忘记 `git add` | 线上缺文件，功能残缺 | 🔴 高 |
| `git commit -m "fix"` 敷衍了事 | 半年后回溯无从下手 | 🔴 高 |
| 没跑本地测试就 push 到远端 | CI 全红，主线被污染 | 🟡 中 |
| PR 描述空空如也或胡写一通 | 团队成员无法 Code Review | 🟡 中 |
| 忘记 `git pull` 导致合并冲突 | 花一小时手动解冲突 | 🟡 中 |

在 GStack 体系里，这些全部被 `/ship` 自动化了。

---

## `/ship` 的工作原理

当你敲出这条命令：

```bash
/ship 评论模块开发完毕，请提交代码并创建 PR。
```

GStack 会启动一个严格的发版流水线。整个流程遵循硅谷大厂的工程规范：

```
    /ship 触发
       ↓
┌──────────────────────────────────┐
│ Step 1: 扫描工作区                │
│ 检查所有 unstaged / untracked     │
│ 文件，确保没有遗漏               │
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│ Step 2: 智能 Stage               │
│ 只 add 与当前功能相关的文件       │
│ 排除临时文件、日志等杂项          │
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│ Step 3: 生成语义化 Commit         │
│ 遵循 Conventional Commits 规范   │
│ 自动分析变更，生成精确的描述      │
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│ Step 4: 执行测试（可选）          │
│ 跑 npm run test / npm run lint   │
│ 如果不通过 → 打回并要求修复      │
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│ Step 5: 拉取远程 & 处理冲突       │
│ git pull --rebase                │
│ 自动解决简单冲突                  │
└──────────────┬───────────────────┘
               ↓
┌──────────────────────────────────┐
│ Step 6: Push & 创建 PR            │
│ 推送到远端分支                    │
│ 调用 GitHub API 生成规范 PR       │
└──────────────────────────────────┘
```

---

## 实战演示：一次完整的 `/ship` 流程

### 场景

你刚完成了博客评论模块的开发，包含 3 个新文件和 2 个修改文件：

```bash
/ship 评论模块已完成开发和 QA 验收，请提交并创建 PR。
```

### Step 1-2: 工作区扫描与 Stage

```
🚢 [Ship] 扫描工作区变更...

新增文件：
  + src/components/CommentBox.tsx
  + src/components/CommentList.tsx
  + src/api/comments.ts

修改文件：
  M src/pages/ArticlePage.tsx
  M src/types/index.ts

忽略文件（不会提交）：
  ⏭ .env.local           (环境变量)
  ⏭ node_modules/         (依赖目录)
  ⏭ src/test-scratch.ts   (临时测试文件)

📎 已 Stage 5 个文件。
```

### Step 3: 生成语义化 Commit

这是 `/ship` 最优雅的部分——它不会生成敷衍的 "Update" 或 "Fix bug"：

```
🚢 [Ship] 分析变更内容，生成 Commit Message...

feat(comments): add comment module with inline reply support

- Add CommentBox component with form validation and XSS sanitization
- Add CommentList component with nested reply threading
- Add comments API service with batch user loading (N+1 fix)
- Integrate comment section into ArticlePage
- Add Comment and Reply types to shared type definitions
```

**解析这条 Commit Message：**

```
feat(comments): add comment module with inline reply support
│    │           │
│    │           └── 简明的功能描述
│    └── 影响范围（comments 模块）
└── 变更类型（feat = 新功能）
```

常见的 Conventional Commits 类型：

| 前缀 | 含义 | 示例 |
|:---:|:---|:---|
| `feat` | 新功能 | `feat(auth): add OAuth login` |
| `fix` | Bug 修复 | `fix(ui): resolve z-index overlap` |
| `refactor` | 重构 | `refactor(api): extract base service` |
| `perf` | 性能优化 | `perf(query): add database index` |
| `docs` | 文档更新 | `docs(readme): add setup guide` |
| `test` | 测试相关 | `test(auth): add login e2e test` |
| `chore` | 构建/工具 | `chore(deps): upgrade React to 19` |

### Step 4: 执行测试

```
🚢 [Ship] 执行本地测试...

Running: npm run lint
✅ ESLint: No errors found (23 files checked)

Running: npm run test
✅ Test Suites: 12 passed, 12 total
✅ Tests:       47 passed, 47 total

🟢 所有测试通过，继续发版流程。
```

> **如果测试失败**：`/ship` 会立刻中止并打回，告诉你具体哪个测试挂了，要求你先修复再重新执行 `/ship`。

### Step 5-6: 推送与创建 PR

```
🚢 [Ship] 拉取远程最新代码...
✅ Already up to date.

🚢 [Ship] 推送到远端分支 feature/comments...
✅ Push 成功。

🚢 [Ship] 创建 Pull Request...
✅ PR 已创建：https://github.com/yourname/myblog/pull/42
```

### 自动生成的 PR 内容

```markdown
## 📝 Pull Request: Add Comment Module

### 变更概述
为文章详情页添加评论模块，支持内联回复和嵌套展示。

### 变更文件清单

| 文件 | 变更类型 | 说明 |
|:---|:---:|:---|
| `CommentBox.tsx` | 🆕 新增 | 评论输入组件，含表单校验和 XSS 消毒 |
| `CommentList.tsx` | 🆕 新增 | 评论列表组件，支持嵌套回复线程 |
| `comments.ts` | 🆕 新增 | 评论 API 服务，已修复 N+1 查询 |
| `ArticlePage.tsx` | ✏️ 修改 | 集成评论区到文章详情页 |
| `index.ts` | ✏️ 修改 | 新增 Comment 和 Reply 类型定义 |

### 测试状态
- ✅ ESLint 检查通过
- ✅ 47 个单元测试全部通过
- ✅ QA 端到端验收通过（登录 → 发表评论 → 回复评论流程）

### 关联信息
- CEO 评审：评论功能为 MVP 核心需求之一
- 架构方案：参见 `docs/eng-review-v2.md`
- QA 报告：所有交互路径已验证
```

---

## 完整工作流回顾

至此，GStack 的整条开发流水线已经全盘打通：

```
💡 /plan-ceo-review    →  让你守住最小 MVP，不忘初心
    ↓
📝 /plan-eng-review    →  让架构有图纸，不拉跨
    ↓
🛠️ 编写代码            →  AI 根据蓝图开发
    ↓
🛡️ /review             →  对抗性审查，把问题杀死在萌芽
    ↓
🤖 /qa                 →  AI 亲自用浏览器跑通业务流程
    ↓
🚀 /ship               →  撰写完美史稿，安全发版
```

每个环节对应团队里的一个角色：

```
你（独立开发者） + GStack = 一支完整的工程团队

┌─────────────────────────────────────────┐
│  🧑‍💼 CEO        → /plan-ceo-review      │
│  🏗️ Tech Lead  → /plan-eng-review      │
│  👨‍💻 Developer  → 你自己 + Claude       │
│  🛡️ Reviewer   → /review              │
│  🤖 QA         → /qa + /browse        │
│  📦 DevOps     → /ship                │
└─────────────────────────────────────────┘
```

---

## GStack 纪律清单

把这份清单贴在显示器旁边，作为每次开发的 Checklist：

- [ ] 新功能是否通过了 `/plan-ceo-review`？
- [ ] 技术方案是否通过了 `/plan-eng-review`？
- [ ] 每个小模块完成后是否执行了 `/review`？
- [ ] 涉及 UI 交互的功能是否通过了 `/qa`？
- [ ] 是否使用 `/ship` 发版而不是手动 `git push`？

---

## 小结

▪️ `/ship` 自动完成 Stage → Commit → Test → Pull → Push → PR 的全流程
▪️ Commit Message 遵循 Conventional Commits 规范，告别敷衍的 "Update"
▪️ PR 自动附带变更清单、测试状态和关联文档，团队协作零摩擦
▪️ GStack 的六个角色组成一支完整的虚拟开发团队，让独立开发者拥有大厂工程能力

有了 GStack 这套技能包，"让 AI 帮我写代码" 正式进阶为更高级的范式：**"让 AI 帮我运营并交付这款数字产品。"**

---

恭喜你完成了 GStack 实战指南系列的全部旅程！去创造你的下一款现象级应用吧！🎉

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发。Bye~

---
*📝 作者：NIHoa ｜ 系列：GStack实战指南系列 ｜ 更新日期：2025-04-17*
