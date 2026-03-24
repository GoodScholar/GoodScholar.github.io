# Flutter | 第3期 - flutter_native_splash：一键生成启动屏

本期为大家分享如何在 Flutter 中去做应用启动屏（Splash Screen）功能，用 flutter_native_splash 插件一键生成 Android 和 iOS 原生启动屏，感兴趣的话和我一起来探索一下呗~

---

### 首先，什么是启动屏（Splash Screen）?

启动屏是用户打开 App 后看到的第一个画面，在 Flutter 引擎初始化完成之前展示，用于提升品牌感和减少白屏等待感。

▪️ **品牌展示**：展示 App Logo 和品牌色，强化用户对品牌的认知
▪️ **过渡体验**：消除 App 启动时的白屏或黑屏，提升专业感
▪️ **原生级别**：启动屏由原生平台渲染，不依赖 Flutter 引擎
▪️ **多平台适配**：需要同时适配 Android（包括 Android 12+）和 iOS
▪️ **暗黑模式**：支持明暗两种主题的自动切换

---

## 为什么选 flutter_native_splash？

手动配置启动屏需要分别修改 Android 的 `styles.xml`、`colors.xml`、`AndroidManifest.xml` 以及 iOS 的 `LaunchScreen.storyboard`，过程繁琐且容易出错。

| 方案 | 核心特点 | 对比 |
|------|---------|------|
| 手动配置原生文件 | 分别修改 Android 和 iOS 配置 | ❌ 繁琐、易出错、维护成本高 |
| flutter_native_splash | 一条命令自动生成全平台配置 | ✅ YAML 配置 + 自动生成，省时省力 |
| animated_splash_screen | Flutter 层动画启动屏 | ⚠️ 不是真正的原生启动屏，白屏仍然存在 |

**本期选择 flutter_native_splash 进行演示。** 它支持背景色/背景图、居中 Logo、品牌图、暗黑模式、Android 12 适配等，是 Flutter 社区最主流的启动屏方案。

---

## 基础集成

### 添加依赖

1️⃣ 在 `pubspec.yaml` 的 `dev_dependencies` 中添加依赖：

```yaml
dev_dependencies:
  flutter_native_splash: ^2.4.6
```

> **注意**：`flutter_native_splash` 是**开发依赖**（dev_dependency），它仅在代码生成时使用，不会打包进最终的 App。

2️⃣ 运行安装命令：

```bash
flutter pub get
```

---

## 配置文件

`flutter_native_splash` 支持两种配置方式：
- **方式一**：在 `pubspec.yaml` 中直接添加 `flutter_native_splash` 配置段
- **方式二**：创建独立的 `flutter_native_splash.yaml` 文件（推荐，更清晰）

本期采用**方式二**，在项目根目录创建 `flutter_native_splash.yaml`。

---

### 基础配置：背景图 + Logo

下面是我在实际项目中的完整配置文件：

```yaml
flutter_native_splash:
  # === 背景设置 ===
  # 方式一：纯色背景
  # color: "#42a5f5"

  # 方式二：背景图片（支持渐变等效果）
  # 图片会被拉伸到屏幕大小
  background_image_android: "assets/launcher/background.png"
  background_image_ios: "assets/launcher/background.png"

  # === 居中 Logo ===
  # 必须是 PNG 文件，建议提供 4x 像素密度的图
  # image: assets/splash.png

  # === 品牌图（底部 Logo）===
  # branding: assets/brand.png
  # branding_mode: bottom
  # branding_bottom_padding: 24

  # === Android 12+ 专属配置 ===
  android_12:
    # 启动屏图标（会被裁剪为圆形）
    # 带背景：960×960 像素，适配 640px 直径圆形
    # 无背景：1152×1152 像素，适配 768px 直径圆形
    image: "assets/launcher/logo.png"
    # 图标背景色
    icon_background_color: "#324ea1"
```

> **注意**：`color` 和 `background_image` 不能同时设置。`color` 适合纯色启动屏，`background_image` 适合需要渐变或纹理的启动屏。

---

### 暗黑模式配置

如果你的 App 支持暗黑模式，可以单独配置暗黑主题下的启动屏：

