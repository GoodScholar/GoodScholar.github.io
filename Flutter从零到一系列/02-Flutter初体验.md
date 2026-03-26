# 🐣 Flutter 从零到一（二）：Flutter 初体验 — 第一个 App 的诞生

> **系列导读**：上一篇我们学了 Dart 语言基础，现在正式进入 Flutter 的世界。
> 本文带你从环境搭建到运行第一个 App，理解 Flutter 的核心概念。

---

## 🛠 1. 环境搭建

### macOS 安装

```bash
# 方式一：Homebrew（推荐）
brew install --cask flutter

# 方式二：手动下载
# 从 https://flutter.dev/docs/get-started/install 下载 SDK
# 解压到你喜欢的目录，添加到 PATH

# 验证安装
flutter --version
# Flutter 3.29.0 • channel stable
# Dart 3.7.0

# 检查环境依赖
flutter doctor
```

### flutter doctor 常见问题

```bash
# 修复 Android licenses
flutter doctor --android-licenses

# 修复 Xcode
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept

# 修复 CocoaPods
brew install cocoapods

# 设置 Android Studio 路径
flutter config --android-studio-dir="/Applications/Android Studio.app"
```

### 目标：全部 ✅

```
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 3.29.0)
[✓] Android toolchain
[✓] Xcode
[✓] Chrome
[✓] Android Studio
[✓] VS Code
[✓] Connected device
[✓] Network resources
```

### IDE 配置

```
推荐方案：
├── VS Code（轻量首选）
│   ├── 安装插件：Flutter
│   ├── 安装插件：Dart
│   └── 安装插件：Flutter Widget Snippets
│
└── Android Studio（功能全面）
    ├── 安装插件：Flutter
    ├── 安装插件：Dart
    └── 自带 Flutter Inspector 和 Layout Explorer
```

---

## 🚀 2. 创建第一个项目

```bash
# 创建项目
flutter create hello_flutter
cd hello_flutter

# 项目结构
hello_flutter/
├── lib/                 # 📂 核心代码目录
│   └── main.dart        # 📄 应用入口
├── test/                # 📂 测试目录
│   └── widget_test.dart
├── android/             # 📂 Android 平台代码
├── ios/                 # 📂 iOS 平台代码
├── web/                 # 📂 Web 平台代码
├── pubspec.yaml         # 📄 项目配置（依赖、资源）
├── pubspec.lock         # 📄 依赖锁定文件
├── analysis_options.yaml # 📄 代码分析规则
└── README.md
```

### 运行项目

```bash
# 打开 iOS 模拟器
open -a Simulator

# 运行（自动检测可用设备）
flutter run

# 指定设备运行
flutter run -d chrome         # Web 浏览器
flutter run -d iPhone         # iOS 模拟器
flutter run -d emulator-5554  # Android 模拟器

# 查看所有可用设备
flutter devices
```

---

## 📝 3. 解读默认代码

```dart
// lib/main.dart — 默认计数器应用

import 'package:flutter/material.dart';  // 导入 Material 组件库

// 应用入口函数
void main() {
  runApp(const MyApp());  // runApp 启动整个应用
}

// 根 Widget — 应用配置
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(         // Material 风格应用
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

// 首页 — 有状态 Widget
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;  // 状态变量

  void _incrementCounter() {
    setState(() {        // setState 触发重新构建
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(              // 页面脚手架
      appBar: AppBar(             // 顶部导航栏
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(               // 内容居中
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text('You have pushed the button this many times:'),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(  // 浮动按钮
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

### 代码结构解析

```
main()
  └── runApp(MyApp)                    # 启动应用
        └── MaterialApp                 # 应用壳（主题、路由）
              └── MyHomePage            # 首页（StatefulWidget）
                    └── Scaffold        # 页面骨架
                          ├── AppBar               # 顶栏
                          ├── Center > Column      # 内容区
                          │     ├── Text           # 提示文字
                          │     └── Text           # 计数显示
                          └── FloatingActionButton  # 浮动按钮
