---
date: 2026-07-19
tags:
  - Flutter
  - Skills
  - Workflow
  - AI编程
  - Riverpod
cover: /covers/cover-flutter-skills-workflow-juejin.jpg
---
# 装完 Skills 还在手动指挥 AI？Flutter 项目 Workflow 闭环实战

![封面](/covers/cover-flutter-skills-workflow-juejin.jpg)

> Flutter 项目装好 Skills 只是起点，加上 Workflow 才到真正提效的临界点。本文用一个消息中心模块从需求到交付的完整 8 步流水线，演示 AGENTS.md / Skills / Workflow 三者协作的工程闭环，附 5 个 Flutter 特有坑点防御清单和可直接复用的 Workflow 模板。

---

## 装好 Skills，但还在手动指挥 AI

你照着 Flutter 装 Skills 教程把项目武装了一遍：AGENTS.md 写好了技术栈红线，5 个核心 Skill 装到位——架构、代码风格、状态管理、路由、Widget 模式各司其职。

然后你坐下来，准备让 AI 写一个新功能：

```
你: 帮我做一个消息中心模块。
AI: 好的，先生成 Message 实体...
你: 现在加载 flutter-state-management Skill，拆 Provider。
AI: 好的，三个 Provider 拆好了...
你: 再加载 api-request Skill，封装接口和 WebSocket。
AI: 接口写好了...
你: 接着加载 flutter-routing Skill，注册路由。
AI: ...
你: 然后加载 flutter-platform-channel Skill，处理通知权限。
AI: ...
你: 最后跑测试、审查、提交。
```

**8 个步骤，8 次手动指挥。** 你变成了 AI 的人肉调度器——Skills 有了，编排没有。

这就像买了一整套智能家居，每天还要挨个按开关。Workflow 就是那个"回家自动开灯开空调"的场景联动——一句话触发，Skills 自动编排。

但 Flutter 项目的 Workflow 不能照搬前端模板。深度用下来发现，Vue3 的 7 步 CRUD 模板直接套到 Flutter 上会漏掉 Provider 拆分、GoRouter 路由树注册、Platform Channel 异步时序这些 Flutter 特有环节，而这些恰恰是最容易出问题的地方。

这篇文章用一个真实的消息中心模块（列表 + 详情 + 未读状态 + WebSocket 推送 + 通知权限）从需求到交付的完整过程，演示 Flutter 项目里 AGENTS.md / Skills / Workflow 三者怎么协作闭环，并把踩过的 5 个 Flutter 特有坑点整理成防御清单。

---

## 三者分工——Flutter 项目里谁负责什么

先厘清边界。很多人把 Skills 和 Workflow 混着用，结果两边都不好维护。

| 层次 | 在 Flutter 项目里负责什么 | 典型内容 |
|:---:|:---|:---|
| **AGENTS.md** | 项目宪法，全局红线 | 技术栈（Flutter + Riverpod 3.x + GoRouter + dio）、目录约定（lib/features/）、命名规范、必加 const |
| **Skills** | 能力模块，单一领域的操作规范 | flutter-state-management（Provider 怎么拆）、flutter-routing（GoRouter 怎么配）、flutter-platform-channel（双端权限怎么处理） |
| **Workflow** | 编排说明书，按交付节奏串联 Skills | feature-delivery.md（新建功能模块的 8 步流水线）、bugfix-flow.md（Bug 修复流程） |

三者的关系可以用一句话讲清：**AGENTS.md 管"必须遵守什么"，Skills 管"具体怎么做"，Workflow 管"按什么顺序做"。**

### 为什么 Flutter 不能直接套 Vue3 的 Workflow 模板

社区里流传较广的 Skills 流水线实战给的 Vue3 CRUD 模板是 7 步：数据模型 → API → 列表页 → 表单 → 测试 → 审查 → 提交。

直接把这个模板搬到 Flutter 项目里，会踩三个坑：

1. **缺 Provider 拆分步骤**：Vue3 的 `useUserList` 是一个组合式函数，Flutter 的 Riverpod 需要 Provider 拆分（列表 Provider、未读数 Provider、连接 Provider 各自独立）。Workflow 不显式约束这一步，AI 会把所有状态塞进一个巨型 Notifier。
2. **缺路由树注册步骤**：Vue Router 自动扫描路由文件，GoRouter 必须手动在 `routes.dart` 注册。Workflow 不强制这一步，AI 写完详情页后跳转会直接抛 `route not found`。
3. **缺 Platform Channel 步骤**：Vue3 通知走浏览器 Notification API，Flutter 走原生权限，必须双端处理。Workflow 不安排这一步，iOS/Android 双端权限遗漏只是时间问题。

