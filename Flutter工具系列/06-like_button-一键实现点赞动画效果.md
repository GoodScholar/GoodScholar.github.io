---
date: 2025-04-06
tags:
  - Flutter
  - 点赞动画
  - like_button
  - 交互动画
---
# Flutter | 第6期 - like_button：一键实现点赞动画效果

本期为大家分享如何在 Flutter 中快速实现带动画效果的点赞按钮，用 like_button 一行代码就能拥有类似 Twitter 的心形动画，感兴趣的话和我一起来探索一下呗~

---

### 首先，什么是 like_button？

在社交类 App 中，「点赞」几乎是标配交互 —— 文章点赞、评论点赞、商品收藏等场景无处不在。一个带有精美动画的点赞按钮，能极大提升用户的交互体验。

▪️ **心形动画**：点赞时带有类似 Twitter 的弹跳缩放效果
▪️ **气泡扩散**：周围散出彩色气泡粒子，视觉反馈强烈
▪️ **圆圈扩展**：点赞瞬间的光圈扩散效果
▪️ **计数动画**：点赞数变化时带有平滑的数字滚动动画
▪️ **高度可定制**：图标、颜色、大小、动画时长均可自定义

---

## 插件选型

| 插件 | 核心特点 | 对比 |
|------|---------|------|
| like_button | 开箱即用，动画效果丰富，FlutterCandies 团队维护 | ✅ 轻量、美观、API 简洁 |
| flutter_animated_button | 通用动画按钮 | ⚠️ 更通用但非专门为点赞设计 |
| 自己实现 AnimationController | 完全自定义动画 | ⚠️ 灵活但开发成本较高 |

**本期选择 like_button 进行演示。** 它由 FlutterCandies 开源社区维护，支持全平台（Android、iOS、Web、macOS、Windows、Linux），Pub.dev 上拥有 1.4k+ 的 likes。

---

## 基础集成

### 添加依赖

1️⃣ 在 `pubspec.yaml` 中添加依赖：

```yaml
dependencies:
  like_button: ^2.1.0
```

2️⃣ 运行安装命令：

```bash
flutter pub get
```

3️⃣ 导入包：

```dart
import 'package:like_button/like_button.dart';
```

> **Tips**：like_button 是纯 Dart 实现的，不依赖任何原生代码，所以**不需要任何平台配置**，开箱即用！

---

## 核心代码

### 最简用法 —— 一行搞定

```dart
// 默认就是一个红色心形点赞按钮，自带动画
LikeButton()
```

就这一行代码，你就拥有了一个带有完整动画效果的点赞按钮：心形图标 + 弹跳动画 + 气泡扩散 + 圆圈光效。

---

### 完整示例页面

下面是一个包含多种点赞按钮样式的完整示例：

```dart
import 'package:flutter/material.dart';
import 'package:like_button/like_button.dart';

class LikeButtonDemo extends StatelessWidget {
  const LikeButtonDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('点赞按钮演示')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // 1️⃣ 默认样式
            const Text('默认样式', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            LikeButton(size: 40),
            const SizedBox(height: 40),

            // 2️⃣ 带计数
            const Text('带点赞计数', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            LikeButton(
              size: 40,
              likeCount: 666,
            ),
            const SizedBox(height: 40),

            // 3️⃣ 自定义图标和颜色
            const Text('自定义样式', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            LikeButton(
              size: 40,
              circleColor: const CircleColor(
                start: Color(0xff00ddff),
                end: Color(0xff0099cc),
              ),
              bubblesColor: const BubblesColor(
                dotPrimaryColor: Color(0xff33b5e5),
                dotSecondaryColor: Color(0xff0099cc),
              ),
              likeBuilder: (bool isLiked) {
                return Icon(
                  Icons.thumb_up,
                  color: isLiked ? Colors.blue : Colors.grey,
                  size: 40,
                );
              },
              likeCount: 520,
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 动画分解

点赞按钮在触发时，会同时播放三层动画效果：

```
用户点击按钮
    ↓
