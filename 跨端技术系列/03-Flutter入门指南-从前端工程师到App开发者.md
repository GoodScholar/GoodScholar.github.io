---
date: 2026-01-03
---
# 🐦 Flutter 入门指南：从前端工程师到 App 开发者的最短路径

> 你已经是一个熟练的前端工程师（Vue / React），想做原生 App 但不想学 Swift 和 Kotlin？
> Flutter 可能是你**投入产出比最高**的选择 — 一套 Dart 代码，同时产出 iOS、Android、Web、桌面应用。

**本文写给谁**：有 JavaScript / TypeScript 经验的前端开发者。不需要任何移动端基础。
读完你将掌握：**Dart 核心语法 → Flutter 布局体系 → 状态管理 → 路由导航 → 实战项目**，直接上手写 App。

---

## 📊 Flutter 全貌速览

| 维度 | 说明 |
|------|------|
| 🏢 出品方 | Google（2018 年正式发布） |
| 📝 开发语言 | Dart（强类型，语法类似 TypeScript） |
| 🎨 渲染方式 | 自绘引擎（Skia / Impeller），不依赖原生控件 |
| 📱 目标平台 | iOS / Android / Web / macOS / Windows / Linux |
| ⭐ GitHub Star | 170k+（全球最活跃的跨端框架） |
| 📦 包管理 | pub.dev（45,000+ 开源包） |
| 🔄 热重载 | ✅ 亚秒级 Hot Reload，改完立刻看效果 |

---

## 🛠 1. 环境搭建：15 分钟开始写代码

### macOS 安装（推荐）

```bash
# 1. 安装 Flutter SDK（使用官方推荐方式）
brew install --cask flutter

# 2. 检查环境依赖
flutter doctor

# 3. 常见缺失项修复
# Xcode（iOS 开发必须）
xcode-select --install
sudo xcodebuild -license accept

# Android Studio（Android 开发必须）
# 从官网下载安装，然后安装 SDK
# https://developer.android.com/studio

# 4. 确认一切就绪
flutter doctor -v
```

### flutter doctor 常见问题速查

| 问题 | 解决方案 |
|------|---------|
| ❌ Android license not accepted | `flutter doctor --android-licenses` |
| ❌ Xcode not installed | App Store 安装 Xcode |
| ❌ CocoaPods not installed | `brew install cocoapods` |
| ❌ Chrome not installed | 安装 Chrome（Web 开发用）|
| ⚠️ Android Studio not found | 安装后运行 `flutter config --android-studio-dir=路径` |

### 创建第一个项目

```bash
# 创建项目
flutter create my_first_app
cd my_first_app

# 启动（iOS 模拟器）
open -a Simulator
flutter run

# 或者 Web
flutter run -d chrome

# 🎉 看到计数器 Demo 就成功了！
```

> 💡 **推荐 IDE**：VS Code + Flutter 插件，或 Android Studio + Flutter 插件。
> VS Code 更轻量，Android Studio 的 Flutter Inspector 更强大。

---

## 📝 2. Dart 语言速成：TypeScript 开发者的 5 分钟对照表

> Dart 和 TypeScript 像是"失散多年的兄弟"。来看看它们的对应关系：

### 基础语法对照

| 概念 | TypeScript | Dart |
|------|-----------|------|
| 变量声明 | `let` / `const` | `var` / `final` / `const` |
| 类型标注 | `name: string` | `String name` |
| 字符串模板 | `` `Hello ${name}` `` | `'Hello $name'` 或 `'Hello ${expr}'` |
| 箭头函数 | `(x) => x * 2` | `(x) => x * 2` ✅ 完全一致 |
| 可选参数 | `fn(x?: number)` | `fn({int? x})` |
| 空安全 | `name?.length` | `name?.length` ✅ 完全一致 |
| 异步 | `async / await` | `async / await` ✅ 完全一致 |
| 数组 | `number[]` | `List<int>` |
| 对象 | `Record<string, any>` | `Map<String, dynamic>` |
| 接口 | `interface` | `abstract class` |
| 枚举 | `enum` | `enum`（功能更强大） |

