# Flutter | 第5期 - Skeletonizer：一行代码实现骨架屏

本期为大家分享如何在 Flutter 中去做骨架屏（Skeleton Loading）功能，用 skeletonizer 插件实现零模板代码的骨架屏效果，感兴趣的话和我一起来探索一下呗~

---

### 首先，什么是骨架屏？

骨架屏是一种在数据加载过程中，用灰色占位块模拟页面结构的加载方案，让用户感知到「内容即将出现」，避免白屏等待的焦虑。

▪️ **用户体验好**：比转圈 Loading 更友好，用户能预见内容结构
▪️ **感知更快**：研究表明骨架屏让用户感觉加载速度快了 15-20%
▪️ **行业标准**：微信、淘宝、抖音等主流 App 广泛使用
▪️ **结构化占位**：以真实 UI 布局为基础生成，而非简单的 Loading 动画
▪️ **自动闪光动画**：带有左右流动的 Shimmer 动画，暗示加载进行中

---

## 为什么选 Skeletonizer？

传统做骨架屏需要**手动编写一套占位 UI**，维护两套布局（真实 UI + 骨架 UI），工作量大且容易不一致。

| 方案 | 核心特点 | 对比 |
|------|---------|------|
| 手动编写骨架屏 | 自己用 Container 拼占位块 | ❌ 工作量大、维护双份 UI、容易与真实 UI 不一致 |
| shimmer | 提供闪光动画效果 | ⚠️ 只有动画，占位布局仍需自己写 |
| skeletonizer | 自动将真实 Widget 转为骨架屏 | ✅ 零模板代码、自动适配布局、内置 Shimmer |
| flutter_skeleton_loader | 预设的骨架屏组件 | ⚠️ 预设样式有限，复杂布局需要大量自定义 |

**本期选择 skeletonizer 进行演示。** 它的核心理念是：**你只需要写一份 UI 代码，数据加载时自动变成骨架屏**，无需手动编写任何占位 Widget。

---

## 基础集成

### 添加依赖

1️⃣ 在 `pubspec.yaml` 中添加依赖：

```yaml
dependencies:
  skeletonizer: ^1.4.0
```

2️⃣ 运行安装命令：

```bash
flutter pub get
```

3️⃣ 导入包：

```dart
import 'package:skeletonizer/skeletonizer.dart';
```

---

## 核心用法：一行代码的骨架屏

Skeletonizer 的用法极其简单 —— 用 `Skeletonizer` 组件包裹你的 Widget，通过 `enabled` 控制是否显示骨架屏：

```dart
class UserProfilePage extends StatefulWidget {
  const UserProfilePage({super.key});

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  bool _isLoading = true;
  User? _user;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await Future<void>.delayed(const Duration(seconds: 2)); // 模拟网络请求
    setState(() {
      _user = User(name: '张三', email: 'zhangsan@email.com', bio: 'Flutter 开发者');
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('个人主页')),
      // ✨ 只需用 Skeletonizer 包裹，设置 enabled 即可！
      body: Skeletonizer(
        enabled: _isLoading,
        child: _buildContent(),
      ),
    );
  }

  Widget _buildContent() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // 头像
          const CircleAvatar(radius: 50, child: Icon(Icons.person, size: 50)),
          const SizedBox(height: 16),
          // 用户名
          Text(
            _user?.name ?? '用户名加载中',
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          // 邮箱
          Text(_user?.email ?? 'email@loading.com'),
          const SizedBox(height: 8),
          // 简介
          Text(_user?.bio ?? '这里是用户的个人简介内容，可能会比较长一些'),
        ],
      ),
    );
  }
}
```

> **提示**：骨架屏显示时，Skeletonizer 会自动将所有子 Widget 渲染为灰色占位块，并添加 Shimmer 动画。你**不需要**写任何额外的骨架 UI 代码！

🚀 加载中自动展示骨架屏，加载完成自动切换为真实内容，就这么简单！

---

## 工作原理

