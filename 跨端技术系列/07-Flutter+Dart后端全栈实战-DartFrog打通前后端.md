# 🔥 Flutter + Dart 后端全栈实战：用 Dart Frog 打通前后端

> 前端写 Dart，后端也写 Dart — 一个语言吃到底。**Dart Frog** 是 Dart 生态的后端框架，
> 让 Flutter 开发者**无需学新语言**就能搭建 API 服务。共享数据模型、统一类型安全，
> 这才是真正的全栈。

**核心优势**：前后端共享 Dart 数据模型 + 类型系统，接口联调**零沟通成本**，
一个团队搞定全部。

---

## 📊 Dart 后端方案对比

| 框架 | 出品方 | 定位 | 特点 | GitHub Star |
|------|-------|------|------|------------|
| 🐸 **Dart Frog** | Very Good Ventures | API 服务 | 极简、约定式路由、中间件 | 2k+ |
| 🚀 Serverpod | Serverpod team | 全栈框架 | ORM、认证、WebSocket 内置 | 2.5k+ |
| 🏗 shelf | Dart 官方 | HTTP 库 | 极底层，需自己搭建 | Dart SDK 内置 |
| ⚡ Conduit | Stable Kernel | REST API | 类似 Spring Boot | 维护中 |

> 🔑 **为什么选 Dart Frog？** 它是最轻量、上手最快的选择。
> 文件路由约定（类似 Next.js），中间件系统完善，与 Flutter 天然配合。

---

## 🛠 1. 环境搭建与项目创建

```bash
# 安装 Dart Frog CLI
dart pub global activate dart_frog_cli

# 创建后端项目
dart_frog create my_api_server
cd my_api_server

# 启动开发服务器（支持热重载）
dart_frog dev
# 🚀 服务运行在 http://localhost:8080
```

### 项目结构

```
my_api_server/
├── routes/                    # 📂 文件路由（核心！）
│   ├── index.dart            # GET /
│   ├── health.dart           # GET /health
│   ├── api/
│   │   ├── products/
│   │   │   ├── index.dart    # GET|POST /api/products
│   │   │   └── [id].dart     # GET|PUT|DELETE /api/products/:id
│   │   └── auth/
│   │       ├── login.dart    # POST /api/auth/login
│   │       └── register.dart # POST /api/auth/register
│   └── _middleware.dart      # 全局中间件
├── lib/                      # 共享业务逻辑
│   ├── models/               # 数据模型
│   ├── repositories/         # 数据层
│   └── services/             # 业务服务
├── test/                     # 测试
├── pubspec.yaml
└── dart_frog.yaml            # 配置文件
```

> 🔑 **文件即路由**：`routes/api/products/index.dart` → `GET /api/products`，
> `routes/api/products/[id].dart` → `GET /api/products/:id`。零配置！

---

## 🧩 2. API 开发：RESTful 接口

### 商品列表接口

```dart
// routes/api/products/index.dart
import 'dart:io';
import 'package:dart_frog/dart_frog.dart';

Future<Response> onRequest(RequestContext context) async {
  switch (context.request.method) {
    case HttpMethod.get:
      return _getProducts(context);
    case HttpMethod.post:
      return _createProduct(context);
    default:
      return Response(statusCode: HttpStatus.methodNotAllowed);
  }
}

Future<Response> _getProducts(RequestContext context) async {
  final repo = context.read<ProductRepository>();
  final params = context.request.uri.queryParameters;
  final page = int.tryParse(params['page'] ?? '1') ?? 1;
  final pageSize = int.tryParse(params['pageSize'] ?? '20') ?? 20;

  final result = await repo.getProducts(page: page, pageSize: pageSize);

  return Response.json(body: {
    'code': 0,
    'data': {
      'list': result.items.map((e) => e.toJson()).toList(),
      'total': result.total,
      'page': page,
    },
  });
}

Future<Response> _createProduct(RequestContext context) async {
  final repo = context.read<ProductRepository>();
  final body = await context.request.json() as Map<String, dynamic>;
  final product = Product.fromJson(body);
  final created = await repo.create(product);

  return Response.json(
    statusCode: HttpStatus.created,
    body: {'code': 0, 'data': created.toJson()},
  );
}
```

