# 🧠 Flutter 状态管理终极指南：Riverpod 3.x 从入门到精通

> 状态管理是 Flutter 开发的**分水岭** — 入门用 `setState`，专业用 Riverpod。
> Riverpod 3.x 带来了 Mutation、`Ref.mounted`、自动重试等重磅特性，
> 本文带你**彻底掌握**生产级状态管理。

**写给谁**：已有 Flutter 基础，想从 `setState` / Provider 升级到 Riverpod 的开发者。
读完你将掌握：Provider 类型选择、Notifier 模式、异步数据流、依赖注入、测试、以及 3.x 新特性。

---

## 📊 状态管理方案对比

| 方案 | 复杂度 | 学习曲线 | 可测试性 | 适合规模 | 2026 状态 |
|------|--------|---------|---------|---------|----------|
| `setState` | ⭐ | 🟢 极低 | 🔴 差 | 单组件 | ✅ 持续可用 |
| Provider | ⭐⭐ | 🟢 低 | 🟡 中 | 小型 | ⚠️ 维护模式 |
| **Riverpod 3.x** | ⭐⭐⭐ | 🟡 中 | 🟢 优秀 | **全规模** | ✅ **推荐** |
| Bloc / Cubit | ⭐⭐⭐⭐ | 🟠 较高 | 🟢 优秀 | 大型企业级 | ✅ 稳定 |
| GetX | ⭐⭐ | 🟢 低 | 🔴 差 | 快速原型 | ⚠️ 争议大 |

> 🔑 **为什么选 Riverpod？** 它是 Provider 作者的"重写版"，解决了 Provider 的所有缺陷：
> 编译期安全、不依赖 BuildContext、完美的可测试性、灵活的依赖注入。

---

## 🏗 1. Riverpod 3.x 核心概念

### 三大角色

```
Provider（数据源）→ Ref（连接器）→ Widget（消费者）

📦 Provider：声明"数据从哪来"
🔗 Ref：读取和操作 Provider
🖥 Widget：监听 Provider 变化并重建 UI
```

### 环境搭建

```yaml
# pubspec.yaml
dependencies:
  flutter_riverpod: ^3.2.1
  riverpod_annotation: ^4.0.2

dev_dependencies:
  riverpod_generator: ^4.0.3
  build_runner: ^2.4.13
  custom_lint:
  riverpod_lint:
```

```dart
// main.dart — 根组件包裹 ProviderScope
void main() {
  runApp(const ProviderScope(child: MyApp()));
}
```

---

## 🧩 2. Provider 类型全解析

### 用代码生成（推荐方式）

Riverpod 3.x 推荐使用 `@riverpod` 注解 + 代码生成，编译器自动推断 Provider 类型。

```dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'my_providers.g.dart';

// ① 简单值 Provider（只读，无状态）
@riverpod
String appTitle(Ref ref) => 'My App';

// ② 计算 / 派生 Provider（依赖其他 Provider）
@riverpod
String greeting(Ref ref) {
  final title = ref.watch(appTitleProvider);
  return 'Welcome to $title!';
}

// ③ 异步 Provider（API 请求）
@riverpod
Future<List<Product>> products(Ref ref) async {
  final dio = ref.watch(dioProvider);
  final response = await dio.get('/api/products');
  return (response.data as List).map((e) => Product.fromJson(e)).toList();
}

// ④ Stream Provider（实时数据）
@riverpod
Stream<int> countdown(Ref ref) {
  return Stream.periodic(const Duration(seconds: 1), (i) => 10 - i).take(11);
}
```

### Notifier（有状态，可修改）

```dart
// ⑤ 同步 Notifier
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
  void decrement() => state--;
  void reset() => state = 0;
}

// ⑥ 异步 Notifier（生产级常用）
@riverpod
class ProductList extends _$ProductList {
  @override
  Future<List<Product>> build() async {
    return _fetchProducts(page: 1);
  }

  Future<List<Product>> _fetchProducts({required int page}) async {
    final dio = ref.read(dioProvider);
    final response = await dio.get('/api/products', queryParameters: {'page': page});
    return (response.data['list'] as List).map((e) => Product.fromJson(e)).toList();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _fetchProducts(page: 1));
  }

  Future<void> loadMore(int page) async {
    final current = state.value ?? [];
    final more = await _fetchProducts(page: page);
    state = AsyncData([...current, ...more]);
  }
}
```