① 图标动画（Icon Animation）
    ├── 缩小至 0 → 弹跳放大到目标尺寸
    └── 颜色从灰色变为红色（或自定义颜色）
    ↓
② 圆圈动画（Circle Animation）
    ├── 从中心向外扩展
    └── 颜色从 start 渐变到 end
    ↓
③ 气泡动画（Bubbles Animation）
    ├── 多个彩色圆点从中心向外扩散
    └── 逐渐缩小并消失
    ↓
④ 计数动画（Count Animation）
    ├── 旧数字向上滑出
    └── 新数字从下方滑入
```

---

## 常用参数详解

### 基础参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | `double` | 30.0 | 点赞图标的大小 |
| `isLiked` | `bool?` | false | 初始点赞状态（null 时每次点击都触发动画） |
| `likeCount` | `int?` | null | 点赞数（null 时不显示计数） |
| `animationDuration` | `Duration` | 1000ms | 动画持续时间 |

### 动画效果参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `bubblesSize` | `double` | size * 2.0 | 气泡扩散的总大小 |
| `bubblesColor` | `BubblesColor` | 橙红色系 | 气泡颜色（支持4种颜色交替） |
| `circleSize` | `double` | size * 0.8 | 圆圈的最终大小 |
| `circleColor` | `CircleColor` | 红→黄渐变 | 圆圈颜色（start → end 渐变） |

### 自定义构建器

| 参数 | 类型 | 说明 |
|------|------|------|
| `likeBuilder` | `Widget Function(bool isLiked)` | 自定义点赞图标 |
| `countBuilder` | `Widget Function(int count, bool isLiked, String text)` | 自定义计数样式 |

### 计数相关参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `likeCountAnimationDuration` | `Duration` | 500ms | 计数变化动画时长 |
| `likeCountAnimationType` | `LikeCountAnimationType` | part | 计数动画类型（none/part/all） |
| `likeCountPadding` | `EdgeInsets` | left: 3.0 | 计数的内边距 |
| `countPostion` | `CountPostion` | right | 计数显示位置（top/right/bottom/left） |
| `countDecoration` | `Decoration?` | null | 计数区域装饰 |

---

## 进阶：常见应用场景

### 场景一：搭配网络请求（乐观更新）

点赞按钮最常见的场景是配合后端 API 使用。`onTap` 回调是异步的，可以在里面发送请求：

```dart
LikeButton(
  isLiked: false,
  likeCount: 999,
  onTap: (bool isLiked) async {
    // 发送点赞/取消点赞请求
    final bool success = await postLikeRequest(itemId: '123');

    // 返回新的点赞状态
    // 成功 → 切换状态；失败 → 保持原状态（动画自动回滚）
    return success ? !isLiked : isLiked;
  },
)
```

> **亮点**：like_button 内置了「乐观更新 + 失败回滚」机制。点击后立即播放动画，如果 `onTap` 返回的状态与动画方向不一致，会自动回滚到原始状态，用户体验极佳。

### 场景二：自定义图标（收藏/点赞/关注）

```dart
// 收藏按钮 ⭐
LikeButton(
  size: 36,
  likeBuilder: (bool isLiked) {
    return Icon(
      isLiked ? Icons.star : Icons.star_border,
      color: isLiked ? Colors.amber : Colors.grey,
      size: 36,
    );
  },
)

// 点赞按钮 👍
LikeButton(
  size: 36,
  likeBuilder: (bool isLiked) {
    return Icon(
      Icons.thumb_up,
      color: isLiked ? Colors.blue : Colors.grey,
      size: 36,
    );
  },
)