Skeletonizer 的核心原理是：

```
enabled = true 时：
  ┌──────────────────────────────────┐
  │  遍历 child Widget 树            │
  │        ↓                         │
  │  将 Text → 灰色圆角矩形          │
  │  将 Icon → 灰色圆形              │
  │  将 Image → 灰色矩形             │
  │  将 Container → 保持形状灰色填充   │
  │        ↓                         │
  │  叠加 Shimmer 动画               │
  └──────────────────────────────────┘

enabled = false 时：
  直接渲染 child，完全无额外开销
```

> **注意**：`enabled = false` 时 Skeletonizer 不做任何处理，零性能开销。

---

## 进阶用法

### 自定义骨架屏样式

```dart
Skeletonizer(
  enabled: _isLoading,
  // 自定义效果
  effect: const ShimmerEffect(
    baseColor: Color(0xFFE0E0E0),       // 骨架基础色
    highlightColor: Color(0xFFF5F5F5),  // 闪光高亮色
    duration: Duration(seconds: 1),      // 动画时长
  ),
  child: _buildContent(),
)
```

### 内置效果类型

```dart
// 1. Shimmer 闪光（默认）
const ShimmerEffect()

// 2. 脉冲呼吸
const PulseEffect()

// 3. 纯色无动画
const SoldColorEffect()
```

---

### Skeleton 注解：精细控制

Skeletonizer 提供了几个注解工具，让你精细控制哪些元素需要骨架化：

#### Skeleton.ignore — 忽略某个 Widget

```dart
Skeletonizer(
  enabled: _isLoading,
  child: Column(
    children: [
      // 这个文本会变成骨架
      const Text('会被骨架化的文本'),

      // 这个文本不会变成骨架，始终正常显示
      Skeleton.ignore(
        child: const Text('始终显示的文本'),
      ),
    ],
  ),
)
```

#### Skeleton.shade — 遮罩某个 Widget

对于图片、图标等已经有视觉内容的 Widget，可以用 `shade` 将其变成灰色遮罩：

```dart
Skeleton.shade(
  child: Icon(Icons.star, color: Colors.amber, size: 30),
)
```

#### Skeleton.keep — 保持原样

保持某个 Widget 的原始外观，不做任何骨架化处理（但仍然参与布局）：

```dart
Skeleton.keep(
  child: FilledButton(
    onPressed: null,
    child: const Text('按钮保持原样'),
  ),
)
```

#### Skeleton.replace — 替换为自定义骨架

用完全自定义的 Widget 替换原始内容：

```dart
Skeleton.replace(
  replacement: Container(
    width: 200,
    height: 30,
    decoration: BoxDecoration(
      color: Colors.grey.shade300,
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  child: const Text('这段文本加载时会被替换为自定义占位块'),
)
```

---

### 列表骨架屏

骨架屏最常见的应用场景就是列表页面：

```dart
class ArticleListPage extends StatefulWidget {
  const ArticleListPage({super.key});

  @override
  State<ArticleListPage> createState() => _ArticleListPageState();
}

class _ArticleListPageState extends State<ArticleListPage> {
  bool _isLoading = true;
  List<Article> _articles = [];

  @override
  void initState() {
    super.initState();
    _loadArticles();
  }

  Future<void> _loadArticles() async {
    await Future<void>.delayed(const Duration(seconds: 2));
    setState(() {
      _articles = List.generate(
        10,
        (i) => Article(
          title: '文章标题 ${i + 1}',
          summary: '这是文章的摘要内容，简要描述文章的核心内容...',
          author: '作者 ${i + 1}',
          date: '2026-03-18',
        ),
      );
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('文章列表')),
      body: Skeletonizer(
        enabled: _isLoading,
        child: ListView.builder(
          itemCount: _isLoading ? 6 : _articles.length, // 加载时显示 6 个骨架
          itemBuilder: (context, index) {
            final article = _isLoading
                ? Article.placeholder() // 占位数据
                : _articles[index];
            return _ArticleCard(article: article);
          },
        ),
      ),
    );
  }
}

class _ArticleCard extends StatelessWidget {
  const _ArticleCard({required this.article});
  final Article article;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              article.title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              article.summary,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const CircleAvatar(radius: 14, child: Icon(Icons.person, size: 16)),
                const SizedBox(width: 8),
                Text(article.author, style: TextStyle(color: Colors.grey.shade600)),
                const Spacer(),
                Text(article.date, style: TextStyle(color: Colors.grey.shade400)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

**数据模型（带占位工厂方法）：**

```dart
class Article {
  final String title;
  final String summary;
  final String author;
  final String date;

