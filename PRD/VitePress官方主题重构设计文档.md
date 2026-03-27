# VitePress 官方主题重构设计文档

## 概述
当前博客基于第三方主题 `@sugarat/theme` 构建。为了获得更高的稳定性和性能，减少依赖冲突，计划重新搭建 VitePress 博客并切换回 VitePress 原生默认主题，同时保留所有之前的 Markdown 技术文章分类结构。

## 目标
- 【核心目标】不丢失当前 `/Users/shen/SZG/PRD/文章` 目录下的所有文章文件内容及其目录归属关系。
- 【设计方案】采用 VitePress 官方默认主题（Default Theme）重构，去除所有的第三方主题构建和插件（例如 `@sugarat/theme`、`sass-embedded`）。
- 【用户体验】通过自定义的导航栏（Nav）和侧边栏（Sidebar）组织各系列的系列文章（如：`跨端技术系列`、`Flutter从零到一系列`、`Taro+Vue3入门系列`、`前端转AI学习手册`、`Node.js技术选型与架构系列`等），尽可能保留原有博客的条理性和导航逻辑。

## 清理与初始化逻辑
1. **依赖清理**：删除 `package.json` 中的 `@sugarat/theme` 依赖，重置 `package.json`，并清理 `node_modules` 与 `package-lock.json` 以排查潜在冲突风险。
2. **构建清理**：删除现有的 `.vitepress` 隐藏目录下的所有旧配置与自定义主题逻辑。
3. **环境初始化**：运行标准 `npm install -D vitepress vue` 重新安装 VitePress。
4. **主配置项生成**：生成极简核心 `.vitepress/config.mts`，采用官方 `defineConfig` 约定。

## 目录结构设计
```
/Users/shen/SZG/PRD/文章/
├── package.json
├── index.md             # 首页，需改为 VitePress 默认 Hero 特性排版
├── PRD/                 # 新增及历史所有的 PRD 需求文档
├── Node.js技术选型与架构系列/
├── 跨端技术系列/
├── Flutter从零到一系列/
├── Flutter工具系列/
├── Flutter页面分析专栏/
├── RN从零到一系列/
├── Taro从零到一系列/
├── Taro+Vue3入门系列/
├── 前端转AI学习手册/
├── Skills文章/
├── 程序人生/
└── .vitepress/          # 全新的官方主题配置目录
    └── config.mts
```

## 测试与验收标准
- 确保 `npm run docs:dev` 能成功运行并且所有页面能够访问。
- 确保所有的分类在侧边栏能够被正确点击并导航展示，目录层级不错乱。
- 前后端构建命令 `docs:build` 执行且无错误抛出。