### 商品详情接口（动态路由）

```dart
// routes/api/products/[id].dart
import 'dart:io';
import 'package:dart_frog/dart_frog.dart';

Future<Response> onRequest(RequestContext context, String id) async {
  switch (context.request.method) {
    case HttpMethod.get:
      return _getProduct(context, id);
    case HttpMethod.put:
      return _updateProduct(context, id);
    case HttpMethod.delete:
      return _deleteProduct(context, id);
    default:
      return Response(statusCode: HttpStatus.methodNotAllowed);
  }
}

Future<Response> _getProduct(RequestContext context, String id) async {
  final repo = context.read<ProductRepository>();
  final product = await repo.getById(id);

  if (product == null) {
    return Response.json(
      statusCode: HttpStatus.notFound,
      body: {'code': 404, 'message': '商品不存在'},
    );
  }

  return Response.json(body: {'code': 0, 'data': product.toJson()});
}
```

---

## 🔗 3. 前后端共享数据模型（核心价值）

### Monorepo 结构

```
my_fullstack_app/
├── packages/
│   └── shared_models/           # 🔥 共享包！
│       ├── lib/
│       │   ├── src/
│       │   │   ├── product.dart
│       │   │   └── user.dart
│       │   └── shared_models.dart
│       └── pubspec.yaml
├── api_server/                  # Dart Frog 后端
│   └── pubspec.yaml             # 依赖 shared_models
├── flutter_app/                 # Flutter 前端
│   └── pubspec.yaml             # 依赖 shared_models
```

### 共享模型定义

```dart
// packages/shared_models/lib/src/product.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'product.freezed.dart';
part 'product.g.dart';

@freezed
class Product with _$Product {
  const factory Product({
    required String id,
    required String name,
    required double price,
    @Default('') String image,
    @Default('') String description,
    @Default(0) int stock,
    DateTime? createdAt,
  }) = _Product;

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
}

@freezed
class ProductListResponse with _$ProductListResponse {
  const factory ProductListResponse({
    required List<Product> list,
    required int total,
    required int page,
  }) = _ProductListResponse;

  factory ProductListResponse.fromJson(Map<String, dynamic> json) =>
      _$ProductListResponseFromJson(json);
}
```

### 前后端引用共享包

```yaml
# api_server/pubspec.yaml
dependencies:
  dart_frog: ^1.1.0
  shared_models:
    path: ../packages/shared_models

# flutter_app/pubspec.yaml
dependencies:
  flutter_riverpod: ^3.2.1
  shared_models:
    path: ../packages/shared_models
```

### 共享模型的威力

| 维度 | ✅ 共享模型 | ❌ 各端自定义 |
|------|-----------|-------------|
| 字段一致性 | 编译期保证完全一致 | 手动同步，容易遗漏 |
| JSON 序列化 | 一份 `fromJson` / `toJson` | 两端各写一份 |
| 重构安全 | 改一处，两端编译报错 | 改一端忘改另一端 |
| 联调成本 | 几乎为零 | 反复沟通确认字段 |

---

## 🛡 4. 中间件：认证、日志、CORS

