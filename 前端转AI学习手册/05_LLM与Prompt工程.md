# 📅 第五章：LLM 与 Prompt 工程（Week 5）

> **目标**：理解大语言模型的工作原理，掌握 Prompt Engineering 核心技巧，写出第一个 API 调用。

---

## 每日任务

### Day 1-2：LLM 是什么

**学习资源**：吴恩达 [ChatGPT Prompt Engineering](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)（1.5h，免费）

**搞懂这些概念**：

| 概念 | 一句话解释 |
|------|-----------|
| Token | 模型处理的最小文本单位，≈ 0.75 个英文单词 |
| Temperature | 越高越随机，越低越确定。创作用 0.7-1.0，分析用 0-0.3 |
| System Prompt | 给模型的"人设说明书"，决定它以什么角色回答 |
| 幻觉 | 模型一本正经胡说八道——它不"知道"事实，只是在做概率预测 |
| Context Window | 模型能一次处理的最大 Token 数（如 128K） |

---

### Day 3-4：Prompt Engineering 实战

在 ChatGPT / Claude 上做 **20+ 次** 实验，练习这些技巧：

**1. 角色设定**
```
你是一位资深前端架构师。请用简洁专业的语言回答。
```

**2. Few-shot（给例子）**
```
把用户评论分类为正面/负面：
评论："这个功能太好用了" → 正面
评论："加载太慢了完全用不了" → 负面
评论："界面还行但有些bug" → ?
```

**3. Chain-of-Thought（让它分步思考）**
```
请先分析问题，然后一步步推理，最后给出结论。
```

**4. 结构化输出**
```
请用 JSON 格式回答，包含 name、category、confidence 字段。
```

---

### Day 5：API 初体验

注册 OpenAI / DeepSeek API，写第一个调用：

```python
from openai import OpenAI

client = OpenAI(api_key="your-key")
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手"},
        {"role": "user", "content": "用一句话解释什么是量子计算"}
    ]
)
print(response.choices[0].message.content)
```

---

## 🎮 章节小游戏：Prompt 决斗场

两个 Prompt 同时挑战同一个任务，看谁的输出质量更高。你来当裁判。

### 游戏规则

```
🏟  第 1 轮：翻译挑战

📝 任务：把 "The attention mechanism allows the model to focus on
         relevant parts of the input" 翻译为中文

🅰️ 选手A（直接翻译）：
   System: "你是翻译助手"
   → "注意力机制允许模型关注输入的相关部分。"

🅱️ 选手B（专业翻译）：
   System: "你是资深 NLP 论文翻译家，术语用括号标注英文原文"
   → "注意力机制（Attention Mechanism）使模型能够聚焦于
      输入序列中与当前任务相关的部分。"

🏆 你选谁？输入 A 或 B > B
   ✅ 选手B 得 1 分！

   当前比分：A: 0 | B: 1
```

### 怎么玩

1. 准备 5 个不同类型的任务（翻译、摘要、代码解释、起标题、纠错）
2. 对每个任务写 2 个不同风格的 Prompt
3. 用 Python 调 API 拿到两份输出
4. 自己当评委打分，记录每轮结果

### 需要用到的知识点

| 功能 | 知识点 |
|------|--------|
| 调用 LLM API | `openai` SDK |
| 多 Prompt 对比 | 循环 + 列表 |
| 用户输入评分 | `input()` |
| 统计结果 | 字典计数 |
| 输出美化 | f-string + 表格 |

### 最低要求

- [ ] 5 个不同任务
- [ ] 每个任务 2 个 Prompt，共 10 次 API 调用
- [ ] 每轮展示两份输出，手动选优
- [ ] 最终统计每个 Prompt 的胜率

### 进阶挑战

- [ ] 加入 LLM 自动评分（让另一个 LLM 当裁判）
- [ ] 输出 Markdown 对比报告

---

## ✅ 本章通关 Checklist

- [ ] 能解释 Token、Temperature、System Prompt 的含义
- [ ] 做了 20+ 次 Prompt 实验
- [ ] 会用 Few-shot 和 Chain-of-Thought 技巧
- [ ] 能用 Python 调用 LLM API 并拿到回复
- [ ] 知道什么是"幻觉"以及怎么缓解
