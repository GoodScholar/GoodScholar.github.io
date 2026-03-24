# 📅 第八章：RAG 知识库系统（Week 9-10）

> **目标**：构建完整的 RAG 系统——上传文档 → 自动向量化 → 语义问答 → 带引用来源。

---

## 学习内容

- 文档解析：PDF / Markdown / 网页内容提取
- 文本分割策略：按段落 / 按 Token / 递归分割
- 向量数据库深入：Chroma / Qdrant
- 检索优化：混合搜索、重排序（Reranking）
- LangChain 实战：Document Loaders、Text Splitters、Retrievers

---

## Week 9 每日任务

| 天 | 任务 |
|----|------|
| Day 1 | 搭建项目 + PDF 上传 + 文本提取 |
| Day 2 | 文本分割 + Embedding 生成 + 向量存储 |
| Day 3 | 基于向量的语义搜索 |
| Day 4 | RAG 问答（检索 + LLM 生成） |
| Day 5 | 引用来源追踪 |

**Week 10**：前端界面开发 + 检索质量优化 + 部署

---

## RAG 核心流程

```
离线阶段：
  PDF → pypdf 提取文本 → TextSplitter 切分
    → chunks → Embedding API → 存入 Chroma

在线阶段：
  用户提问 → 生成 Embedding → Chroma 检索 Top-5 chunks
    → [chunks + 用户问题] → LLM → 带引用的回答
```

### 关键代码示例

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", "。", "，", " "]
)
chunks = splitter.split_text(document_text)
```

---

## 🏆 通关项目：DocMind — RAG 知识库

### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 上传 PDF/TXT/MD | 文件上传 API、拖拽上传 |
| 解析文档纯文本 | `pypdf` / `pdfplumber` |
| 切分 chunks | LangChain TextSplitter |
| Embedding + 向量存储 | Embedding API、Chroma |
| 语义搜索 Top-5 | 相似度排序 |
| RAG 回答生成 | Prompt 模板设计 |
| 引用标注 `[1] 来自xxx` | 元数据管理 |
| 多知识库管理 | 数据隔离 |
| 找不到时不瞎编 | 相似度阈值 |

---

## 🎮 章节小游戏：文档寻宝 · RAG 解密

上传一份"藏宝图"文档（PDF），用 RAG 问答一步步找出宝藏位置。

### 游戏流程

```
📄 已上传：《神秘岛藏宝指南.pdf》（15 页）

系统：文档已解析并向量化。请提问来找到宝藏！

> 宝藏藏在岛的哪个方向？
🤖 根据文档第 3 页记载，宝藏位于岛屿的东北方向，
   靠近一棵已有 200 年历史的橡树。[来源: 第3页]

> 橡树附近有什么标记？
🤖 第 7 页提到，橡树根部刻有一个十字标记，
   从标记处向正北方走 50 步即为埋藏点。[来源: 第7页]

> 最终密码是什么？
🤖 根据第 12 页的暗号表，最终密码是 "TREASURE2025"。
   [来源: 第12页]

🎉 恭喜！输入密码 "TREASURE2025" 通关！
```

### 需要用到的知识点

| 功能 | 知识点 |
|------|--------|
| 生成藏宝图 PDF | Python 生成 PDF |
| 上传并解析 | `pypdf` 提取文本 |
| 切分 + 向量化 | TextSplitter + Embedding |
| 语义问答 | RAG Prompt 模板 |
| 引用来源 | chunk 元数据追踪 |
| 密码验证 | 最终答案比对 |

### 最低要求

- [ ] 生成一份至少 10 页的"藏宝图"PDF
- [ ] 正确解析并向量化
- [ ] 通过 3-5 个问题能一步步推导出密码
- [ ] 每个回答带引用来源标注
- [ ] 问无关问题时回答"文档中未找到相关信息"

---

### ✅ 通关 Checklist

- [ ] 能上传 PDF，自动解析+向量化
- [ ] 问文档里有的 → 准确回答
- [ ] 回答有引用标注，点击能看原文
- [ ] 问文档里没有的 → 告知"找不到"，不瞎编
- [ ] 能管理多个知识库
- [ ] 3 份不同文档，问答准确率 > 80%
- [ ] 前端直观好用
- [ ] 能解释"为什么有时候回答不准确"