```yaml
flutter_native_splash:
  # 亮色模式
  color: "#ffffff"
  image: assets/splash-light.png

  # 暗黑模式（设备为深色模式时自动应用）
  color_dark: "#042a49"
  image_dark: assets/splash-dark.png
  branding_dark: assets/brand-dark.png

  android_12:
    image: "assets/launcher/logo.png"
    color: "#ffffff"
    icon_background_color: "#324ea1"

    # Android 12 暗黑模式
    image_dark: assets/launcher/logo-dark.png
    color_dark: "#042a49"
    icon_background_color_dark: "#eeeeee"
```

> **提示**：如果不配置 `_dark` 后缀的参数，暗黑模式下会自动使用亮色模式的配置。

---

### 平台特定配置

如果需要不同平台展示不同的启动屏，可以使用平台特定参数：

```yaml
flutter_native_splash:
  # 平台特定图片
  image_android: assets/splash-android.png
  image_ios: assets/splash-ios.png
  image_web: assets/splash-web.gif  # Web 支持 GIF 动图！

  # 平台特定背景色
  color_android: "#42a5f5"
  color_ios: "#ffffff"
  color_web: "#42a5f5"

  # 图片位置
  # Android: center, bottom, top, fill 等
  android_gravity: center
  # iOS: center, scaleAspectFit, scaleAspectFill 等
  ios_content_mode: center
  # Web: center, contain, stretch, cover
  web_image_mode: center

  # 禁用某个平台
  # android: false
  # ios: false
  # web: false
```

---

### 全屏配置

如果想隐藏状态栏（全屏启动屏）：

```yaml
flutter_native_splash:
  color: "#42a5f5"
  fullscreen: true
```

> **注意**：iOS 不会在启动时自动显示状态栏。如果设置了 `fullscreen: true`，需要在 Flutter 代码中手动恢复状态栏：
> ```dart
> WidgetsFlutterBinding.ensureInitialized();
> SystemChrome.setEnabledSystemUIMode(
>   SystemUiMode.manual,
>   overlays: [SystemUiOverlay.top, SystemUiOverlay.bottom],
> );
> ```

---

## 生成启动屏

### 一键生成

3️⃣ 配置完成后，运行生成命令：

```bash
dart run flutter_native_splash:create
```

插件会自动修改以下原生文件：

| 平台 | 修改的文件 |
|------|----------|
| Android | `styles.xml`、`colors.xml`、`drawable` 目录下的启动屏资源 |
| Android 12+ | `styles.xml` 中的 `Theme.App.SplashScreen` |
| iOS | `LaunchScreen.storyboard`、`Assets.xcassets` |
| Web | `index.html` 中的启动屏样式 |

🚀 一条命令搞定三个平台的启动屏配置，再也不用手动编辑原生文件了！

---

### 恢复默认

如果想恢复 Flutter 的默认白色启动屏：

```bash
dart run flutter_native_splash:remove
```

---

## 进阶：保持启动屏直到初始化完成

默认情况下，启动屏会在 Flutter 引擎加载完成后立即消失。但很多 App 需要在启动时做一些初始化工作（加载配置、检查登录状态、预加载数据等），这时候我们希望 **启动屏保持显示，直到初始化完成**。

`flutter_native_splash` 提供了 `preserve` 和 `remove` API 来控制启动屏的生命周期：

```dart
import 'package:flutter/material.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';

void main() {
  // 1️⃣ 保持启动屏显示
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);

  // 2️⃣ 执行初始化任务
  await _initializeApp();

  // 3️⃣ 初始化完成，移除启动屏
  FlutterNativeSplash.remove();

  runApp(const MyApp());
}

Future<void> _initializeApp() async {
  // 加载用户配置
  await loadUserPreferences();
  // 检查登录状态
  await checkLoginStatus();
  // 预加载必要数据
  await preloadData();
}
```

> **提示**：也可以在 App 内部的任意位置调用 `FlutterNativeSplash.remove()`。比如在首页数据加载完成后再移除启动屏，这样用户看到的第一个画面就是完整的内容页，体验更好。

---

## 启动屏资源设计规范

### 图片尺寸建议