### Provider 选型决策树

```
你需要什么样的状态？
│
├── 只读数据，无需修改？
│   ├── 同步数据 → @riverpod 函数（简单值）
│   ├── 异步数据（API）→ @riverpod Future 函数
│   └── 实时流数据 → @riverpod Stream 函数
│
└── 可修改状态？
    ├── 同步状态 → @riverpod class（Notifier）
    └── 异步状态 → @riverpod class + Future（AsyncNotifier）
```

---

## ⚡ 3. Riverpod 3.x 新特性深度解析

### 3.1 Mutation（副作用状态追踪）

> 3.x 最重磅特性！让 UI 能追踪"提交/删除/更新"等操作的 loading/success/error 状态。

```dart
@riverpod
class CartController extends _$CartController {
  @override
  List<CartItem> build() => [];

  // 标记为 @mutation，UI 可追踪此操作的状态
  @mutation
  Future<void> addItem(CartItem item) async {
    await ref.read(cartRepositoryProvider).addItem(item);
    state = [...state, item];
  }

  @mutation
  Future<void> removeItem(String itemId) async {
    await ref.read(cartRepositoryProvider).removeItem(itemId);
    state = state.where((e) => e.id != itemId).toList();
  }
}

// UI 中使用 — 每个 mutation 有独立的状态
class AddToCartButton extends ConsumerWidget {
  final CartItem item;
  const AddToCartButton({super.key, required this.item});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 监听 addItem 这个 mutation 的状态
    final addMutation = ref.watch(
      cartControllerProvider.addItem,
    );

    return ElevatedButton(
      onPressed: addMutation.isLoading
          ? null  // 加载中禁用按钮
          : () => ref.read(cartControllerProvider.notifier).addItem(item),
      child: addMutation.isLoading
          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
          : const Text('加入购物车'),
    );
  }
}
```

| 对比维度 | 2.x 做法 | 3.x Mutation |
|---------|---------|-------------|
| 追踪按钮加载态 | 手动维护 `isLoading` 变量 | 自动追踪，`mutation.isLoading` |
| 多个操作并行 | 状态互相冲突 | 每个 mutation 独立状态 |
| 错误处理 | 手动 try/catch + 状态同步 | `mutation.hasError` 自动管理 |

### 3.2 Ref.mounted（安全检查）

```dart
@riverpod
class SearchController extends _$SearchController {
  @override
  List<SearchResult> build() => [];

  Future<void> search(String query) async {
    state = const AsyncLoading();
    final results = await ref.read(searchRepositoryProvider).search(query);

    // 3.x 新增：检查 Provider 是否还活着（防止内存泄漏）
    if (!ref.mounted) return;  // 如果已销毁，直接返回

    state = AsyncData(results);
  }
}
```

### 3.3 自动重试（Automatic Retry）

```dart
// 3.x 默认开启：异步 Provider 失败后自动重试
// 无需手动配置，框架自动处理瞬时错误（如网络抖动）

// 如果要自定义重试策略
@Riverpod(retry: myRetryLogic)
Future<UserProfile> userProfile(Ref ref) async {
  return ref.read(userRepositoryProvider).getProfile();
}

Duration? myRetryLogic(int retryCount, Object error) {
  // 最多重试 3 次，指数退避
  if (retryCount > 3) return null;  // 停止重试
  return Duration(seconds: math.pow(2, retryCount).toInt());
}
```

### 3.4 统一 Ref（告别泛型）

```dart
// 2.x（旧写法）— 需要泛型
// String myProvider(Ref<String> ref) => 'hello';

// 3.x（新写法）— 统一 Ref，无泛型
@riverpod
String myProvider(Ref ref) => 'hello';
```