### 代码对比

**TypeScript：**

```typescript
interface User {
  id: string;
  name: string;
  age?: number;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

const users: User[] = [];
users.push({ id: '1', name: 'Alice' });
console.log(`Hello ${users[0].name}`);
```

**Dart 等价写法：**

```dart
class User {
  final String id;
  final String name;
  final int? age;  // 可空类型用 ?

  User({required this.id, required this.name, this.age});
}

Future<User> fetchUser(String id) async {
  final response = await http.get(Uri.parse('/api/users/$id'));
  return User.fromJson(jsonDecode(response.body));
}

final users = <User>[];
users.add(User(id: '1', name: 'Alice'));
print('Hello ${users[0].name}');
```

### Dart 独有特性（前端没有的好东西）

```dart
// 1. 命名参数 — 比位置参数更清晰
Widget buildCard({required String title, String? subtitle, int elevation = 4}) {
  // ...
}
buildCard(title: '标题', elevation: 8);  // 调用时参数名可见

// 2. 级联调用 — 链式操作太爽了
final paint = Paint()
  ..color = Colors.blue
  ..strokeWidth = 2.0
  ..style = PaintingStyle.stroke;

// 3. 扩展方法 — 给现有类加方法
extension StringExt on String {
  String get capitalize => '${this[0].toUpperCase()}${substring(1)}';
}
'hello'.capitalize;  // 'Hello'

// 4. sealed class（模式匹配）
sealed class Result<T> {}
class Success<T> extends Result<T> { final T data; Success(this.data); }
class Failure<T> extends Result<T> { final String error; Failure(this.error); }

// 配合 switch 表达式
final message = switch (result) {
  Success(data: var d) => '成功: $d',
  Failure(error: var e) => '失败: $e',
};
```

---

## 🧱 3. Widget 体系：一切皆组件

> Flutter 中**一切都是 Widget**。文字是 Widget，按钮是 Widget，间距是 Widget，
> 甚至"居中"也是一个 Widget。这和前端的 HTML + CSS 分离不同。

### 核心概念对照

| 前端概念 | Flutter 等价 |
|---------|-------------|
| `<div>` | `Container` / `SizedBox` |
| `<span>` / `<p>` | `Text` |
| `<img>` | `Image` |
| `<button>` | `ElevatedButton` / `TextButton` / `IconButton` |
| `<input>` | `TextField` |
| `<ul><li>` | `ListView` |
| `display: flex` | `Row`（横向）/ `Column`（纵向） |
| `flex: 1` | `Expanded` / `Flexible` |
| `gap` | `SizedBox(width: 8)` 或使用 `gap` 属性 |
| `padding` | `Padding` Widget 或 `Container(padding:)` |
| `margin` | `Container(margin:)` |
| `position: absolute` | `Stack` + `Positioned` |
| `overflow: scroll` | `SingleChildScrollView` / `ListView` |
| `@media` 响应式 | `MediaQuery` / `LayoutBuilder` |

### StatelessWidget vs StatefulWidget

```dart
// 📌 无状态组件 — 类似 React 的纯函数组件
class GreetingCard extends StatelessWidget {
  final String name;
  const GreetingCard({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text('Hello, $name!', style: const TextStyle(fontSize: 20)),
      ),
    );
  }
}

// 📌 有状态组件 — 类似 React 的 useState
class CounterButton extends StatefulWidget {
  const CounterButton({super.key});

  @override
  State<CounterButton> createState() => _CounterButtonState();
}

class _CounterButtonState extends State<CounterButton> {
  int _count = 0;  // 相当于 const [count, setCount] = useState(0)

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => setState(() => _count++),  // 相当于 setCount(c => c + 1)
      child: Text('点击了 $_count 次'),
    );
  }
}
```

