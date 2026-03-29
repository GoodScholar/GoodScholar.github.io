---
date: 2025-04-07
tags:
  - Flutter
  - 拖拽排序
  - ReorderableListView
  - 列表
---
# Flutter | 第7期 - ReorderableListView：拖拽排序列表

本期为大家分享如何在 Flutter 中实现列表拖拽排序功能，用 ReorderableListView 让用户通过长按拖动的方式自由调整列表顺序，感兴趣的话和我一起来探索一下呗~

---

### 首先，什么是 ReorderableListView？

在很多 App 中，都需要让用户自定义列表顺序 —— 待办事项排优先级、播放列表调顺序、导航菜单自定义排列等等。

▪️ **拖拽排序**：长按列表项后拖动到目标位置，松手即完成排序
▪️ **拖拽手柄**：桌面端自动显示拖拽手柄图标，移动端长按触发
▪️ **拖拽装饰**：拖拽中的项可自定义样式（阴影、缩放、透明度等）
▪️ **滚动自适应**：拖到列表边缘时自动滚动
▪️ **Flutter 内置**：无需安装任何第三方插件，开箱即用

---

## 方案对比

| 方案 | 核心特点 | 对比 |
|------|---------|------|
| ReorderableListView（官方内置） | 开箱即用，API 简洁，支持 builder 模式 | ✅ 官方维护、零依赖 |
| drag_and_drop_lists | 支持列表间拖拽、分组拖拽 | ⚠️ 功能更强但 API 复杂 |
| flutter_reorderable_list | 更多自定义动画选项 | ⚠️ 第三方维护 |
| 自己实现 Draggable + DragTarget | 完全自定义 | ⚠️ 开发成本高 |

**本期选择 Flutter 内置的 ReorderableListView 进行演示。** 它是 `material` 库的一部分，零依赖、零配置，适合绝大多数拖拽排序需求。

---

## 基础集成

### 无需额外依赖！

ReorderableListView 是 Flutter 框架自带的 Widget，只需导入 material 包即可：

```dart
import 'package:flutter/material.dart';
```

> **Tips**：不需要在 `pubspec.yaml` 中添加任何依赖，不需要任何平台配置，真正的开箱即用！

---

## 核心代码

### 最简用法

```dart
ReorderableListView(
  onReorder: (int oldIndex, int newIndex) {
    setState(() {
      // ⚠️ 注意：向下拖动时 newIndex 会多 1
      if (newIndex > oldIndex) newIndex--;
      final item = items.removeAt(oldIndex);
      items.insert(newIndex, item);
    });
  },
  children: [
    for (final item in items)
      ListTile(
        key: ValueKey(item), // ⚠️ 每个子项必须有唯一 Key
        title: Text(item),
      ),
  ],
)
```

> **重要**：`onReorder` 中的 `newIndex` 在向下移动时会比实际位置大 1，需要先判断并减 1。这是 Flutter 官方的设计，不是 bug。

---

### 完整示例页面

下面是一个包含拖拽排序、拖拽装饰、头部尾部的完整示例：

```dart
import 'package:flutter/material.dart';

class ReorderableListDemo extends StatefulWidget {
  const ReorderableListDemo({super.key});

  @override
  State<ReorderableListDemo> createState() => _ReorderableListDemoState();
}

class _ReorderableListDemoState extends State<ReorderableListDemo> {
  final List<String> _items = List.generate(10, (i) => '任务 ${i + 1}');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('拖拽排序列表')),
      body: ReorderableListView.builder(
        itemCount: _items.length,
        // 列表内边距
        padding: const EdgeInsets.symmetric(vertical: 8),
        // 拖拽中的装饰效果
        proxyDecorator: (Widget child, int index, Animation<double> animation) {
          return AnimatedBuilder(
            animation: animation,
            builder: (context, child) {
              final double elevation = lerpDouble(0, 6, animation.value)!;
              return Material(
                elevation: elevation,
                color: Colors.transparent,
                shadowColor: Colors.black54,
                borderRadius: BorderRadius.circular(12),
                child: child,
              );
            },
            child: child,
          );
        },
        // 排序回调
        onReorder: (int oldIndex, int newIndex) {
          setState(() {
            if (newIndex > oldIndex) newIndex--;
            final String item = _items.removeAt(oldIndex);
            _items.insert(newIndex, item);
          });
        },
        // 列表项构建
        itemBuilder: (BuildContext context, int index) {
          return Card(
            key: ValueKey(_items[index]),
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.primaries[index % Colors.primaries.length],
                child: Text('${index + 1}', style: const TextStyle(color: Colors.white)),
              ),
              title: Text(_items[index]),
              subtitle: Text('长按拖动排序'),
              trailing: const Icon(Icons.drag_handle, color: Colors.grey),
            ),
          );
        },
      ),
    );
  }
}
```