```

---

## 🧱 4. Widget 核心概念

### 一切皆 Widget

> Flutter 中**一切可见的元素都是 Widget**。文字、按钮、图片是 Widget，
> 布局、对齐、填充也是 Widget。Widget 是 UI 的**描述**，不是最终绘制的对象。

```dart
// Widget 是轻量的描述对象，Flutter 引擎负责高效渲染
Center(                    // Widget: 居中布局
  child: Container(        // Widget: 容器
    padding: EdgeInsets.all(16),  // 不是 Widget，是属性值
    child: Text('Hello'),  // Widget: 文字显示
  ),
)
```

### Widget 树

```
每个 Flutter 应用都是一棵 Widget 树：

          MaterialApp
              │
          Scaffold
         ╱    │    ╲
    AppBar   Body   FAB
              │
           Center
              │
           Column
           ╱    ╲
        Text   Text
```

### StatelessWidget vs StatefulWidget

```dart
// 📌 StatelessWidget — 无状态组件
// 数据从外部传入，不会自己改变
class WelcomeCard extends StatelessWidget {
  final String name;
  final String role;

  const WelcomeCard({
    super.key,
    required this.name,
    required this.role,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text('欢迎，$name！', style: const TextStyle(fontSize: 20)),
            Text('身份：$role', style: const TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}

// 使用
const WelcomeCard(name: '张三', role: '前端工程师');
```

```dart
// 📌 StatefulWidget — 有状态组件
// 自身有可变状态，通过 setState 更新
class LikeButton extends StatefulWidget {
  const LikeButton({super.key});

  @override
  State<LikeButton> createState() => _LikeButtonState();
}

class _LikeButtonState extends State<LikeButton> {
  bool _isLiked = false;
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        setState(() {  // 修改状态并触发 UI 更新
          _isLiked = !_isLiked;
          _count += _isLiked ? 1 : -1;
        });
      },
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _isLiked ? Icons.favorite : Icons.favorite_border,
            color: _isLiked ? Colors.red : Colors.grey,
          ),
          const SizedBox(width: 4),
          Text('$_count'),
        ],
      ),
    );
  }
}
```

### 如何选择？

| 问题 | 答案 → 选择 |
|------|-----------|
| 这个组件的数据会变化吗？ | 不会 → StatelessWidget |
| 数据变化时需要更新 UI 吗？ | 需要 → StatefulWidget |
| 能从外部接收所有数据吗？ | 能 → StatelessWidget |

---

## 🔥 5. Hot Reload — 开发利器

```
Hot Reload（热重载）：
├── 保存文件 → 自动触发
├── 保留应用状态（变量值不丢失）
├── 只更新修改的部分
└── 通常 < 1 秒

Hot Restart（热重启）：
├── 按 Shift + R 触发
├── 重置所有状态
├── 重新执行 main()
└── 用于修改了 initState / main 时

完全重启：
├── 按 Ctrl + C 停止，再 flutter run
├── 用于修改了原生代码（Android/iOS）
└── 用于修改了 pubspec.yaml 依赖
```

---

## 📦 6. pubspec.yaml — 项目配置文件

```yaml
# pubspec.yaml — Flutter 项目的"身份证"

name: hello_flutter
description: 我的第一个 Flutter 应用
version: 1.0.0+1

environment:
  sdk: '>=3.7.0 <4.0.0'     # Dart SDK 版本约束
  flutter: '>=3.29.0'        # Flutter 版本约束

# 项目依赖
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6    # iOS 风格图标

# 开发依赖
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0

# 资源文件声明
flutter:
  uses-material-design: true  # 启用 Material 图标

  # 图片资源
  assets:
    - assets/images/
    - assets/icons/

  # 字体
  fonts:
    - family: CustomFont
      fonts:
        - asset: assets/fonts/CustomFont-Regular.ttf
        - asset: assets/fonts/CustomFont-Bold.ttf
          weight: 700