  Article({
    required this.title,
    required this.summary,
    required this.author,
    required this.date,
  });

  /// 占位数据 — 骨架屏使用
  factory Article.placeholder() => Article(
        title: '文章标题占位文本内容',
        summary: '这是文章的摘要内容占位文本，用于骨架屏展示时撑开布局空间',
        author: '作者名',
        date: '2026-01-01',
      );
}
```

> **提示**：骨架屏不关心 placeholder 的具体文字内容，它只用来**确定占位块的宽高**。所以占位文本的长度应该与真实数据的预期长度相近，这样骨架屏的布局才自然。

---

### 配合 Riverpod 使用

如果你使用 Riverpod 做状态管理，可以这样优雅地结合：

```dart
class ArticleListPage extends ConsumerWidget {
  const ArticleListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncArticles = ref.watch(articlesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('文章列表')),
      body: Skeletonizer(
        enabled: asyncArticles.isLoading,
        child: asyncArticles.when(
          loading: () => _buildList(Article.placeholders(6)),
          error: (e, _) => Center(child: Text('加载失败: $e')),
          data: (articles) => _buildList(articles),
        ),
      ),
    );
  }

  Widget _buildList(List<Article> articles) {
    return ListView.builder(
      itemCount: articles.length,
      itemBuilder: (context, index) => _ArticleCard(article: articles[index]),
    );
  }
}
```

---

## 使用场景对照表

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 首次进入页面加载 | ✅ Skeletonizer | 结构化占位，用户体验好 |
| 下拉刷新 | ❌ 不推荐骨架屏 | 已有内容，用 RefreshIndicator 即可 |
| 列表加载更多 | ❌ 不推荐骨架屏 | 底部加一个 Loading 更合适 |
| 表单提交等待 | ❌ 不推荐骨架屏 | 用 Loading Dialog 或按钮 Loading 状态 |
| 图片加载占位 | ⚠️ 可用 | 但 `FadeInImage` 或 `cached_network_image` 更合适 |
| Tab 切换内容 | ✅ Skeletonizer | 切换时骨架屏过渡自然 |

---

## 与其他方案的对比

```
传统方案（手动）:
  - 写一份真实 UI
  - 再写一份骨架 UI（Container + 灰色）
  - 用条件判断切换两套 UI
  - 真实 UI 改了，骨架 UI 也要同步修改 😩

Skeletonizer:
  - 只写一份真实 UI
  - 用 Skeletonizer 包裹
  - enabled = true 自动变骨架
  - 真实 UI 改了，骨架自动适配 🎉
```

---

## 常见问题与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 骨架屏宽度太窄 | 占位文本太短 | 让 placeholder 文本长度接近真实数据 |
| 某个 Widget 不该骨架化 | 默认全部骨架化 | 用 `Skeleton.ignore()` 包裹 |
| 动画不够明显 | 默认 Shimmer 颜色浅 | 自定义 `ShimmerEffect` 的 `baseColor` 和 `highlightColor` |
| 列表骨架数量不对 | `itemCount` 未处理 | 加载时用固定数量的 placeholder |
| 嵌套 Skeletonizer | 内外层冲突 | 只在最外层使用一个 Skeletonizer |
| 图片不变成骨架 | Image Widget 特殊处理 | 用 `Skeleton.shade()` 包裹图片 |

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~