---

## 交互分解

拖拽排序的交互流程如下：

```
用户长按列表项（移动端）/ 抓住拖拽手柄（桌面端）
    ↓
① onReorderStart(index) 触发
    └── 获取被拖拽项的索引
    ↓
② 拖拽过程
    ├── proxyDecorator 渲染拖拽中的外观（阴影、缩放等）
    ├── 其他列表项自动让位（平滑动画）
    └── 拖到边缘时列表自动滚动
    ↓
③ 用户松手
    ↓
④ onReorder(oldIndex, newIndex) 触发
    ├── oldIndex = 拖拽前的位置
    └── newIndex = 放置后的位置（向下拖时 +1）
    ↓
⑤ 在回调中更新数据 → setState → UI 刷新
    ↓
⑥ onReorderEnd(index) 触发
    └── 拖拽结束后的清理工作
```

---

## 常用参数详解

### 构造函数

ReorderableListView 提供两种构造方式：

| 构造函数 | 适用场景 |
|---------|---------|
| `ReorderableListView(children: [...])` | 列表项数量少、固定的情况 |
| `ReorderableListView.builder(itemBuilder, itemCount)` | 列表项数量多、动态的情况（推荐） |

### 核心参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `onReorder` | `void Function(int, int)` | **必填**，拖拽排序完成后的回调 |
| `onReorderStart` | `void Function(int)` | 开始拖拽时的回调 |
| `onReorderEnd` | `void Function(int)` | 拖拽结束时的回调 |
| `itemBuilder` | `Widget Function(BuildContext, int)` | builder 模式下的列表项构建器 |
| `itemCount` | `int` | builder 模式下的列表项数量 |

### 外观与布局

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `proxyDecorator` | `Widget Function(Widget, int, Animation)` | 默认 Material 阴影 | 自定义拖拽中项的外观 |
| `buildDefaultDragHandles` | `bool` | true | 是否自动添加拖拽手柄（桌面端） |
| `padding` | `EdgeInsets` | null | 列表内边距 |
| `header` | `Widget?` | null | 列表头部（不参与拖拽） |
| `footer` | `Widget?` | null | 列表尾部（不参与拖拽） |
| `scrollDirection` | `Axis` | vertical | 滚动方向（竖向/横向） |
| `reverse` | `bool` | false | 是否反转列表 |

### 滚动相关

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `scrollController` | `ScrollController?` | null | 自定义滚动控制器 |
| `physics` | `ScrollPhysics?` | null | 滚动物理效果 |
| `primary` | `bool?` | null | 是否为主滚动视图 |
| `shrinkWrap` | `bool` | false | 是否根据内容收缩 |
| `autoScrollerVelocityScalar` | `double` | — | 拖到边缘时自动滚动的速度 |

---

## 进阶：常见应用场景

### 场景一：待办事项拖拽排序