// 关注按钮（使用文字）
LikeButton(
  size: 50,
  bubblesColor: const BubblesColor(
    dotPrimaryColor: Color(0xFFFF6B6B),
    dotSecondaryColor: Color(0xFFFF8E8E),
  ),
  likeBuilder: (bool isLiked) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: isLiked ? Colors.red : Colors.grey[200],
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        isLiked ? '已关注' : '关注',
        style: TextStyle(
          color: isLiked ? Colors.white : Colors.black87,
          fontSize: 14,
        ),
      ),
    );
  },
)
```

### 场景三：自定义气泡颜色（品牌色适配）

```dart
// 蓝色系（适合科技类 App）
LikeButton(
  size: 40,
  circleColor: const CircleColor(
    start: Color(0xFF2196F3),
    end: Color(0xFF64B5F6),
  ),
  bubblesColor: const BubblesColor(
    dotPrimaryColor: Color(0xFF42A5F5),
    dotSecondaryColor: Color(0xFF1E88E5),
    dotThirdColor: Color(0xFF1565C0),
    dotLastColor: Color(0xFF0D47A1),
  ),
)

// 绿色系（适合健康/环保类 App）
LikeButton(
  size: 40,
  circleColor: const CircleColor(
    start: Color(0xFF4CAF50),
    end: Color(0xFF81C784),
  ),
  bubblesColor: const BubblesColor(
    dotPrimaryColor: Color(0xFF66BB6A),
    dotSecondaryColor: Color(0xFF43A047),
    dotThirdColor: Color(0xFF2E7D32),
    dotLastColor: Color(0xFF1B5E20),
  ),
)
```

### 场景四：自定义计数样式

```dart
LikeButton(
  size: 40,
  likeCount: 1024,
  countBuilder: (int? count, bool isLiked, String text) {
    final color = isLiked ? Colors.redAccent : Colors.grey;
    // count 为 0 时显示 "赞"
    if (count == 0) {
      return Text('赞', style: TextStyle(color: color, fontSize: 14));
    }
    // 大数字格式化
    String displayText = text;
    if (count != null && count >= 10000) {
      displayText = '${(count / 10000).toStringAsFixed(1)}w';
    } else if (count != null && count >= 1000) {
      displayText = '${(count / 1000).toStringAsFixed(1)}k';
    }
    return Text(
      displayText,
      style: TextStyle(color: color, fontSize: 14),
    );
  },
  // 计数显示在底部
  countPostion: CountPostion.bottom,
)
```

---

## 封装建议

在实际项目中，建议将常用的点赞按钮样式封装为通用组件：

```dart
class AppLikeButton extends StatelessWidget {
  const AppLikeButton({
    super.key,
    required this.isLiked,
    required this.likeCount,
    required this.onTap,
    this.size = 30,
    this.iconType = LikeIconType.heart,
  });

  final bool isLiked;
  final int likeCount;
  final Future<bool?> Function(bool isLiked) onTap;
  final double size;
  final LikeIconType iconType;

  @override
  Widget build(BuildContext context) {
    return LikeButton(
      size: size,
      isLiked: isLiked,
      likeCount: likeCount,
      onTap: onTap,
      likeBuilder: (bool isLiked) {
        return Icon(
          _getIcon(isLiked),
          color: _getColor(isLiked),
          size: size,
        );
      },
      countBuilder: (int? count, bool isLiked, String text) {
        return Text(
          _formatCount(count),
          style: TextStyle(
            color: isLiked ? _getColor(true) : Colors.grey,
            fontSize: size * 0.4,
          ),
        );
      },
      likeCountAnimationType: LikeCountAnimationType.part,
    );
  }

  /// 根据类型获取图标
  IconData _getIcon(bool isLiked) {
    switch (iconType) {
      case LikeIconType.heart:
        return isLiked ? Icons.favorite : Icons.favorite_border;
      case LikeIconType.thumb:
        return Icons.thumb_up;
      case LikeIconType.star:
        return isLiked ? Icons.star : Icons.star_border;
    }
  }

