# ✨ Flutter 动画从零到炫酷：让你的 App 动起来

> 同样的功能，加上动画后用户好感度提升 60%。Flutter 内置了**完整的动画引擎**，
> 从简单的淡入淡出到复杂的交错动画，甚至物理弹簧效果 — 全都开箱即用。

**本文目标**：从最简单的隐式动画开始，逐步进阶到显式动画、Hero 动画、交错动画，
最后用 Lottie 实现设计师级别的炫酷效果。每个知识点都有**可运行的完整代码**。

---

## 📊 Flutter 动画体系总览

| 层级 | 类型 | 难度 | 典型场景 | 代表 Widget |
|------|------|------|---------|------------|
| 1️⃣ | 隐式动画 | ⭐ | 颜色渐变、尺寸变化、透明度 | `AnimatedContainer` / `AnimatedOpacity` |
| 2️⃣ | 显式动画 | ⭐⭐ | 循环旋转、自定义曲线、序列动画 | `AnimationController` + `Tween` |
| 3️⃣ | Hero 动画 | ⭐⭐ | 页面转场、图片放大 | `Hero` |
| 4️⃣ | 交错动画 | ⭐⭐⭐ | 列表项依次入场、引导页 | `Interval` + `Stagger` |
| 5️⃣ | 物理动画 | ⭐⭐⭐ | 弹簧效果、惯性滑动 | `SpringSimulation` / `physics` |
| 6️⃣ | Lottie | ⭐⭐ | 设计师级复杂动画 | `lottie` 包 |

---

## 🎯 1. 隐式动画：最简单的动画方式

> 隐式动画 = 你只需要改变目标值，Flutter 自动帮你补间过渡。
> **零学习成本**，适合 90% 的 UI 动效需求。

### AnimatedContainer — 万能隐式动画

```dart
class AnimatedBox extends StatefulWidget {
  const AnimatedBox({super.key});

  @override
  State<AnimatedBox> createState() => _AnimatedBoxState();
}

class _AnimatedBoxState extends State<AnimatedBox> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => _expanded = !_expanded),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOutCubic,     // 缓动曲线
        width: _expanded ? 300 : 150,      // 宽度动画
        height: _expanded ? 200 : 100,     // 高度动画
        decoration: BoxDecoration(
          color: _expanded ? Colors.indigo : Colors.teal,  // 颜色动画
          borderRadius: BorderRadius.circular(
            _expanded ? 24 : 12,           // 圆角动画
          ),
          boxShadow: [
            BoxShadow(
              color: (_expanded ? Colors.indigo : Colors.teal).withValues(alpha: 0.4),
              blurRadius: _expanded ? 20 : 8,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Center(
          child: Text(
            _expanded ? '收起 ↑' : '展开 ↓',
            style: const TextStyle(color: Colors.white, fontSize: 16),
          ),
        ),
      ),
    );
  }
}
```

### 常用隐式动画 Widget 速查

| Widget | 动画属性 | 用途 |
|--------|---------|------|
| `AnimatedContainer` | 尺寸、颜色、边距、圆角、阴影 | 万能容器动画 |
| `AnimatedOpacity` | `opacity` | 淡入/淡出 |
| `AnimatedScale` | `scale` | 缩放 |
| `AnimatedRotation` | `turns` | 旋转 |
| `AnimatedSlide` | `offset` | 滑动位移 |
| `AnimatedAlign` | `alignment` | 对齐位置变化 |
| `AnimatedPadding` | `padding` | 内边距变化 |
| `AnimatedCrossFade` | 两个子 Widget 交叉切换 | 内容切换 |
| `AnimatedSwitcher` | 子 Widget 替换时自动过渡 | 任意内容切换 |
| `AnimatedDefaultTextStyle` | 字号、颜色、粗细 | 文字样式变化 |

### AnimatedSwitcher — 内容切换动画

```dart
AnimatedSwitcher(
  duration: const Duration(milliseconds: 300),
  transitionBuilder: (child, animation) {
    return FadeTransition(
      opacity: animation,
      child: ScaleTransition(scale: animation, child: child),
    );
  },
  child: Text(
    '$_count',
    key: ValueKey<int>(_count),  // key 变化才触发动画
    style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
  ),
)
```

