---
date: 2026-07-16
tags:
  - Flutter
  - Skills
  - AI编程
  - 开发效率
cover: /covers/cover-flutter-skills-setup.jpg
---

# 在 Flutter 项目里装 Skills：让 AI 写代码时自动遵守你的规范

## 使用假设

文章类型：教程干货；目标读者：Flutter 开发者、独立开发者、技术团队负责人；核心目标：涨粉 + 互动；作者调性：独立开发者。

## 备选标题

1. 在 Flutter 项目里装 Skills：让 AI 写代码时自动遵守你的规范（推荐）
2. Flutter + Skills：从零搭建 AI 辅助开发的完整工作流
3. 给 Flutter 项目装上 AI 大脑：Skills 落地实战指南
4. 让 AI 成为你的 Flutter 专家：Skills 体系搭建全流程
5. Flutter 开发效率翻倍：用 Skills 驯服 AI 编码助手

## 摘要

在 Flutter 项目中使用 AI 编码助手时，最常见的问题是"AI 写的代码不符合项目规范"。本文从零开始，教你如何搭建 Skills 体系，让 AI 自动理解并遵守你的项目架构、代码风格和最佳实践。

---

## 你可能正在经历的事

你用 Cursor 或 Claude Code 写 Flutter，AI 确实能帮你快速生成代码。但每次生成后，你都要花时间修正：

- 状态管理混用了 Provider 和 Riverpod
- 路由配置没有用 GoRouter
- 代码风格和项目现有规范不一致
- Widget 嵌套层级不合理

**本质上，AI 编码助手不知道你的项目"游戏规则"。** 它只知道通用的 Flutter 知识，但不知道你的项目用什么架构、遵循什么规范、哪些文件该放哪里。

Skills 就是解决这个问题的钥匙。它不是新的编程语言或框架，而是一套给 AI 编码助手看的"项目规则手册"。

---

## Skills 是什么，为什么 Flutter 项目需要它

### 什么是 Skills

Skills 是一组由指令文件、脚本和资源组成的文件夹，专门给 AI 编码助手"充电"用的。你可以把它理解为：

- **AI 的专业教材**：让 AI 助手在特定领域的开发任务中更加精准高效
- **开放标准**：遵循统一的技能规范，可以在不同的 AI Agent 之间自由迁移
- **即插即用**：一条命令安装到项目中，AI 助手自动识别并应用

简单来说，装上 Skills 后，你的 AI 编码助手就从"通用选手"升级为"你的项目专属专家"了。

### 为什么 Flutter 项目特别需要 Skills

Flutter 有几个特性让 AI 辅助开发特别容易出问题：

1. **强类型系统**：Dart 的类型系统很严格，但 AI 容易生成类型不匹配的代码
2. **布局约束复杂**：Flutter 的布局系统和 Web 差异很大，AI 对约束传递理解不足
3. **状态管理方案多样**：Provider、Riverpod、Bloc、GetX 等，AI 需要知道你的项目用哪个
4. **代码组织规范**：Widget 拆分、文件目录结构、命名约定等，AI 不会自动遵守

---

## 从零搭建：Flutter 项目的 Skills 体系

### 前置条件

- 一个已有的 Flutter 项目（或新建一个）
- 安装了支持 Skills 的 AI 编码助手（Cursor、Claude Code、Trae 等）
- 了解基本的 Flutter 项目结构和架构

### 步骤一：初始化 Skills 目录

在项目根目录创建 `.skills/` 文件夹，这是 AI 编码助手自动识别 Skills 的标准位置。

```bash
mkdir -p .skills
```

目录结构推荐：

```
.skills/
├── AGENTS.md              # 项目级 AI 指令（全局规则）
├── skills/                # 技能模块目录
│   ├── flutter-architecture/     # 架构规范
│   ├── flutter-code-style/       # 代码风格
│   ├── flutter-state-management/ # 状态管理
│   ├── flutter-routing/          # 路由配置
│   └── flutter-widget-patterns/  # Widget 模式
└── workflows/             # 工作流（可选）
```

### 步骤二：编写 AGENTS.md（全局规则）

这是最重要的文件，相当于项目的"宪法"。AI 编码助手会优先读取这里的规则。

**技术栈定义**：

- 框架：Flutter 3.x + Dart
- 状态管理：Riverpod 3.x
- 路由：GoRouter
- 网络请求：Dio
- 代码生成：build_runner + freezed

**全局红线（不可违反）**：

1. **状态管理统一使用 Riverpod**，禁止混用其他方案
2. **路由必须通过 GoRouter 配置**，禁止手写 Navigator.push
3. **所有 Widget 必须使用 const 构造函数**（除非有理由）
4. **文件命名使用 snake_case**，类名使用 PascalCase
5. **Widget 拆分原则**：单个文件不超过 200 行，超过必须拆分

**目录结构约定**：