```dart
// routes/_middleware.dart（全局中间件）
import 'package:dart_frog/dart_frog.dart';

Handler middleware(Handler handler) {
  return handler
      .use(loggerMiddleware())       // 日志
      .use(corsMiddleware())         // CORS
      .use(authMiddleware())         // 认证
      .use(rateLimitMiddleware());   // 限流
}

// 日志中间件
Middleware loggerMiddleware() {
  return (handler) {
    return (context) async {
      final stopwatch = Stopwatch()..start();
      final response = await handler(context);
      stopwatch.stop();

      print('[${context.request.method.name}] '
          '${context.request.uri.path} '
          '→ ${response.statusCode} '
          '(${stopwatch.elapsedMilliseconds}ms)');

      return response;
    };
  };
}

// CORS 中间件
Middleware corsMiddleware() {
  return (handler) {
    return (context) async {
      if (context.request.method == HttpMethod.options) {
        return Response(statusCode: 204, headers: _corsHeaders);
      }
      final response = await handler(context);
      return response.copyWith(headers: {...response.headers, ..._corsHeaders});
    };
  };
}

const _corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// JWT 认证中间件
Middleware authMiddleware() {
  return (handler) {
    return (context) async {
      final path = context.request.uri.path;

      // 跳过不需要认证的路径
      if (path.startsWith('/api/auth/') || path == '/health') {
        return handler(context);
      }

      final authHeader = context.request.headers['Authorization'];
      if (authHeader == null || !authHeader.startsWith('Bearer ')) {
        return Response.json(
          statusCode: 401,
          body: {'code': 401, 'message': '未登录'},
        );
      }

      final token = authHeader.substring(7);
      final user = await verifyJwt(token);
      if (user == null) {
        return Response.json(
          statusCode: 401,
          body: {'code': 401, 'message': 'Token 已过期'},
        );
      }

      // 注入用户信息到 context
      return handler(context.provide<User>(() => user));
    };
  };
}
```

---

## 🚀 5. 部署上线

### Docker 部署

```dockerfile
# Dockerfile
FROM dart:stable AS build

WORKDIR /app
COPY . .
RUN dart pub get
RUN dart_frog build

FROM scratch
COPY --from=build /runtime/ /
COPY --from=build /app/build/ /app/

EXPOSE 8080
ENTRYPOINT ["/app/bin/server"]
```

```bash
# 构建并运行
docker build -t my-api-server .
docker run -p 8080:8080 my-api-server
```

### 部署对比

| 方案 | 适合场景 | 成本 |
|------|---------|------|
| Docker + VPS | 完全自控 | ¥50-200/月 |
| Cloud Run (GCP) | 按需伸缩 | 按请求量 |
| Railway / Fly.io | 快速部署 | 免费额度 + 按量 |
| Vercel Edge | Serverless | 免费额度 |

---

## 💉 6. 常见踩坑

| 错误 | 后果 | 修复 |
|-----|------|------|
| 共享包没有 `dart run build_runner` | `fromJson` 缺失，序列化报错 | 共享包也要运行代码生成 |
| 中间件顺序错误 | 认证在日志前，看不到被拦截的请求 | 日志 → CORS → 认证 → 限流 |
| 文件路由忘记导出 `onRequest` | 404 找不到接口 | 确保函数名为 `onRequest` |
| Flutter 端直连 `localhost` | 真机无法访问 | 用内网 IP 或 ngrok 隧道 |

---

## ✅ Dart 全栈 Checklist

### 后端搭建
- [ ] 安装 Dart Frog CLI
- [ ] 创建文件路由结构
- [ ] 配置中间件（日志 / CORS / 认证）
- [ ] 实现核心 CRUD 接口

### 前后端共享
- [ ] 创建 shared_models 包
- [ ] Freezed 定义共享数据模型
- [ ] 前后端 pubspec 引用共享包
- [ ] 验证 JSON 序列化一致性

### 部署
- [ ] 编写 Dockerfile
- [ ] 配置环境变量
- [ ] CI/CD 流水线
- [ ] 监控与日志

---

> 全栈的终极形态，不是"什么都会"，而是"用最少的技术栈做最多的事"。
> Dart 全栈就是这种极简主义的实践 — 一门语言、一套类型、一个团队，
> 从用户点击按钮到数据库返回结果，**全链路类型安全**。


---
*📝 作者：NIHoa ｜ 系列：跨端技术系列 ｜ 更新日期：2026-01-07*
