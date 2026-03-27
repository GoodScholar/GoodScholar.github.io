---
date: 2025-04-09
tags:
  - Flutter
  - oktoast
  - Toast
  - 动画
  - 工具类封装
---
# 🍞 Flutter 页面分析：手把手封装一个有动画的 Toast 工具类

Flutter | 页面分析系列

Toast 这个东西，官方没有内置——`SnackBar` 太重，需要 `context`；`showDialog` 又不够轻量。于是大家都去找第三方库，`oktoast` 是其中用起来最顺手的一个。

但直接用 `oktoast` 的 API 每次都要传一堆参数，这期来聊聊怎么在它上面封一层好用的工具类，顺便加上自定义动画。

---

## 🔍 1. 整体结构拆解

这个工具类分两层：

```
ToastUtil（对外 API 层）
├── showTop()     → 顶部滑入
├── showBottom()  → 底部上滑
├── showCenter()  → 居中淡入
├── showSuccess() → 封装 showCenter，绿色+勾
├── showError()   → 封装 showCenter，红色+叹号
└── showInfo()    → 封装 showCenter，蓝色+信息

动画组件层（私有，外部不可访问）
├── _SlideToast       → 滑入动画，顶部/底部通用
└── _FadeCenterToast  → 淡入淡出，居中专用
```

对外只暴露 6 个静态方法，动画实现全部收在私有 Widget 里，调用方完全不用关心下面怎么动的。

---

## 🧩 2. 关键设计解析

### 为什么不直接用 oktoast 的 showToast？

`oktoast` 自带的 `showToast()` 是纯文字，只能改文字颜色和背景色，没有动画。如果想要滑入效果，得用 `showToastWidget()`——传进去一个自定义 Widget，动画自己控制。

这也是这个工具类的核心：不用 `showToast`，全部用 `showToastWidget`。

### duration 的计算方式

这里有个细节，`oktoast` 的 `duration` 参数是整个 Toast 的存活时间（包含动画时间），所以得这样算：

```dart
duration: Duration(
  milliseconds: 300 + duration.inMilliseconds + 400,
),
```

- **300ms**：入场动画时长
- **stayDuration**：停留时间（用户传入的）
- **400ms**：退场动画时长

如果直接把 `stayDuration` 传给 `duration`，Toast 会在动画还没播完就被 oktoast 强制移除。我最开始就这么写，Toast 一闪而过，找了半小时才发现。

### double 秒的支持

停留时间用的是 `double?` 而不是 `int`，所以你可以传 `1.5`（秒）：

```dart
Duration(milliseconds: ((staySeconds ?? 2) * 1000).toInt())
```

`Duration` 构造函数只接受整数，直接传 double 会报错，得先乘以 1000 再 `toInt()`。

### dismissOtherToast: true

这个参数让同一时间只存在一个 Toast。连续触发两次，第一个会被立刻移除换成第二个。不加的话两个 Toast 会叠在一起，像 bug 一样。

---

## ⚙️ 3. 动画实现详解

### 滑入动画（_SlideToast）

顶部和底部共用一个 Widget，用 `isTop` 区分方向：

```dart
_offset = Tween<Offset>(
  begin: widget.isTop ? const Offset(0, -1) : const Offset(0, 1),
  end: Offset.zero,
).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic));
```

`Offset(0, -1)` 表示从上方一个 Widget 高度的距离滑入，`Offset(0, 1)` 是从下方滑入。`easeOutCubic` 的缓动曲线让动画开头快、结尾慢，感觉自然不生硬。

进场之后等待 `stayDuration`，然后反向播放退场：

```dart
_controller.forward().then((_) async {
  await Future<dynamic>.delayed(widget.stayDuration);
  if (mounted) await _controller.reverse(); // ← mounted 检查，不能少
});
```