```
lib/
├── main.dart              # 入口文件
├── app/                   # 应用核心
│   ├── app.dart           # 根 Widget
│   └── routes.dart        # 路由配置
├── features/              # 业务功能模块
│   └── auth/              # 认证模块示例
│       ├── presentation/  # UI 层
│       ├── domain/        # 领域层
│       └── data/          # 数据层
├── shared/                # 共享组件和工具
└── providers/             # Riverpod Providers
```

**Skills 索引**：

- **flutter-architecture**：架构规范和分层原则，触发场景：新建模块、修改架构
- **flutter-code-style**：代码风格和命名约定，触发场景：生成代码、代码审查
- **flutter-state-management**：Riverpod 使用规范，触发场景：状态管理相关操作
- **flutter-routing**：GoRouter 路由配置，触发场景：路由相关操作
- **flutter-widget-patterns**：常用 Widget 模式，触发场景：UI 开发

### 步骤三：编写第一个 Skill — 状态管理规范

在 `.skills/skills/flutter-state-management/` 目录下创建 `SKILL.md`：

**核心规则**：

1. **优先使用 NotifierProvider** 管理可变状态
2. **使用 Provider** 管理只读状态
3. **使用 Family** 处理需要参数的 Provider
4. **状态变更必须在 Notifier 内部完成**，禁止在 UI 层直接修改状态

**代码模板 — 创建一个简单的 Counter Provider**：

```dart
// lib/providers/counter_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final counterProvider = NotifierProvider<CounterNotifier, int>(
  CounterNotifier.new,
);

class CounterNotifier extends Notifier<int> {
  @override
  int build() {
    return 0;
  }

  void increment() {
    state++;
  }

  void decrement() {
    state--;
  }

  void reset() {
    state = 0;
  }
}
```

**常见错误与修复**：

错误：在 UI 层直接修改状态

```dart
// ❌ 错误
ref.watch(counterProvider).notifier.state++;

// ✅ 正确
ref.read(counterProvider.notifier).increment();
```

错误：使用 StateProvider 管理复杂状态

```dart
// ❌ 错误：复杂状态应该用 NotifierProvider
final userProvider = StateProvider<User>((ref) => User());

// ✅ 正确
final userProvider = NotifierProvider<UserNotifier, User>(
  UserNotifier.new,
);
```

### 步骤四：编写路由配置 Skill

在 `.skills/skills/flutter-routing/` 目录下创建 `SKILL.md`：

**核心规则**：

1. **所有路由必须在 app/routes.dart 中统一配置**
2. **使用命名路由**，禁止使用路径字符串字面量
3. **路由参数必须通过 GoRouter 的 extra 或 pathParameters 传递**
4. **页面 Widget 必须是 ConsumerWidget**（除非不需要状态）

**导航跳转对比**：

```dart
// ✅ 正确：使用命名路由
context.pushNamed('login');
context.pushNamed('profile', pathParameters: {'userId': '123'});

// ❌ 错误：使用路径字符串
context.push('/login');
```

### 步骤五：测试效果

现在打开你的 AI 编码助手，让它帮你写一个新页面：

```
请帮我创建一个用户资料页面，包含用户名、头像和简介。
```

如果 Skills 配置正确，AI 应该会：

1. 在 `lib/features/profile/presentation/` 目录下创建页面
2. 使用 Riverpod 管理状态（如果需要）
3. 使用 GoRouter 配置路由
4. 遵循代码风格规范

---

## 实战：让 AI 按规范写代码

### 场景：创建一个 Todo 功能模块

**需求**：创建一个 Todo 功能，包含列表展示、添加、删除和状态切换。

**AI 编码助手的输出（Skills 生效后）**：

```dart
// lib/features/todo/presentation/todo_screen.dart
class TodoScreen extends ConsumerWidget {
  const TodoScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todos = ref.watch(todoListProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Todos')),
      body: ListView.builder(
        itemCount: todos.length,
        itemBuilder: (context, index) {
          final todo = todos[index];
          return ListTile(
            title: Text(todo.title),
            leading: Checkbox(
              value: todo.completed,
              onChanged: (value) {
                ref.read(todoListProvider.notifier).toggle(todo.id);
              },
            ),
            trailing: IconButton(
              icon: const Icon(Icons.delete),
              onPressed: () {
                ref.read(todoListProvider.notifier).remove(todo.id);
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddTodoDialog(context, ref),
        child: const Icon(Icons.add),
      ),
    );
  }
  // ... 省略对话框代码
}
```

```dart
// lib/providers/todo_provider.dart
final todoListProvider = NotifierProvider<TodoListNotifier, List<Todo>>(
  TodoListNotifier.new,
);

class TodoListNotifier extends Notifier<List<Todo>> {
  @override
  List<Todo> build() {
    return [];
  }

  void add(String title) { /* ... */ }
  void remove(String id) { /* ... */ }
  void toggle(String id) { /* ... */ }
}
```

