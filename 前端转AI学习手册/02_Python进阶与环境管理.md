# 📅 第二章：Python 进阶与环境管理（Week 2）

> **目标**：掌握现代 Python 项目结构、异步编程和测试。

---

## 学习内容

1. **虚拟环境与包管理**：`uv init`、`uv add`、`uv run`
2. **项目结构**：`src/` layout + `tests/`
3. **标准库**：`pathlib`、`json`、`datetime`、`typing`、`dataclasses`、`enum`
4. **异步编程**：`asyncio`、`httpx`

---

## 每日任务

### Day 1：用 uv 创建项目

把 Week 1 的 TodoList 迁移到标准项目结构：

```
my-todolist/
├── pyproject.toml
├── src/
│   └── my_todolist/
│       ├── __init__.py
│       └── todo.py
└── tests/
    └── test_todo.py
```

**知识要点**：
- `uv init my-todolist` 创建项目
- `uv add httpx` 添加依赖
- `uv run python -m my_todolist` 运行

---

### Day 2：用 dataclass 和类型注解重构

```python
from dataclasses import dataclass, field
from typing import Optional
from enum import Enum

class Status(Enum):
    TODO = "todo"
    DONE = "done"

@dataclass
class TodoItem:
    id: int
    title: str
    status: Status = Status.TODO
```

**知识要点**：
- `@dataclass` 自动生成 `__init__`、`__repr__`
- `Enum` 约束状态值
- 类型注解让代码更可读（和 TypeScript 一个思路）

---

### Day 3：pathlib + 配置管理器

**练习**：实现一个配置管理器（读/写/合并 JSON 配置）

```python
config = ConfigManager("app_config.json")
config.set("theme", "dark")
config.set("lang", "zh-CN")
config.get("theme")  # "dark"
config.merge({"debug": True, "theme": "light"})  # 合并
```

---

### Day 4：httpx + asyncio 异步爬虫

**练习**：并发请求 5 个网页，统计状态码和响应时间

```python
import asyncio
import httpx

async def fetch(url):
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        return {"url": url, "status": resp.status_code}

async def main():
    urls = ["https://httpbin.org/get"] * 5
    results = await asyncio.gather(*[fetch(u) for u in urls])
```

---

### Day 5：用 pytest 写单元测试

给 TodoList 写 5 个测试：

```python
def test_add_todo(tmp_path):
    todo = TodoList(tmp_path / "test.json")
    todo.add("测试任务")
    assert len(todo.list_all()) == 1

def test_delete_nonexistent():
    """删除不存在的 ID 应该提示错误"""
    ...
```

---

## 🏆 通关项目：PyFM — CLI 文件管理器

```bash
pyfm scan <目录>             # 扫描目录，统计文件类型分布
pyfm search <目录> <关键词>   # 按文件名搜索
pyfm duplicates <目录>       # 查找重复文件（按大小+哈希）
pyfm organize <目录>         # 按类型自动归类
pyfm report <目录>           # 生成 JSON 报告
```

### 功能 → 技能映射

| 功能 | 练到的技能 |
|------|-----------|
| 扫描目录统计 | `pathlib` 遍历、`dict` 聚合 |
| 文件名搜索 | 字符串方法、列表推导式 |
| 查找重复文件 | `hashlib` MD5、`defaultdict` |
| 自动归类 | `shutil.move()`、异常处理 |
| JSON 报告 | `json.dump()`、`dataclass` |
| 命令行参数 | `argparse` |
| 测试 | `pytest`、`tmp_path` |

### 🎮 章节小游戏：文件系统寻宝

写一个 CLI 寻宝游戏——程序先在指定目录下自动"藏宝"，然后你用代码去"找宝"。

#### 游戏流程

```bash
# 第一步：运行藏宝脚本（自动在目录下生成隐藏文件）
python treasure_hide.py ~/playground

🏴‍☠️ 已在 ~/playground 下藏了 5 个宝藏！
提示：宝藏文件名都包含 "treasure"，内容是一段加密文本。
找到所有宝藏，拼出最终密码！

# 第二步：运行寻宝脚本
python treasure_hunt.py ~/playground

🔍 扫描中...
  找到宝藏 1/5：./docs/readme_treasure_a3f.txt → 解密片段："Pyth"
  找到宝藏 2/5：./images/.treasure_hidden.dat → 解密片段："on_i"
  ...
🎉 全部找到！最终密码：Python_is_awesome
```

#### 需要用到的知识点

| 功能 | 知识点 |
|------|--------|
| 藏宝脚本（创建文件） | `pathlib.mkdir()`、写文件 |
| 递归搜索目录 | `Path.rglob("*treasure*")` |
| 文件内容解密 | `hashlib`、base64 |
| 宝藏数据结构 | `@dataclass` |
| 验证最终密码 | `pytest` 测试 |

#### 最低要求

- [ ] 藏宝脚本能在任意目录下生成 5 个隐藏宝藏文件
- [ ] 寻宝脚本能递归搜索并找到所有宝藏
- [ ] 拼出最终密码并验证
- [ ] 用 `pytest` 写 3 个测试（藏宝→寻宝→验证密码）

---

### ✅ 通关 Checklist

- [ ] `pyfm scan ~/Downloads` 能看到文件分布表格
- [ ] 能搜索文件并显示结果
- [ ] 能找出重复文件
- [ ] 能自动整理文件（执行前确认 y/n）
- [ ] 能生成 JSON 报告
- [ ] 有 `pyproject.toml` + `src/` 结构
- [ ] 5 个 pytest 测试全部通过
- [ ] 有 README
