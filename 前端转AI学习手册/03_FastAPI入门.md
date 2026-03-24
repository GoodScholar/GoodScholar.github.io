# 📅 第三章：FastAPI 入门（Week 3）

> **目标**：能用 FastAPI 独立写完整的 RESTful API。FastAPI 就是你的 Express/Koa。

---

## Express → FastAPI 对照表

| Express/Koa | FastAPI |
|-------------|---------|
| `app.get('/users', handler)` | `@app.get("/users")` |
| `req.params.id` | 函数参数 `id: int` |
| `req.body` | `Pydantic Model` |
| `middleware` | `middleware` / `Depends` |
| `res.json()` | 直接 `return dict` |
| Zod/Yup 验证 | Pydantic 自动验证 |

---

## 学习内容

- **Pydantic**：定义 Model、嵌套模型、自定义验证器、字段约束
- **依赖注入**：`Depends()` — 数据库连接、认证、权限检查
- **中间件**：CORS 配置、自定义异常处理器

---

## 每日任务

### Day 1：搭建项目 + 基础路由

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class TodoCreate(BaseModel):
    title: str

@app.post("/todos")
def create_todo(todo: TodoCreate):
    return {"id": 1, "title": todo.title, "done": False}

@app.get("/todos")
def list_todos():
    return [...]
```

启动：`uvicorn main:app --reload`  
打开 Swagger：`http://localhost:8000/docs`

---

### Day 2：完整 CRUD + Pydantic 校验

- 实现 `PUT /todos/{id}`、`DELETE /todos/{id}`
- Pydantic 加字段约束：`title: str = Field(min_length=1, max_length=100)`
- 自定义验证器：`@field_validator`

---

### Day 3：分页、筛选、排序

```python
@app.get("/todos")
def list_todos(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    sort: str = Query("created_at", regex="^(created_at|title)$"),
):
    ...
```

---

### Day 4：错误处理 + CORS + 中间件

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(status_code=404, content={"detail": "未找到"})
```

---

### Day 5：前端联调

用你熟悉的框架（Vue/React）写一个简单前端页面调用这个 API：
- 展示 Todo 列表
- 支持添加、完成、删除
- 用 `fetch` 或 `axios` 调用后端

---

## 🎮 章节小游戏：API 猜数字对战

用 FastAPI 写一个猜数字游戏的后端 API，再写一个前端页面来玩。

### API 设计

```
POST /api/games          → 创建新游戏（服务器随机生成 1-100 的数字）
                           返回 {"game_id": "abc123", "message": "游戏开始！猜一个 1-100 的数字"}

POST /api/games/{id}/guess  → 提交猜测 {"number": 42}
                           返回 {"result": "太大了", "attempts": 3}
                           或   {"result": "太小了", "attempts": 4}
                           或   {"result": "🎉 恭喜！", "attempts": 5, "answer": 42}

GET  /api/games/{id}     → 查看游戏状态（猜了几次、是否结束）
GET  /api/leaderboard    → 排行榜（按猜测次数排序，最少的排第一）
```

### 需要用到的知识点

| 功能 | 知识点 |
|------|--------|
| 随机数生成 | `random.randint(1, 100)` |
| 游戏状态存储 | 内存字典 或 SQLite |
| 请求校验 | Pydantic：`number: int = Field(ge=1, le=100)` |
| 排行榜排序 | `sorted()` + `Query` 分页 |
| 前端页面 | 你的前端主场！ |

### 最低要求

- [ ] 能创建游戏、猜数字、返回大/小/正确
- [ ] 10 次猜不中自动结束，告知答案
- [ ] 排行榜按猜测次数排序
- [ ] 前端页面能完整玩一局

### 进阶挑战

- [ ] 加难度选择（简单 1-50 / 困难 1-1000）
- [ ] 加多人模式（同一个 game_id 多人轮流猜）

---

## ✅ 本章通关 Checklist

- [ ] 能用 FastAPI 写完整的 CRUD API
- [ ] 理解 Pydantic Model 和 Field 校验
- [ ] Swagger 文档能正常访问
- [ ] CORS 配置正确，前端能跨域调用
- [ ] 自定义了异常处理