**效果验证**：

- ✅ 使用了 Riverpod 的 NotifierProvider
- ✅ 使用了 ConsumerWidget
- ✅ 文件目录符合约定（features/todo/presentation/）
- ✅ 状态变更在 Notifier 内部完成
- ✅ 使用了 const 构造函数

---

## 常见坑点与解决方案

### 坑点一：AI 忽略 Skills 的规则

**触发场景**：AI 编码助手生成的代码不符合 Skills 中定义的规则。

**看到的现象**：AI 生成了 Provider 代码，但项目规范要求使用 Riverpod。

**根本原因**：Skills 文件的格式或位置不正确，AI 无法识别。

**实际处理**：

1. 检查 `.skills/` 目录是否在项目根目录
2. 检查 `SKILL.md` 文件是否存在且格式正确
3. 检查 AI 编码助手是否支持 Skills 规范
4. 在 AGENTS.md 中用更明确的语言重写规则

**验证结果**：让 AI 重新生成代码，确认是否遵守了规则。

**怎么避免**：定期验证 Skills 的效果，确保 AI 确实在使用这些规则。

### 坑点二：Skills 规则之间冲突

**触发场景**：多个 Skills 文件中定义的规则互相矛盾。

**看到的现象**：一个 Skill 要求使用 Riverpod，另一个 Skill 要求使用 Provider。

**根本原因**：Skills 模块之间没有明确的优先级和互斥声明。

**实际处理**：在 AGENTS.md 中添加"规则优先级"声明：

1. AGENTS.md 中的全局规则优先级最高
2. 特定 Skill 的规则只在该 Skill 生效的场景中适用
3. 规则冲突时，以 AGENTS.md 中的全局规则为准

**验证结果**：检查所有 Skills 文件，确保没有与全局规则冲突的内容。

**怎么避免**：编写每个 Skill 时，先阅读 AGENTS.md 的全局规则。

### 坑点三：Skills 过于复杂导致 AI 理解困难

**触发场景**：Skills 文件太长或太复杂，AI 无法正确理解。

**看到的现象**：AI 只遵循了部分规则，忽略了其他规则。

**根本原因**：单个 Skills 文件超过了 AI 的上下文窗口，或者规则表述不够清晰。

**实际处理**：

1. 拆分过长的 Skills 文件
2. 使用更简洁的语言表述规则
3. 提供更多的代码示例
4. 删除冗余或重复的规则

**验证结果**：简化后重新测试，确认 AI 是否能完整遵守规则。

**怎么避免**：保持每个 Skills 文件不超过 200 行，规则不超过 10 条。

---

## 可收藏清单：Flutter Skills 体系搭建检查

在完成 Skills 体系搭建后，用这份清单自检：

1. **目录结构**：`.skills/` 目录是否在项目根目录？
2. **AGENTS.md**：是否定义了技术栈、全局红线和目录结构约定？
3. **Skills 索引**：AGENTS.md 中是否有完整的 Skills 索引表？
4. **核心 Skills**：是否至少包含架构、代码风格、状态管理和路由四个 Skill？
5. **代码示例**：每个 Skill 是否有完整的代码示例和错误对比？
6. **规则优先级**：是否定义了规则冲突时的处理策略？
7. **验证测试**：是否用一个真实需求测试过 Skills 的效果？
8. **团队共享**：`.skills/` 目录是否已加入版本控制？

---

## 写在最后

Skills 不是魔法，它只是把你的项目知识系统化地告诉 AI。搭建一套好的 Skills 体系，需要你先梳理清楚自己的项目规则——这本身就是一次有价值的架构反思。

当 AI 编码助手开始自动遵守你的规范时，你会发现：你不再是"AI 的校对员"，而是"AI 的指挥官"。你负责定义方向和规则，AI 负责执行具体的编码工作。

**下一步**：如果你想让 AI 参与更复杂的流程，可以学习如何编写 Workflow，把多个 Skills 串联成完整的开发流水线。

你在 Flutter 项目中使用 AI 编码助手时遇到过什么问题？欢迎在评论区讨论。

---

## 转发文案

1. 给你的 Flutter 项目装上 AI 大脑，让 AI 写代码时自动遵守你的规范
2. Flutter + Skills 实战：从零搭建 AI 辅助开发体系

## 发布前检查

- [ ] 封面图已生成：`/covers/cover-flutter-skills-setup.webp`
- [ ] 标题、摘要、正文指向同一主题
- [ ] 代码示例完整且可运行
- [ ] 坑点结构使用规范格式（触发场景 / 看到的现象 / 根本原因 / 实际处理 / 验证结果 / 怎么避免）
- [ ] 没有极限词、虚假承诺、无出处数据和诱导分享
- [ ] 复制到公众号编辑器后完成一次手机预览