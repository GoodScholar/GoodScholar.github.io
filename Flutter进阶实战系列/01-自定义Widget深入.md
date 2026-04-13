---
date: 2025-06-01
cover: /covers/cover-flutter-advanced.webp
---
# 🎯 Flutter 进阶实战（一）：自定义 Widget 深入 — 从 Container 到 RenderObject

> **系列导读**：这是「Flutter 进阶实战」系列的第 1 篇。假设你已掌握「Flutter 从零到一」全部内容，
> 本篇将带你深入 Flutter 的渲染机制，学会从零创造属于自己的 Widget。

**本文目标**：理解 Widget → Element → RenderObject 三棵树的关系，掌握 CustomPainter 和 RenderObject 两种自定义 Widget 方式，并实战完成两个可复用的自定义组件。

---

## 📊 你已经会用 Widget，但你真的了解它吗？

用 Flutter 写 UI，你一直在组合现有 Widget——`Container`、`Column`、`Stack`……但当产品说「我要一个波浪形的进度条」「我要一个不规则形状的卡片」时，现有 Widget 就不够用了。

这时候你有两条路：

| 方案 | 适用场景 | 难度 | 性能 |
|------|---------|------|------|
| **CustomPainter** | 自定义绘制（图形、图表、装饰效果） | ⭐⭐ | 高 |
| **RenderObject** | 自定义布局 + 绘制（非标准排列方式） | ⭐⭐⭐⭐ | 最高 |
| 组合现有 Widget | 大部分 UI 需求 | ⭐ | 取决于嵌套深度 |

> **90% 的自定义需求用 CustomPainter 就够了。只有当你需要自定义布局逻辑时，才需要碰 RenderObject。**

---

## 🌳 1. 三棵树：理解 Flutter 渲染管线

在写自定义 Widget 之前，你需要理解 Flutter 底层的「三棵树」模型：

```
Widget 树                Element 树              RenderObject 树
（配置/蓝图）            （管理者/桥梁）           （真正干活的）
┌──────────┐           ┌──────────┐           ┌──────────┐
│ MyApp    │ ──创建──→ │ Element  │ ──创建──→ │ RenderObj│
│ (Widget) │           │          │           │ (布局+绘制)│
├──────────┤           ├──────────┤           ├──────────┤
│ Scaffold │ ──创建──→ │ Element  │ ──创建──→ │ RenderObj│
├──────────┤           ├──────────┤           ├──────────┤
│ Column   │ ──创建──→ │ Element  │ ──创建──→ │ RenderFlex│
├──────────┤           ├──────────┤           ├──────────┤
│ Text     │ ──创建──→ │ Element  │ ──创建──→ │ RenderPar│
└──────────┘           └──────────┘           └──────────┘

 不可变，每帧重建      持久化，管理生命周期     真正的布局和绘制
```

### 各自的职责

| 树 | 是什么 | 生命周期 | 开发者接触频率 |
|----|--------|---------|-------------|
| **Widget** | UI 的配置描述（蓝图） | 每帧可能重建（轻量） | ⭐⭐⭐⭐⭐ 天天写 |
| **Element** | Widget 和 RenderObject 的桥梁 | 持久化，复用 | ⭐ 几乎不碰 |
| **RenderObject** | 真正负责布局（layout）和绘制（paint） | 持久化，按需更新 | ⭐⭐ 高级场景 |

### 一个关键认知

```dart
// 你以为你在创建 UI，其实你在写配置
Container(
  width: 200,
  height: 100,
  color: Colors.blue,
)
// Container 本身不画任何东西！
// 它只是告诉 Flutter："我需要一个 200x100 的蓝色矩形"
// 真正画这个矩形的是底层的 RenderDecoratedBox
```

> **Widget 是菜单，Element 是服务员，RenderObject 是厨师。你写菜单，厨师做菜。**

---

## 🎨 2. CustomPainter 深入

### 基础回顾

