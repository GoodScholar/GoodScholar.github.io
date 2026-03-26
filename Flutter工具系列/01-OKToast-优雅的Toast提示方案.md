# Flutter | 第1期 - OKToast：优雅的 Toast 提示方案

本期为大家分享如何在 Flutter 中去做 Toast 消息提示功能，从基础使用到封装一套带动画的自定义 Toast 工具类，感兴趣的话和我一起来探索一下呗~

---

### 首先，什么是 Toast?

Toast 是一种轻量级的消息提示方式，常用于向用户展示操作反馈，不打断用户当前操作流程。

▪️ **非阻塞性**：不会遮挡页面内容，不需要用户手动关闭
▪️ **自动消失**：显示一段时间后自动消失，通常 2-3 秒
▪️ **位置灵活**：可以出现在屏幕的顶部、底部或居中
▪️ **场景广泛**：操作成功、错误提示、信息通知等场景都能使用
▪️ **轻量简洁**：相比 Dialog 和 SnackBar，Toast 更加轻量无侵入

---

## 为什么选 OKToast？

Flutter 官方的 `SnackBar` 虽然能完成部分提示功能，但在实际开发中有诸多不便。我们来对比一下市面上主流的 Toast 方案：

| 方案 | 核心特点 | 对比 | pub 好评 |
|------|---------|------|----------|
| SnackBar（官方） | 底部横幅式提示 | ⚠️ 需要 ScaffoldMessenger 上下文，使用不便 | - |
| fluttertoast | 原生 Toast 桥接 | ⚠️ 依赖原生实现，样式受平台限制 | 3.8k |
| oktoast | 纯 Flutter 实现、支持自定义 Widget | ✅ 无需 context、自定义自由度高 | 1.5k |
| bot_toast | 功能丰富（Toast + Loading + Notification） | ⚠️ 功能过重，简单场景杀鸡用牛刀 | 800 |

**本期选择 oktoast 进行演示。** 它最大的优势是：**不依赖 `context`**，在任何地方（工具类、网络拦截器、全局错误处理）都能直接弹出 Toast，非常适合封装为全局工具类。

---

## 基础集成

### 添加依赖

1️⃣ 在 `pubspec.yaml` 中添加依赖：

```yaml
dependencies:
  oktoast: ^3.4.0
```

2️⃣ 运行安装命令：

```bash
flutter pub get
```

3️⃣ 导入包：

```dart
import 'package:oktoast/oktoast.dart';
```

---

### 初始化配置

4️⃣ 在 `MaterialApp` 外层包裹 `OKToast` Widget：

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 用 OKToast 包裹整个 App
    return OKToast(
      child: MaterialApp(
        title: 'My App',
        home: HomePage(),
      ),
    );
  }
}
```

> **注意**：`OKToast` 必须包裹在 `MaterialApp` 的**外层**，而不是里面。这样才能在整个 App 中使用 Toast，且不需要传递 `context`。

---

### 基本使用

5️⃣ 在任意位置调用即可弹出 Toast：

```dart
// 最简单的文字 Toast
showToast('操作成功');

// 指定位置
showToast('顶部提示', position: ToastPosition.top);
showToast('底部提示', position: ToastPosition.bottom);

// 自定义时长
showToast('停留 5 秒', duration: Duration(seconds: 5));

// 关闭其他 Toast 后再弹出
showToast('独占提示', dismissOtherToast: true);
```

🚀 是不是很简单？不需要 `context`、不需要 `ScaffoldMessenger`，一行代码搞定 Toast！

---

## 进阶：自定义 Toast Widget

oktoast 的真正杀手锏是 `showToastWidget` 方法 —— 你可以传入**任意自定义 Widget** 作为 Toast 内容，这意味着你可以做出带图标、带动画、带颜色的各种精美 Toast。

我们来封装一个生产级的 `ToastUtil` 工具类，支持以下功能：

▪️ **顶部滑入 Toast**：从屏幕顶部滑入，适合通知类提示
▪️ **底部上滑 Toast**：从屏幕底部上滑，适合操作反馈
▪️ **居中淡入 Toast**：屏幕中央淡入淡出，适合状态提示
▪️ **语义化快捷方法**：`showSuccess` / `showError` / `showInfo`，带颜色和图标
▪️ **自定义停留时长**：支持 `double` 秒数，精确控制显示时间

---

## 完整工具类代码

下面是我在实际项目中封装的 `ToastUtil` 工具类，包含动画组件的完整实现：

### API 层：ToastUtil

```dart
import 'package:flutter/material.dart';
import 'package:oktoast/oktoast.dart';

