---
date: 2025-06-06
cover: /covers/cover-flutter-advanced.webp
---
# 🎯 Flutter 进阶实战（六）：App 架构设计 — Clean Architecture 落地指南

> **系列导读**：这是「Flutter 进阶实战」系列的第 6 篇。代码从 1000 行写到 10000 行，
> 如果没有架构，你就是在给自己挖坑。本篇教你用 Clean Architecture 给 Flutter 项目「搭骨架」。

**本文目标**：掌握 Clean Architecture 四层模型在 Flutter 中的落地方式，学会用 Repository 模式管理数据，用依赖反转实现可测试的架构。

---

## 📊 为什么需要架构？

| 项目阶段 | 无架构 | 有架构 |
|---------|--------|--------|
| 0-1000 行 | 写得飞快 ✅ | 有点「过度设计」 |
| 1000-5000 行 | 开始混乱 ⚠️ | 结构清晰 ✅ |
| 5000-20000 行 | 改一处崩三处 ❌ | 模块独立，改动可控 ✅ |
| 20000+ 行 | 不敢碰，重写吧 💀 | 持续迭代无压力 ✅ |

---

## 🏗 1. Clean Architecture 四层模型

```
┌─────────────────────────────────────────┐
│           Presentation 层                │  ← UI + 状态管理
│  Pages / Widgets / Riverpod Providers   │
├─────────────────────────────────────────┤
│           Application 层                 │  ← 业务编排（可选）
│  Use Cases / Services                   │
├─────────────────────────────────────────┤
│            Domain 层                     │  ← 业务实体 + 接口
│  Entities / Repository Interfaces       │
├─────────────────────────────────────────┤
│             Data 层                      │  ← 数据获取
│  Repositories / Data Sources / DTOs     │
└─────────────────────────────────────────┘

依赖方向：外层 → 内层（Presentation 依赖 Domain，Domain 不依赖任何人）
```

### 每层职责

| 层 | 职责 | 包含 | 依赖 |
|----|------|------|------|
| **Presentation** | 展示 UI、处理用户输入 | Widget、Page、Provider | Application / Domain |
| **Application** | 编排业务流程 | UseCase、Service | Domain |
| **Domain** | 核心业务规则 | Entity、Repository 接口 | 无（最内层） |
| **Data** | 获取和存储数据 | Repository 实现、API、DAO | Domain（实现接口） |

---

## 📁 2. 目录结构模板

```
lib/
├── main.dart
├── app.dart
├── core/                          # 公共工具
│   ├── constants/
│   ├── exceptions/
│   ├── extensions/
│   └── utils/
│
├── features/                      # 按功能模块划分
│   ├── auth/                      # 认证模块
│   │   ├── presentation/
│   │   │   ├── pages/
│   │   │   ├── widgets/
│   │   │   └── providers/
│   │   ├── application/
│   │   │   └── auth_service.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.dart
│   │   │   └── repositories/
│   │   │       └── auth_repository.dart      # 抽象接口
│   │   └── data/
│   │       ├── repositories/
│   │       │   └── auth_repository_impl.dart  # 具体实现
│   │       ├── data_sources/
│   │       │   ├── auth_remote_source.dart
│   │       │   └── auth_local_source.dart
│   │       └── models/
│   │           └── user_dto.dart
│   │
│   └── article/                   # 文章模块（同样结构）
│       ├── presentation/
│       ├── application/
│       ├── domain/
│       └── data/
│
└── shared/                        # 跨模块共享
    ├── widgets/
    ├── providers/
    └── services/
```

---

## 🔄 3. Repository 模式实战

### Domain 层：定义接口

```dart
// features/article/domain/entities/article.dart
@freezed
class Article with _$Article {
  const factory Article({
    required String id,
    required String title,
    required String content,
    required String author,
    required DateTime createdAt,
    @Default(false) bool isFavorited,
  }) = _Article;
}

// features/article/domain/repositories/article_repository.dart
abstract class ArticleRepository {
  Future<List<Article>> getArticles({int page = 1, int limit = 20});
  Future<Article> getArticleById(String id);
  Future<void> favoriteArticle(String id);
  Future<void> unfavoriteArticle(String id);
}
```

### Data 层：实现接口

