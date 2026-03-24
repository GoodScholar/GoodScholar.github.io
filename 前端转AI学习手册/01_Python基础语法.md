# 📅 第一章：Python 基础语法（Week 1）

> **目标**：能用 Python 写基本的命令行程序，掌握和 JS/TS 的核心差异。

---

## JS/TS → Python 对照表

| JS/TS 概念 | Python 对应 | 差异要点 |
|------------|-------------|---------:|
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

---

## 学习方法

1. **不要从头看视频课**。直接打开 [Python 官方教程](https://docs.python.org/zh-cn/3/tutorial/) 对照着写
2. 遇到和 JS 不同的地方停下来搞懂
3. 每学一个概念，立刻写代码验证

---

## 每日任务

### Day 1：变量、字符串、f-string

**练习**：写一个温度转换器（命令行输入输出）

```
请输入温度值: 100
请选择转换方向 (1: °C→°F  2: °F→°C): 1
100.0°C = 212.0°F
```

> 公式：°F = °C × 9/5 + 32，°C = (°F - 32) × 5/9

**知识要点**：
- `input()` 接收用户输入（总是字符串）
- `float()` 转换类型
- `f"结果: {value:.2f}"` 格式化输出

---

### Day 2：列表、字典、元组、集合

**练习**：写一个词频统计器

```
请输入文本: the cat sat on the mat and the cat saw the dog

词频统计结果（按频率降序）：
  the  → 4 次
  cat  → 2 次
  sat  → 1 次
  ...
```

**知识要点**：
- `str.split()` 分词
- `dict` / `collections.Counter` 计数
- `sorted(d.items(), key=lambda x: x[1], reverse=True)` 排序

---

### Day 3：函数、*args、**kwargs、装饰器

**练习**：写一个 `@timer` 装饰器，打印函数执行时间

```python
@timer
def slow_function():
    import time
    time.sleep(1.5)
    return "done"

result = slow_function()
# ⏱️ slow_function 执行耗时: 1.5012 秒
```

**知识要点**：
- `def wrapper(*args, **kwargs)` 透传参数
- `functools.wraps` 保留原函数信息
- 装饰器不能丢失原函数的返回值

---

### Day 4：类与面向对象

**练习**：用 class 实现 TodoList（增删改查，数据存内存）

```python
todo = TodoList()
todo.add("学习 Python")      # ✅ 已添加 (ID: 1)
todo.complete(1)              # ✅ 已完成
todo.update(1, "复习 Python") # ✏️ 已更新
todo.delete(1)                # 🗑️ 已删除
todo.list_all()               # 打印所有任务
```

**知识要点**：
- `__init__` 构造方法
- 实例方法 `self` 参数
- 列表操作 + ID 管理

---

### Day 5：文件读写、JSON、异常处理

**练习**：把 TodoList 改为持久化到 JSON 文件

```python
todo = TodoList("my_todos.json")  # 指定文件
todo.add("学 FastAPI")
# 重启后数据不丢失
todo2 = TodoList("my_todos.json")
todo2.list_all()  # 数据还在
```

**知识要点**：
- `json.dump()` / `json.load()` 读写
- `pathlib.Path` 判断文件是否存在
- `try/except FileNotFoundError` 容错

---

## 🎮 章节小游戏：文字冒险 · 地牢逃脱

用本章学到的知识，写一个命令行文字冒险游戏：

### 游戏规则

```
你醒来发现自己在一个黑暗的地牢中...

当前状态：❤️ 生命值 100 | 🎒 背包：空 | 📍 房间：入口大厅

请选择行动：
1. 向北走 → 武器室
2. 向东走 → 厨房
3. 向南走 → 牢房
> 1

你来到了武器室，发现一把生锈的剑。
1. 捡起剑
2. 离开
> 1

🗡️ 获得道具：生锈的剑（攻击力 +15）
```

### 需要用到的知识点

| 功能 | 知识点 |
|------|--------|
| 玩家状态（生命、攻击力） | 变量、f-string |
| 房间描述 | 字典（`rooms = {"入口": {...}}`） |
| 行动选择 | `input()` + `if/elif/else` |
| 战斗系统 | `import random`、循环 |
| 背包系统 | 列表的增删查 |
| 游戏循环 | `while True` + 退出条件 |

### 最低要求

- [ ] 至少 5 个房间
- [ ] 3 个可拾取道具
- [ ] 1 场怪物战斗（回合制，用 random 决定伤害）
- [ ] 找到钥匙 → 打开出口 → 逃脱成功

### 进阶挑战

- [ ] 用函数封装每个房间的逻辑
- [ ] 用装饰器 `@log_action` 记录每次行动
- [ ] 游戏结束后用 JSON 保存存档

---

## ✅ 本章通关 Checklist

- [ ] 能写 f-string 格式化字符串
- [ ] 理解列表推导式 `[x for x in arr if ...]`
- [ ] 能写带参数的装饰器
- [ ] 能用 class 实现基础 CRUD
- [ ] 能读写 JSON 文件
- [ ] 5 个练习全部独立完成