`mounted` 检查很重要——如果 Toast 还没退场就被 `dismissOtherToast` 强制移除了，Widget 已经卸载，这时候再调 `_controller.reverse()` 会报错。

### 渐隐效果

`_SlideToast` 同时叠了一层 `FadeTransition`，复用同一个 `_controller`：

```dart
FadeTransition(
  opacity: _controller,
  child: SlideTransition(
    position: _offset,
    child: ...,
  ),
)
```

入场时透明度从 0→1，退场时 1→0，滑动和渐变同步进行，视觉更顺。居中的 `_FadeCenterToast` 没有位移，只有 `FadeTransition`，更低调。

---

## 💻 4. 完整使用方式

**第一步：在 `main.dart` 包裹 OKToast**

```dart
void main() {
  runApp(
    OKToast( // ← 必须在最外层包裹
      child: MyApp(),
    ),
  );
}
```

不包裹的话调用任何方法都会直接崩。

**第二步：随处调用，不需要 context**

```dart
// 基础用法
ToastUtil.showTop('已复制到剪贴板');
ToastUtil.showBottom('网络请求失败，请重试');

// 语义化接口（推荐）
ToastUtil.showSuccess('保存成功');
ToastUtil.showError('上传失败，请检查网络');
ToastUtil.showInfo('版本已是最新');

// 自定义停留时间
ToastUtil.showSuccess('操作完成', staySeconds: 3.5);

// 自定义颜色和图标
ToastUtil.showBottom(
  '新消息',
  background: Colors.purple.shade700,
  icon: Icons.notifications_outlined,
);
```

---

## 🚀 5. 性能 & 实现要点

**SafeArea 的使用**

`_SlideToast` 外层包了 `SafeArea`，保证在有刘海/挖孔的机型上 Toast 不会被遮住。居中的 `_FadeCenterToast` 不需要，因为居中不会贴边。

**Row + mainAxisSize.min**

内容区用的是 `Row(mainAxisSize: MainAxisSize.min, ...)`，Toast 的宽度跟着内容走，不会撑满全屏。如果文字很长，外层的 `Flexible` 会让文字自动换行而不是溢出。

**BoxShadow 增加立体感**

```dart
boxShadow: const [
  BoxShadow(
    color: Colors.black26,
    blurRadius: 8,
    offset: Offset(0, 3),
  ),
],
```

加了一个微弱的向下阴影，Toast 有"悬浮"的感觉，不会和背景混在一起。这个细节成本几乎为零，但视觉提升很明显。

---

## 💡 6. 延伸思考

- 现在 Toast 是全局单例管理的，如果需要同时展示多个 Toast 怎么改？
- 动画曲线换成 `Curves.elasticOut` 会有什么效果，适合什么场景？
- 如果要加上"可以点击关闭"的 Toast，需要在哪里改？

---

## 📝 小结

- [x] `showToastWidget` 而不是 `showToast`，才能完全自定义 Widget 和动画
- [x] `duration` = 入场时长 + 停留时长 + 退场时长，算错了 Toast 会闪退
- [x] `stayDuration` 用 `double` 传入秒，换算成毫秒时记得 `toInt()`
- [x] `mounted` 检查不能省，`await` 之后 Widget 可能已经卸载
- [x] `dismissOtherToast: true` 避免多个 Toast 叠加
- [x] `OKToast` 包裹在 `runApp` 最外层，少了这步必崩

> 封工具类的核心思路：让调用方只需要一行代码，所有细节都收在工具类里自己处理。`ToastUtil.showSuccess('成功')` 比 `showToastWidget(_FadeCenterToast(...), ...)` 好用太多了。

---

好了，本期内容到这里，感兴趣的话欢迎点赞、在看，我们下期见！Bye~

**标签**：`#Flutter` `#oktoast` `#Toast` `#动画` `#工具类封装`


*📝 作者：NIHoa ｜ 系列：Flutter页面分析专栏 ｜ 更新日期：2025-04-09*