---

## 🔗 4. 依赖注入与 Provider 组合

### Provider 之间的依赖

```dart
// 基础设施层
@riverpod
Dio dio(Ref ref) {
  final token = ref.watch(authTokenProvider);
  return Dio(BaseOptions(
    baseUrl: 'https://api.example.com',
    headers: token != null ? {'Authorization': 'Bearer $token'} : null,
  ));
}

// 数据层 — 依赖 Dio
@riverpod
ProductRepository productRepository(Ref ref) {
  return ProductRepositoryImpl(dio: ref.watch(dioProvider));
}

// 业务层 — 依赖 Repository
@riverpod
Future<List<Product>> featuredProducts(Ref ref) async {
  final repo = ref.watch(productRepositoryProvider);
  return repo.getFeatured();
}

// 当 authToken 变化 → Dio 重建 → Repository 重建 → 数据自动刷新
// 🔥 这就是 Riverpod 的响应式依赖链！
```

### 依赖链可视化

```
authTokenProvider（登录状态变化）
    ↓ ref.watch
dioProvider（重建 Dio 实例，带新 Token）
    ↓ ref.watch
productRepositoryProvider（重建 Repository）
    ↓ ref.watch
featuredProductsProvider（自动重新请求数据）
    ↓ ref.watch
UI（自动重建展示新数据）
```

### Family Provider（参数化）

```dart
// 3.x 新写法：参数通过构造函数传入
@riverpod
class ProductDetail extends _$ProductDetail {
  @override
  Future<Product> build({required String productId}) async {
    final repo = ref.watch(productRepositoryProvider);
    return repo.getById(productId);
  }
}

// 使用时
ref.watch(productDetailProvider(productId: 'prod-123'));
```

---

## 🖥 5. UI 集成模式

### ConsumerWidget（推荐）

```dart
class ProductScreen extends ConsumerWidget {
  const ProductScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productListProvider);

    return Scaffold(
      body: productsAsync.when(
        data: (products) => ProductListView(products: products),
        loading: () => const ShimmerLoading(),
        error: (e, st) => ErrorView(
          message: e.toString(),
          onRetry: () => ref.invalidate(productListProvider),
        ),
      ),
    );
  }
}
```

### Consumer（局部监听，减少重建范围）

```dart
class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 这部分不需要状态，不会重建
        const HeaderWidget(),

        // 只有这部分监听状态，精确重建
        Consumer(
          builder: (context, ref, child) {
            final user = ref.watch(userProvider);
            return Text(user.value?.name ?? '加载中...');
          },
        ),

        // 这部分也不会重建
        const FooterWidget(),
      ],
    );
  }
}
```

### ref.listen（副作用监听）

```dart
class LoginScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 监听状态变化执行副作用（不影响 UI 重建）
    ref.listen(loginControllerProvider, (prev, next) {
      if (next.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('登录失败: ${next.error}')),
        );
      }
      if (next.hasValue && next.value != null) {
        context.go('/home');  // 登录成功跳转
      }
    });

    final loginState = ref.watch(loginControllerProvider);

    return ElevatedButton(
      onPressed: loginState.isLoading ? null : () {
        ref.read(loginControllerProvider.notifier).login(
          email: emailController.text,
          password: passwordController.text,
        );
      },
      child: loginState.isLoading
          ? const CircularProgressIndicator()
          : const Text('登录'),
    );
  }
}
```

---

## 🧪 6. 测试：Riverpod 的杀手级优势

### Provider 单元测试

```dart
// test/providers/counter_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:riverpod/riverpod.dart';

void main() {
  group('CounterProvider', () {
    test('初始值为 0', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      expect(container.read(counterProvider), 0);
    });

    test('increment 增加 1', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(counterProvider.notifier).increment();
      expect(container.read(counterProvider), 1);
    });

    test('多次操作', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(counterProvider.notifier);
      notifier.increment();
      notifier.increment();
      notifier.decrement();
      expect(container.read(counterProvider), 1);
    });
  });
}
```

