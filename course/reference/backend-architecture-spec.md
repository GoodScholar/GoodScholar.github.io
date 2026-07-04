# 后端 DAG 执行引擎核心数据结构与接口

后端（假设使用 TypeScript / Node.js）作为真大脑，需要处理图解析、执行循环与快照存储。

## 1. 核心数据结构

```typescript
// 1. 数据库存储的执行实例快照
export interface WorkflowInstance {
  instanceId: string;
  workflowId: string;
  status: 'RUNNING' | 'SUSPENDED' | 'SUCCESS' | 'FAILED';
  
  // 核心！挂起时的现场快照
  snapshot: {
    // 尚未执行的节点队列
    pendingQueue: string[]; // 存 node IDs
    // 已经执行完成的节点和它们的输出
    completedNodes: Record<string, any>; 
  };
}

// 2. 节点执行器的抽象基类
export abstract class BaseExecutor {
  // 返回 SUCCESS 代表继续，返回 SUSPENDED 代表抛出挂起中断
  abstract execute(
    node: LogicNode, 
    inputs: Record<string, any> // 从 completedNodes 中提取的上游依赖
  ): Promise<{ status: 'SUCCESS' | 'SUSPENDED' | 'FAILED', output?: any }>;
}
```

## 2. 引擎执行循环 (Event Loop)

后端的执行循环不再是一个死循环 `while`，而是响应式的。

```typescript
export class DAGEngine {
  async runCycle(instance: WorkflowInstance, dag: LogicDAG) {
    let queue = [...instance.snapshot.pendingQueue];
    const completed = { ...instance.snapshot.completedNodes };

    while(queue.length > 0) {
      const currentNodeId = queue[0];
      const node = dag.nodes.find(n => n.id === currentNodeId);
      
      // 检查前置依赖
      if (!this.checkIncomersReady(node, dag, completed)) {
        queue.shift(); queue.push(currentNodeId); // 挪到队尾（简单的延迟处理）
        continue;
      }

      // 获取执行器并运行
      const executor = ExecutorFactory.get(node.type);
      const result = await executor.execute(node, this.extractInputs(node, dag, completed));

      if (result.status === 'SUSPENDED') {
        // [核心断点逻辑] - 保存快照并终止当前线程
        await db.updateInstance(instance.instanceId, {
          status: 'SUSPENDED',
          snapshot: { pendingQueue: queue, completedNodes: completed }
        });
        return; // 中断执行！
      }

      // 成功，推进状态
      completed[node.id] = result.output;
      queue.shift();
      const outgoers = this.getOutgoers(node, dag);
      queue.push(...outgoers);
    }
    
    // 执行结束
    await db.updateInstance(instance.instanceId, { status: 'SUCCESS' });
  }
}
```

## 3. 核心 API 设计

- `POST /api/workflow/start`: 接收 `LogicDAG`，创建新实例，推入根节点，调用 `runCycle()`。
- `POST /api/workflow/resume`: 接收外部输入，加载挂起实例，将外部输入写入对应节点的 `completedNodes`，然后再次调用 `runCycle()`。
