# 🐟 Flutter 页面分析：仿闲鱼首页的多 SliverAppBar + 瀑布流布局

Flutter | 页面分析系列

打开闲鱼首页，往上滑你会发现——顶部有好几层 Banner，其中有一层会"粘住"不动（吸顶），等你继续往下滑才能看到商品瀑布流。这种布局在电商/二手类 App 里非常常见，但用普通的 `ListView` 或 `Column` 根本做不出来。

关键词就一个：**CustomScrollView + Sliver 家族**。

---

## 🔍 1. 页面结构拆解

```
Scaffold
├── AppBar（普通 AppBar，标题"闲鱼首页示例"）
└── Body: CustomScrollView
    ├── SliverAppBar 1（橙色背景，可折叠）
    ├── SliverAppBar 2（黄色背景，可折叠）
    ├── SliverAppBar 3（绿色背景，pinned: true → 吸顶）
    └── SliverGrid（2列瀑布流，30个色块 Item）
```

4 个 Sliver 串在一起，共享同一个滚动上下文——这是 `CustomScrollView` 存在的全部意义。

---

## 🧩 2. 关键选型解析

### 为什么不用 ListView + Column？

你可能想过这样写：

```dart
// ❌ 这样写行不通
ListView(
  children: [
    Container(height: 200, color: Colors.orange),  // 头图1
    Container(height: 200, color: Colors.yellow),   // 头图2
    GridView.builder(...)  // 商品列表
  ],
)
```

问题在哪？`GridView` 放在 `ListView` 里面，两个可滚动控件嵌套，手指在 GridView 区域滑的时候，到底是外面的 ListView 滚还是里面的 GridView 滚？Flutter 处理不了这种歧义。

即使你加了 `shrinkWrap: true` + `NeverScrollableScrollPhysics()` 强行压平，GridView 会一次性把 30 个 Item 全创建出来——因为它"不知道"自己的可视区域有多大。

| 方案 | 滚动冲突 | 懒加载 | 吸顶支持 |
|------|---------|--------|---------|
| ListView + GridView | ❌ 嵌套冲突 | ❌ 全量创建 | ❌ 不支持 |
| CustomScrollView + Slivers | ✅ 统一滚动 | ✅ 按需创建 | ✅ pinned |

### SliverAppBar 的三种行为

代码里用了 3 个 `SliverAppBar`，前两个没加任何参数，第三个加了 `pinned: true`：

```dart
// 前两个：向上滑动时会被完全推走
const SliverAppBar(
  flexibleSpace: FlexibleSpaceBar(
    title: Text('AppBar 1'),
    background: ColoredBox(color: Colors.orange),
  ),
),

// 第三个：吸顶——推到顶部时不再继续上移
const SliverAppBar(
  pinned: true,  // ← 就这一个参数
  flexibleSpace: FlexibleSpaceBar(
    title: Text('AppBar 3 吸顶效果'),
    background: ColoredBox(color: Colors.green),
  ),
),
```

`SliverAppBar` 有三个常用的布尔参数，行为完全不同：

| 参数 | 效果 |
|------|------|
| `pinned: true` | 滑到顶后"钉住"不动，继续展示 |
| `floating: true` | 往下滑时立刻出现，不用滑回顶部 |
| `snap: true`（配合 floating） | 出现/隐藏不会停在一半，自动弹到完整状态 |

闲鱼那种频道 Tab 栏就是用 `pinned: true` 做的——滚多远它都钉在那里。

---

## ⚙️ 3. SliverGrid 的参数解读

```dart
SliverGrid(
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,         // 每行 2 列
    crossAxisSpacing: 10,      // 列间距
    mainAxisSpacing: 10,       // 行间距
    childAspectRatio: 0.7,     // 宽高比（0.7 = 高比宽大）
  ),
  delegate: SliverChildBuilderDelegate(
    (context, index) {
      return ColoredBox(
        color: Colors.primaries[index % Colors.primaries.length],
        child: Center(child: Text('Item $index')),
      );
    },
    childCount: 30,
  ),
),
```

