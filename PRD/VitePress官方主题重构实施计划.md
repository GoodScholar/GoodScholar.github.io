# VitePress 重建为官方默认主题 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 清理当前的第三方主题，使用 VitePress 官方默认主题重构配置，同时兼容现有的 Markdown 文章目录结构。

**Architecture:** 删除旧的 `.vitepress` 目录与 `node_modules` 依赖缓冲。使用 `npm` 全新安装 `vitepress` 和 `vue`。创建极简核心的 `.vitepress/config.mts`，配置 `title`、`nav` 与各个系列的 `sidebar`映射关系。最后修改根目录的 `index.md` 使其适配官方主页 Hero 组件布局。

**Tech Stack:** Node.js, VitePress, Vue

---

### Task 1: 清理遗留配置与依赖体系

**Files:**
- Modify: `package.json`
- Delete: `.vitepress/` 整个目录, `node_modules/`, `package-lock.json`

- [ ] **Step 1: 删除旧的配置文件和依赖目录**

```bash
# 执行删除清理操作
rm -rf .vitepress node_modules package-lock.json
```
Expected: 以上目录及文件被移除。

- [ ] **Step 2: 重置 package.json 的依赖内容**

将原先带有 `@sugarat/theme` 以及 `sass-embedded` 的依赖全部删除，仅保留基础信息。创建新的 `package.json` 内容。

```json
{
  "name": "my-blog",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs:preview": "vitepress preview"
  }
}
```

### Task 2: 全新安装与建立核心配置

**Files:**
- Create: `.vitepress/config.mts`

- [ ] **Step 1: 新装 VitePress 和 Vue**

```bash
npm install -D vitepress vue
```
Expected: 安装成功，生成最新的 `package-lock.json` 与新的 `node_modules`，并且在 `package.json` 的 `devDependencies` 中出现 `vitepress` 和 `vue` 依赖项。

- [ ] **Step 2: 编写核心配置文件 `.vitepress/config.mts`**

创建基础结构和针对各个目录的基础边栏/导航：

```typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "NIHoa 的技术博客",
  description: "跨端开发 · Flutter · Taro · React Native · AI",
  lang: 'zh-CN',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '跨端技术',
        items: [
          { text: '跨端技术系列', link: '/跨端技术系列/01-跨端应用框架对比-Flutter-RN-UniApp-Taro' },
          { text: 'Flutter从零到一', link: '/Flutter从零到一系列/01-Dart语言基础' },
          { text: 'Flutter工具系列', link: '/Flutter工具系列/01-OKToast-优雅的Toast提示方案' },
          { text: 'Flutter页面分析', link: '/Flutter页面分析专栏/Flutter页面分析_仿闲鱼首页多SliverAppBar与瀑布流布局' },
          { text: 'RN从零到一', link: '/RN从零到一系列/01-RN是什么与环境搭建' },
          { text: 'Taro从零到一', link: '/Taro从零到一系列/01-Taro是什么与环境搭建' },
          { text: 'Taro+Vue3入门', link: '/Taro+Vue3入门系列/01-环境搭建与第一个小程序' },
        ]
      },
      { text: 'AI 学习', link: '/前端转AI学习手册/01_Python基础语法' },
      { text: 'Node.js 架构', link: '/Node.js技术选型与架构系列/01-Node.js运行时全解-V8·事件循环·libuv' },
      { text: '程序人生', link: '/程序人生/距离软件行业大裁员还有不到2年' },
    ],

    sidebar: {
      '/跨端技术系列/': [
        {
          text: '跨端技术系列',
          items: [
            { text: '01-跨端应用框架对比', link: '/跨端技术系列/01-跨端应用框架对比-Flutter-RN-UniApp-Taro' },
            { text: '02-Flutter+Taro双栈打造全平台产品', link: '/跨端技术系列/02-从零到一-Flutter+Taro双栈打造全平台产品' },
            { text: '03-Flutter入门指南', link: '/跨端技术系列/03-Flutter入门指南-从前端工程师到App开发者' }
          ]
        }
      ],
      '/Node.js技术选型与架构系列/': [
        {
          text: 'Node.js技术选型与架构',
          items: [
            { text: '01-运行时全解：V8·事件循环·libuv', link: '/Node.js技术选型与架构系列/01-Node.js运行时全解-V8·事件循环·libuv' },
            { text: '02-Web框架选型', link: '/Node.js技术选型与架构系列/02-Web框架选型-Express-vs-Koa-vs-Fastify-vs-NestJS' },
            { text: '03-NestJS企业级架构', link: '/Node.js技术选型与架构系列/03-NestJS企业级架构-模块·依赖注入·装饰器' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/GoodScholar' }
    ]
  }
})
```

### Task 3: 适配主页排版

**Files:**
- Modify: `index.md`

- [ ] **Step 1: 写入原生的首页 YAML 和正文内容**

```markdown
---
layout: home

hero:
  name: "NIHoa 的技术博客"
  text: "深耕跨端技术与AI"
  tagline: "涵盖 Flutter, Taro, React Native, 与 AI 实践分享"
  actions:
    - theme: brand
      text: 跨端系列
      link: /跨端技术系列/01-跨端应用框架对比-Flutter-RN-UniApp-Taro
    - theme: alt
      text: Node.js架构
      link: /Node.js技术选型与架构系列/01-Node.js运行时全解-V8·事件循环·libuv

features:
  - title: 跨端应用开发与剖析
    details: 解析 Flutter、Taro 及 RN 在实际大项目中的落地。
  - title: AI 工具栈的效能倍增
    details: 探索 Claude, Cursor, Gemini 以及 GStack 带来的效能跃迁。
  - title: 全栈架构经验沉淀
    details: Node.js 体系的数据库、缓存中间件以及微服务方案整合。
---
```

### Task 4: 构建验证

- [ ] **Step 1: 构建生成静态页面以确保编译无报错**

```bash
npm run docs:build
```
Expected: 输出构建成功的日志（包含所有存在的 markdown 页面路由生成），没有报错并输出到 `.vitepress/dist` 目录。
