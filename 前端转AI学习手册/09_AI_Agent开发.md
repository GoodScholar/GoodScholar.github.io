# 📅 第九章：AI Agent 开发（Week 11-12）

> **目标**：理解 Agent 架构，掌握 Function Calling 和 LangGraph，构建一个能自主搜索和分析的 AI 研究助手。

---

## 学习内容

- **Function Calling / Tool Use** — 让 LLM 调用外部工具
- **ReAct 模式** — 推理 → 行动 → 观察 → 循环
- **LangGraph** — 状态机式 Agent 设计
- **MCP 协议** — Model Context Protocol

---

## Agent vs 普通 API 调用的区别

```
普通 API 调用：
  用户提问 → LLM 回答 → 结束

Agent：
  用户提问 → LLM 思考 "我需要更多信息"
    → 调用搜索工具 → 拿到结果
    → LLM 再思考 "还需要更多数据"
    → 调用另一个工具 → 拿到结果
    → LLM 综合所有信息 → 生成最终回答
```

---

## Function Calling 示例

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "搜索互联网获取最新信息",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "搜索关键词"}
                },
                "required": ["query"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto",
)
```

---

## LangGraph 状态机

```
       ┌──────────────┐
       │  分解子问题   │
       └──────┬───────┘
              ↓
       ┌──────────────┐
  ┌───→│  搜索子问题   │←──┐
  │    └──────┬───────┘   │
  │           ↓           │
  │    ┌──────────────┐   │
  │    │  提取内容     │   │
  │    └──────┬───────┘   │
  │           ↓           │
  │    ┌──────────────┐   │
  │    │ 信息足够了吗？ │───┘（不够，继续搜）
  │    └──────┬───────┘
  │           ↓ （够了）
  │    ┌──────────────┐
  │    │  生成报告     │
  │    └──────────────┘
```

---

## 🏆 通关项目：ResearchBot — AI 研究助手

### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 输入主题 → 分解子问题 | LLM 任务分解、CoT |
| 自动搜索每个子问题 | Function Calling / Tool Use |
| 自动提取网页内容 | `beautifulsoup4`、内容提取 |
| 整合生成 Markdown 报告 | 多步推理、信息综合 |
| 前端实时显示状态 | WebSocket / SSE 状态推送 |
| 每步日志可展开 | 可观测性、步骤轨迹 |
| LangGraph 状态流转 | 状态机、条件分支 |
| 不确定时问用户 | Human-in-the-loop |
| 超时保护（30s） | 超时处理、降级 |
| 报告导出 | 文件生成与下载 |

---

## 🎮 章节小游戏：Agent 密室逃脱

构建一个密室逃脱游戏——玩家被困在一个虚拟密室中，Agent 需要调用不同工具来解谜、开门、逃脱。

### 游戏流程

```
🔒 你被困在了一间密室中。房间里有：
   - 一扇上锁的门（需要 4 位数字密码）
   - 一台可以上网的电脑
   - 一面镜子后面似乎有东西
   - 一本加密的日记

Agent 开始工作...

🤔 思考：我需要先检查房间里的物品
🔧 调用工具：examine_item("日记")
📋 结果：日记用 Caesar 密码加密，偏移量未知

🤔 思考：我需要破解密码，先搜索解密方法
🔧 调用工具：search_web("Caesar cipher brute force")
📋 结果：Caesar 密码只有 25 种可能，可以暴力破解

🤔 思考：让我试试所有偏移量
🔧 调用工具：decrypt_caesar("KHOOR", shift=3)
📋 结果：解密成功！原文是 "HELLO"，密码线索在最后一页...

🤔 思考：拿到了两位数字，还需要找剩下的
🔧 调用工具：examine_item("镜子")
📋 结果：镜子后面刻着数字 "42"

🎉 Agent 拼出完整密码 "4217"，成功逃脱！
   共使用 6 步，调用了 3 种工具
```

### 需要用到的知识点

| 功能 | 知识点 |
|------|--------|
| 定义工具 | Function Calling tools 数组 |
| Agent 循环 | ReAct 模式（思考→行动→观察） |
| 4 种工具 | examine / search / decrypt / open_door |
| 状态流转 | LangGraph 条件分支 |
| 前端展示 | 实时显示每步思考和工具调用 |
| 超时保护 | 30 秒限制 |

### 最低要求

- [ ] 至少 4 种工具供 Agent 调用
- [ ] Agent 能自主决定调用哪个工具
- [ ] 前端能看到每一步的思考过程
- [ ] 成功逃脱 → 显示总步数和工具调用记录

### 进阶挑战

- [ ] 多个房间，每个房间不同谜题
- [ ] 加入 Human-in-the-loop（Agent 不确定时问玩家）

---

### ✅ 通关 Checklist

- [ ] 输入主题 → Agent 全自动完成研究
- [ ] 能看到实时执行状态
- [ ] 能展开查看每步思考和工具调用
- [ ] 报告有标题、摘要、分点论述、引用来源
- [ ] 超时不崩溃
- [ ] 用了至少 2 种工具（搜索 + 内容提取）
- [ ] 能导出 Markdown 报告
- [ ] 能解释 Agent 和普通 API 调用的区别