### Mock 依赖（Override）

```dart
// 测试时替换真实 API 为 Mock
test('获取商品列表', () async {
  final mockRepo = MockProductRepository();
  when(mockRepo.getAll()).thenAnswer((_) async => [
    Product(id: '1', name: '测试商品', price: 99.0),
  ]);

  final container = ProviderContainer(
    overrides: [
      // 🔥 核心能力：用 Mock 替换真实依赖
      productRepositoryProvider.overrideWithValue(mockRepo),
    ],
  );
  addTearDown(container.dispose);

  // 等待异步 Provider 完成
  await container.read(productListProvider.future);
  final products = container.read(productListProvider).value!;

  expect(products.length, 1);
  expect(products[0].name, '测试商品');
});
```

### Widget 测试

```dart
testWidgets('商品列表展示正确', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        productListProvider.overrideWith((ref) async {
          return [
            Product(id: '1', name: 'Flutter 实战', price: 59.0),
            Product(id: '2', name: 'Dart 入门', price: 39.0),
          ];
        }),
      ],
      child: const MaterialApp(home: ProductScreen()),
    ),
  );

  await tester.pumpAndSettle();

  expect(find.text('Flutter 实战'), findsOneWidget);
  expect(find.text('Dart 入门'), findsOneWidget);
});
```

---

## 📋 7. 生产级最佳实践

### 项目结构

```
lib/
├── core/
│   └── providers/
│       ├── dio_provider.dart       # 网络层
│       └── storage_provider.dart   # 缓存层
├── features/
│   └── product/
│       ├── data/
│       │   └── product_repository.dart
│       ├── domain/
│       │   └── product.dart
│       └── presentation/
│           ├── controllers/
│           │   └── product_controller.dart  # @riverpod Notifier
│           ├── screens/
│           │   └── product_screen.dart      # ConsumerWidget
│           └── widgets/
│               └── product_card.dart        # StatelessWidget
```

### 常见错误速查

| 错误 | 后果 | 修复 |
|-----|------|------|
| 在 `build()` 中用 `ref.read` | 状态变化 UI 不更新 | 读数据用 `ref.watch`，写操作用 `ref.read` |
| callback 中用 `ref.watch` | 不必要的监听和重建 | callback 中用 `ref.read` |
| 忘记 `ref.mounted` 检查 | 异步完成后 Provider 已销毁 | 异步操作后加 `if (!ref.mounted) return` |
| `ProviderScope` 嵌套混乱 | 状态隔离不符合预期 | 全局只用一个根 `ProviderScope` |
| 不用代码生成手写 Provider | 易出错，写法冗长 | 统一用 `@riverpod` + `build_runner` |

---

## ✅ Riverpod 掌握 Checklist

### 基础掌握
- [ ] 理解 Provider / Notifier / Ref 三大角色
- [ ] 能用 `@riverpod` 创建各种类型 Provider
- [ ] 掌握 `ref.watch` vs `ref.read` vs `ref.listen` 的区别
- [ ] 理解 `AsyncValue.when()` 三态处理
- [ ] 能运行 `build_runner` 生成代码

### 进阶掌握
- [ ] 掌握 Provider 依赖链和响应式刷新
- [ ] 使用 Family Provider 传参
- [ ] 使用 Mutation 追踪副作用状态
- [ ] 使用 `ref.invalidate()` 手动刷新
- [ ] 理解 `keepAlive` 和自动销毁机制

### 生产级
- [ ] 能用 `ProviderContainer` + Override 写单元测试
- [ ] 能用 `ProviderScope` overrides 写 Widget 测试
- [ ] 配置 `riverpod_lint` 静态检查
- [ ] 使用 Riverpod DevTools 调试

---

> Provider 是"推"模型 — 你告诉 Widget 数据在哪，Widget 被动接收。
> Riverpod 是"拉"模型 — Widget 主动声明"我需要什么"，框架负责送达和更新。
> **从"推"到"拉"的思维转变，就是从初级到高级 Flutter 开发者的跨越。**