> 🔑 **核心理解**：`setState()` 就是 Flutter 版的"触发重新渲染"。
> 调用后 Flutter 会重新执行 `build()` 方法（类似 React 的 `render`）。

---

## 📐 4. 布局系统：从 Flexbox 到 Row/Column

### 最常用的 5 个布局 Widget

#### ① Row + Column = Flexbox

```dart
// 横向排列（flex-direction: row）
Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,  // justify-content
  crossAxisAlignment: CrossAxisAlignment.center,       // align-items
  children: [
    Icon(Icons.star, color: Colors.amber),
    Text('4.8'),
    Text('(128 评价)'),
  ],
)

// 纵向排列（flex-direction: column）
Column(
  crossAxisAlignment: CrossAxisAlignment.start,  // align-items: flex-start
  children: [
    Text('标题', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
    SizedBox(height: 8),  // 间距（相当于 gap）
    Text('副标题', style: TextStyle(color: Colors.grey)),
  ],
)
```

#### ② Stack = position: relative/absolute

```dart
Stack(
  children: [
    // 底层：背景图
    Image.network('https://example.com/bg.jpg', fit: BoxFit.cover),

    // 上层：定位元素
    Positioned(
      bottom: 16,
      right: 16,
      child: FloatingActionButton(
        onPressed: () {},
        child: Icon(Icons.add),
      ),
    ),
  ],
)
```

#### ③ Expanded / Flexible = flex: 1

```dart
Row(
  children: [
    // 固定宽度侧边栏
    Container(width: 80, color: Colors.grey[200]),

    // 自适应宽度主内容（flex: 1）
    Expanded(
      child: Text('这段文字会占据剩余全部宽度'),
    ),

    // 3:1 比例分配
    Expanded(flex: 3, child: Container(color: Colors.blue)),
    Expanded(flex: 1, child: Container(color: Colors.red)),
  ],
)
```

#### ④ ListView = 可滚动列表

```dart
// 静态列表
ListView(
  children: [
    ListTile(title: Text('选项 1')),
    ListTile(title: Text('选项 2')),
    ListTile(title: Text('选项 3')),
  ],
)

// 动态列表（大数据量用 builder，类似 React 的虚拟列表）
ListView.builder(
  itemCount: products.length,
  itemBuilder: (context, index) {
    return ProductCard(product: products[index]);
  },
)
```

#### ⑤ Container = 万能盒子

```dart
Container(
  width: 200,
  height: 100,
  margin: const EdgeInsets.all(16),            // 外边距
  padding: const EdgeInsets.symmetric(         // 内边距
    horizontal: 20, vertical: 12,
  ),
  decoration: BoxDecoration(
    color: Colors.white,                       // 背景色
    borderRadius: BorderRadius.circular(12),   // 圆角
    boxShadow: [                               // 阴影
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.1),
        blurRadius: 10,
        offset: const Offset(0, 4),
      ),
    ],
  ),
  child: Text('精美卡片'),
)
```

### 布局速查决策树

```
需要什么布局？
│
├── 横向排列多个子元素 → Row
├── 纵向排列多个子元素 → Column
├── 层叠 / 绝对定位 → Stack + Positioned
├── 可滚动列表 → ListView / ListView.builder
├── 网格布局 → GridView
├── 自适应占满剩余空间 → Expanded / Flexible
├── 固定尺寸间距 → SizedBox(width: / height:)
├── 内边距 → Padding
└── 复杂装饰（圆角/阴影/渐变） → Container + BoxDecoration
```

---

## 🎨 5. 样式与主题：告别硬编码

### 全局主题定义