`childAspectRatio: 0.7` 这个值很重要——它决定了每个商品卡片的高度。0.7 意味着高度 = 宽度 / 0.7 ≈ 1.43 倍宽度，是竖版卡片的常见比例。

`SliverChildBuilderDelegate` 是懒加载的，只有即将进入可视区域的 Item 才会被创建。30 个 Item，屏幕上可能同时只有 6 个被 build——这就是 Sliver 的性能优势。

### 颜色循环的小技巧

```dart
Colors.primaries[index % Colors.primaries.length]
```

`Colors.primaries` 是 Flutter 内置的 18 种主色数组，取模循环后每个 Item 都不一样。做 Demo 的时候很好用，不用自己定义调色板。

---

## 💻 4. 从 Demo 到真实闲鱼首页，还差什么？

当前代码是最小可运行的骨架，真正的闲鱼首页还需要：

**头部区域：**
- `SliverAppBar 1` → 搜索框 + Banner 轮播图
- `SliverAppBar 2` → 金刚区（图标入口矩阵）
- `SliverAppBar 3`（pinned）→ 频道 TabBar（推荐 / 关注 / 同城）

**商品列表：**
- 把 `SliverGrid` 换成 `SliverMasonryGrid`（来自 `flutter_staggered_grid_view`），支持不等高瀑布流
- 每个 Item 换成商品卡片（图片 + 标题 + 价格 + 头像）
- 加上下拉刷新（`RefreshIndicator`）和上拉加载

**代码结构：**
- 抽取各个 Sliver 为独立 Widget
- 商品数据接入 Riverpod 管理

---

## 🚀 5. 性能要点

**不要给 SliverGrid 加 shrinkWrap**

`SliverGrid` 不需要 `shrinkWrap`——它已经在 `CustomScrollView` 里了，滚动行为由 CustomScrollView 统一管理。加了反而会破坏懒加载。

**const 修饰**

三个 `SliverAppBar` 都加了 `const`，因为它们的内容在编译期就确定了。如果内容是动态的（比如从接口拿），去掉 `const`，但子 Widget 尽量保留。

**ColoredBox vs Container**

代码里用了 `ColoredBox` 而不是 `Container(color: ...)`。`ColoredBox` 是更轻量的选择——只做一件事（上色），不带 padding、margin 等额外属性的开销。

---

## 💡 6. 延伸思考

- 如果 SliverAppBar 里放一个 `TabBar`，`TabBarView` 应该怎么和 `CustomScrollView` 配合？（提示：`SliverFillRemaining` 或 `NestedScrollView`）
- 除了 `SliverGrid`，还有哪些 Sliver？`SliverList`、`SliverToBoxAdapter`、`SliverPersistentHeader` 分别适合什么场景？
- 怎样实现"滑到商品列表时，频道 Tab 自动切换"的联动效果？

---

## 📝 小结

- [x] 多区域联动滚动用 `CustomScrollView` + Sliver 家族，不要用 ListView 嵌套 GridView
- [x] `pinned: true` 让 SliverAppBar 吸顶，`floating: true` 让它下拉时快速出现
- [x] `SliverChildBuilderDelegate` 是懒加载的，只创建可视区域内的 Item
- [x] `childAspectRatio` 控制网格 Item 的宽高比，竖版卡片常用 0.7
- [x] 用 `ColoredBox` 替代 `Container(color: ...)`，更轻量

> 闲鱼首页看起来复杂，拆开其实就是"几个 SliverAppBar + 一个 SliverGrid"。搞懂 Sliver 系统，电商首页想怎么拼就怎么拼。

---

好了，本期内容到这里，感兴趣的话欢迎点赞、在看，我们下期见！Bye~

**标签**：`#Flutter` `#CustomScrollView` `#SliverAppBar` `#SliverGrid` `#闲鱼首页`


*📝 作者：NIHoa ｜ 系列：Flutter页面分析专栏 ｜ 更新日期：2025-04-10*