```dart
class TodoReorderPage extends StatefulWidget {
  const TodoReorderPage({super.key});

  @override
  State<TodoReorderPage> createState() => _TodoReorderPageState();
}

class _TodoReorderPageState extends State<TodoReorderPage> {
  final List<Map<String, dynamic>> _todos = [
    {'title': '完成项目报告', 'done': false, 'priority': '🔴'},
    {'title': '回复邮件', 'done': true, 'priority': '🟡'},
    {'title': '整理文档', 'done': false, 'priority': '🟢'},
    {'title': '代码审查', 'done': false, 'priority': '🔴'},
    {'title': '团队周会', 'done': true, 'priority': '🟡'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('待办清单')),
      body: ReorderableListView.builder(
        itemCount: _todos.length,
        padding: const EdgeInsets.all(8),
        onReorder: (oldIndex, newIndex) {
          setState(() {
            if (newIndex > oldIndex) newIndex--;
            final item = _todos.removeAt(oldIndex);
            _todos.insert(newIndex, item);
          });
        },
        itemBuilder: (context, index) {
          final todo = _todos[index];
          return Dismissible(
            key: ValueKey(todo['title']),
            // 左滑删除
            direction: DismissDirection.endToStart,
            background: Container(
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 20),
              color: Colors.red,
              child: const Icon(Icons.delete, color: Colors.white),
            ),
            onDismissed: (_) {
              setState(() => _todos.removeAt(index));
            },
            child: Card(
              child: ListTile(
                leading: Text(todo['priority'], style: const TextStyle(fontSize: 20)),
                title: Text(
                  todo['title'],
                  style: TextStyle(
                    decoration: todo['done'] ? TextDecoration.lineThrough : null,
                    color: todo['done'] ? Colors.grey : null,
                  ),
                ),
                trailing: Checkbox(
                  value: todo['done'],
                  onChanged: (value) {
                    setState(() => todo['done'] = value);
                  },
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

### 场景二：自定义拖拽装饰（卡片效果）

```dart
ReorderableListView.builder(
  itemCount: items.length,
  proxyDecorator: (Widget child, int index, Animation<double> animation) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        // 拖拽时放大 + 旋转 + 阴影
        final double scale = lerpDouble(1.0, 1.05, animation.value)!;
        final double elevation = lerpDouble(0, 10, animation.value)!;
        return Transform.scale(
          scale: scale,
          child: Material(
            elevation: elevation,
            borderRadius: BorderRadius.circular(12),
            shadowColor: Colors.blue.withOpacity(0.3),
            child: child,
          ),
        );
      },
      child: child,
    );
  },
  onReorder: (oldIndex, newIndex) {
    // ...排序逻辑
  },
  itemBuilder: (context, index) {
    return Card(
      key: ValueKey(items[index]),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        title: Text(items[index]),
      ),
    );
  },
)
```

### 场景三：自定义拖拽手柄

默认情况下，桌面端会在顶部显示拖拽手柄，移动端通过长按触发。如果想要自定义手柄位置和样式：

```dart
ReorderableListView.builder(
  // ⚠️ 关闭默认拖拽手柄
  buildDefaultDragHandles: false,
  itemCount: items.length,
  onReorder: (oldIndex, newIndex) {
    setState(() {
      if (newIndex > oldIndex) newIndex--;
      final item = items.removeAt(oldIndex);
      items.insert(newIndex, item);
    });
  },
  itemBuilder: (context, index) {
    return Card(
      key: ValueKey(items[index]),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        title: Text(items[index]),
        // 自定义拖拽手柄（放在右侧）
        trailing: ReorderableDragStartListener(
          index: index,
          child: const Icon(Icons.drag_handle, color: Colors.grey),
        ),
      ),
    );
  },
)
```

> **关键**：使用自定义手柄时，必须先设置 `buildDefaultDragHandles: false`，然后用 `ReorderableDragStartListener` 包裹你的手柄 Widget。

### 场景四：横向拖拽排序

```dart
SizedBox(
  height: 120,
  child: ReorderableListView(
    scrollDirection: Axis.horizontal, // 横向滚动
    onReorder: (oldIndex, newIndex) {
      setState(() {
        if (newIndex > oldIndex) newIndex--;
        final item = tags.removeAt(oldIndex);
        tags.insert(newIndex, item);
      });
    },
    children: [
      for (int i = 0; i < tags.length; i++)
        Container(
          key: ValueKey(tags[i]),
          width: 100,
          margin: const EdgeInsets.symmetric(horizontal: 6, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.primaries[i % Colors.primaries.length].shade100,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: Colors.primaries[i % Colors.primaries.length],
            ),
          ),
          child: Center(
            child: Text(
              tags[i],
              style: TextStyle(
                color: Colors.primaries[i % Colors.primaries.length].shade700,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
    ],
  ),
)
```

### 场景五：带头部和尾部

```dart
ReorderableListView.builder(
  itemCount: items.length,
  // 头部（不参与拖拽）
  header: Container(
    padding: const EdgeInsets.all(16),
    color: Colors.blue.shade50,
    child: const Text(
      '📋 拖拽列表项可调整顺序',
      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
    ),
  ),
  // 尾部（不参与拖拽）
  footer: Padding(
    padding: const EdgeInsets.all(16),
    child: OutlinedButton.icon(
      onPressed: () {
        setState(() {
          items.add('新任务 ${items.length + 1}');
        });
      },
      icon: const Icon(Icons.add),
      label: const Text('添加任务'),
    ),
  ),
  onReorder: (oldIndex, newIndex) {
    setState(() {
      if (newIndex > oldIndex) newIndex--;
      final item = items.removeAt(oldIndex);
      items.insert(newIndex, item);
    });
  },
  itemBuilder: (context, index) {
    return ListTile(
      key: ValueKey(items[index]),
      title: Text(items[index]),
    );
  },
)
```

---

## 封装建议

在实际项目中，建议将 `onReorder` 的通用逻辑抽取为工具方法：

```dart
/// 通用的列表重排序方法
void reorderList<T>(List<T> list, int oldIndex, int newIndex) {
  if (newIndex > oldIndex) newIndex--;
  final T item = list.removeAt(oldIndex);
  list.insert(newIndex, item);
}
```

进一步封装为通用的可排序列表组件：

```dart
class AppReorderableList<T> extends StatelessWidget {
  const AppReorderableList({
    super.key,
    required this.items,
    required this.onReorder,
    required this.itemBuilder,
    this.header,
    this.footer,
    this.showDragHandle = true,
  });

  final List<T> items;
  final void Function(List<T> reorderedItems) onReorder;
  final Widget Function(T item, int index) itemBuilder;
  final Widget? header;
  final Widget? footer;
  final bool showDragHandle;

  @override
  Widget build(BuildContext context) {
    return ReorderableListView.builder(
      itemCount: items.length,
      buildDefaultDragHandles: false,
      header: header,
      footer: footer,
      padding: const EdgeInsets.symmetric(vertical: 8),
      proxyDecorator: (child, index, animation) {
        return AnimatedBuilder(
          animation: animation,
          builder: (context, child) {
            final elevation = lerpDouble(0, 8, animation.value)!;
            return Material(
              elevation: elevation,
              color: Colors.transparent,
              shadowColor: Colors.black38,
              borderRadius: BorderRadius.circular(8),
              child: child,
            );
          },
          child: child,
        );
      },
      onReorder: (oldIndex, newIndex) {
        final reordered = List<T>.from(items);
        if (newIndex > oldIndex) newIndex--;
        final item = reordered.removeAt(oldIndex);
        reordered.insert(newIndex, item);
        onReorder(reordered);
      },
      itemBuilder: (context, index) {
        return Row(
          key: ValueKey(items[index]),
          children: [
            Expanded(child: itemBuilder(items[index], index)),
            if (showDragHandle)
              ReorderableDragStartListener(
                index: index,
                child: const Padding(
                  padding: EdgeInsets.all(12),
                  child: Icon(Icons.drag_handle, color: Colors.grey),
                ),
              ),
          ],
        );
      },
    );
  }
}
```

使用时更加简洁：

```dart
AppReorderableList<String>(
  items: tasks,
  onReorder: (reorderedTasks) {
    setState(() => tasks = reorderedTasks);
  },
  itemBuilder: (task, index) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: CircleAvatar(child: Text('${index + 1}')),
        title: Text(task),
      ),
    );
  },
)
```

---

## 与状态管理配合

使用 Riverpod 管理排序状态，保证数据持久化：

```dart
// Provider 定义
final taskListProvider = StateNotifierProvider<TaskListNotifier, List<Task>>(
  (ref) => TaskListNotifier(),
);