```dart
// lib/config/theme.dart
class AppTheme {
  static ThemeData get darkTheme => ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: const Color(0xFF0F172A),
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFF6366F1),        // 主色：靛蓝
      secondary: Color(0xFFEC4899),      // 辅色：粉红
      surface: Color(0xFF1E293B),        // 卡片背景
      onPrimary: Colors.white,
    ),
    textTheme: const TextTheme(
      headlineLarge: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
      headlineMedium: TextStyle(fontSize: 24, fontWeight: FontWeight.w600),
      bodyLarge: TextStyle(fontSize: 16),
      bodyMedium: TextStyle(fontSize: 14),
      labelLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    ),
    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: const Color(0xFF1E293B),
    ),
  );
}

// main.dart 中使用
MaterialApp(
  title: 'My App',
  theme: AppTheme.darkTheme,
  home: const HomeScreen(),
);
```

### 使用主题（不要硬编码！）

```dart
// ❌ 坏习惯：硬编码
Text('标题', style: TextStyle(fontSize: 24, color: Color(0xFF6366F1)));

// ✅ 好习惯：使用主题
Text('标题', style: Theme.of(context).textTheme.headlineMedium);

// ✅ 获取主题色
final primaryColor = Theme.of(context).colorScheme.primary;

// ✅ 自适应间距
final screenWidth = MediaQuery.of(context).size.width;
final padding = screenWidth > 600 ? 32.0 : 16.0;
```

---

## 🗺 6. 路由导航：GoRouter 声明式路由

### 安装

```yaml
# pubspec.yaml
dependencies:
  go_router: ^14.0.0
```

### 路由配置

```dart
// lib/config/router.dart
import 'package:go_router/go_router.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    // 基础路由
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),

    // 带参数路由
    GoRoute(
      path: '/product/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return ProductDetailScreen(productId: id);
      },
    ),

    // 嵌套路由（Bottom Tab）
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(path: '/home', builder: (_, __) => const HomePage()),
        GoRoute(path: '/search', builder: (_, __) => const SearchPage()),
        GoRoute(path: '/profile', builder: (_, __) => const ProfilePage()),
      ],
    ),
  ],
);

// main.dart
MaterialApp.router(
  routerConfig: router,
  theme: AppTheme.darkTheme,
);
```

### 导航操作

```dart
// 前端路由对照
// React: navigate('/product/123')
context.go('/product/123');         // 替换当前路由
context.push('/product/123');       // 压入路由栈（可返回）

// React: navigate(-1)  /  history.back()
context.pop();                      // 返回上一页

// 带 query 参数
context.go('/search?keyword=flutter');
// 获取参数
final keyword = state.uri.queryParameters['keyword'];
```

---

## 🧠 7. 状态管理：从 setState 到 Riverpod

### 状态管理选型

| 方案 | 复杂度 | 适合场景 | 前端类比 |
|------|--------|---------|---------|
| `setState` | ⭐ | 单组件局部状态 | `useState` |
| `InheritedWidget` | ⭐⭐ | 跨组件共享 | `useContext` |
| **Riverpod** | ⭐⭐⭐ | **生产级推荐** | Zustand / Jotai |
| Bloc | ⭐⭐⭐⭐ | 大型企业项目 | Redux |

### Riverpod 快速上手

```yaml
# pubspec.yaml
dependencies:
  flutter_riverpod: ^3.2.1
  riverpod_annotation: ^4.0.2

dev_dependencies:
  riverpod_generator: ^4.0.3
  build_runner: ^2.4.13
```

