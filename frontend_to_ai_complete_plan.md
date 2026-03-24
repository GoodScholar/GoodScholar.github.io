# 🚀 前端工程师转 AI —— 完整学习计划

> **目标受众**：有 2+ 年经验的纯前端工程师
> **核心策略**：不从零学理论，从应用层切入，做项目驱动学习
> **总周期**：16 周（每周 12-15 小时）
> **通关方式**：每个阶段完成一个具体项目，做完 = 通关

---

## 📌 第零步：选方向

AI 领域很大，前端转型有 3 条主流路径：

| 路径 | 描述 | 难度 | 薪资天花板 | 适合人群 |
|------|------|------|-----------|---------:|
| **🅰️ AI 应用工程师** | 用 AI API/框架构建产品 | ⭐⭐ | 中高 | 想快速转型、喜欢做产品 |
| **🅱️ AI 全栈工程师** | 前端 + 后端 + AI 集成 | ⭐⭐⭐ | 高 | 愿意学后端、想做独立开发者 |
| **🅲️ ML/算法工程师** | 训练模型、做算法研究 | ⭐⭐⭐⭐⭐ | 极高 | 数学好、愿意长期深入 |

> **推荐路线：A → B**。先成为 AI 应用工程师，再扩展到全栈。这是前端工程师性价比最高的路线。

### 你的前端优势（好好利用）

1. **产品思维** — AI 工程师往往缺乏用户视角，你有
2. **UI/UX 能力** — AI 应用的交互设计是核心竞争力
3. **工程化能力** — 构建、部署、测试经验完全可迁移
4. **TypeScript** — Vercel AI SDK、LangChain.js 等都用 TS
5. **Streaming** — 你消费过 SSE/WebSocket，现在学生产端

### 常见误区（避免踩坑）

- ❌ 不要一开始就学深度学习理论 — 先做应用，遇到瓶颈再补
- ❌ 不要试图学会所有框架 — 选一个深入（推荐 LangChain 生态）
- ❌ 不要只学 Python — 你的 TS/JS 在 AI 应用层仍然极其有价值
- ❌ 不要忽视工程能力 — 很多 AI "研究员"写不好生产代码，这是你的护城河
- ❌ 不要等"准备好了"才开始 — 边做边学

---

# 第一阶段：Python 基础（Week 1-4）

**一句话标准**：能用 Python 独立写一个带 API 的后端服务。

**不需要达到的程度**：
- ❌ 不需要精通元类、描述符等高级特性
- ❌ 不需要学 Django（太重了）
- ❌ 不需要学 numpy/pandas（后面按需补）

---

## 📅 Week 1：Python 基础语法

### JS/TS → Python 对照表

| JS/TS 概念 | Python 对应 | 差异要点 |
|------------|-------------|---------|
| `const/let/var` | 直接赋值 | 没有声明关键字 |
| `() => {}` | `lambda` / `def` | 用缩进代替大括号 |
| `Array` | `list` | 切片 `a[1:3]` 很强大 |
| `Object` | `dict` | 用法几乎一样 |
| `interface/type` | `TypedDict` / `dataclass` | 类型注解是可选的 |
| `async/await` | `async/await` | 概念一样，用 `asyncio` 库 |
| `try/catch` | `try/except` | 几乎一样 |
| `map/filter` | 列表推导式 | `[x*2 for x in arr if x > 0]` |
| `npm` | `pip` / `uv` | `uv` 是新一代包管理，推荐 |
| `package.json` | `pyproject.toml` | 项目配置文件 |

### 怎么学

