# 节点编排系统前后端架构设计

本方案基于我们在前期课程中梳理的“双层状态架构”与“工作流断点挂起”理论，设计一个类 tapNow / ComfyUI 的前后端全栈架构。

## 核心架构分歧：引擎归属地

> [!WARNING]
> 在深入之前，我们必须首先确定**工作流引擎 (DAG Engine) 的运行位置**。这直接决定了前后端的职责划分。

### 方案 A：前端执行模式 (Frontend-driven Execution) 
*适合轻量级、重交互、偏数据展示和前端组装的应用。*
- **前端职责**：不仅负责 UI 渲染 (React Flow)，还运行 `while` 循环引擎，负责调度。当遇到挂起时，把序列化快照发给后端。
- **后端职责**：纯粹的 CRUD 存储节点图元数据和执行快照记录。

### 方案 B：后端执行模式 (Backend-driven Execution) **(推荐用于重型业务)**
*适合真正的类似 ComfyUI/tapNow，节点可能包含耗时运算（如 AI 生图、外部 API 调用）。*
- **前端职责**：纯净的“画板 (Canvas)”。只负责定义 DAG 图，并通过 WebSocket 或长轮询实时反映后端执行状态。
- **后端职责**：运行核心 DAG 引擎，处理异步任务，遇到人工审核等情况自行挂起并持久化到 DB。

---

## 推荐架构设计 (基于方案 B)

假设我们采用更具扩展性的方案 B，架构划分如下：

### 1. 数据库与领域模型 (Backend Data Schema)
无论是关系型数据库 (PostgreSQL) 还是 MongoDB，我们需要两张核心表/集合：
- **`Workflow_Definition` (工作流定义表)**
  - `id`: 工作流模板 ID
  - `ui_schema`: 前端用的坐标和样式数据 (JSON)
  - `logic_schema`: 仅包含节点间连线关系和节点参数的纯净 DAG (JSON)
- **`Workflow_Instance` (工作流执行实例表)**
  - `id`: 实例运行 ID
  - `workflow_id`: 关联的定义 ID
  - `status`: RUNNING / SUSPENDED / SUCCESS / FAILED
  - `current_snapshot`: 引擎挂起时的序列化快照 (包含 `queue`, `completedNodes` 结果缓存)

### 2. 后端核心模块 (Backend Modules)
- **API 接口层**：提供保存图定义、启动工作流 (`/start`)、恢复工作流 (`/resume`) 的 HTTP 接口。
- **DAG 解析器**：读取 `logic_schema`，计算拓扑排序和入度出度。
- **调度引擎 (Scheduler)**：执行核心。
- **节点执行器工厂 (Node Executors)**：针对不同类型的节点（例如 `HttpRequestNode`, `AI_GenerateNode`, `HumanApprovalNode`）实现具体的 `execute` 方法。

### 3. 前端核心模块 (Frontend Modules)
- **React Flow 层**：负责画布渲染、拖拽、连线验证（例如输出类型必须匹配输入类型）。
- **Zustand Store 层**：
  - `uiSlice`: 维护 `reactflow` 所需的 nodes 和 edges。
  - `logicSlice`: 提取纯业务逻辑图，负责向后端提交 `logic_schema`。
  - `monitorSlice`: 监听 WebSocket 传来的后端执行进度，用于在节点上显示 “Loading” 或 “Error” 状态动画。

## Open Questions

> [!IMPORTANT]
> 1. **执行引擎定位**：你希望核心的 DAG 调度执行代码是写在前端浏览器里（纯前端执行），还是写在后端（如 Node.js / Go / Java 服务）？
> 2. **后端技术栈**：如果引擎放在后端，你目前团队或个人偏好使用的后端语言/框架是什么？（如 Node.js/NestJS, Python, Go 等）
> 3. **节点类型**：你预期系统中大概有哪些类型的节点？（比如：发送请求节点、数据处理节点、AI 节点、人工审核节点？）