```

### 添加依赖

```bash
# 命令行添加
flutter pub add go_router
flutter pub add dio
flutter pub add flutter_riverpod

# 或手动编辑 pubspec.yaml 后执行
flutter pub get
```

---

## 🖊 7. 改写第一个 App

让我们把默认计数器改写成一个更有趣的应用：

```dart
// lib/main.dart — 名言生成器
import 'package:flutter/material.dart';
import 'dart:math';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '每日名言',
      debugShowCheckedModeBanner: false,  // 隐藏 Debug 角标
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.indigo,
          brightness: Brightness.dark,     // 暗色主题
        ),
        useMaterial3: true,
      ),
      home: const QuotePage(),
    );
  }
}

class QuotePage extends StatefulWidget {
  const QuotePage({super.key});

  @override
  State<QuotePage> createState() => _QuotePageState();
}

class _QuotePageState extends State<QuotePage> {
  final List<Map<String, String>> _quotes = [
    {'text': '学而不思则罔，思而不学则殆。', 'author': '孔子'},
    {'text': '千里之行，始于足下。', 'author': '老子'},
    {'text': '代码是写给人看的，附带能在机器上运行。', 'author': 'Harold Abelson'},
    {'text': '简单是终极的复杂。', 'author': '达芬奇'},
    {'text': '过早优化是万恶之源。', 'author': 'Donald Knuth'},
    {'text': '先让它工作，再让它正确，最后让它快。', 'author': 'Kent Beck'},
    {'text': '任何足够先进的技术，都与魔法无异。', 'author': 'Arthur C. Clarke'},
  ];

  int _currentIndex = 0;
  bool _isFavorited = false;

  void _nextQuote() {
    setState(() {
      _currentIndex = Random().nextInt(_quotes.length);
      _isFavorited = false;
    });
  }

  void _toggleFavorite() {
    setState(() {
      _isFavorited = !_isFavorited;
    });
  }

  @override
  Widget build(BuildContext context) {
    final quote = _quotes[_currentIndex];

    return Scaffold(
      appBar: AppBar(
        title: const Text('📖 每日名言'),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 名言图标
              Icon(
                Icons.format_quote,
                size: 48,
                color: Theme.of(context).colorScheme.primary,
              ),

              const SizedBox(height: 24),

              // 名言内容
              Text(
                quote['text']!,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w300,
                  height: 1.6,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 16),

              // 作者
              Text(
                '—— ${quote['author']!}',
                style: TextStyle(
                  fontSize: 16,
                  color: Theme.of(context).colorScheme.secondary,
                  fontStyle: FontStyle.italic,
                ),
              ),

              const SizedBox(height: 48),

              // 操作按钮
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // 收藏按钮
                  IconButton(
                    onPressed: _toggleFavorite,
                    icon: Icon(
                      _isFavorited ? Icons.favorite : Icons.favorite_border,
                      color: _isFavorited ? Colors.red : null,
                      size: 32,
                    ),
                  ),

                  const SizedBox(width: 32),

                  // 下一条按钮
                  FilledButton.icon(
                    onPressed: _nextQuote,
                    icon: const Icon(Icons.refresh),
                    label: const Text('换一条'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## ✅ 本篇小结 Checklist

- [ ] Flutter SDK 安装成功，`flutter doctor` 全部 ✅
- [ ] 成功创建并运行第一个项目
- [ ] 理解项目目录结构（lib / pubspec.yaml）
- [ ] 理解 Widget 树的概念
- [ ] 区分 StatelessWidget 和 StatefulWidget
- [ ] 体验 Hot Reload 开发流程
- [ ] 完成名言生成器 App 改写

---

> **下一篇预告**：《Widget 大全：Flutter 的积木世界》—— 掌握 30+ 常用 Widget，
> 构建任何界面都信手拈来。

---

*本文是「Flutter 从零到一」系列第 2 篇，共 13 篇。*


---
*📝 作者：NIHoa ｜ 系列：Flutter从零到一系列 ｜ 更新日期：2025-03-02*