```dart
class MyPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // 在这里画你想画的任何东西
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    // 返回 true = 重新绘制，false = 跳过
    return false;
  }
}

// 使用
CustomPaint(
  painter: MyPainter(),
  size: Size(200, 200),
)
```

### Paint 对象详解

```dart
void paint(Canvas canvas, Size size) {
  // 填充画笔
  final fillPaint = Paint()
    ..color = Colors.blue
    ..style = PaintingStyle.fill;    // 填充

  // 描边画笔
  final strokePaint = Paint()
    ..color = Colors.red
    ..style = PaintingStyle.stroke   // 描边
    ..strokeWidth = 3.0
    ..strokeCap = StrokeCap.round    // 线段端点样式
    ..strokeJoin = StrokeJoin.round; // 线段连接处样式

  // 渐变画笔
  final gradientPaint = Paint()
    ..shader = LinearGradient(
      colors: [Color(0xFF6C5CE7), Color(0xFF00CEC9)],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

  // 阴影/模糊画笔
  final shadowPaint = Paint()
    ..color = Colors.black26
    ..maskFilter = MaskFilter.blur(BlurStyle.normal, 8);

  // 抗锯齿（默认就是 true，但显式写出来更清晰）
  final smoothPaint = Paint()
    ..isAntiAlias = true
    ..color = Colors.green;
}
```

### Canvas 核心 API

| 方法 | 用途 | 示例 |
|------|------|------|
| `drawRect` | 画矩形 | `canvas.drawRect(rect, paint)` |
| `drawRRect` | 画圆角矩形 | `canvas.drawRRect(rrect, paint)` |
| `drawCircle` | 画圆 | `canvas.drawCircle(center, radius, paint)` |
| `drawArc` | 画弧线/扇形 | `canvas.drawArc(rect, startAngle, sweepAngle, useCenter, paint)` |
| `drawLine` | 画直线 | `canvas.drawLine(p1, p2, paint)` |
| `drawPath` | 画自定义路径 | `canvas.drawPath(path, paint)` |
| `drawImage` | 画图片 | `canvas.drawImage(image, offset, paint)` |
| `clipPath` | 裁剪画布 | `canvas.clipPath(path)` |
| `save/restore` | 保存/恢复画布状态 | 用于变换后恢复 |
| `translate/rotate/scale` | 变换画布 | 平移/旋转/缩放 |

---

## 🌊 3. 实战一：自定义波浪进度条

### 效果描述

一个带波浪动画的进度条：底部是灰色轨道，蓝色填充区域的顶部有波浪效果，进度值变化时波浪平滑过渡。

### 完整代码

