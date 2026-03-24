# 📅 第六章：Embedding 向量与 RAG 概念（Week 6）

> **目标**：理解文本是怎么变成向量的，搞懂 RAG 流程，用 chromadb 做第一个语义搜索。

---

## 每日任务

### Day 1-2：Embedding 和向量

**学习资源**：[3Blue1Brown 线性代数](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) 第1-3集

**核心概念**：

| 概念 | 类比 |
|------|------|
| Embedding | 把文字变成一组数字（向量），语义相近的文字距离更近 |
| 向量相似度 | 两段文字的"意思接近程度"，用余弦相似度衡量 |
| 向量数据库 | 专门存向量的数据库，支持"找最接近的 N 条"查询 |

**动手实验**：调 Embedding API 计算两段文字的相似度

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text):
    resp = client.embeddings.create(input=text, model="text-embedding-3-small")
    return resp.data[0].embedding

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

e1 = get_embedding("苹果手机很好用")
e2 = get_embedding("iPhone 的体验非常棒")
e3 = get_embedding("今天天气真好")

print(cosine_similarity(e1, e2))  # 高相似度 ~0.85+
print(cosine_similarity(e1, e3))  # 低相似度 ~0.2-0.5
```

---

### Day 3-4：RAG 概念

**学习资源**：吴恩达 [LangChain for LLM](https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/)

**RAG 全流程**：

```
文档 → 切分成 chunks → 每个 chunk 生成 Embedding → 存入向量库
                                                      ↓
用户提问 → 生成 Embedding → 在向量库中检索最相关的 chunks
                                                      ↓
            检索到的 chunks + 用户问题 → 一起发给 LLM → 生成回答
```

**为什么需要 RAG**：
- LLM 不知道你公司的内部文档
- LLM 的训练数据有截止日期
- RAG 让 LLM 在回答前先"查资料"

---

### Day 5：chromadb 语义搜索

```python
import chromadb

client = chromadb.Client()
collection = client.create_collection("my_docs")

# 存入 10 条文本
docs = [
    "FastAPI 是一个现代 Python Web 框架",
    "React 是一个 JavaScript UI 库",
    "向量数据库用于存储 Embedding",
    ...
]
collection.add(
    documents=docs,
    ids=[f"doc_{i}" for i in range(len(docs))],
)

# 语义搜索
results = collection.query(query_texts=["Python 后端开发"], n_results=3)
print(results["documents"])  # 返回最相关的 3 条
```

---

## 🏆 通关项目：Prompt Lab — Prompt 测评工作台

### 核心流程

```
1. 定义测试用例（YAML）：输入 + 期望输出关键词
2. 定义 Prompt 模板（YAML）：多个不同风格的 Prompt
3. 一键运行全部组合（3 Prompt × 5 用例 = 15 次调用）
4. 自动评分 + 对比报告 → 找出最佳 Prompt
```

### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 调用 LLM API | `openai` SDK、`.env` 管理 |
| Streaming 输出 | `stream=True`、迭代器 |
| YAML 配置加载 | YAML 读写 |
| 15 次并发调用 | `asyncio.Semaphore` |
| 关键词评分 | 字符串匹配 |
| 语义相似度评分 | Embedding + 余弦相似度 |
| 历史实验存储 | `chromadb` |
| Token 费用统计 | API `usage` 字段 |

---

## 🎮 章节小游戏：语义猜词

系统锁定一个"目标词"，你输入各种词来猜——程序实时计算语义相似度，越接近 1.0 越接近答案。像"冷热游戏"一样，靠向量距离逼近目标。

### 游戏流程

```
🎯 目标词已锁定！请开始猜测：

> 苹果
  相似度：0.34 🟡 还差得远

> 水果
  相似度：0.52 🟠 有点意思

> 热带水果
  相似度：0.71 🟢 很接近了！

> 芒果
  相似度：0.89 🟢🟢 几乎了！

> 香蕉
  相似度：0.95 🎉 答对了！目标词就是"香蕉"！

用了 5 次猜测。排行榜第 3 名！
```

### 需要用到的知识点

| 功能 | 知识点 |
|------|--------|
| 计算词向量 | Embedding API |
| 余弦相似度 | `numpy` dot + norm |
| 目标词库 | 列表 / chromadb |
| 相似度等级 | 条件判断 + emoji |
| 排行榜 | 记录猜测次数 |

### 最低要求

- [ ] 目标词库至少 10 个词（随机抽取）
- [ ] 每次猜测实时返回相似度
- [ ] 相似度 > 0.90 视为猜中
- [ ] 记录猜测次数，显示排行

### 进阶挑战

- [ ] 用 chromadb 存历史猜测记录
- [ ] 加提示功能：显示"和目标词最相关的 3 个词"

---

### ✅ 通关 Checklist

- [ ] 能调用 LLM API 并 Streaming 输出
- [ ] 从 YAML 加载 3+ Prompt 和 5+ 用例
- [ ] 一键运行 15 次，耗时 < 2 分钟（并发）
- [ ] 自动评分（关键词 + 语义）
- [ ] 对比报告一眼看出最佳 Prompt
- [ ] 显示 Token 消耗和费用
- [ ] README 有完整使用示例