所以 Flutter 的 Workflow 必须在 Vue3 模板基础上增加 **Provider 拆分、路由树注册、Platform Channel** 三个步骤，变成 8 步流水线。

**判断清单：你的 Flutter 项目是否需要上 Workflow**

- 项目 Skills 数量 ≥ 5 个（Skills 太少，手动指挥反而更快）
- 同类功能重复开发 ≥ 3 次（不重复的流程不值得固化）
- 团队规模 ≥ 2 人（一个人用，手动指挥也能跑通；多人用才需要统一流水线）

满足任意 2 项即可考虑上 Workflow。

---

## 实战——用 Workflow 交付"消息中心"模块

### 准备工作

项目结构假设（与 Flutter 装 Skills 教程一致）：

```
.skills/
├── AGENTS.md
├── skills/
│   ├── flutter-architecture/
│   ├── flutter-state-management/
│   ├── flutter-routing/
│   ├── flutter-widget-patterns/
│   ├── flutter-platform-channel/
│   ├── api-request/
│   ├── unit-test/
│   ├── code-review/
│   └── git-commit/
└── workflows/
    └── feature-delivery.md   ← 本文要写的 Workflow
```

技术栈：Flutter 3.x + Dart 3.x + Riverpod 3.x + GoRouter + dio + web_socket_channel。

### Step 1：领域模型定义

Workflow 触发后，第一步加载 `flutter-architecture` Skill，按分层架构在 `lib/features/message/domain/` 下定义实体。

```dart
// lib/features/message/domain/message.dart

enum MessageStatus { unread, read }

class Message {
  const Message({
    required this.id,
    required this.title,
    required this.content,
    required this.createdAt,
    this.status = MessageStatus.unread,
  });

  final String id;
  final String title;
  final String content;
  final DateTime createdAt;
  final MessageStatus status;

  Message copyWith({MessageStatus? status}) {
    return Message(
      id: id,
      title: title,
      content: content,
      createdAt: createdAt,
      status: status ?? this.status,
    );
  }
}
```

**为什么第一步是模型而不是 API**：模型是后面所有步骤的依赖源头——Provider 拆分要看模型字段、UI 要看模型结构、测试要基于模型构造数据。模型先定义清楚，后面步骤的产出质量才稳定。

这一步不是暂停点，AI 写完直接进入下一步。

### Step 2：Provider 拆分（暂停点）

加载 `flutter-state-management` Skill。这一步是 Workflow 的第一个暂停点，必须等用户确认。

为什么暂停？因为 Provider 拆分方式直接决定了后续 UI 层的写法。如果拆得不对，UI 写完才发现要重写 Provider，返工成本高。

```dart
// lib/features/message/providers/message_providers.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/message.dart';
import '../data/message_repository.dart';

// 1. 消息列表 Provider
final messageListProvider = NotifierProvider<MessageListNotifier, List<Message>>(
  MessageListNotifier.new,
);

class MessageListNotifier extends Notifier<List<Message>> {
  @override
  List<Message> build() => [];

  Future<void> refresh() async {
    final repo = ref.read(messageRepositoryProvider);
    state = await repo.fetchList();
  }

  void prepend(Message msg) {
    state = [msg, ...state];
  }
}

// 2. 未读数 Provider（派生状态）
final unreadCountProvider = Provider<int>((ref) {
  return ref.watch(messageListProvider)
      .where((m) => m.status == MessageStatus.unread)
      .length;
});

// 3. WebSocket 连接 Provider（独立生命周期）
final messageSocketProvider = NotifierProvider<MessageSocketNotifier, bool>(
  MessageSocketNotifier.new,
);

class MessageSocketNotifier extends Notifier<bool> {
  @override
  bool build() => false;

  Future<void> connect() async {
    state = true;
    // 监听新消息，prepend 到列表
  }

  void disconnect() {
    state = false;
  }
}
```

**三个 Provider 各自独立，UI 层用 `ref.watch` 组合消费。** 这是 Riverpod 3.x 推荐的写法，避免把所有状态塞进一个 Notifier。

用户确认 Provider 拆分后，进入下一步。

