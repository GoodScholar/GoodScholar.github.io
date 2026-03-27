---
date: 2026-01-10
---
# 🏗 跨端项目工程化：Monorepo + CI/CD + 自动化测试

> 代码写完只是开始，**工程化能力**决定项目能走多远。
> 当你的产品同时有 Flutter App、Taro 小程序、H5 三条线时，
> 没有工程化 = 修一个 Bug 提三次代码，改一个 Token 通知六个人。

**核心目标**：让多端项目像单端一样简单 — 一次提交、自动构建、自动测试、自动发布。

---

## 📊 工程化能力矩阵

| 能力 | 没有工程化 | 有工程化 |
|------|-----------|---------|
| 代码管理 | 🔴 多个独立仓库 | 🟢 Monorepo 统一管理 |
| 共享逻辑 | 🔴 复制粘贴 | 🟢 共享包引用 |
| 构建发布 | 🔴 手动打包上传 | 🟢 Git Push 自动部署 |
| 质量保障 | 🔴 人工测试 | 🟢 自动化测试门禁 |
| 设计同步 | 🔴 口头通知 | 🟢 Token 自动同步 |
| 接口联调 | 🔴 文档过时 | 🟢 Schema 自动生成 |

---

## 📁 1. Monorepo 架构设计

### 为什么用 Monorepo？

| 维度 | Polyrepo（多仓库） | Monorepo（单仓库） |
|------|-------------------|-------------------|
| 代码共享 | 发 npm 包 / Git Submodule | 直接 path 引用 ✅ |
| 原子提交 | 跨仓库改动需协调 | 一次 commit 改多个包 ✅ |
| 版本一致性 | 容易版本不同步 | 统一管理 ✅ |
| CI/CD | 每个仓库单独配置 | 统一流水线 ✅ |
| 代码权限 | 天然隔离 ✅ | 需要 CODEOWNERS 控制 |

### 推荐目录结构

```
my-product/
├── .github/
│   └── workflows/
│       ├── flutter-ci.yml        # Flutter 流水线
│       ├── taro-ci.yml           # Taro 流水线
│       └── shared-check.yml      # 共享包检查
├── packages/
│   ├── shared-models/            # Dart 共享数据模型
│   │   ├── lib/
│   │   ├── test/
│   │   └── pubspec.yaml
│   ├── design-tokens/            # 设计 Token 源
│   │   ├── tokens.json
│   │   └── scripts/
│   └── api-schema/               # OpenAPI 定义
│       └── openapi.yaml
├── apps/
│   ├── flutter-app/              # Flutter 端
│   │   ├── lib/
│   │   ├── test/
│   │   └── pubspec.yaml
│   └── taro-app/                 # Taro 端
│       ├── src/
│       ├── __tests__/
│       └── package.json
├── tools/
│   ├── sync-tokens.js            # Token 同步脚本
│   ├── gen-api.sh                # API 生成脚本
│   └── check-consistency.js      # 一致性检查
├── Makefile
├── CODEOWNERS
└── README.md
```

### CODEOWNERS（代码权限控制）

```
# .github/CODEOWNERS

# 共享包 — 架构师审核
/packages/                       @architect-team

# Flutter 端 — 移动团队
/apps/flutter-app/               @mobile-team

# Taro 端 — 前端团队
/apps/taro-app/                  @frontend-team

# CI/CD 配置 — DevOps 团队
/.github/workflows/              @devops-team
```

---

## 🔄 2. CI/CD 流水线设计

### 智能触发：只构建变更部分

```yaml
# .github/workflows/flutter-ci.yml
name: Flutter CI

on:
  push:
    paths:
      - 'apps/flutter-app/**'
      - 'packages/shared-models/**'
      - 'packages/design-tokens/**'

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.29.0'

      # 同步共享包
      - name: Sync shared models
        run: |
          cd packages/shared-models
          dart pub get
          dart run build_runner build --delete-conflicting-outputs

      # 测试
      - name: Run tests
        run: |
          cd apps/flutter-app
          flutter pub get
          flutter test --coverage

      # 代码质量
      - name: Analyze
        run: |
          cd apps/flutter-app
          dart analyze --fatal-infos

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - name: Build APK
        run: |
          cd apps/flutter-app
          flutter build apk --release
      - uses: actions/upload-artifact@v4
        with:
          name: android-release
          path: apps/flutter-app/build/app/outputs/flutter-apk/

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - name: Build iOS
        run: |
          cd apps/flutter-app
          flutter build ios --release --no-codesign
```

