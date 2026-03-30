# Skills 文章系列优化需求文档

## 需求概述

对 `Skills文章/` 目录下 14 篇 AI 编程系列文章进行结构化优化，解决日期冲突、Frontmatter 缺失、系列混放、缺少导航等问题。

## 需求背景

1. 14 篇文章混放在同一目录，实际分属 Skills 使用指南（7篇）和 Vibe Coding 深度解读（7篇）两个子系列
2. 4 篇文章日期完全相同（2026-03-25），违反日期唯一性规则
3. 所有文章缺少 `tags` 和 `cover` 字段，影响博客展示效果
4. 7 篇 Vibe Coding 文章标记为 `draft: true`，未发布
5. VitePress 导航栏和侧边栏中无任何 Skills 系列入口

## 实施内容

### Phase 1：Frontmatter 规范化
- 修复 10 处日期冲突（4 篇互相冲突 + 6 篇与其他系列冲突）
- 为 14 篇文章添加 `tags` 和 `cover` 字段
- 统一签名行格式（系列名、日期一致）
- 移除 7 篇 Vibe Coding 文章的 `draft: true`

### Phase 2：结构整理
- 新建 `Vibe-Coding系列/` 目录，将对应 7 篇文章迁移
- 为 14 篇文章添加编号前缀（01-07），明确阅读顺序
- 更新 VitePress config 添加导航和 sidebar 配置
- 修复桥梁篇中的交叉引用链接

### Phase 3：封面图生成
- 为 14 篇文章各生成 1 张科技风封面图
- 部署到 `public/covers/` 目录

## 验证结果
- ✅ 日期全局唯一
- ✅ VitePress 构建成功（132 pages, 0 errors）
- ✅ 19 张封面图正常部署

## 状态：已完成