### Step 3：API + WebSocket 封装

加载 `api-request` Skill，在 `lib/features/message/data/` 下封装接口层。

```dart
// lib/features/message/data/message_repository.dart

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/message.dart';

final messageRepositoryProvider = Provider<MessageRepository>((ref) {
  return MessageRepository(dio: ref.watch(dioProvider));
});

class MessageRepository {
  MessageRepository({required this.dio});

  final Dio dio;

  Future<List<Message>> fetchList() async {
    final res = await dio.get('/messages');
    return (res.data['items'] as List)
        .map((e) => Message(
              id: e['id'],
              title: e['title'],
              content: e['content'],
              createdAt: DateTime.parse(e['createdAt']),
              status: e['read'] ? MessageStatus.read : MessageStatus.unread,
            ))
        .toList();
  }

  Future<void> markRead(String id) async {
    await dio.post('/messages/$id/read');
  }
}
```

WebSocket 用 `web_socket_channel` 包单独封装，逻辑独立：

```dart
// lib/features/message/data/message_socket.dart

import 'package:web_socket_channel/web_socket_channel.dart';

class MessageSocket {
  MessageSocket({required this.url});

  final String url;
  WebSocketChannel? _channel;

  Stream<Map<String, dynamic>> get messages =>
      _channel?.stream.map((e) => jsonDecode(e) as Map<String, dynamic>) ??
      const Stream.empty();

  void connect() {
    _channel = WebSocketChannel.connect(Uri.parse(url));
  }

  void disconnect() {
    _channel?.sink.close();
    _channel = null;
  }
}
```

这一步不是暂停点，AI 写完直接继续。

### Step 4：消息列表 UI

加载 `flutter-widget-patterns` Skill，在 `lib/features/message/presentation/` 下生成列表页。

```dart
// lib/features/message/presentation/message_list_screen.dart

class MessageListScreen extends ConsumerWidget {
  const MessageListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final messages = ref.watch(messageListProvider);
    final unreadCount = ref.watch(unreadCountProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('消息 $unreadCount'),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(messageListProvider.notifier).refresh(),
        child: ListView.builder(
          itemCount: messages.length,
          itemBuilder: (context, index) {
            final msg = messages[index];
            return ListTile(
              title: Text(
                msg.title,
                style: msg.status == MessageStatus.unread
                    ? const TextStyle(fontWeight: FontWeight.bold)
                    : null,
              ),
              subtitle: Text(msg.content),
              onTap: () => context.pushNamed(
                'messageDetail',
                pathParameters: {'id': msg.id},
              ),
            );
          },
        ),
      ),
    );
  }
}
```

关键检查点：

- 用 `ConsumerWidget` 而不是 `StatefulWidget`（状态由 Provider 管）
- `const` 构造函数优先（AppBar 的 `title` 用 `Text` 而不是 `Text(...)` 实例化）
- 列表用 `ListView.builder` 而不是 `Column`（性能）

### Step 5：详情页 + 路由注册（暂停点）

加载 `flutter-routing` Skill。这一步是 Workflow 的第二个暂停点。

为什么暂停？因为路由注册是个跨文件操作——AI 写详情页的同时必须修改 `routes.dart`，否则跳转不生效。让用户确认这一步，避免路由树遗漏。

```dart
// lib/features/message/presentation/message_detail_screen.dart

class MessageDetailScreen extends ConsumerWidget {
  const MessageDetailScreen({super.key, required this.messageId});

  final String messageId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final messages = ref.watch(messageListProvider);
    final msg = messages.firstWhere((m) => m.id == messageId);

    return Scaffold(
      appBar: AppBar(title: Text(msg.title)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(msg.content),
      ),
    );
  }
}
```

然后在 `routes.dart` 注册路由：

```dart
// lib/app/routes.dart

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/messages',
      name: 'messageList',
      builder: (context, state) => const MessageListScreen(),
    ),
    GoRoute(
      path: '/messages/:id',
      name: 'messageDetail',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return MessageDetailScreen(messageId: id);
      },
    ),
  ],
);
```

用户确认路由树更新后，进入下一步。

### Step 6：Platform Channel 通知权限

加载 `flutter-platform-channel` Skill。这一步处理 iOS/Android 双端通知权限。

