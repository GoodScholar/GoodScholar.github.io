# 前端双层状态树规范 (React Flow + Zustand)

为了满足执行引擎的分离要求，我们在前端必须将状态严格划分为“UI 层”与“逻辑层”。

## 1. 业务模型定义 (逻辑层)

这一层的数据是后端执行引擎真正关心的，也是断点恢复的核心。

```typescript
// 纯净的逻辑节点
export interface LogicNode {
  id: string;
  type: 'HttpRequest' | 'AI_Generate' | 'HumanApproval' | 'Condition';
  // 节点内部的业务参数
  parameters: Record<string, any>;
  // 节点的输出结果缓存（挂起恢复时用到）
  outputData?: any;
}

// 纯净的逻辑连线
export interface LogicEdge {
  id: string;
  sourceNodeId: string;
  sourceHandleId?: string;
  targetNodeId: string;
  targetHandleId?: string;
}

export interface LogicDAG {
  nodes: LogicNode[];
  edges: LogicEdge[];
}
```

## 2. 视图模型定义 (UI 层)

这是 React Flow 直接消费的状态，绝不能传给执行引擎的核心循环。

```typescript
import { Node as RFNode, Edge as RFEdge } from 'reactflow';

// UI 节点仅仅包含展示相关信息
export type UINode = RFNode<{
  label: string;
  icon?: string;
  // 重要：不要在这里存放业务 parameters，避免同步麻烦
}>;

export type UIEdge = RFEdge;
```

## 3. Zustand Store 架构设计

使用 切片模式 (Slices Pattern) 将两者组合。当用户拖拽节点时，仅更新 UI；当用户在侧边栏编辑节点参数时，仅更新逻辑模型；但当添加新节点时，两者同步更新。

```typescript
import { create } from 'zustand';

interface WorkflowStore {
  // --- 视图状态 ---
  uiNodes: UINode[];
  uiEdges: UIEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;

  // --- 逻辑状态 ---
  logicGraph: LogicDAG;
  
  // --- 操作 Action ---
  // 添加节点（同时更新 UI 和 Logic）
  addNode: (nodeType: string, position: {x: number, y: number}) => void;
  // 更新节点业务参数（仅更新 Logic）
  updateNodeParameter: (nodeId: string, params: Record<string, any>) => void;
  
  // --- 后端通信 ---
  // 将逻辑图转换为后端所需格式进行提交
  exportForEngine: () => LogicDAG;
}
```

## 结论
前端开发者的核心纪律：**在 React Flow 的自定义节点组件中，不要直接修改 `props.data` 里的业务参数，而是调用 Zustand 的 `updateNodeParameter` 来确保逻辑真相 (Truth) 不受 UI 生命周期影响。**