| 资源 | 推荐尺寸 | 说明 |
|------|---------|------|
| 居中 Logo（`image`） | 768×768 px | 4x 像素密度，插件会自动生成各密度版本 |
| 背景图（`background_image`） | 1920×1920 px | 会被拉伸到屏幕大小 |
| 品牌图（`branding`） | 400×100 px | 底部展示的品牌标识 |
| Android 12 图标（带背景） | 960×960 px | 裁剪为 640px 直径的圆形 |
| Android 12 图标（无背景） | 1152×1152 px | 裁剪为 768px 直径的圆形 |

### Android 12 圆形裁剪示意

```
┌─────────────────────────┐
│                         │
│    ┌──────────────┐     │
│    │  ╭────────╮  │     │
│    │  │  LOGO  │  │     │  960×960 安全区域
│    │  │ (640px)│  │     │  圆形裁剪直径 640px
│    │  ╰────────╯  │     │
│    └──────────────┘     │
│                         │
└─────────────────────────┘
```

> **注意**：Android 12+ 会将启动屏图标裁剪为圆形，所以图标的核心内容必须在安全区域内。建议预留足够边距。

---

## 完整配置参数速查

```yaml
flutter_native_splash:
  # ── 背景 ──
  color: "#ffffff"                           # 纯色背景
  background_image: "assets/bg.png"          # 背景图（与 color 二选一）
  color_dark: "#042a49"                      # 暗黑模式背景色
  background_image_dark: "assets/bg-dark.png"  # 暗黑模式背景图

  # ── 居中图片 ──
  image: assets/splash.png                   # 居中 Logo
  image_dark: assets/splash-dark.png         # 暗黑模式 Logo

  # ── 品牌图 ──
  branding: assets/brand.png                 # 底部品牌标识
  branding_mode: bottom                      # 位置: bottom / bottomRight / bottomLeft
  branding_bottom_padding: 24                # 底部间距
  branding_dark: assets/brand-dark.png       # 暗黑模式品牌图

  # ── Android 12+ ──
  android_12:
    image: "assets/logo.png"                 # 居中图标（圆形裁剪）
    color: "#ffffff"                         # 背景色
    icon_background_color: "#324ea1"         # 图标背景色
    branding: assets/brand.png               # 品牌图
    image_dark: assets/logo-dark.png         # 暗黑图标
    color_dark: "#042a49"                    # 暗黑背景
    icon_background_color_dark: "#eeeeee"    # 暗黑图标背景

  # ── 平台开关 ──
  android: true                              # 是否生成 Android
  ios: true                                  # 是否生成 iOS
  web: true                                  # 是否生成 Web

  # ── 图片位置 ──
  android_gravity: center                    # Android 图片位置
  ios_content_mode: center                   # iOS 图片位置
  web_image_mode: center                     # Web 图片位置

  # ── 其他 ──
  fullscreen: false                          # 是否全屏（隐藏状态栏）
  android_screen_orientation: portrait       # Android 屏幕方向
```

---

## 常见问题与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 启动仍是白屏 | 没有运行生成命令 | 执行 `dart run flutter_native_splash:create` |
| Android 12 启动屏不生效 | 缺少 `android_12` 配置 | 必须单独配置 `android_12` 段 |
| 图片被拉伸变形 | 用了 `background_image` 放 Logo | Logo 用 `image`，背景用 `background_image` |
| 暗黑模式不生效 | 没配置 `_dark` 参数 | 添加 `color_dark` / `image_dark` 等 |
| iOS 模拟器不更新 | 缓存问题 | 删除 App 重新安装，或清理 DerivedData |
| hot restart 后启动屏消失 | 正常行为 | 启动屏仅在冷启动时展示 |

---

## 使用步骤总结

```
1️⃣ 添加 dev_dependency
   ↓
2️⃣ 准备图片资源（Logo、背景图、品牌图）
   ↓
3️⃣ 创建 flutter_native_splash.yaml 配置文件
   ↓
4️⃣ 执行 dart run flutter_native_splash:create
   ↓
5️⃣ （可选）代码中使用 preserve / remove 控制启动屏生命周期
   ↓
6️⃣ 重新构建 App 验证效果
```

> **提示**：每次修改配置后，都需要重新执行 `dart run flutter_native_splash:create` 并重新构建 App（不是 hot reload）才能看到变化。

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~