/// 通用 Toast 工具类（支持自定义停留时间，double 秒）
class ToastUtil {
  /// 顶部滑入滑出
  static void showTop(String message, {double? staySeconds}) {
    final Duration duration = Duration(
        milliseconds: ((staySeconds ?? 2) * 1000).toInt()); // 支持 double
    showToastWidget(
      _SlideToast(message, stayDuration: duration),
      position: ToastPosition.top,
      duration: Duration(
        milliseconds: 300 + duration.inMilliseconds + 400,
      ),
      dismissOtherToast: true,
    );
  }

  /// 底部上滑淡入
  static void showBottom(String message,
      {double? staySeconds, Color? background, IconData? icon}) {
    final Duration duration =
        Duration(milliseconds: ((staySeconds ?? 2) * 1000).toInt());
    showToastWidget(
      _SlideToast(message,
          isTop: false,
          stayDuration: duration,
          background: background,
          icon: icon),
      position: ToastPosition.bottom,
      duration: Duration(
        milliseconds: 300 + duration.inMilliseconds + 400,
      ),
      dismissOtherToast: true,
    );
  }

  /// 居中淡入淡出
  static void showCenter(String message,
      {double? staySeconds, Color? background, IconData? icon}) {
    final Duration duration =
        Duration(milliseconds: ((staySeconds ?? 2) * 1000).toInt());
    showToastWidget(
      _FadeCenterToast(message,
          stayDuration: duration, background: background, icon: icon),
      position: ToastPosition.center,
      duration: duration + const Duration(milliseconds: 400),
      dismissOtherToast: true,
    );
  }

  /// 成功提示（绿色）
  static void showSuccess(String message, {double? staySeconds}) {
    showCenter(message,
        staySeconds: staySeconds,
        background: Colors.green.shade600,
        icon: Icons.check_circle_outline);
  }

  /// 错误提示（红色）
  static void showError(String message, {double? staySeconds}) {
    showCenter(message,
        staySeconds: staySeconds,
        background: Colors.red.shade600,
        icon: Icons.error_outline);
  }

  /// 信息提示（蓝色）
  static void showInfo(String message, {double? staySeconds}) {
    showCenter(message,
        staySeconds: staySeconds,
        background: Colors.blue.shade600,
        icon: Icons.info_outline);
  }
}
```

> **提示**：`duration` 的计算是 `进场动画时间 (300ms) + 停留时间 + 退场动画时间 (400ms)`，这样确保 oktoast 在动画完全结束后才移除 Widget。

---

### 动画层：滑入滑出 Toast

顶部和底部的 Toast 使用 `SlideTransition` + `FadeTransition` 双动画组合：

```dart
/// 顶部 / 底部滑入动画
class _SlideToast extends StatefulWidget {
  const _SlideToast(this.message,
      {this.isTop = true,
      required this.stayDuration,
      this.background,
      this.icon});
  final String message;
  final bool isTop;
  final Duration stayDuration;
  final Color? background;
  final IconData? icon;

  @override
  State<_SlideToast> createState() => _SlideToastState();
}