```dart
// lib/features/message/data/notification_permission.dart

import 'package:flutter/services.dart';

class NotificationPermission {
  static const _platform = MethodChannel('com.example.app/notification');

  static Future<bool> request() async {
    if (Platform.isIOS) {
      final granted = await _platform.invokeMethod<bool>('requestIOSNotification');
      return granted ?? false;
    }
    // Android 13+ 需要运行时申请 POST_NOTIFICATIONS
    final granted = await _platform.invokeMethod<bool>('requestAndroidNotification');
    return granted ?? false;
  }
}
```

**关键约束：权限申请必须在 WebSocket 连接之前完成。** 否则消息推送到了但用户看不到通知，体验直接崩。这个顺序约束在 Workflow 的 Step 3 和 Step 6 之间显式声明：

```markdown
## Step 6: Platform Channel 通知权限

> ⚠️ 本步骤必须在 Step 3 的 WebSocket 连接之前完成。
> 在 MessageSocketNotifier.connect() 内部先调 NotificationPermission.request()，
> 通过后再建立 WebSocket 连接。
```

### Step 7：测试

加载 `unit-test` Skill，为关键 Provider 写单测。

```dart
// test/features/message/providers/message_providers_test.dart

void main() {
  test('unreadCountProvider 应统计未读消息数', () {
    final container = ProviderContainer(overrides: [
      messageListProvider.overrideWith(() => FakeMessageListNotifier()),
    ]);

    expect(container.read(unreadCountProvider), 2);
    container.dispose();
  });
}

class FakeMessageListNotifier extends MessageListNotifier {
  @override
  List<Message> build() => [
    const Message(id: '1', title: 'a', content: 'x', createdAt: ..., status: MessageStatus.unread),
    const Message(id: '2', title: 'b', content: 'y', createdAt: ..., status: MessageStatus.unread),
    const Message(id: '3', title: 'c', content: 'z', createdAt: ..., status: MessageStatus.read),
  ];
}
```

**Workflow 区分"可跳过"和"必跑"测试**——Provider 单测必跑，UI Widget 测试如果用户说"快速出一版"可以跳过。这个区分在 Workflow 自适应规则里显式声明。

### Step 8：审查 + 提交

加载 `code-review` + `git-commit` Skill。Code Review 按 AGENTS.md 的红线逐项检查，git commit 按约定式提交拆分。

```
feat(message): add message center with WebSocket push
feat(message): register message list and detail routes
test(message): add unreadCountProvider unit test
```

到这里，消息中心模块从需求到交付的 8 步流水线跑完。整个过程两次暂停（Provider 拆分、路由注册），其他步骤 turbo。

---

## Flutter 特有坑点与防御清单

跑通这条流水线的过程中，踩了 5 个 Flutter 特有坑点，前端场景不会遇到。

### 坑点 1：步骤间状态污染

**触发场景**：Step 2 写完 Provider 拆分，进入 Step 4 生成 UI 时。

**看到的现象**：AI 在 UI 代码里引用了不存在的 Provider，比如 `messageProvider`（列表 Provider 实际叫 `messageListProvider`）。

**根本原因**：Workflow 步骤间没有显式清理上下文。AI 在 Step 2 思考"我要叫它 messageProvider 还是 messageListProvider"的过程中，可能留下了 messageProvider 的中间产物，Step 4 读取上下文时把中间产物当成了最终命名。

**实际处理**：在 Workflow 文件里给每个 Step 加一条"上下文清理"指令：

```markdown
## Step 2 完成后
- 列出本步骤产出的所有 Provider 名称，明确标注为最终命名
- 在进入 Step 4 前，重置 AI 上下文，只保留 Provider 名称清单
```

**怎么避免**：每个步骤结束时输出一份"产出清单"，下一步骤只读清单不读思考过程。

### 坑点 2：GoRouter 路由树遗漏

**触发场景**：Step 5 写完详情页后。

**看到的现象**：从列表点详情，控制台抛 `Could not find a route named messageDetail`。

**根本原因**：AI 写了 `message_detail_screen.dart`，但忘了在 `routes.dart` 里加 GoRoute。Flutter 的 GoRouter 不会自动扫描页面文件，必须手动注册。

**实际处理**：在 Workflow 的 Step 5 强制校验路由树：

```markdown
## Step 5 完成后（强制校验）
- 列出本步骤新增的所有页面 Widget
- 逐个检查是否在 routes.dart 注册了对应 GoRoute
- 如果有遗漏，自动补齐并提示用户
```