---

## 🎡 2. 显式动画：完全掌控每一帧

> 当隐式动画满足不了需求（循环、反复、自定义曲线），就需要显式动画。

### AnimationController 核心三件套

```
AnimationController（控制器）→ 决定时间和控制
      ↓
Tween（补间）→ 定义值的起止范围
      ↓
Widget（渲染）→ 用动画值构建 UI
```

### 脉冲呼吸灯效果

```dart
class PulsingDot extends StatefulWidget {
  const PulsingDot({super.key});

  @override
  State<PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<PulsingDot>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;
  late final Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,  // 绑定帧回调，节省 GPU
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    _opacityAnimation = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );

    _controller.repeat(reverse: true);  // 无限循环，自动反向
  }

  @override
  void dispose() {
    _controller.dispose();  // ⚠️ 必须释放，否则内存泄漏！
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Opacity(
            opacity: _opacityAnimation.value,
            child: Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.green.withValues(alpha: 0.6),
                    blurRadius: 12 * _scaleAnimation.value,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
```

### 常用缓动曲线

| 曲线 | 效果 | 适用场景 |
|------|------|---------|
| `Curves.linear` | 匀速 | 进度条 |
| `Curves.easeInOut` | 慢-快-慢 | 通用过渡 |
| `Curves.easeOutCubic` | 快速减速 | 弹窗弹出 |
| `Curves.easeInBack` | 先后退再前进 | 强调出场 |
| `Curves.elasticOut` | 弹簧抖动 | 趣味反馈 |
| `Curves.bounceOut` | 落地弹跳 | 下落效果 |

---

## 🦸 3. Hero 动画：页面转场魔法

> `Hero` 让同一个 Widget 在两个页面间**无缝飞行**，最适合图片预览和详情页转场。

```dart
// 列表页 — 商品卡片
class ProductCard extends StatelessWidget {
  final Product product;
  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ProductDetailPage(product: product),
        ),
      ),
      child: Hero(
        tag: 'product-${product.id}',  // 两端 tag 必须一致！
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.network(product.image, height: 180, fit: BoxFit.cover),
        ),
      ),
    );
  }
}

// 详情页 — 大图
class ProductDetailPage extends StatelessWidget {
  final Product product;
  const ProductDetailPage({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Hero(
            tag: 'product-${product.id}',  // 与列表页 tag 一致
            child: Image.network(
              product.image,
              width: double.infinity,
              height: 300,
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(product.name, style: const TextStyle(fontSize: 24)),
          ),
        ],
      ),
    );
  }
}
```

---

## 🎭 4. 交错动画：列表项依次入场

```dart
class StaggeredList extends StatefulWidget {
  final List<String> items;
  const StaggeredList({super.key, required this.items});

  @override
  State<StaggeredList> createState() => _StaggeredListState();
}

class _StaggeredListState extends State<StaggeredList>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 200 * widget.items.length + 400),
      vsync: this,
    );
    _controller.forward();  // 页面进入时播放
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: widget.items.length,
      itemBuilder: (context, index) {
        // 每个 item 有自己的时间窗口
        final start = index * 0.1;
        final end = start + 0.4;

        final slideAnimation = Tween<Offset>(
          begin: const Offset(0.5, 0),  // 从右侧滑入
          end: Offset.zero,
        ).animate(CurvedAnimation(
          parent: _controller,
          curve: Interval(start.clamp(0, 1), end.clamp(0, 1), curve: Curves.easeOutCubic),
        ));

        final fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(
            parent: _controller,
            curve: Interval(start.clamp(0, 1), end.clamp(0, 1)),
          ),
        );

        return SlideTransition(
          position: slideAnimation,
          child: FadeTransition(
            opacity: fadeAnimation,
            child: Card(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              child: ListTile(
                leading: CircleAvatar(child: Text('${index + 1}')),
                title: Text(widget.items[index]),
              ),
            ),
          ),
        );
      },
    );
  }
}
```

---

## 🎬 5. Lottie 动画：设计师级别的视觉效果