```dart
// features/article/data/models/article_dto.dart
@freezed
class ArticleDto with _$ArticleDto {
  const factory ArticleDto({
    required String id,
    required String title,
    required String content,
    required String author,
    @JsonKey(name: 'created_at') required String createdAt,
    @JsonKey(name: 'is_favorited') @Default(false) bool isFavorited,
  }) = _ArticleDto;

  factory ArticleDto.fromJson(Map<String, dynamic> json) =>
      _$ArticleDtoFromJson(json);
}

// DTO → Entity 转换
extension ArticleDtoMapper on ArticleDto {
  Article toEntity() => Article(
    id: id,
    title: title,
    content: content,
    author: author,
    createdAt: DateTime.parse(createdAt),
    isFavorited: isFavorited,
  );
}

// features/article/data/repositories/article_repository_impl.dart
class ArticleRepositoryImpl implements ArticleRepository {
  final ArticleRemoteSource _remoteSource;
  final ArticleLocalSource _localSource;

  ArticleRepositoryImpl({
    required ArticleRemoteSource remoteSource,
    required ArticleLocalSource localSource,
  }) : _remoteSource = remoteSource,
       _localSource = localSource;

  @override
  Future<List<Article>> getArticles({int page = 1, int limit = 20}) async {
    try {
      // 先从网络获取
      final dtos = await _remoteSource.getArticles(page: page, limit: limit);
      // 缓存到本地
      await _localSource.cacheArticles(dtos);
      return dtos.map((dto) => dto.toEntity()).toList();
    } catch (e) {
      // 网络失败时从缓存读取
      final cached = await _localSource.getCachedArticles();
      if (cached.isNotEmpty) {
        return cached.map((dto) => dto.toEntity()).toList();
      }
      rethrow;
    }
  }

  @override
  Future<Article> getArticleById(String id) async {
    final dto = await _remoteSource.getArticleById(id);
    return dto.toEntity();
  }

  @override
  Future<void> favoriteArticle(String id) =>
      _remoteSource.favoriteArticle(id);

  @override
  Future<void> unfavoriteArticle(String id) =>
      _remoteSource.unfavoriteArticle(id);
}
```

### 依赖注入（Riverpod）

```dart
// 抽象层 Provider
@riverpod
ArticleRepository articleRepository(Ref ref) {
  return ArticleRepositoryImpl(
    remoteSource: ref.watch(articleRemoteSourceProvider),
    localSource: ref.watch(articleLocalSourceProvider),
  );
}

// Presentation 层只依赖抽象
@riverpod
Future<List<Article>> articleList(Ref ref) {
  final repository = ref.watch(articleRepositoryProvider);
  return repository.getArticles();
}
```

---

## 🔀 4. Entity vs DTO vs Model

| 概念 | 所在层 | 职责 | 示例 |
|------|--------|------|------|
| **Entity** | Domain | 业务核心对象，纯 Dart | `Article(id, title, ...)` |
| **DTO** | Data | 数据传输对象，JSON 映射 | `ArticleDto` + `fromJson` |
| **Model** | Presentation | UI 展示模型（可选） | `ArticleViewModel(formattedDate, ...)` |

### 数据流方向

```
API Response (JSON)
    ↓ fromJson()
DTO（Data 层）
    ↓ toEntity()
Entity（Domain 层）
    ↓ 直接使用 / toViewModel()
Widget（Presentation 层）
```

> **小项目可以省略 DTO，直接用 Entity + fromJson。项目大了再拆分——架构是演进的，不是一步到位的。**

---

## 🧪 5. 架构的可测试性

```dart
// 测试 Repository 时可以轻松 mock
test('getArticles returns cached data on network failure', () async {
  final mockRemote = MockArticleRemoteSource();
  final mockLocal = MockArticleLocalSource();

  // 模拟网络失败
  when(mockRemote.getArticles(page: 1, limit: 20))
      .thenThrow(Exception('Network error'));

  // 模拟本地有缓存
  when(mockLocal.getCachedArticles())
      .thenAnswer((_) async => [testArticleDto]);

  final repo = ArticleRepositoryImpl(
    remoteSource: mockRemote,
    localSource: mockLocal,
  );

  final result = await repo.getArticles();

  expect(result, hasLength(1));
  verify(mockLocal.getCachedArticles()).called(1); // 验证走了缓存
});
```

---

## ✅ 本篇小结 Checklist

- [ ] 理解 Clean Architecture 四层模型
- [ ] 能按 feature-first 组织目录结构
- [ ] 掌握 Repository 模式（接口 + 实现）
- [ ] 理解 Entity vs DTO 的区别
- [ ] 能用 Riverpod 实现依赖注入
- [ ] 理解「依赖方向：外层 → 内层」的原则

---

> **下一篇预告**：《Flutter 进阶实战（七）：插件开发从零到发布 — 从使用者到创造者》——
> 不只是用别人的插件，自己也能创造并发布到 pub.dev。

---

*本文是「Flutter 进阶实战」系列第 6 篇，共 10 篇。*

---
*📝 作者：NIHoa ｜ 系列：Flutter进阶实战系列 ｜ 更新日期：2025-06-06*