**怎么避免**：把"路由注册"作为 Step 5 的产出之一，不只是"详情页代码"。

### 坑点 3：const Widget 误判

**触发场景**：批量生成 UI（Step 4 + Step 5）时。

**看到的现象**：编译报错 `Constant expression expected`。AI 给一个动态构造的 Widget 加了 `const`。

**根本原因**：Skill 里写了"所有 Widget 必须使用 const 构造函数"。AI 在批量生成模式下倾向过度遵守这条规则，把动态构造的 Widget 也标 const。

**实际处理**：在 `flutter-widget-patterns` Skill 里补充 const 判断规则：

```markdown
## const 判断规则
- 构造函数所有参数都是字面量或常量 → 加 const
- 参数包含变量、方法调用、运行时计算 → 不加 const
- 不确定时，不加 const（编译器会提示，反过来加错了编译报错）
```

**怎么避免**：所有"必须"类规则，都要补上"什么时候不适用"的边界。

### 坑点 4：Platform Channel 异步时序

**触发场景**：Step 6 通知权限 + Step 3 WebSocket 连接。

**看到的现象**：WebSocket 连接建立成功，但 iOS 端用户收不到通知。日志显示通知权限请求还在 pending 状态时 WebSocket 已经开始接收消息。

**根本原因**：Workflow 没有显式约束两个异步操作的先后顺序。AI 把它们当独立步骤处理，运行时同时触发。

**实际处理**：在 `MessageSocketNotifier.connect()` 内部强制串行：

```dart
Future<void> connect() async {
  // 1. 先申请权限
  final granted = await NotificationPermission.request();
  if (!granted) {
    state = false;
    return;
  }
  // 2. 权限通过后再建立连接
  state = true;
  _socket.connect();
}
```

**怎么避免**：涉及权限、初始化、连接的异步操作，必须在 Skill 里显式声明先后顺序，不能让 AI 自由组合。

### 坑点 5：turbo 模式跳过关键测试

**触发场景**：用户说"快速出一版"，Workflow 启用 turbo-all。

**看到的现象**：所有测试步骤被跳过，包括 `unreadCountProvider` 这种纯逻辑 Provider 的单测。结果派生状态计算错误没被发现，未读数显示错误上线。

**根本原因**：Workflow 的自适应规则把"跳过测试"写得太粗——一刀切跳过所有测试，没区分"可跳过的 UI 测试"和"必跑的纯逻辑测试"。

**实际处理**：把测试拆成两类：

```markdown
## 自适应规则
- 用户说"快速出一版" → 跳过 Widget 测试
- 但 Provider 单测、纯逻辑函数测试 **永远不跳过**
- 跳过任何测试时，必须在控制台显式提示"本次跳过了 X 类测试"
```

**怎么避免**：自适应规则要细粒度，不能一刀切。任何"可跳过"的规则都要标注"什么永远不能跳过"。

### 5 个坑点的统一防御方法

把这 5 个坑点抽象成一条原则：**Workflow 的每一步都要回答三个问题——产出什么、依赖什么、什么时候不能跳。**

- 产出什么：明确这一步的输出物（不只是"写代码"，是"写 Provider + 输出 Provider 名称清单"）
- 依赖什么：这一步前置条件是什么（路由注册依赖详情页 Widget 定义）
- 什么时候不能跳：哪些规则即使在 turbo 模式下也必须执行（纯逻辑单测）

---

## 可复用的 Flutter Workflow 模板

把上面 8 步抽象成一份可直接复制的 Workflow 文件。