```dart
import 'dart:math';
import 'package:flutter/material.dart';

class WaveProgressBar extends StatefulWidget {
  final double progress; // 0.0 ~ 1.0
  final double height;
  final Color backgroundColor;
  final List<Color> gradientColors;
  final double waveHeight;

  const WaveProgressBar({
    super.key,
    required this.progress,
    this.height = 40,
    this.backgroundColor = const Color(0xFFE0E0E0),
    this.gradientColors = const [Color(0xFF6C5CE7), Color(0xFF00CEC9)],
    this.waveHeight = 6,
  });

  @override
  State<WaveProgressBar> createState() => _WaveProgressBarState();
}

class _WaveProgressBarState extends State<WaveProgressBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _waveController;

  @override
  void initState() {
    super.initState();
    // 波浪动画：无限循环
    _waveController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
  }

  @override
  void dispose() {
    _waveController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _waveController,
      builder: (context, _) {
        return CustomPaint(
          size: Size(double.infinity, widget.height),
          painter: _WavePainter(
            progress: widget.progress,
            wavePhase: _waveController.value * 2 * pi,
            backgroundColor: widget.backgroundColor,
            gradientColors: widget.gradientColors,
            waveHeight: widget.waveHeight,
          ),
        );
      },
    );
  }
}

class _WavePainter extends CustomPainter {
  final double progress;
  final double wavePhase;
  final Color backgroundColor;
  final List<Color> gradientColors;
  final double waveHeight;

  _WavePainter({
    required this.progress,
    required this.wavePhase,
    required this.backgroundColor,
    required this.gradientColors,
    required this.waveHeight,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final radius = size.height / 2;
    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    final rrect = RRect.fromRectAndRadius(rect, Radius.circular(radius));

    // 1. 画背景轨道
    final bgPaint = Paint()
      ..color = backgroundColor
      ..style = PaintingStyle.fill;
    canvas.drawRRect(rrect, bgPaint);

    // 2. 裁剪为圆角矩形（让波浪不超出边界）
    canvas.save();
    canvas.clipRRect(rrect);

    // 3. 计算进度宽度
    final progressWidth = size.width * progress.clamp(0.0, 1.0);

    // 4. 构建波浪路径
    final wavePath = Path();
    wavePath.moveTo(0, size.height);

    for (double x = 0; x <= progressWidth; x++) {
      final y = size.height / 2 +
          sin((x / size.width * 4 * pi) + wavePhase) * waveHeight;
      wavePath.lineTo(x, y);
    }

    wavePath.lineTo(progressWidth, size.height);
    wavePath.close();

    // 5. 用渐变填充波浪
    final fillPaint = Paint()
      ..shader = LinearGradient(
        colors: gradientColors,
      ).createShader(Rect.fromLTWH(0, 0, progressWidth, size.height));
    canvas.drawPath(wavePath, fillPaint);

    canvas.restore();

    // 6. 画进度文字
    if (progress > 0.05) {
      final textPainter = TextPainter(
        text: TextSpan(
          text: '${(progress * 100).toInt()}%',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      textPainter.paint(
        canvas,
        Offset(
          (progressWidth - textPainter.width) / 2,
          (size.height - textPainter.height) / 2,
        ),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _WavePainter oldDelegate) {
    // 只在值变化时重绘
    return oldDelegate.progress != progress ||
        oldDelegate.wavePhase != wavePhase;
  }
}
```

### 使用方式

```dart
// 基础使用
WaveProgressBar(progress: 0.7)

// 自定义样式
WaveProgressBar(
  progress: 0.45,
  height: 50,
  gradientColors: [Colors.orange, Colors.red],
  waveHeight: 8,
)

// 配合动画
TweenAnimationBuilder<double>(
  tween: Tween(begin: 0, end: 0.8),
  duration: Duration(seconds: 2),
  builder: (context, value, _) {
    return WaveProgressBar(progress: value);
  },
)
```

---

## 📊 4. 实战二：自定义环形统计图

### 效果描述

多段数据组成的环形图，每段有不同颜色，支持间距、圆角端点、中心文字。

### 完整代码

```dart
class RingChart extends StatelessWidget {
  final List<RingSegment> segments;
  final double size;
  final double strokeWidth;
  final double gapDegree;
  final Widget? center;

  const RingChart({
    super.key,
    required this.segments,
    this.size = 200,
    this.strokeWidth = 20,
    this.gapDegree = 3,
    this.center,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(
            size: Size(size, size),
            painter: _RingChartPainter(
              segments: segments,
              strokeWidth: strokeWidth,
              gapDegree: gapDegree,
            ),
          ),
          if (center != null) center!,
        ],
      ),
    );
  }
}

class RingSegment {
  final double value;
  final Color color;
  final String label;

  const RingSegment({
    required this.value,
    required this.color,
    required this.label,
  });
}

class _RingChartPainter extends CustomPainter {
  final List<RingSegment> segments;
  final double strokeWidth;
  final double gapDegree;

  _RingChartPainter({
    required this.segments,
    required this.strokeWidth,
    required this.gapDegree,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;
    final rect = Rect.fromCircle(center: center, radius: radius);

    // 计算总值
    final total = segments.fold<double>(0, (sum, s) => sum + s.value);
    if (total == 0) return;

    // 计算总间距角度
    final totalGap = gapDegree * segments.length;
    final availableDegree = 360.0 - totalGap;

    // 画背景轨道
    final bgPaint = Paint()
      ..color = Colors.grey.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    canvas.drawCircle(center, radius, bgPaint);

    // 逐段绘制
    double startAngle = -pi / 2; // 从顶部开始

    for (final segment in segments) {
      final sweepAngle =
          (segment.value / total) * availableDegree * (pi / 180);
      final gapAngle = gapDegree * (pi / 180);

      final paint = Paint()
        ..color = segment.color
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round; // 圆角端点

      canvas.drawArc(rect, startAngle, sweepAngle, false, paint);
      startAngle += sweepAngle + gapAngle;
    }
  }

  @override
  bool shouldRepaint(covariant _RingChartPainter oldDelegate) {
    return oldDelegate.segments != segments;
  }
}
```