```dart
// 1️⃣ 包裹根组件
// main.dart
void main() {
  runApp(const ProviderScope(child: MyApp()));
}

// 2️⃣ 定义 Provider（类似 React 的 custom hook）
// lib/providers/counter_provider.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'counter_provider.g.dart';

@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;  // 初始值

  void increment() => state++;
  void decrement() => state--;
  void reset() => state = 0;
}

// 3️⃣ 在 UI 中使用（ConsumerWidget 代替 StatelessWidget）
class CounterPage extends ConsumerWidget {
  const CounterPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);      // 订阅状态（自动重建）
    final notifier = ref.read(counterProvider.notifier);  // 获取操作方法

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('$count', style: const TextStyle(fontSize: 48)),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(onPressed: notifier.decrement, icon: const Icon(Icons.remove)),
            IconButton(onPressed: notifier.reset, icon: const Icon(Icons.refresh)),
            IconButton(onPressed: notifier.increment, icon: const Icon(Icons.add)),
          ],
        ),
      ],
    );
  }
}

// 4️⃣ 运行代码生成
// 终端执行：dart run build_runner build --delete-conflicting-outputs
```

### 异步数据加载（API 请求）

```dart
// lib/providers/product_provider.dart
@riverpod
class ProductList extends _$ProductList {
  @override
  Future<List<Product>> build() async {
    // 自动管理 loading / data / error 状态
    final response = await ref.read(dioProvider).get('/api/products');
    return (response.data['list'] as List)
        .map((json) => Product.fromJson(json))
        .toList();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => build());
  }
}

// UI 中使用
class ProductScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productState = ref.watch(productListProvider);

    return productState.when(
      data: (products) => ListView.builder(
        itemCount: products.length,
        itemBuilder: (_, i) => Text(products[i].name),
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, _) => Center(child: Text('出错了: $err')),
    );
  }
}
```

> 🔑 **Riverpod 核心三件套**：
> - `ref.watch()` → 订阅状态，状态变化自动重建 UI（类似 React 的 hook 订阅）
> - `ref.read()` → 读取一次，不订阅（用于事件回调中）
> - `AsyncValue.when()` → 优雅处理 loading / data / error 三态

---

## 🚀 8. 实战项目：搭建一个完整的 App

以一个**"技术文章阅读器"** App 为例，串联上面所有知识点：

### 项目结构

```
lib/
├── config/
│   ├── theme.dart            # 主题配置
│   └── router.dart           # 路由配置
├── models/
│   └── article.dart          # 数据模型
├── providers/
│   └── article_provider.dart # 状态管理
├── screens/
│   ├── home_screen.dart      # 首页（文章列表）
│   └── detail_screen.dart    # 详情页
├── widgets/
│   └── article_card.dart     # 文章卡片组件
└── main.dart                 # 入口
```

### 核心代码