class TaskListNotifier extends StateNotifier<List<Task>> {
  TaskListNotifier() : super([]);

  /// 加载任务列表
  Future<void> load() async {
    state = await taskRepository.getAll();
  }

  /// 重排序
  void reorder(int oldIndex, int newIndex) {
    if (newIndex > oldIndex) newIndex--;
    final newList = List<Task>.from(state);
    final item = newList.removeAt(oldIndex);
    newList.insert(newIndex, item);

    // 更新排序字段
    for (int i = 0; i < newList.length; i++) {
      newList[i] = newList[i].copyWith(sortOrder: i);
    }

    state = newList;

    // 异步持久化到数据库
    taskRepository.updateSortOrder(newList);
  }
}

// 在页面中使用
class TaskListPage extends ConsumerWidget {
  const TaskListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tasks = ref.watch(taskListProvider);

    return ReorderableListView.builder(
      itemCount: tasks.length,
      onReorder: (oldIndex, newIndex) {
        ref.read(taskListProvider.notifier).reorder(oldIndex, newIndex);
      },
      itemBuilder: (context, index) {
        return ListTile(
          key: ValueKey(tasks[index].id),
          title: Text(tasks[index].title),
          trailing: const Icon(Icons.drag_handle),
        );
      },
    );
  }
}
```

---

## onReorder 的 newIndex 为什么要减 1？

这是初学者最常见的困惑，值得专门解释：

```dart
// 假设列表：[A, B, C, D, E]
// 将 A（index=0）拖到 C 和 D 之间

