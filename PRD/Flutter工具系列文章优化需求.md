# Flutter 工具系列文章优化需求

## 背景

Flutter 工具系列共 8 篇文章，覆盖 Toast、WebView、启动屏、图片裁剪、骨架屏、点赞动画、拖拽排序、AI Skills 等主题。在日常维护中发现若干结构性问题和一致性缺陷，需要统一修复优化。

## 需求详情

### 一、编号重排

**问题**：两篇文章编号均为 05（Skeletonizer 和 like_button），且缺少第 07 期。

**处理方案**：按发布日期重新编号

| 新编号 | 文件名 | 日期 |
|--------|---------|------|
| 01 | 01-OKToast-优雅的Toast提示方案.md | 2025-04-01 |
| 02 | 02-WebView-Flutter与H5混合开发全攻略.md | 2025-04-02 |
| 03 | 03-flutter_native_splash-一键生成启动屏.md | 2025-04-03 |
| 04 | 04-image_picker+image_cropper-图片选择与裁剪.md | 2025-04-04 |
| 05 | 05-Skeletonizer-一行代码实现骨架屏.md | 2025-04-05 |
| 06 | **06-like_button-一键实现点赞动画效果.md**（原 05） | 2025-04-06 |
| 07 | **07-ReorderableListView-拖拽排序列表.md**（原 06） | 2025-04-07 |
| 08 | 08-Flutter官方Skills-AI Agent开发技能库.md | 2025-04-08 |

### 二、补充 YAML Frontmatter tags

**问题**：所有文章的 frontmatter 仅有 `date` 字段，缺少 `tags` 标签，导致博客标签分类功能无法正常使用。

**处理方案**：为每篇文章添加 `tags` 字段

| 文章 | tags |
|------|------|
| 01-OKToast | Flutter, OKToast, Toast, 消息提示, 工具封装 |
| 02-WebView | Flutter, WebView, H5, 混合开发, JS通信 |
| 03-flutter_native_splash | Flutter, 启动屏, Splash Screen, 原生配置 |
| 04-image_picker+image_cropper | Flutter, 图片选择, 图片裁剪, 相机, 相册 |
| 05-Skeletonizer | Flutter, 骨架屏, Skeleton Loading, 加载动画 |
| 06-like_button | Flutter, 点赞动画, like_button, 交互动画 |
| 07-ReorderableListView | Flutter, 拖拽排序, ReorderableListView, 列表 |
| 08-Flutter Skills | Flutter, AI Agent, Skills, GitHub Copilot, Claude Code |

### 三、修复代码问题

**问题**：02-WebView 文章中 `_onLoadFlutterAssets` 方法定义了但在 `build` 中没有调用入口。

**处理方案**：在 AppBar 的 `actions` 中添加按钮调用该方法，使代码示例完整可用。

### 四、VitePress 配置

**确认**：Flutter 工具系列由 `@sugarat/theme` 博客主题自动扫描文件生成列表，文件重命名后无需修改 VitePress 配置。

## 验收标准

- [ ] 8 篇文章编号连续（01-08），无重复无跳号
- [ ] 文件名中的编号与文章内部标题中的期号一致
- [ ] 所有文章 frontmatter 包含 `date` 和 `tags` 字段
- [ ] 日期无重复、不超过当前日期
- [ ] 02-WebView 代码示例完整可用
