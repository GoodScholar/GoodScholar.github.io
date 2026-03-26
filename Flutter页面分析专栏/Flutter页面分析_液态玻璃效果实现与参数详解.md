# 🫧 Flutter 页面分析：用 liquid_glass_easy 实现 iOS 26 风格的液态玻璃效果

Flutter | 页面分析系列

苹果在 WWDC 25 发布了一种新的视觉设计语言——Liquid Glass（液态玻璃）。它的核心是一种像真实液态玻璃一样的 UI 材质：透明、折射、带色散，会实时反映背景内容的变化。Flutter 社区很快跟进，出了 `liquid_glass_easy` 这个库。这期来拆解一下它的用法和背后的实现逻辑。

---

## 🔍 1. 页面结构拆解

```
Scaffold
├── AppBar（透明，extendBodyBehindAppBar: true）
├── Body: LiquidGlassView（核心容器）
│   ├── backgroundWidget: Stack（背景图 + 标题文字）
│   └── children: [LiquidGlass]（玻璃镜头，按 _bgIndex 条件渲染）
│       ├── bgIndex=0 → 小圆形镜头（含暂停按钮）
│       ├── bgIndex=1 → 卡片形镜头（含天气 Widget）
│       ├── bgIndex=2 → Superellipse 形镜头
│       ├── bgIndex=3 → 圆角矩形镜头（高折射）
│       ├── bgIndex=4 → Superellipse 镜头（自定义指数）
│       └── bgIndex=5 → 圆形镜头（cornerRadius=75）
└── BottomNavigationBar（两个按钮：刷新快照 / 切换背景）
```

整个页面的精华就在 `LiquidGlassView` 里，6张不同背景 + 6种不同形状的玻璃镜头，每次切换背景时对应展示一种镜头效果。

---

## 🧩 2. 核心概念解析

### LiquidGlassView 是怎么工作的？

`liquid_glass_easy` 的实现原理是**截图 + 着色器渲染**：

1. `LiquidGlassView` 把 `backgroundWidget` 截图（使用 `RepaintBoundary`）
2. 把截图作为纹理传给 GLSL 着色器
3. 着色器对玻璃镜头覆盖区域的像素做折射、色散、模糊等处理
4. 渲染结果叠在背景上展示

所以 `LiquidGlass` 本质不是真正的"透明"，而是把背景截图之后实时处理的"假透明"。

### 两种截图模式

```dart
// 实时截图（跟着背景动画实时更新，性能消耗高）
realTimeCapture: true

// 单次截图（背景变化后手动调用 captureOnce）
await viewController.captureOnce();
```

Demo 里默认开了实时截图（`_realtime = true`）。如果背景是静态图，关掉实时截图、改成手动触发 `captureOnce` 性能会好很多。

### 两个 Controller 的分工

```dart
final LiquidGlassViewController viewController = LiquidGlassViewController();
// 控制整个 View 层：截图时机、刷新

final LiquidGlassController lensController = LiquidGlassController();
// 控制单个镜头：显示/隐藏动画、重置位置
```

---

## ⚙️ 3. LiquidGlass 参数详解

每个场景的镜头参数都不一样，这里逐个说明关键参数的作用：

| 参数 | 作用 | 参考值 |
|------|------|--------|
| `distortion` | 折射强度，值越大背景变形越夸张 | 0.075 ~ 0.25 |
| `distortionWidth` | 折射的边缘宽度（px） | 50 ~ 80 |
| `chromaticAberration` | 色散强度，模拟真实玻璃的彩色边缘 | 0.002（建议别太高）|
| `blur` | 背景模糊程度（高斯模糊） | sigmaX/Y: 0.5 ~ 1.0 |
| `draggable` | 是否可拖拽 | true / false |
| `outOfBoundaries` | 是否允许拖出屏幕边界 | true / false |

### 形状（shape）的选择

目前支持两种形状：

**RoundedRectangleShape**（圆角矩形，最常用）

```dart
shape: const RoundedRectangleShape(
  cornerRadius: 75,       // 圆角半径，75 = 圆形
  borderSoftness: 2.5,    // 边缘柔和程度
  lightIntensity: 1.5,    // 高光强度
  lightDirection: 39,     // 高光角度（度数）
  borderWidth: 2,         // 边框宽度
)
```

**SuperellipseShape**（超椭圆，iOS 图标那种形状）

```dart
shape: const SuperellipseShape(
  curveExponent: 4,   // 曲线指数，越大越方，越小越圆
  lightDirection: 140,
  lightIntensity: 1.5,
)
```

`curveExponent` 是 `SuperellipseShape` 的灵魂参数。`curveExponent: 2` 是普通椭圆，`curveExponent: 4` 接近 iOS 图标圆角，继续加大会趋向正方形。

---

## 💻 4. 完整使用示例

### 最简单的接入方式

