# Flutter 优质工具推荐

> 分类整理的 Flutter 生态优质工具，持续更新。

---

## 🛠️ 开发辅助

| 工具 | 用途 |
|---|---|
| **FlutterGen** | 自动生成 assets、fonts 的类型安全代码，告别硬编码字符串 |
| **build_runner** | 代码生成的核心驱动，配合 json_serializable、Riverpod 等使用 |
| **mason / mason_cli** | Flutter 专属代码片段脚手架，自定义 brick 模板快速生成页面/模块 |
| **very_good_cli** | Very Good Ventures 出品，快速生成最佳实践的项目结构 |
| **dart_code_metrics** | 代码质量检测，比 flutter analyze 更严格，可检查圈复杂度 |

---

## 🧪 测试

| 工具 | 用途 |
|---|---|
| **mocktail** | 比 mockito 更简洁的 mock 方案，无需代码生成 |
| **golden_toolkit** | 黄金测试（截图对比）增强版，支持多设备尺寸截图 |
| **patrol** | 替代 flutter_test 的 UI 自动化测试框架，支持真机测试 |
| **integration_test** | 官方集成测试方案，配合 GitHub Actions 做 CI |

---

## 🎨 UI / 设计

| 工具/包 | 用途 |
|---|---|
| **Widgetbook** | 组件可视化预览工具，类似 Flutter 版 Storybook |
| **flutter_screenutil** | 适配不同屏幕尺寸，px 自动换算 |
| **shimmer** | 骨架屏加载效果，开箱即用 |
| **lottie** | 直接播放 AE 导出的 Lottie 动画 |
| **smooth_page_indicator** | 精美的分页指示器 |

---

## ⚙️ 架构 / 状态管理

| 工具/包 | 用途 |
|---|---|
| **Riverpod + riverpod_generator** | 目前最推荐的状态管理方案，配合代码生成使用 |
| **freezed** | 不可变数据类 + Union 类型，配合 Riverpod 极佳 |
| **auto_route / go_router** | 类型安全的路由方案，支持嵌套路由和 deep link |
| **dio + retrofit** | dio 做网络请求，retrofit 生成类型安全的 API 客户端 |

---

## 📦 VS Code / Android Studio 插件

| 插件名 | 用途 |
|---|---|
| **Flutter Widget Snippets** | 快速插入各种 Widget 代码片段 |
| **Pubspec Assist** | 直接在 VS Code 搜索并添加 pub 依赖 |
| **Flutter Coverage** | 可视化显示测试覆盖率 |
| **Dart Data Class Generator** | 一键生成 copyWith、toJson、fromJson 等模板代码 |

---

## 💡 推荐核心工具链

```
状态管理：Riverpod + riverpod_generator
数据模型：freezed + json_serializable
网络请求：dio + retrofit
路由：    go_router
代码生成：build_runner + FlutterGen
屏幕适配：flutter_screenutil
组件预览：Widgetbook
脚手架：  mason_cli
```