  /// 根据类型获取颜色
  Color _getColor(bool isLiked) {
    if (!isLiked) return Colors.grey;
    switch (iconType) {
      case LikeIconType.heart:
        return Colors.redAccent;
      case LikeIconType.thumb:
        return Colors.blue;
      case LikeIconType.star:
        return Colors.amber;
    }
  }

  /// 格式化大数字
  String _formatCount(int? count) {
    if (count == null || count == 0) return '0';
    if (count >= 10000) return '${(count / 10000).toStringAsFixed(1)}w';
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}k';
    return count.toString();
  }
}

/// 点赞图标类型
enum LikeIconType { heart, thumb, star }
```

使用时更加简洁：

```dart
// 心形点赞
AppLikeButton(
  isLiked: post.isLiked,
  likeCount: post.likeCount,
  onTap: (isLiked) async {
    final success = await likeService.toggleLike(post.id);
    return success ? !isLiked : isLiked;
  },
)

// 星形收藏
AppLikeButton(
  isLiked: item.isFavorited,
  likeCount: item.favoriteCount,
  iconType: LikeIconType.star,
  size: 24,
  onTap: (isLiked) async {
    await favoriteService.toggle(item.id);
    return !isLiked;
  },
)

// 拇指点赞
AppLikeButton(
  isLiked: comment.isLiked,
  likeCount: comment.likeCount,
  iconType: LikeIconType.thumb,
  size: 20,
  onTap: (isLiked) async {
    return !isLiked;
  },
)
```

---

## 与状态管理配合

如果你使用 Riverpod 进行状态管理，可以这样配合使用：

```dart
// Provider 定义
final likeStateProvider = StateNotifierProvider.family<LikeNotifier, LikeState, String>(
  (ref, postId) => LikeNotifier(ref, postId),
);

class LikeState {
  final bool isLiked;
  final int likeCount;
  LikeState({required this.isLiked, required this.likeCount});
}

class LikeNotifier extends StateNotifier<LikeState> {
  LikeNotifier(this.ref, this.postId)
      : super(LikeState(isLiked: false, likeCount: 0));

  final Ref ref;
  final String postId;

  Future<bool> toggleLike() async {
    try {
      final result = await ref.read(likeRepositoryProvider).toggleLike(postId);
      state = LikeState(
        isLiked: result.isLiked,
        likeCount: result.likeCount,
      );
      return true;
    } catch (_) {
      return false;
    }
  }
}

// 在页面中使用
class PostCard extends ConsumerWidget {
  const PostCard({super.key, required this.postId});
  final String postId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final likeState = ref.watch(likeStateProvider(postId));

    return LikeButton(
      isLiked: likeState.isLiked,
      likeCount: likeState.likeCount,
      onTap: (bool isLiked) async {
        final success = await ref
            .read(likeStateProvider(postId).notifier)
            .toggleLike();
        return success ? !isLiked : isLiked;
      },
    );
  }
}
```

---

## 常见问题与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 点赞动画每次都触发 | `isLiked` 设为 null | 明确设置 `isLiked` 的初始值（true/false） |
| 点赞状态无法保存 | 没有持久化处理 | 配合后端 API + `onTap` 回调同步状态 |
| 计数不显示 | `likeCount` 为 null | 传入具体的点赞数值 |
| 动画太快/太慢 | 默认时长不满足需求 | 调整 `animationDuration` 参数 |
| 气泡/圆圈太大或太小 | 默认跟随 size 缩放 | 独立设置 `bubblesSize` 和 `circleSize` |
| 列表中点赞状态错乱 | Key 没有正确绑定 | 为 `LikeButton` 添加唯一的 `Key` |
| 点击非常快时重复触发 | 连续快速点击 | 在 `onTap` 中加防抖逻辑或使用 loading 状态 |

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~


*📝 作者：NIHoa ｜ 系列：Flutter工具系列 ｜ 更新日期：2025-04-06*