// Flutter 的 onReorder 回调给出的是：
// oldIndex = 0, newIndex = 3
// 但「移除 A 之后」的列表是 [B, C, D, E]
// 此时 index=3 的位置是 E，而不是 D 后面
// 所以需要 newIndex-- → 变成 2，即 [B, C, A, D, E] ✅

// 总结规则：
void onReorder(int oldIndex, int newIndex) {
  // 向下拖动时，newIndex 是移除前的索引，需要减 1
  if (newIndex > oldIndex) newIndex--;
  final item = list.removeAt(oldIndex);
  list.insert(newIndex, item);
}
```

简单来说：`newIndex` 表示的是「移除项之前的目标位置」，而 `removeAt` 执行后列表长度减 1，所以向下移动时需要 `newIndex--`。

---

## 常见问题与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 报错"子项缺少 Key" | 每个子 Widget 必须有唯一 Key | 为每个列表项添加 `ValueKey` |
| 向下拖动后位置不对 | `newIndex` 未做 -1 处理 | 在 `onReorder` 中判断 `if (newIndex > oldIndex) newIndex--` |
| 桌面端拖拽手柄挡住内容 | 默认手柄会覆盖在列表项上方 | 设置 `buildDefaultDragHandles: false`，用 `ReorderableDragStartListener` 自定义位置 |
| 拖拽时列表闪烁 | Key 不稳定（例如使用 index 作为 Key） | 使用与数据绑定的稳定 Key（如 `ValueKey(item.id)`） |
| 嵌套在 Column 中报错 | ReorderableListView 需要有限高度 | 用 `Expanded` 包裹，或设置 `shrinkWrap: true` |
| 拖拽到边缘不自动滚动 | 默认行为可能不够灵敏 | 调整 `autoScrollerVelocityScalar` 参数 |
| 与 Dismissible 冲突 | 左滑删除和长按拖拽手势冲突 | 使用自定义拖拽手柄，分离两种手势的触发区域 |

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~


*📝 作者：NIHoa ｜ 系列：Flutter工具系列 ｜ 更新日期：2025-04-07*