```dart
// 1. pubspec.yaml 加依赖
// liquid_glass_easy: ^latest

// 2. 页面结构
Scaffold(
  body: LiquidGlassView(
    controller: viewController,
    backgroundWidget: YourBackgroundWidget(), // 被捕获的背景
    realTimeCapture: true,
    children: [
      LiquidGlass(
        position: const LiquidGlassAlignPosition(alignment: Alignment.center),
        width: 150,
        height: 150,
        distortion: 0.1,
        distortionWidth: 60,
        chromaticAberration: 0.002,
        draggable: true,
        shape: const RoundedRectangleShape(
          cornerRadius: 75, // 正圆形
          lightIntensity: 1.5,
          lightDirection: 39,
          borderSoftness: 2.5,
        ),
      ),
    ],
  ),
);
```

### 背景切换后刷新快照的正确时序

```dart
Future<void> _refreshSnapshot() async {
  // 先隐藏镜头（避免截图时镜头本身被截进去）
  lensController.hideLiquidGlass(animationTimeMillisecond: 280);
  // 等待隐藏动画完成
  await Future.delayed(const Duration(milliseconds: 340));
  // 重新截图
  await viewController.captureOnce();
  // 再显示镜头
  lensController.showLiquidGlass(animationTimeMillisecond: 280);
}
```

这个时序很关键——如果不先隐藏镜头就截图，镜头的渲染结果会被截进背景纹理，产生递归叠加的诡异效果。

---

## 🎨 5. 内嵌 WeatherWidget 的设计

Demo 里 bgIndex=1 的镜头内嵌了一个天气卡片，所有尺寸都乘了 `0.8` 的缩放系数：

```dart
fontSize: 22 * 0.8  // 原始设计稿尺寸 × 缩放比例
padding: EdgeInsets.all(21 * 0.8)
```

这是一个常见的设计稿还原技巧——先按正常尺寸设计，整体偏大时统一乘缩放系数，比逐一调整每个数值快很多。

颜色用的都是 `Colors.white.withAlpha(xxx)` 而不是 `withOpacity`：

```dart
// 推荐：withAlpha，避免浮点精度问题
Colors.white.withAlpha(204)  // ≈ 0.8 透明度

// 不推荐（旧写法，在新版 Flutter 有 deprecation 警告）
Colors.white.withOpacity(0.8)
```

---

## 🚀 6. 性能注意事项

**实时截图的代价**

`realTimeCapture: true` 会在每一帧都对 `backgroundWidget` 做截图，如果背景是复杂动画或大图，GPU 压力会比较大。静态背景建议关掉，改用 `captureOnce`。

**镜头数量**

同时屏幕上的 `LiquidGlass` 数量越多，着色器计算量越大。Demo 里每次只展示一个镜头，实际项目要控制数量，不建议同时展示超过 3 个。

**`extendBodyBehindAppBar: true`**

透明 AppBar + 全屏背景的标准做法。注意 AppBar 的返回按钮颜色要手动改成白色：

```dart
leading: IconButton(
  icon: const Icon(Icons.arrow_back, color: Colors.white), // 手动指定白色
  onPressed: () => Navigator.of(context).pop(),
),
```

---

## 💡 7. 延伸思考

- `realTimeCapture` 的实现原理是什么？Flutter 的哪个 API 支持逐帧截图？
- 如果想在 `LiquidGlass` 内嵌可交互的 Widget（比如按钮），触摸事件怎么传递？
- 液态玻璃效果在深色背景下和浅色背景下视觉效果差异很大，设计上有哪些建议？

---

## 📝 小结

- [x] `LiquidGlassView` = 背景截图容器，`LiquidGlass` = 着色器渲染的玻璃镜头
- [x] `realTimeCapture: true` 用于动态背景，静态背景用 `captureOnce` 省性能
- [x] 刷新快照前必须先隐藏镜头，避免截图递归叠加
- [x] `distortion` 控制折射强度，`chromaticAberration` 控制色散，`blur` 控制模糊
- [x] 形状支持 `RoundedRectangleShape` 和 `SuperellipseShape`，后者的 `curveExponent` 是关键
- [x] 颜色透明度用 `withAlpha` 替代 `withOpacity`，规避新版 Flutter 的 deprecation 警告

> Liquid Glass 本质上是「截图 + 着色器」的组合技——Flutter 的自定义渲染能力让这种效果在 Dart 层就能实现，不需要写原生代码。能跑在 iOS 和 Android 上，这点还挺惊喜的。

---

好了，本期内容到这里，感兴趣的话欢迎点赞、在看，我们下期见！Bye~

**标签**：`#Flutter` `#LiquidGlass` `#动画效果` `#iOS26` `#着色器`


*📝 作者：NIHoa ｜ 系列：Flutter页面分析专栏 ｜ 更新日期：2025-04-12*
