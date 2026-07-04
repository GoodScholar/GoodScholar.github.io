# 学习记录 0001: 双层状态架构

**日期**: 2026-06-17
**关联任务**: 构建 React Flow 节点编排系统

## 核心洞见 (Key Insight)
在构建复杂的节点编排引擎时，不能将 React Flow 的视图状态 (UI State: `nodes`, `edges`) 与业务执行状态 (Logical State: `DAG`) 混在一起。

## 为什么这很重要？
工作流引擎需要“工作流断点 (Workflow Breakpoints)”，即在执行中挂起并持久化保存。如果视图状态和逻辑状态耦合，每次挂起都需要保存庞大的坐标信息，不仅浪费存储，也极难在后续“恢复 (Resume)”时干净地重新注入业务数据。

## 后续影响
我们将使用 Zustand 建立逻辑状态的单点真相 (Single Source of Truth)，React Flow 将纯粹作为渲染这层逻辑数据的一层皮肤。
