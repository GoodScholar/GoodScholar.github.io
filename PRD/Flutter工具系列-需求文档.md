# Flutter 工具系列 — 需求文档

## 1. 概述

创作一系列 Flutter 开发工具专题文章，共 **10 篇**，面向有一定 Flutter 基础的开发者，聚焦于工具链的选型与实战使用。与「Flutter 从零到一系列」互补 —— 那个系列讲**语言与框架基础**，这个系列讲**工具与效率提升**。

## 2. 目标受众

- 已入门 Flutter、希望提升开发效率的中级开发者
- 正在进行 Flutter 技术选型的团队负责人
- 有其他框架经验、想了解 Flutter 生态全貌的跨端开发者

## 3. 写作风格

沿用现有系列统一风格：
- 标题使用 emoji + 描述性标题
- 开篇系列导读 + 文章目标
- 表格速览关键对比
- 大量可运行的代码示例
- 结尾 Checklist 总结
- 下一篇预告
- 每篇 300-800 行 Markdown

## 4. 文章大纲

### 第 1 篇：开发环境与效率工具 — 让 Flutter 开发飞起来
- IDE 配置（VS Code / Android Studio / Cursor）
- 必装插件清单（Dart、Flutter、Error Lens、Bracket Pair 等）
- 快捷键速查表
- FVM（Flutter 版本管理）
- Mason（项目模板生成）
- Very Good CLI
- 开发效率对比：优化前 vs 优化后

### 第 2 篇：DevTools 全攻略 — 性能调试的瑞士军刀
- DevTools 概览与启动方式
- Widget Inspector（布局调试）
- Performance 面板（帧率分析）
- Memory 面板（内存泄漏排查）
- Network 面板（网络请求监控）
- Logging 面板（日志查看）
- CPU Profiler（性能瓶颈定位）
- 实战：定位并修复一个列表卡顿问题

### 第 3 篇：代码生成与自动化 — 告别手写样板代码
- build_runner 原理与使用
- json_serializable（JSON 序列化）
- freezed（不可变数据类 + union types）
- auto_route（路由代码生成）
- injectable（依赖注入代码生成）
- Dart macros 前瞻
- 实战：一个完整的代码生成工作流

### 第 4 篇：状态管理工具对比 — Provider / Bloc / Riverpod 实战选型
- 状态管理的本质与分类
- Provider 速览与局限
- Bloc / Cubit 模式详解
- Riverpod 3.x 新特性与最佳实践
- GetX 简要介绍（及争议）
- 选型决策树
- 实战：同一功能用三种方案实现

### 第 5 篇：网络请求工具链 — Dio + Retrofit + 接口调试
- http 包 vs Dio 对比
- Dio 高级配置（拦截器、缓存、重试）
- Retrofit（声明式 API 定义）
- Chopper 简介
- 接口调试工具（Postman、Thunder Client）
- Mock 数据方案
- 实战：封装一个生产级网络层

### 第 6 篇：路由管理工具 — GoRouter + AutoRoute 深度对比
- Navigator 1.0 vs 2.0 简史
- go_router 使用详解
- auto_route 使用详解
- 路由守卫/认证拦截
- 深度链接（Deep Link）配置
- 两者对比与选型建议
- 实战：带认证的完整路由架构

### 第 7 篇：数据持久化工具箱 — Hive / Isar / Drift 全解析
- SharedPreferences（轻量存储）
- Hive（NoSQL 本地数据库）
- Isar（高性能 NoSQL）
- Drift（SQLite ORM）
- Floor（SQLite 注解方案）
- 不同方案的适用场景
- 实战：离线优先应用的数据层

### 第 8 篇：国际化与主题工具 — 多语言多主题一步到位
- Flutter 内置 intl 方案
- easy_localization 使用
- slang（类型安全的 i18n）
- 主题系统深度定制
- flex_color_scheme（快速主题生成）
- 暗黑模式适配
- 实战：支持中英文 + 明暗主题的完整方案

### 第 9 篇：测试工具全家桶 — 单元测试 + Widget 测试 + 集成测试
- Dart 测试框架基础
- mocktail（Mock 工具）
- Widget 测试技巧
- golden_toolkit（截图测试）
- integration_test（集成测试）
- patrol（E2E 测试）
- 测试覆盖率与 CI 集成
- 实战：为一个页面编写完整测试

### 第 10 篇：发布与 CI/CD 工具链 — 从代码到应用商店
- Flutter 构建配置（flavors / 环境变量）
- 图标与启动页生成工具
- fastlane 自动化发布
- Codemagic / GitHub Actions CI/CD
- Shorebird（代码推送 / 热更新）
- 应用签名与上架流程
- 实战：从零配置一条完整的 CI/CD 流水线

## 5. 输出规范

- 文件路径：`/Users/shen/SZG/文章/Flutter工具系列/`
- 文件命名：`01-标题.md`、`02-标题.md` ...
- 每篇文章独立成文，可单独阅读
- 系列有前后连接（上一篇/下一篇导航）