```yaml
# pubspec.yaml
dependencies:
  lottie: ^3.1.0
```

```dart
// 从网络加载 Lottie 动画
Lottie.network(
  'https://assets.lottiefiles.com/packages/lf20_success.json',
  width: 200,
  height: 200,
  repeat: false,  // 只播放一次
)

// 从本地资源加载
Lottie.asset(
  'assets/animations/loading.json',
  width: 120,
  height: 120,
)

// 控制播放（配合 AnimationController）
class LottieDemo extends StatefulWidget {
  @override
  State<LottieDemo> createState() => _LottieDemoState();
}

class _LottieDemoState extends State<LottieDemo>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        _controller.reset();
        _controller.forward();  // 点击播放一次
      },
      child: Lottie.asset(
        'assets/animations/like.json',
        controller: _controller,
        onLoaded: (composition) {
          _controller.duration = composition.duration;
        },
      ),
    );
  }
}
```

---

## 🧩 6. 实用动画模式速查

### 页面转场动画

```dart
// 自定义页面转场
Navigator.push(context, PageRouteBuilder(
  pageBuilder: (_, animation, __) => DetailPage(),
  transitionsBuilder: (_, animation, __, child) {
    return FadeTransition(
      opacity: animation,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.1),
          end: Offset.zero,
        ).animate(CurvedAnimation(
          parent: animation,
          curve: Curves.easeOutCubic,
        )),
        child: child,
      ),
    );
  },
  transitionDuration: const Duration(milliseconds: 400),
));
```

### 骨架屏闪烁效果

```dart
class ShimmerEffect extends StatefulWidget {
  final double width;
  final double height;
  const ShimmerEffect({super.key, required this.width, required this.height});

  @override
  State<ShimmerEffect> createState() => _ShimmerEffectState();
}

class _ShimmerEffectState extends State<ShimmerEffect>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (_, __) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            gradient: LinearGradient(
              begin: Alignment(-1.0 + 2.0 * _controller.value, 0),
              end: Alignment(-0.5 + 2.0 * _controller.value, 0),
              colors: const [
                Color(0xFF1E293B),
                Color(0xFF334155),
                Color(0xFF1E293B),
              ],
            ),
          ),
        );
      },
    );
  }
}
```

---

## 💉 7. 动画性能优化

| 错误 | 后果 | 修复 |
|-----|------|------|
| 动画中重建整个 Widget 树 | 帧率暴跌 | 用 `AnimatedBuilder` 精确重建动画部分 |
| 忘记 `dispose()` Controller | 内存泄漏 | `dispose()` 中调用 `_controller.dispose()` |
| 无节制使用 `Opacity` Widget | GPU 离屏渲染 | 简单场景用 `FadeTransition`，或设 `alwaysIncludeSemantics` |
| 同时运行 20+ 动画 | 主线程卡顿 | 控制同屏动画数量，离屏元素停止动画 |
| 使用 `setState` 驱动高频动画 | 整个 Widget 重建 | 用 `AnimationController` + `AnimatedBuilder` |

---

## ✅ Flutter 动画 Checklist

### 入门必会
- [ ] 掌握 `AnimatedContainer` 基本用法
- [ ] 会用 `AnimatedOpacity` / `AnimatedScale` 做简单过渡
- [ ] 理解 `duration` 和 `curve` 的作用

### 进阶技能
- [ ] 掌握 `AnimationController` + `Tween` 显式动画
- [ ] 会用 `Hero` 做页面转场动画
- [ ] 能实现交错动画（列表入场）
- [ ] 集成 Lottie 动画

### 性能优化
- [ ] 养成 `dispose()` Controller 的习惯
- [ ] 使用 `AnimatedBuilder` 减少重建范围
- [ ] 用 Flutter DevTools 检查帧率

---

> 动画不是锦上添花，而是**用户体验的基础设施**。
> 一个按钮点击后没有反馈，用户会怀疑"点到了吗？"；
> 一个页面切换没有过渡，用户会感觉"卡了一下"。
> **好的动画让用户感觉不到动画的存在 — 一切都自然流畅。**