```yaml
# .github/workflows/taro-ci.yml
name: Taro CI

on:
  push:
    paths:
      - 'apps/taro-app/**'
      - 'packages/design-tokens/**'
      - 'packages/api-schema/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install & Test
        run: |
          cd apps/taro-app
          npm ci
          npm run lint
          npm test

  build-weapp:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Build WeChat Mini Program
        run: |
          cd apps/taro-app
          npm ci
          npm run build:weapp

      # 自动上传微信小程序
      - name: Upload to WeChat
        run: npx miniprogram-ci upload --pp ./dist/weapp --appid ${{ secrets.WX_APPID }} --pkp ${{ secrets.WX_PRIVATE_KEY }} -uv "1.0.${{ github.run_number }}"

  build-h5:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Build H5
        run: |
          cd apps/taro-app
          npm ci
          npm run build:h5
      # 部署到 Vercel / CDN
```

### CI 流水线可视化

```
Git Push
    │
    ├── 检测变更路径
    │   ├── packages/shared-models/ → 触发 Flutter CI + Taro CI
    │   ├── packages/design-tokens/ → 触发 Token 同步 + 两端 CI
    │   ├── apps/flutter-app/      → 仅触发 Flutter CI
    │   └── apps/taro-app/         → 仅触发 Taro CI
    │
    ├── Flutter CI
    │   ├── 代码分析 (dart analyze)
    │   ├── 单元测试 (flutter test)
    │   ├── 构建 Android APK
    │   ├── 构建 iOS IPA
    │   └── 上传产物
    │
    └── Taro CI
        ├── ESLint 检查
        ├── 单元测试 (jest)
        ├── 构建微信小程序 → 自动上传
        ├── 构建 H5 → 部署 CDN
        └── 构建支付宝/抖音小程序
```

---

## 🧪 3. 自动化测试策略

### 测试金字塔

```
          ╱ ╲
         ╱ E2E ╲          少量：关键流程端到端验证
        ╱───────╲
       ╱ 集成测试 ╲        中量：组件交互和 API 集成
      ╱─────────────╲
     ╱   单元测试     ╲     大量：业务逻辑和工具函数
    ╱─────────────────╲
```

### Flutter 端测试

```dart
// 单元测试 — Provider 逻辑
test('计算总价', () {
  final cart = CartController();
  cart.addItem(CartItem(name: '商品A', price: 99));
  cart.addItem(CartItem(name: '商品B', price: 199));
  expect(cart.totalPrice, 298);
});

// Widget 测试 — UI 交互
testWidgets('点击添加按钮数量+1', (tester) async {
  await tester.pumpWidget(
    const ProviderScope(child: MaterialApp(home: CounterPage())),
  );

  expect(find.text('0'), findsOneWidget);
  await tester.tap(find.byIcon(Icons.add));
  await tester.pump();
  expect(find.text('1'), findsOneWidget);
});

// 集成测试 — 完整流程
void main() {
  integrationTest('登录并查看商品列表', (tester) async {
    await tester.pumpWidget(const MyApp());

    // 输入登录信息
    await tester.enterText(find.byKey(Key('email')), 'test@test.com');
    await tester.enterText(find.byKey(Key('password')), '123456');
    await tester.tap(find.text('登录'));
    await tester.pumpAndSettle();

    // 验证跳转到首页
    expect(find.text('热门推荐'), findsOneWidget);
  });
}
```

### Taro 端测试