```markdown
// .skills/workflows/feature-delivery.md

---
description: 新建一个 Flutter 功能模块，自动编排完整的开发流程
---

# Flutter 功能模块交付流水线

当用户要求新建一个功能模块（消息中心、设置中心、订单列表等）时，
严格按以下 8 步执行。每完成一步必须按"产出清单"输出，关键步骤暂停等待确认。

## Step 1: 领域模型定义
1. 加载 `flutter-architecture` Skill
2. 在 lib/features/<module>/domain/ 下定义实体类
3. 必须包含：基础字段、状态枚举（如有）、copyWith 方法
- **产出**：实体类文件 + 字段清单
- **是否暂停**：否

## Step 2: Provider 拆分（暂停点）
1. 加载 `flutter-state-management` Skill
2. 按职责拆分 Provider：列表 Provider、派生状态 Provider、连接 Provider
3. 列表 Provider 用 NotifierProvider，派生状态用 Provider
- **产出**：Provider 文件 + Provider 名称清单
- **是否暂停**：是，等用户确认 Provider 拆分

## Step 3: API + WebSocket 封装
1. 加载 `api-request` Skill
2. 在 lib/features/<module>/data/ 下封装 Repository
3. 如有 WebSocket 需求，单独封装连接类，不混入 Repository
- **产出**：Repository 文件 + 连接类文件
- **是否暂停**：否

## Step 4: 列表 UI
1. 加载 `flutter-widget-patterns` Skill
2. 用 ConsumerWidget + ref.watch 组合消费 Provider
3. 列表用 ListView.builder，不用 Column
- **产出**：列表页 Widget
- **是否暂停**：否

## Step 5: 详情 UI + 路由注册（暂停点）
1. 加载 `flutter-routing` Skill
2. 生成详情页 Widget
3. **强制**：在 routes.dart 中注册对应 GoRoute
4. 路由命名：全小写 + 短横线分隔
- **产出**：详情页 Widget + 更新后的 routes.dart + 路由校验报告
- **是否暂停**：是，等用户确认路由树

## Step 6: Platform Channel 通知权限
1. 加载 `flutter-platform-channel` Skill
2. iOS/Android 双端权限请求封装
3. **强制顺序**：权限申请必须在 WebSocket 连接之前
- **产出**：权限封装类
- **是否暂停**：否

## Step 7: 测试
1. 加载 `unit-test` Skill
2. Provider 单测（必跑）
3. Widget 测试（自适应，可跳过）
- **产出**：测试文件 + 测试覆盖率报告
- **是否暂停**：否

## Step 8: 审查 + 提交
1. 加载 `code-review` + `git-commit` Skill
2. 按 AGENTS.md 红线审查
3. 按约定式提交拆分 commit
- **产出**：审查报告 + Git commit
- **是否暂停**：否

## 自适应规则

- 用户说"快速出一版" → 跳过 Step 7 的 Widget 测试，但 Provider 单测 **必跑**
- 用户说"不需要通知权限" → 跳过 Step 6
- 实体字段 ≤ 5 个 → Step 4 和 Step 5 可合并为一步
- 启用 `// turbo-all` 时，仍保留 Step 2 和 Step 5 的暂停点

## 步骤间上下文管理

每步结束时输出"产出清单"：
- 新增/修改的文件路径
- 新增的 Provider / 路由 / 类的名称
- 下一步需要用到的关键标识符

下一步开始前，AI 只读"产出清单"，不读上一步的思考过程。
```

**这份模板可以直接复制到你的 Flutter 项目 `.skills/workflows/` 目录使用。** 第一次用时建议不要开 turbo，跑一遍完整流程感受每个暂停点的作用，再根据自己项目特点调整自适应规则。

---

## 从"AI 辅助写代码"到"AI 按工程规范交付"

搭完这条流水线后，我对 Flutter + AI 协作的认识变了两个判断。

**第一个判断变化**：以前以为"AI 写代码不准"是模型能力问题，搭完 Workflow 才意识到大部分是"上下文管理问题"。同一个 AI 模型，在 Workflow 约束下产出质量明显提升——不是它变聪明了，是我们把该约束的事情约束住了。

**第二个判断变化**：以前以为 Workflow 越自动化越好，跑下来发现"暂停点设计"才是关键。Provider 拆分、路由注册这两个暂停点，把"事后返工"变成"事前确认"，整体返工率明显下降。

但也保留了怀疑。这套 Workflow 在我这种规模的项目（5 个 Skill、3 人团队、重复功能多）里有效，**换到小项目或原型阶段反而是负担**——一个人写脚本根本不需要 8 步流水线。Workflow 不是越完整越好，是越匹配项目规模越好。

下一步打算把这条流水线扩展成一个 Workflow 矩阵：`feature-delivery`（新功能交付）、`bugfix-flow`（Bug 修复）、`refactor-flow`（重构流程）三条并行。每条流水线的暂停点、自适应规则、必跑测试都不一样，但共享同一套 Skills。这是把 Flutter + AI 协作从"单流程"推向"流程矩阵"的下一步方向。

你 Flutter 项目里重复最多的开发流程是什么？是新增功能模块、修复线上 Bug、还是做架构重构？欢迎在评论区说说，下一篇可以挑重复最高的那个流程，演示怎么把它写成 Workflow。
