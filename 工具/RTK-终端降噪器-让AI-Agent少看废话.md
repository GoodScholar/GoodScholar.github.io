# 🦞 RTK：一个让 AI Agent 少看废话的工具

AI 编程智能体正变得越来越能干。Claude Code、Cursor、Codex、Gemini CLI 们已经能自主阅读项目、执行测试、分析日志、修复 bug，并根据结果持续迭代。

**但一个很现实的问题随之出现：Agent 并不是只消耗"思考 token"，它还会被大量终端输出吞掉上下文。**

一次 `npm test` 可能吐出几百行日志，一次 `git diff` 可能包含大量无关格式变化，一次 `docker logs` 很可能被重复错误刷屏。对人来说，这些输出可以快速扫一眼、抓重点；但对于 AI Agent，很多内容会原封不动进入上下文，既增加 token 成本，又压缩了真正有用代码的"思考空间"。

> RTK 做的事情，就是把终端输出从"给人看的流水账"，改造成"给 Agent 用的结构化信号"。

---

## 🚀 1. RTK 是什么：一个终端降噪器

RTK 不是新的编程智能体，而是给 Claude Code、Cursor、Codex 这类 Agent 配套的**终端降噪器**。

它夹在 Agent 和命令行之间，在终端输出进入大模型上下文之前，先把冗长日志、重复报错等进行过滤、压缩并结构化整理。

换句话说：**它不是让 Agent 少干活，而是让 Agent 少看废话。**

### 核心数据

| 指标 | 数值 |
|------|------|
| GitHub Star | 46.3k |
| Token 节省率 | 最高 88.9% |
| 支持命令数 | 100+ 种开发命令 |
| 30分钟会话节省 | ~80%（118k → 23.9k tokens）|

---

## ⚙️ 2. 工作原理：Agent 与 Shell 之间的一层代理

RTK 的思路不是改造大模型本身，而是在 Agent 和 shell 命令之间加一层代理。

### 工作流对比

```
没有 RTK：
Claude → git status → shell → git 原始输出 (~2,000 tokens)

使用 RTK：
Claude → git status → RTK → git → RTK 过滤 (~200 tokens) → Claude
                              ↓
                         [智能过滤]
```

### 四类核心处理

| 处理方式 | 说明 |
|---------|------|
| 🔍 智能过滤 | 去掉注释、空白字符、样板化输出和低价值噪声 |
| 📦 分组聚合 | 把相似文件、相似错误按目录或错误类型归类 |
| ✂️ 截断机制 | 保留关键上下文，移除冗余部分 |
| 🔁 去重 | 折叠重复的日志行并附带出现次数 |

> 这类设计特别适合编程 Agent，因为 Agent 真正需要的通常不是完整日志，而是失败了几个测试、失败点在哪个文件哪一行、哪些文件发生变化等信息。

---

## 📋 3. 功能特性一览

### Auto-Rewrite Hook：自动化重写命令

RTK 提供了 Auto-Rewrite Hook，可以自动拦截 Bash 命令，并把普通命令改写成 RTK 命令。

例如：Agent 本来想执行 `git status`，hook 会在执行前把它改成 `rtk git status`，开发者和 Agent 的工作流基本不用改变。

### 支持的 Agent 平台

| Agent | 初始化命令 |
|-------|-----------|
| Claude Code / Copilot | `rtk init -g` |
| Gemini CLI | `rtk init -g --gemini` |
| Codex (OpenAI) | `rtk init -g --codex` |
| Cursor | `rtk init -g --agent cursor` |
| Windsurf | `rtk init --agent windsurf` |
| Cline / Roo Code | `rtk init --agent cline` |

---

## 🔧 4. 快速上手：三步开始使用

### 第一步：安装

```bash
# macOS 用户优先使用 Homebrew
brew install rtk

# Linux / macOS 也可以使用官方安装脚本
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

### 第二步：验证安装

```bash
# 确认版本（应显示 "rtk 0.27.x"）
rtk --version

# 查看 token 节省统计
rtk gain
```

### 第三步：为 AI 智能体安装 Hook

```bash
# Claude Code / Copilot（默认）
rtk init -g

# 其他 Agent
rtk init -g --gemini    # Gemini CLI
rtk init -g --codex      # Codex (OpenAI)
rtk init -g --agent cursor  # Cursor
rtk init --agent windsurf   # Windsurf
```

### 第四步：测试

```bash
# 重启你的 AI 工具后，测试自动重写
git status  # 会自动被重写为 rtk git status
```

---

## 💡 5. 使用场景与效果对比

### 典型场景 Token 消耗对比

| 场景 | 原始输出 | RTK 处理后 | 节省比例 |
|------|---------|-----------|---------|
| `npm test` | ~5,000 tokens | ~500 tokens | 90% |
| `git diff` | ~3,000 tokens | ~300 tokens | 90% |
| `cargo test` | ~8,000 tokens | ~800 tokens | 90% |
| `docker logs` | ~15,000 tokens | ~1,500 tokens | 90% |

### ✅ 推荐做法 vs ❌ 避免做法

| 类型 | ✅ 推荐做法 | ❌ 避免做法 |
|------|-----------|-----------|
| Agent 配置 | 开启 Auto-Rewrite Hook | 手动每次输入 rtk 前缀 |
| 新项目 | 先 `rtk gain` 查看节省统计 | 不关注 token 消耗 |
| 调试场景 | `rtk logs` 查看过滤记录 | 盲目信任所有输出 |

---

## 🎯 6. 为什么 RTK 值得使用

### RTK 的本质价值

一个优秀的编程智能体，**不应把所有终端输出都一股脑塞进上下文**，指望模型自己去筛选噪声。

真正工程化的 Agent 系统，会在信息进入大模型前就完成第一轮"清洗"——剔除重复日志、过滤无用样板、突出关键错误和证据。

RTK 正是这种思路的实践。它远不止是一个省 Token 的小工具，而是 AI 编程时代里重要的**上下文优化层**。

### 常见问题排查

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| 命令未被重写 | Hook 未正确安装 | 重启 AI 工具后重新 `rtk init -g` |
| 版本过旧 | 功能不完整 | `brew upgrade rtk` 或重新安装 |
| 部分命令不支持 | 仍在迭代中 | 提 Issue 到 GitHub 仓库 |

---

## 📦 7. 部署 Checklist

### 安装阶段
- [ ] 确认安装成功：`rtk --version`
- [ ] 选择对应的 Agent 平台并初始化
- [ ] 重启 AI 工具使 Hook 生效

### 配置阶段
- [ ] 查看当前节省统计：`rtk gain`
- [ ] 测试常用命令是否正常重写
- [ ] 确认关键命令（git、npm、docker）的输出被正确过滤

### 运行阶段
- [ ] 定期查看 token 节省报告
- [ ] 关注 GitHub 更新，及时升级版本
- [ ] 根据需要调整过滤规则

---

## 🏁 结语

> 上下文窗口不是垃圾桶，Token 更不是无限资源。让智能体少读噪声、多抓重点，本质上就是在提升整个开发系统的工程效率和经济性。

过去，我们优化的是代码性能、构建速度和测试耗时。而当 Agent 进入真实开发流程后，还需要优化另一个关键变量：**Agent 看到的信息质量**。

**项目链接**：https://github.com/rtk-ai/rtk