```typescript
// 单元测试 — 工具函数
describe('formatPrice', () => {
  test('格式化价格', () => {
    expect(formatPrice(99)).toBe('¥99.00')
    expect(formatPrice(1234.5)).toBe('¥1,234.50')
  })
})

// 组件测试
describe('ProductCard', () => {
  test('显示商品名称和价格', () => {
    const product = { id: '1', name: '测试商品', price: 99, image: '' }
    const { getByText } = render(<ProductCard product={product} />)
    expect(getByText('测试商品')).toBeTruthy()
    expect(getByText('¥99')).toBeTruthy()
  })
})
```

---

## 🔧 4. 自动化工具链

### Makefile 统一命令

```makefile
# Makefile

.PHONY: setup sync-all test-all build-all

# 一键初始化
setup:
	@echo "📦 Installing dependencies..."
	cd packages/shared-models && dart pub get
	cd apps/flutter-app && flutter pub get
	cd apps/taro-app && npm ci
	@echo "✅ Setup complete"

# 同步共享资源
sync-tokens:
	node tools/sync-tokens.js
	@echo "🎨 Tokens synced"

sync-api:
	sh tools/gen-api.sh
	@echo "📡 API clients generated"

sync-all: sync-tokens sync-api

# 全量测试
test-flutter:
	cd apps/flutter-app && flutter test

test-taro:
	cd apps/taro-app && npm test

test-all: test-flutter test-taro
	@echo "✅ All tests passed"

# 全量构建
build-flutter-android:
	cd apps/flutter-app && flutter build apk --release

build-taro-weapp:
	cd apps/taro-app && npm run build:weapp

build-taro-h5:
	cd apps/taro-app && npm run build:h5

build-all: build-flutter-android build-taro-weapp build-taro-h5
	@echo "✅ All platforms built"

# 一致性检查
check:
	node tools/check-consistency.js
	@echo "✅ Consistency check passed"
```

### Git Hooks（提交前自动检查）

```bash
# .husky/pre-commit（Taro 端）
cd apps/taro-app && npx lint-staged

# 在 apps/flutter-app/ 目录的 pre-commit
cd apps/flutter-app && dart analyze && flutter test
```

---

## 💉 5. 工程化踩坑速查

| 错误 | 后果 | 修复 |
|-----|------|------|
| 不区分变更范围触发 CI | 每次提交两端都构建，浪费资源 | 用 `paths` 过滤触发条件 |
| 共享包版本不锁定 | 不同环境构建结果不一致 | 锁定 pubspec.lock / package-lock.json |
| CI 没有缓存 | 构建时间 20 分钟+ | 缓存 pub cache / node_modules |
| 手动管理版本号 | 版本混乱 | 用 CI run number 自动递增 |
| 没有 CODEOWNERS | 关键代码被随意修改 | 配置 CODEOWNERS + 分支保护 |
| 测试覆盖率不设门槛 | 质量逐渐下降 | CI 中设置最低覆盖率要求 |

---

## ✅ 工程化 Checklist

### Monorepo 搭建
- [ ] 创建目录结构（packages / apps / tools）
- [ ] 配置共享包引用（path 依赖）
- [ ] 编写 Makefile 统一命令
- [ ] 配置 CODEOWNERS

### CI/CD
- [ ] 配置 Flutter CI 流水线
- [ ] 配置 Taro CI 流水线
- [ ] 设置路径过滤（智能触发）
- [ ] 配置缓存（加速构建）
- [ ] 小程序自动上传
- [ ] H5 自动部署

### 测试与质量
- [ ] 共享包单元测试
- [ ] Flutter Widget 测试
- [ ] Taro 组件测试
- [ ] 测试覆盖率门禁
- [ ] 代码分析（dart analyze / ESLint）

### 自动化同步
- [ ] Design Token 自动同步脚本
- [ ] API Schema 自动生成脚本
- [ ] 一致性检查工具
- [ ] Git Hooks 提交前检查

---

> 工程化就像修公路 — 一开始觉得"走小路也能到"，
> 但当车一多（需求增加）、路一远（项目复杂），
> 没有公路的代价就是**堵车（构建慢）、翻车（Bug 多）、迷路（版本混乱）**。
> **投资工程化，就是投资团队的长期效率。**


---
*📝 作者：NIHoa ｜ 系列：跨端技术系列 ｜ 更新日期：2026-01-10*