### 使用方式

```dart
RingChart(
  size: 200,
  strokeWidth: 24,
  segments: [
    RingSegment(value: 45, color: Color(0xFF6C5CE7), label: 'Flutter'),
    RingSegment(value: 25, color: Color(0xFF00CEC9), label: 'Dart'),
    RingSegment(value: 20, color: Color(0xFFFD79A8), label: 'Native'),
    RingSegment(value: 10, color: Color(0xFFFDCB6E), label: 'Other'),
  ],
  center: Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      Text('100', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
      Text('总计', style: TextStyle(color: Colors.grey)),
    ],
  ),
)
```

---

## 🧱 5. RenderObject 入门：自定义流式标签布局

### 什么时候需要 RenderObject？

| 需求 | CustomPainter 能做？ | 需要 RenderObject？ |
|------|--------------------|--------------------|
| 自定义图形 | ✅ | ❌ |
| 自定义图表 | ✅ | ❌ |
| 装饰效果/粒子 | ✅ | ❌ |
| 非标准布局排列 | ❌ | ✅ |
| 自定义命中测试 | ❌ | ✅ |
| 自定义子组件约束 | ❌ | ✅ |

### RenderObject 的生命周期

```
创建 RenderObject
    ↓
setupParentData()  ← 初始化子组件的位置数据
    ↓
performLayout()    ← 测量自身 + 决定子组件位置（最核心）
    ↓
paint()            ← 绘制自身 + 绘制子组件
    ↓
hitTest()          ← 处理点击事件
```

### 实战：流式标签布局（FlowTags）

Wrap 能实现流式布局，但如果你想要更灵活的控制（比如每行居中、自定义间距算法），就需要自定义 RenderObject。

```dart
// 1. 定义 Widget
class FlowTags extends MultiChildRenderObjectWidget {
  final double horizontalSpacing;
  final double verticalSpacing;
  final MainAxisAlignment alignment;

  FlowTags({
    super.key,
    required List<Widget> children,
    this.horizontalSpacing = 8,
    this.verticalSpacing = 8,
    this.alignment = MainAxisAlignment.start,
  }) : super(children: children);

  @override
  RenderFlowTags createRenderObject(BuildContext context) {
    return RenderFlowTags(
      horizontalSpacing: horizontalSpacing,
      verticalSpacing: verticalSpacing,
      alignment: alignment,
    );
  }

  @override
  void updateRenderObject(BuildContext context, RenderFlowTags renderObject) {
    renderObject
      ..horizontalSpacing = horizontalSpacing
      ..verticalSpacing = verticalSpacing
      ..alignment = alignment;
  }
}

// 2. ParentData — 记录每个子组件的位置
class FlowTagsParentData extends ContainerBoxParentData<RenderBox> {}

// 3. 核心：RenderObject 实现
class RenderFlowTags extends RenderBox
    with
        ContainerRenderObjectMixin<RenderBox, FlowTagsParentData>,
        RenderBoxContainerDefaultsMixin<RenderBox, FlowTagsParentData> {
  double horizontalSpacing;
  double verticalSpacing;
  MainAxisAlignment alignment;

  RenderFlowTags({
    required this.horizontalSpacing,
    required this.verticalSpacing,
    required this.alignment,
  });

  @override
  void setupParentData(RenderBox child) {
    if (child.parentData is! FlowTagsParentData) {
      child.parentData = FlowTagsParentData();
    }
  }

  @override
  void performLayout() {
    final maxWidth = constraints.maxWidth;
    double x = 0;
    double y = 0;
    double rowHeight = 0;

    // 遍历所有子组件
    RenderBox? child = firstChild;
    while (child != null) {
      // 让子组件自己测量大小
      child.layout(
        BoxConstraints(maxWidth: maxWidth),
        parentUsesSize: true,
      );

      // 换行判断
      if (x + child.size.width > maxWidth && x > 0) {
        x = 0;
        y += rowHeight + verticalSpacing;
        rowHeight = 0;
      }

      // 设置子组件位置
      final parentData = child.parentData as FlowTagsParentData;
      parentData.offset = Offset(x, y);

      x += child.size.width + horizontalSpacing;
      rowHeight = max(rowHeight, child.size.height);

      child = parentData.nextSibling;
    }

    // 设置自身大小
    size = Size(maxWidth, y + rowHeight);
  }

  @override
  void paint(PaintingContext context, Offset offset) {
    // 绘制所有子组件
    defaultPaint(context, offset);
  }

  @override
  bool hitTestChildren(BoxHitTestResult result, {required Offset position}) {
    return defaultHitTestChildren(result, position: position);
  }
}
```