1. **不要从头看书/视频**，直接打开 [Python 官方教程](https://docs.python.org/zh-cn/3/tutorial/) 对照着写
2. 遇到和 JS 不同的地方，停下来搞懂
3. 每学一个概念，立刻写一段代码验证

### 每日任务

| 天 | 学什么 | 练习 |
|----|--------|------|
| Day 1 | 变量、字符串、f-string | 写一个温度转换器（命令行输入输出） |
| Day 2 | 列表、字典、元组、集合 | 写一个词频统计器（输入文本 → 按频率排序输出） |
| Day 3 | 函数、*args、**kwargs、装饰器 | 写一个 `@timer` 装饰器，打印函数执行时间 |
| Day 4 | 类与面向对象 | 用 class 实现 TodoList（增删改查，数据存内存） |
| Day 5 | 文件读写、JSON、异常处理 | 把 TodoList 改为持久化到 JSON 文件 |

#### 📋 预期输入 / 输出示例

<details>
<summary><b>Day 1：温度转换器</b></summary>

```
请输入温度值: 100
请选择转换方向 (1: °C→°F  2: °F→°C): 1
100.0°C = 212.0°F

请输入温度值: 72
请选择转换方向 (1: °C→°F  2: °F→°C): 2
72.0°F = 22.22°C

请输入温度值: abc
❌ 无效输入，请输入数字

请输入温度值: 0
请选择转换方向 (1: °C→°F  2: °F→°C): 1
0.0°C = 32.0°F
```

> **公式提示**：°F = °C × 9/5 + 32，°C = (°F - 32) × 5/9

</details>

<details>
<summary><b>Day 2：词频统计器</b></summary>

```
请输入文本: the cat sat on the mat and the cat saw the dog

词频统计结果（按频率降序）：
  the  → 4 次
  cat  → 2 次
  sat  → 1 次
  on   → 1 次
  mat  → 1 次
  and  → 1 次
  saw  → 1 次
  dog  → 1 次
共 8 个不同的单词，总计 12 个词
```

> **进阶**：能处理大小写统一（`The` 和 `the` 算同一个词），忽略标点。

</details>

<details>
<summary><b>Day 3：@timer 装饰器</b></summary>

```python
@timer
def slow_function():
    import time
    time.sleep(1.5)
    return "done"

result = slow_function()
```

```
⏱️ slow_function 执行耗时: 1.5012 秒
```

```python
@timer
def add(a, b):
    return a + b

result = add(3, 5)
print(f"结果: {result}")
```

```
⏱️ add 执行耗时: 0.0001 秒
结果: 8
```

> **关键点**：装饰器不能丢失原函数的返回值，`result` 必须正确拿到。

</details>

<details>
<summary><b>Day 4：TodoList 类</b></summary>

```python
todo = TodoList()

todo.add("学习 Python")
# ✅ 已添加: "学习 Python" (ID: 1)

todo.add("写温度转换器")
# ✅ 已添加: "写温度转换器" (ID: 2)

todo.add("复习 f-string")
# ✅ 已添加: "复习 f-string" (ID: 3)

todo.list_all()
# [ ] 1. 学习 Python
# [ ] 2. 写温度转换器
# [ ] 3. 复习 f-string

todo.complete(1)
# ✅ 已完成: "学习 Python"

todo.list_all()
# [x] 1. 学习 Python
# [ ] 2. 写温度转换器
# [ ] 3. 复习 f-string

todo.delete(2)
# 🗑️ 已删除: "写温度转换器"

todo.list_all()
# [x] 1. 学习 Python
# [ ] 3. 复习 f-string

todo.update(3, "复习 f-string 和切片")
# ✏️ 已更新: "复习 f-string" → "复习 f-string 和切片"

todo.delete(99)
# ❌ 未找到 ID 为 99 的任务
```

</details>

<details>
<summary><b>Day 5：TodoList 持久化到 JSON</b></summary>

```python
# 1. 添加任务并保存
todo = TodoList("my_todos.json")  # 指定 JSON 文件
todo.add("学 FastAPI")
todo.add("写单元测试")
todo.complete(1)
todo.list_all()
# [x] 1. 学 FastAPI
# [ ] 2. 写单元测试

# 2. 此时 my_todos.json 文件内容应该是：
```

```json
{
  "todos": [
    {"id": 1, "title": "学 FastAPI", "done": true},
    {"id": 2, "title": "写单元测试", "done": false}
  ]
}
```

```python
# 3. 重启程序后，数据不丢失
todo2 = TodoList("my_todos.json")  # 重新加载
todo2.list_all()
# [x] 1. 学 FastAPI
# [ ] 2. 写单元测试   ← 数据还在！

# 4. 文件不存在时 → 自动创建空列表，不报错
todo3 = TodoList("new_file.json")
todo3.list_all()
# （空）
```

> **关键点**：每次 add/delete/update/complete 后都要自动保存到文件，不能手动调 save。

</details>

---

## 📅 Week 2：Python 进阶 + 环境管理

### 学什么

1. **虚拟环境与包管理**：`uv init`、`uv add`、`uv run`
2. **项目结构**：`src/` layout + `tests/`
3. **标准库**：`pathlib`、`json`、`datetime`、`typing`、`dataclasses`、`enum`
4. **异步编程**：`asyncio`、`httpx`

### 每日任务

| 天 | 练习 |
|----|------|
| Day 1 | 用 `uv` 创建新项目，把 Week1 的 TodoList 迁移到标准结构 |
| Day 2 | 用 `dataclass` 和类型注解重构 TodoList |
| Day 3 | 用 `pathlib` 和 `json` 实现配置管理器（读/写/合并配置） |
| Day 4 | 用 `httpx` + `asyncio` 写异步爬虫（并发请求 5 个网页） |
| Day 5 | 用 `pytest` 给 TodoList 写单元测试 |

---

### 🏆 Week 1-2 通关项目：`PyFM` — CLI 文件管理器

独立完成一个命令行文件管理工具：

```
pyfm scan <目录>             # 扫描目录，统计文件类型分布
pyfm search <目录> <关键词>   # 按文件名搜索
pyfm duplicates <目录>       # 查找重复文件（按文件大小+哈希）
pyfm organize <目录>         # 按类型自动归类到子目录
pyfm report <目录>           # 生成 JSON 分析报告
```

#### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 扫描目录统计文件类型 | `pathlib` 遍历、`dict` 聚合、f-string 格式化 |
| 表格输出按大小排序 | `sorted(key=)`、字符串对齐 |
| 文件名模糊搜索 | 字符串方法、列表推导式过滤 |
| 查找重复文件 | `hashlib` MD5、`defaultdict` 分组、二进制读文件 |
| 自动归类文件 | `pathlib.mkdir()`、`shutil.move()`、异常处理 |
| 生成 JSON 报告 | `json.dump()`、`dataclass`、`datetime` |
| `--verbose` 参数 | `argparse` 命令行解析 |
| pytest 测试（5个） | `pytest`、`tmp_path` fixture |

#### ✅ 完成标准

```
□ pyfm scan ~/Downloads 能看到文件分布表格
□ 能搜索文件并显示结果
□ 能找出重复文件
□ 能自动整理文件（执行前确认 y/n）
□ 能生成 JSON 报告
□ 有 pyproject.toml + src/ 结构
□ 5 个 pytest 测试全部通过
□ 有 README
```

---

## 📅 Week 3：FastAPI（你的"Express"）

### Express → FastAPI 对照

| Express/Koa | FastAPI |
|-------------|---------|
| `app.get('/users', handler)` | `@app.get("/users")` |
| `req.params.id` | 函数参数 `id: int` |
| `req.body` | `Pydantic Model` |
| `middleware` | `middleware` / `Depends` |
| `res.json()` | 直接 `return dict` |
| Zod/Yup 验证 | Pydantic 自动验证 |

### 学什么

- **Pydantic**：定义 Model、嵌套模型、自定义验证器、字段约束
- **依赖注入**：`Depends()` — 数据库连接、认证、权限控制
- **中间件**：CORS、自定义异常处理器

### 每日任务

| 天 | 练习 |
|----|------|
| Day 1 | 搭建项目 + 实现 `POST` 和 `GET /todos` |
| Day 2 | 实现 `PUT`、`DELETE` + Pydantic 校验 |
| Day 3 | 加分页、筛选、排序 |
| Day 4 | 加错误处理、CORS、中间件 |
| Day 5 | 写一个前端页面调用这个 API（Vue/React） |

---

## 📅 Week 4：数据库 + 综合项目

### 学什么

- **SQLite + SQLAlchemy**：Model 定义、CRUD、关联查询
- 或 **MongoDB + Motor**（如果更熟悉 NoSQL）

---

### 🏆 Week 3-4 通关项目：`Shortly` — URL 短链服务

一个完整的短链接服务（后端 API + 前端界面 + 数据库）：

```
API：
  POST /api/shorten          → 创建短链接
  GET  /api/links            → 列出所有短链（分页）
  GET  /api/links/{code}     → 短链详情 + 点击统计
  GET  /{code}               → 302 重定向到原始 URL
  DELETE /api/links/{code}   → 删除短链

前端：
  / — 输入长 URL → 生成短链 → 一键复制
  /dashboard — 短链列表 + 点击量排行
```

#### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 创建短链接 API | FastAPI 路由、Pydantic 请求校验 |
| URL 合法性校验 | `field_validator`、`HttpUrl` 类型 |
| 短码生成（6位随机，不重复） | `secrets` 模块、唯一性检查、重试逻辑 |
| 302 重定向 | `RedirectResponse`、HTTP 状态码 |
| 点击统计（时间、IP、UA） | SQLAlchemy 关联表、`Request` 对象 |
| 分页列表 | `Query` 参数、分页逻辑 |
| 前端生成+复制短链 | 前端 `fetch` 调用 API、剪贴板 API |
| 404 错误处理 | `HTTPException` 自定义异常 |
| SQLite 持久化 | ORM Model、async session |
| 8 个 pytest 测试 | `httpx.AsyncClient` 测试 FastAPI |

#### ✅ 完成标准

```
□ 能通过 API 创建短链接
□ 访问短链能 302 重定向到原始 URL
□ 无效 URL 返回 422，不存在的短码返回 404
□ 看板页面能看到所有短链和点击量
□ 前端能输入 URL → 生成 → 复制
□ 数据重启后不丢失
□ Swagger 文档可访问
□ 8 个测试全部通过
□ 前后端能一起跑
```

---

### 🎓 Python 阶段总通关测试

> 不看教程，3-4 小时内完成：FastAPI 词频统计 API + SQLite + Pydantic + CORS + 3 个 pytest + 标准项目结构 + README。超过 6 小时说明有薄弱环节需要补。

---

# 第二阶段：AI 基础概念（Week 5-6）

---

## 📅 Week 5：理解 LLM 和 Prompt Engineering

### 每日任务

| 天 | 学什么 | 怎么学 |
|----|--------|--------|
| Day 1-2 | LLM 是什么 | 看吴恩达 [ChatGPT Prompt Engineering](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)（1.5h，免费） |
| | | 搞懂：Token、Temperature、System Prompt、幻觉 |
| Day 3-4 | Prompt Engineering | 在 ChatGPT/Claude 上做 20+ 次实验 |
| | | 练习：角色设定、Few-shot、Chain-of-Thought、结构化输出 |
| Day 5 | API 初体验 | 注册 OpenAI/DeepSeek API，用 Python 写第一个调用 |

```python
# Day 5 的第一个 API 调用
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

## 📅 Week 6：理解 Embedding、向量和 RAG

### 每日任务

| 天 | 学什么 | 怎么学 |
|----|--------|--------|
| Day 1-2 | Embedding 和向量 | 看 [3Blue1Brown 线性代数](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) 第1-3集 |
| | | 调 Embedding API，计算文本相似度 |
| Day 3-4 | RAG 概念 | 看吴恩达 [LangChain for LLM](https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/) |
| | | 理解：文档 → 切分 → Embedding → 向量库 → 检索 → 生成 |
| Day 5 | 动手实验 | 用 `chromadb` 存 10 条文本，做语义搜索 |

---

### 🏆 Week 5-6 通关项目：`Prompt Lab` — Prompt 测评工作台

一个系统化测试和比较 Prompt 效果的工具：

```
核心流程：
  1. 定义测试用例（YAML）：输入 + 期望输出关键词
  2. 定义 Prompt 模板（YAML）：多个不同风格的 Prompt
  3. 一键运行全部组合（3 Prompt × 5 用例 = 15 次调用）
  4. 自动评分 + 对比报告 → 找出最佳 Prompt
```

#### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 调用 LLM API 获取回复 | `openai` SDK、API Key 管理、`.env` |
| Streaming 逐字输出 | `stream=True`、迭代器处理 |
| Prompt 模板变量插值 | `str.format()` 或 `jinja2` |
| YAML 配置文件加载 | YAML 读写、数据建模 |
| 15 次并发调用 | `asyncio.Semaphore` 并发控制 |
| 关键词匹配评分 | 字符串匹配、评分函数 |
| 语义相似度评分 | Embedding API、余弦相似度计算 |
| 对比报告表格输出 | 终端表格、数据聚合 |
| 向量库存历史实验 | `chromadb` 存储与检索 |
| Token 消耗和费用统计 | Token 计算、费率配置 |

#### 示例配置

```yaml
# prompts.yaml
prompts:
  - name: "直接翻译"
    system: "你是一个翻译助手。"
    template: "请将以下文本翻译为{target_lang}：\n{text}"
  - name: "专业翻译"
    system: "你是专业的技术文档翻译家，翻译要准确、自然。"
    template: "请翻译为{target_lang}，保持术语准确：\n{text}"

# test_cases.yaml
test_cases:
  - input: { text: "The transformer architecture...", target_lang: "中文" }
    expected_keywords: ["Transformer", "自注意力"]
```

#### 示例输出

```
╔═══════════════╦══════════╦══════════╦══════════╦═════════════╗
║ Prompt        ║ 用例1    ║ 用例2    ║ 平均分   ║ Token 费用  ║
╠═══════════════╬══════════╬══════════╬══════════╬═════════════╣
║ 直接翻译      ║ 72/100   ║ 68/100   ║ 70.0     ║ ¥0.012     ║
║ 专业翻译 ⭐   ║ 91/100   ║ 88/100   ║ 89.5     ║ ¥0.018     ║
╠═══════════════╩══════════╩══════════╩══════════╩═════════════╣
║ 🏆 最佳: "专业翻译"（平均 89.5，性价比最高）                  ║
╚═════════════════════════════════════════════════════════════╝
```

#### ✅ 完成标准

```
□ 能调用至少 1 个 LLM API 并获取回复
□ 能 Streaming 输出到终端
□ 能从 YAML 加载 3+ 个 Prompt 模板 和 5+ 个测试用例
□ 一键运行全部组合（15 次），耗时 < 2 分钟（并发）
□ 自动评分（关键词匹配 + 语义相似度）
□ 生成对比报告，一眼看出最佳 Prompt
□ 能存入 chromadb，搜索历史实验
□ 显示 Token 消耗和费用
□ README 有完整使用示例
```

---

# 第三阶段：AI 应用开发实战（Week 7-12）

---

## 📅 Week 7-8：全栈 AI 聊天应用

### 学什么

**Week 7（后端）**：
- Streaming 响应（SSE）— 你做过消费端，现在学生产端
- 多轮对话管理（对话历史如何传递）
- Token 计算和成本控制
- 多模型支持（OpenAI / Claude / 通义千问）

**Week 8（前端 — 你的主场）**：
- Chat UI（消息气泡、Markdown 渲染、代码高亮）
- Streaming 逐字显示效果
- 对话持久化
- 响应式设计

---

### 🏆 Week 7-8 通关项目：`MiniChat` — 全栈 AI 聊天

#### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 输入消息，AI 逐字回复 | FastAPI SSE + 前端流式 `fetch` |
| 多轮对话（AI 记得上下文） | 对话历史管理、`messages` 数组构建 |
| 新建/切换/删除对话 | 前端状态管理 + 后端 CRUD |
| Markdown 正确渲染 | `marked` / `markdown-it` |
| 代码块语法高亮 + 复制按钮 | `highlight.js` / `prism.js` |
| System Prompt 自定义 | 设置面板 + 后端持久化 |
| 切换模型（至少 2 个） | 后端多模型适配、前端下拉选择 |
| 对话持久化到数据库 | SQLite + SQLAlchemy |
| "思考中"动画 + "停止生成" | 前端状态、`AbortController` |
| 响应式布局 | CSS 媒体查询 |
| 深色/浅色主题 | CSS 变量 |
| 每条消息显示 Token 消耗 | API `usage` 字段解析 |

#### ✅ 完成标准

```
□ AI 逐字回复，体验流畅
□ 多对话管理，历史正确加载
□ Markdown + 代码高亮正常
□ 代码块有复制按钮
□ 能切换至少 2 个模型
□ 能自定义 System Prompt
□ "停止生成"功能正常
□ 刷新页面数据不丢失
□ 移动端不崩溃
□ 深色/浅色主题可切换
□ UI 达到"能放简历截图"的水平
□ 部署上线，有可访问的 URL
```

---

## 📅 Week 9-10：RAG 知识库系统

### 学什么

- 文档解析：PDF/Markdown/网页内容提取
- 文本分割策略：按段落/按 Token/递归分割
- 向量数据库深入：Chroma / Qdrant
- 检索优化：混合搜索、重排序（Reranking）
- LangChain 实战：Document Loaders、Text Splitters、Retrievers

### Week 9 每日任务

| 天 | 任务 |
|----|------|
| Day 1 | 搭建项目，实现 PDF 上传和文本提取 |
| Day 2 | 实现文本分割 + Embedding 生成 + 向量存储 |
| Day 3 | 实现基于向量的语义搜索 |
| Day 4 | 实现 RAG 问答（搜索 + LLM 生成） |
| Day 5 | 加上引用来源追踪 |

**Week 10**：前端界面开发 + 优化检索质量 + 部署

---

### 🏆 Week 9-10 通关项目：`DocMind` — RAG 知识库

#### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 上传 PDF/TXT/MD 文件 | 文件上传 API、前端拖拽上传 |
| 自动解析文档提取纯文本 | `pypdf` / `pdfplumber` |
| 切分成 chunks | LangChain `TextSplitter` |
| 每个 chunk 生成 Embedding 存入向量库 | Embedding API、Chroma 操作 |
| 提问时检索最相关 5 个 chunks | 语义搜索、相似度排序 |
| chunks + 问题 → LLM 生成回答 | RAG Prompt 模板设计 |
| 引用标注 `[1] 来自《xxx.pdf》第3页` | 引用追踪、元数据管理 |
| 多知识库管理 | 数据隔离、知识库 CRUD |
| 找不到相关内容时不瞎编 | 相似度阈值、Prompt 工程 |

#### ✅ 完成标准

```
□ 能上传 PDF，自动解析+向量化
□ 问文档里有的问题 → 准确回答
□ 回答有引用标注，点击能看原文
□ 问文档里没有的 → AI 告知"找不到"，不瞎编
□ 能管理多个知识库
□ 3 份不同文档，问答准确率 > 80%
□ 前端界面直观好用
□ 能解释"为什么有时候回答不准确"
```

---

## 📅 Week 11-12：AI Agent 开发

### 学什么

- Function Calling / Tool Use
- ReAct 模式（推理 → 行动 → 观察 → 循环）
- LangGraph（状态机式 Agent 设计）
- MCP 协议

---

### 🏆 Week 11-12 通关项目：`ResearchBot` — AI 研究助手

#### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 输入主题 → Agent 分解为子问题 | LLM 任务分解、CoT |
| 自动搜索每个子问题 | Function Calling / Tool Use |
| 自动提取网页核心内容 | `beautifulsoup4`、内容提取 |
| 整合生成 Markdown 研究报告 | 多步推理、信息综合 |
| 前端实时显示 Agent 状态 | WebSocket/SSE 状态推送 |
| 每步操作有日志可展开查看 | 可观测性、步骤轨迹 |
| LangGraph 状态流转图 | 状态机、条件分支 |
| 不确定时询问用户 | Human-in-the-loop |
| 单步超时保护（30s） | 超时处理、优雅降级 |
| 报告导出 Markdown | 文件生成与下载 |

#### ✅ 完成标准

```
□ 输入"Transformer 在 CV 中的应用"→ Agent 全自动完成
□ 能看到实时执行状态
□ 能展开查看每步思考过程和工具调用
□ 报告有标题、摘要、分点论述、引用来源
□ 超时不崩溃
□ 用了至少 2 种工具（搜索 + 内容提取）
□ 能导出 Markdown 报告
□ 能解释 Agent 和普通 API 调用的区别
```

---

# 第四阶段：差异化 + 求职（Week 13-16）

---

## 📅 Week 13-14：选一个方向深入（三选一）

### 选项 A：浏览器端 AI 🌊（你的蓝海）

- `Transformers.js` — 浏览器中运行 AI 模型
- `ONNX Runtime Web` — 浏览器端推理
- 练手：纯前端"AI 图片描述"工具（无后端）

> 很少有人同时精通前端和 AI。如果你能在浏览器端做 AI 推理，你会是非常稀缺的人才。

### 选项 B：AI 产品化

- 评估体系设计（如何衡量 AI 应用效果）
- 成本优化（模型路由、缓存、Token 压缩）
- 练手：给 DocMind 加自动化评估流水线

### 选项 C：多模态 AI

- Vision API（图像理解）
- Whisper API（语音处理）
- 练手："拍照 → AI 描述 → 语音播报"应用

---

## 📅 Week 15-16：作品集 + 求职

### 打磨 3 个核心项目

| 项目 | 展示能力 | 行动 |
|------|---------|------|
| **MiniChat** | 全栈 AI + Streaming + UI | 完善 UI，写好 README |
| **DocMind** | RAG 系统 + 检索优化 | 部署上线，录 Demo 视频 |
| **ResearchBot** | Agent 架构 + 工具调用 | 展示思考过程可视化 |

### 简历关键词

确保简历包含：`LLM` `RAG` `Agent` `Prompt Engineering` `LangChain` `Vector Database` `Embedding` `Fine-tuning` `MCP` `Function Calling` `Streaming` `Python` `FastAPI` `TypeScript`

### 技术博客（写 2-3 篇）

推荐选题：
- 《前端工程师如何构建 RAG 知识库系统》
- 《用 Transformers.js 在浏览器里跑 AI》
- 《从零构建 AI Agent：一个前端的视角》

### 开源贡献

给 LangChain / LlamaIndex / Vercel AI SDK 提 PR — 即使是文档修复也有价值。

---

# 📖 学习方法论

## 黄金循环（每天重复）

```
概念速读（30min）→ 照着敲代码（1h）→ 改一改试试（1h）→ 独立做项目（2h）→ 复盘（15min）
```

## 遇到困难

| 场景 | 策略 |
|------|------|
| 看不懂某个概念 | 先跳过，做项目时用到再回来 |
| 代码跑不通 | 给 AI 助手看报错，让它解释 |
| 觉得进度太慢 | 回顾上周不会的东西，你已经进步很多 |
| 觉得太简单 | 加功能，或跳到下一周 |
| 不知道学得够不够 | 检查通关 Checklist，全勾就继续 |

## 通关自检三问

每完成一个项目：

> 1. 从零再做一遍，能用一半时间完成吗？
> 2. 有人问某个技术点原理，能讲清楚吗？
> 3. 敢放 GitHub 上让面试官看吗？

三个 Yes → 通关。有 No → 回去补短板。

---

# 📚 推荐资源

### 必修（按优先级）

1. 🎓 [吴恩达 DeepLearning.AI 短课程](https://www.deeplearning.ai/short-courses/)（免费，每门 1-2h）
2. 📖 [FastAPI 官方文档](https://fastapi.tiangolo.com/zh/)（中文）
3. 📖 [LangChain 官方文档](https://python.langchain.com/docs/get_started/introduction)
4. 🎓 [李宏毅 GenAI 课程](https://speech.ee.ntu.edu.tw/~hylee/genai/2024-spring.php)（中文）
5. 📖 [Vercel AI SDK](https://sdk.vercel.ai/docs)（前端友好）
6. 🎓 [Hugging Face NLP 课程](https://huggingface.co/learn/nlp-course)（免费）
7. 🎬 [3Blue1Brown 线性代数](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)

### 社区

- **Hacker News** — AI 最新动态
- **r/LocalLLaMA** — 本地模型社区
- **即刻 AI 圈** — 中文 AI 社区
- **X/推特** — 关注 @karpathy @ylecun @JimFan

### 数学（按需 ）

- [3Blue1Brown 线性代数](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)（向量/矩阵直觉）
- [StatQuest](https://www.youtube.com/c/joshstarmer)（统计学，一看就懂）

> 走路径 A/B 只需"能理解概念"，不需要会推导公式。

---

# 🧭 16 周总览

```
阶段          周数      通关项目          核心能力
───────────────────────────────────────────────────
Python        W1-2      PyFM             CLI工具 + 测试
基础          W3-4      Shortly          FastAPI + 数据库 + 前端联调
───────────────────────────────────────────────────
AI            W5-6      Prompt Lab       LLM API + Embedding + 向量库
概念
───────────────────────────────────────────────────
AI            W7-8      MiniChat  🎯     全栈 AI + Streaming
应用          W9-10     DocMind   🎯     RAG 全流程
实战          W11-12    ResearchBot 🎯   Agent + 工具调用
───────────────────────────────────────────────────
差异化        W13-14    方向深入          浏览器AI / 产品化 / 多模态
+ 求职        W15-16    作品集           博客 + 简历 + 部署
```

### 每周时间投入

- **工作日**：每天 1.5 小时
- **周末**：每天 2.5 小时
- **总计**：每周 ~12-15 小时

---

> **今天就开始的第一步**：
> ```bash
> curl -LsSf https://astral.sh/uv/install.sh | sh
> uv init my-first-python
> cd my-first-python
> uv run python -c "print('Hello, AI world!')"
> ```
> 然后打开 Week 1 Day 1 的任务：写一个温度转换器。