class _SlideToastState extends State<_SlideToast>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _offset;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),       // 进场 300ms
      reverseDuration: const Duration(milliseconds: 400), // 退场 400ms
    );

    // 顶部 Toast 从上方滑入，底部 Toast 从下方滑入
    _offset = Tween<Offset>(
      begin: widget.isTop ? const Offset(0, -1) : const Offset(0, 1),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );

    // 动画流程：滑入 → 停留 → 滑出
    _controller.forward().then((_) async {
      await Future<dynamic>.delayed(widget.stayDuration);
      if (mounted) await _controller.reverse();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  double get _margin => widget.isTop ? 20 : 40;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Align(
        alignment:
            widget.isTop ? Alignment.topCenter : Alignment.bottomCenter,
        child: SlideTransition(
          position: _offset,
          child: FadeTransition(
            opacity: _controller,
            child: Container(
              margin: EdgeInsets.only(
                  top: widget.isTop ? _margin : 0,
                  bottom: widget.isTop ? 0 : _margin),
              padding:
                  const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              decoration: BoxDecoration(
                color: widget.background ?? Colors.black87,
                borderRadius: BorderRadius.circular(12),
                boxShadow: const <BoxShadow>[
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 8,
                    offset: Offset(0, 3),
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  if (widget.icon != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child:
                          Icon(widget.icon, color: Colors.white, size: 22),
                    ),
                  Flexible(
                    child: Text(
                      widget.message,
                      style: const TextStyle(
                          color: Colors.white, fontSize: 16),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
```

> **注意**：这里使用了 `SafeArea` 来避免 Toast 被状态栏或底部导航遮挡，在刘海屏和全面屏设备上效果更好。

---

### 动画层：居中淡入淡出 Toast

居中 Toast 使用纯 `FadeTransition` 动画，更加简洁优雅：

```dart
/// 居中淡入淡出动画
class _FadeCenterToast extends StatefulWidget {
  const _FadeCenterToast(this.message,
      {required this.stayDuration, this.background, this.icon});
  final String message;
  final Duration stayDuration;
  final Color? background;
  final IconData? icon;

  @override
  State<_FadeCenterToast> createState() => _FadeCenterToastState();
}

class _FadeCenterToastState extends State<_FadeCenterToast>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
      reverseDuration: const Duration(milliseconds: 400),
    );

    // 淡入 → 停留 → 淡出
    _controller.forward().then((_) async {
      await Future<dynamic>.delayed(widget.stayDuration);
      if (mounted) await _controller.reverse();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _controller,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        decoration: BoxDecoration(
          color: widget.background ?? Colors.black87,
          borderRadius: BorderRadius.circular(12),
          boxShadow: const <BoxShadow>[
            BoxShadow(
              color: Colors.black26,
              blurRadius: 8,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            if (widget.icon != null)
              Padding(
                padding: const EdgeInsets.only(right: 8),
                child: Icon(widget.icon, color: Colors.white, size: 22),
              ),
            Flexible(
              child: Text(
                widget.message,
                style:
                    const TextStyle(color: Colors.white, fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 使用示例

封装完成后，我们在项目中使用就非常简洁了：

```dart
// 顶部通知
ToastUtil.showTop('您有一条新消息');

// 底部反馈
ToastUtil.showBottom('已添加到购物车');

// 成功提示（绿色 + ✅ 图标）
ToastUtil.showSuccess('保存成功');

// 错误提示（红色 + ❌ 图标）
ToastUtil.showError('网络连接失败，请重试');

// 信息提示（蓝色 + ℹ️ 图标）
ToastUtil.showInfo('当前为离线模式');

// 自定义停留时间（支持小数秒）
ToastUtil.showTop('重要通知！', staySeconds: 5);
ToastUtil.showSuccess('上传完成', staySeconds: 1.5);

// 自定义底部 Toast（带图标和颜色）
ToastUtil.showBottom(
  '已收藏',
  background: Colors.orange.shade600,
  icon: Icons.star,
  staySeconds: 3,
);
```

🚀 一行代码搞定各种 Toast 提示，代码简洁、动画流畅，直接复制到你的项目就能用！

---

## 动画时序解析

为了帮助大家理解动画的执行流程，这里画一个时序图：

```
顶部/底部 Toast 时序：

  ├── 300ms ──┤──── 2000ms（默认）────┤── 400ms ──┤
  │  滑入+淡入  │       停留显示         │  滑出+淡出  │
  │  forward() │  Future.delayed()    │  reverse() │

居中 Toast 时序：

  ├── 300ms ──┤──── 2000ms（默认）────┤── 400ms ──┤
  │   淡入      │       停留显示         │   淡出      │
  │  forward() │  Future.delayed()    │  reverse() │

总时长 = 进场动画 + 停留时间 + 退场动画
       = 300ms + stayDuration + 400ms
```

> **提示**：`staySeconds` 参数支持 `double` 类型（如 `1.5`、`0.8`），内部通过 `((staySeconds ?? 2) * 1000).toInt()` 转换为毫秒，精度控制非常灵活。

---

## 封装设计要点

这套工具类的设计有几个值得注意的细节：

▪️ **`dismissOtherToast: true`**：新 Toast 弹出时自动关闭旧的，避免 Toast 堆叠
▪️ **`mounted` 检查**：在 `reverse()` 前检查 `mounted` 状态，防止 Widget 已销毁时操作动画导致崩溃
▪️ **`SafeArea` 包裹**：适配刘海屏、挖孔屏等异形屏设备
▪️ **`Flexible` 包裹文字**：当文本过长时自动换行，不会撑爆布局
▪️ **`mainAxisSize: MainAxisSize.min`**：Toast 宽度自适应内容，不会铺满屏幕
▪️ **语义化方法**：`showSuccess` / `showError` / `showInfo` 预设了颜色和图标，调用时零配置

---

## 与 SnackBar 的使用场景对比

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 操作反馈（保存成功等） | ✅ ToastUtil | 轻量、不打断用户 |
| 需要撤销操作（删除等） | ✅ SnackBar | 支持 Action 按钮 |
| 全局错误提示（网络异常等） | ✅ ToastUtil | 不依赖 context |
| 表单校验错误 | ✅ ToastUtil | 可指定位置 |
| 需要用户确认 | ❌ 都不推荐 | 用 Dialog |

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~


*📝 作者：NIHoa ｜ 系列：Flutter工具系列 ｜ 更新日期：2025-04-01*