```dart
// lib/models/article.dart
class Article {
  final String id;
  final String title;
  final String summary;
  final String author;
  final String date;
  final String? coverUrl;

  Article({
    required this.id,
    required this.title,
    required this.summary,
    required this.author,
    required this.date,
    this.coverUrl,
  });
}

// lib/widgets/article_card.dart
class ArticleCard extends StatelessWidget {
  final Article article;
  final VoidCallback onTap;

  const ArticleCard({super.key, required this.article, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GestureDetector(
      onTap: onTap,
      child: Card(
        margin: const EdgeInsets.only(bottom: 16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 封面图
              if (article.coverUrl != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    article.coverUrl!,
                    height: 160,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
              if (article.coverUrl != null) const SizedBox(height: 12),

              // 标题
              Text(article.title, style: theme.textTheme.headlineMedium),
              const SizedBox(height: 8),

              // 摘要
              Text(
                article.summary,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                ),
              ),
              const SizedBox(height: 12),

              // 作者 + 日期
              Row(
                children: [
                  Icon(Icons.person_outline, size: 16,
                    color: theme.colorScheme.primary),
                  const SizedBox(width: 4),
                  Text(article.author, style: theme.textTheme.bodyMedium),
                  const Spacer(),
                  Text(article.date, style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                  )),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// lib/screens/home_screen.dart
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final articlesState = ref.watch(articleListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('📖 技术文章'),
        centerTitle: false,
      ),
      body: articlesState.when(
        data: (articles) => RefreshIndicator(
          onRefresh: () => ref.read(articleListProvider.notifier).refresh(),
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: articles.length,
            itemBuilder: (context, index) {
              final article = articles[index];
              return ArticleCard(
                article: article,
                onTap: () => context.push('/article/${article.id}'),
              );
            },
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('😕 加载失败'),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: () => ref.invalidate(articleListProvider),
                child: const Text('重试'),
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

## 💉 9. 新手常见错误对照表

| 错误 | 后果 | 修复 |
|-----|------|------|
| 在 `build()` 方法里发网络请求 | 无限请求，性能爆炸 | 请求放到 Provider / Controller 中 |
| `setState` 管理全局状态 | 状态混乱，难以维护 | 全局用 Riverpod，局部用 setState |
| `Container` 满天飞 | 代码臃肿，性能浪费 | 只需 Padding 就用 `Padding`，只需尺寸就用 `SizedBox` |
| 忘记 `const` 构造函数 | 不必要的 Widget 重建 | 编译期常量加 `const`（IDE 有提示） |
| 硬编码颜色和字号 | 换主题时全局搜索替换 | 统一使用 `Theme.of(context)` |
| `Column` 套 `ListView` 不加 `shrinkWrap` | 布局报错（无限高度） | 用 `Expanded` 包裹 `ListView`，或设 `shrinkWrap: true` |
| Hot Reload 不生效 | 改了 `main()` 或 `initState` | 用 Hot Restart（`Shift + R`） |

---

## 📚 10. 学习路径 Checklist

### 第 1 周：基础入门
- [ ] 安装 Flutter SDK，跑通 `flutter doctor`
- [ ] 创建第一个项目并在模拟器运行
- [ ] 学完 Dart 语法（对照 TypeScript 速成表）
- [ ] 掌握 5 大核心 Widget：`Row` / `Column` / `Stack` / `ListView` / `Container`
- [ ] 理解 `StatelessWidget` vs `StatefulWidget`

### 第 2 周：进阶能力
- [ ] 配置全局 ThemeData，告别硬编码
- [ ] 使用 GoRouter 实现多页面导航
- [ ] 学会 Riverpod 状态管理基础
- [ ] 实现一个完整的列表页（加载 + 刷新 + 分页）
- [ ] 运行 `dart run build_runner` 代码生成

### 第 3 周：实战项目
- [ ] 搭建完整项目结构（Feature-First 分层架构）
- [ ] 接入真实 API，使用 Dio + Freezed
- [ ] 实现登录 / 注册流程
- [ ] 学会 Flutter DevTools 调试

### 第 4 周：上线准备
- [ ] 适配深色/浅色主题
- [ ] 国际化（i18n）配置
- [ ] App Icon 和启动页定制
- [ ] 构建 Release 包并提交应用商店

---

## 📖 推荐学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| [flutter.dev/docs](https://flutter.dev/docs) | 官方文档 | 最权威的学习资料 |
| [dart.dev/language](https://dart.dev/language) | 语言文档 | Dart 语法大全 |
| [pub.dev](https://pub.dev) | 包管理 | 查找和评估第三方包 |
| [riverpod.dev](https://riverpod.dev) | 状态管理 | Riverpod 官方教程 |
| [Flutter Widget of the Week](https://www.youtube.com/playlist?list=PLjxrf2q8roU2HdJQDjJzOeO6J3FoFLWr2) | 视频 | Google 官方 Widget 讲解 |
| [FlutterByExample](https://flutterbyexample.com) | 教程 | 代码示例驱动学习 |

---

> 学 Flutter 就像学骑自行车 — 你不需要先背完物理学原理，只需要**跨上去蹬几圈**。
> 从第一个 `Text('Hello')` 开始，每天写一个小组件，四周后你就能独立交付 App。
> **最好的学习方法，就是现在就 `flutter create` 一个项目，然后开始写代码。**


---
*📝 作者：NIHoa ｜ 系列：跨端技术系列 ｜ 更新日期：2026-01-03*