### 使用方式

```dart
FlowTags(
  horizontalSpacing: 10,
  verticalSpacing: 10,
  children: [
    Chip(label: Text('Flutter')),
    Chip(label: Text('Dart')),
    Chip(label: Text('Widget')),
    Chip(label: Text('RenderObject')),
    Chip(label: Text('CustomPainter')),
    Chip(label: Text('Animation')),
  ],
)
```

---

## ⚡ 6. 性能优化：shouldRepaint 的正确姿势

### 常见错误

```dart
// ❌ 错误：总是返回 true，导致每帧都重绘
@override
bool shouldRepaint(covariant MyPainter oldDelegate) => true;

// ❌ 错误：总是返回 false，数据变了也不更新
@override
bool shouldRepaint(covariant MyPainter oldDelegate) => false;
```

### 正确做法

```dart
class ProgressPainter extends CustomPainter {
  final double progress;
  final Color color;

  ProgressPainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) { /* ... */ }

  // ✅ 正确：精确比较需要的属性
  @override
  bool shouldRepaint(covariant ProgressPainter oldDelegate) {
    return oldDelegate.progress != progress ||
           oldDelegate.color != color;
  }
}
```

### CustomPainter 性能最佳实践

| 做法 | 效果 |
|------|------|
| ✅ 精确实现 `shouldRepaint` | 避免不必要的重绘 |
| ✅ 用 `RepaintBoundary` 包裹 | 隔离重绘区域 |
| ✅ 提前创建 `Paint` 对象（构造函数中） | 避免每次 paint 都创建 |
| ✅ 复杂图形用 `Path` 缓存 | 避免每帧重新计算路径 |
| ❌ 在 `paint()` 中创建大量对象 | 触发 GC，导致卡顿 |
| ❌ 不加判断直接 `setState` | 全组件重建 |

---

## ✅ 本篇小结 Checklist

- [ ] 理解 Widget → Element → RenderObject 三棵树
- [ ] 掌握 Canvas 和 Paint 的核心 API
- [ ] 能用 CustomPainter 绘制自定义图形
- [ ] 实现过波浪进度条或环形图
- [ ] 知道什么场景需要 RenderObject
- [ ] 理解 `shouldRepaint` 的性能影响
- [ ] 能用 RenderObject 实现自定义布局

---

> **下一篇预告**：《Flutter 进阶实战（二）：复杂动画编排 — Hero + 物理引擎 + Rive 实战》——
> 从交错动画到物理模拟，再到 Rive 状态机集成，让你的 App 动起来。

---

*本文是「Flutter 进阶实战」系列第 1 篇，共 10 篇。*

---
*📝 作者：NIHoa ｜ 系列：Flutter进阶实战系列 ｜ 更新日期：2025-06-01*
