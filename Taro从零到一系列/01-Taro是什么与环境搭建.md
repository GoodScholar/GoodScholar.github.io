---
date: 2024-06-01
---
# 🌱 Taro 从零到一（一）：Taro 是什么 — 一套代码，多端运行

> **系列导读**：这是「Taro 从零到一」系列的第 1 篇。Taro 是京东开源的多端开发框架，
> 用一套 React/Vue 代码同时生成微信小程序、支付宝小程序、H5、抖音小程序等多个平台应用。

**本文目标**：理解 Taro 的定位和原理，完成环境搭建，创建并运行第一个多端项目。

---

## 📊 Taro 速览

| 维度 | 说明 |
|------|------|
| 🏢 出品方 | 京东凹凸实验室（2018 年开源） |
| 🎯 定位 | 多端统一开发框架 |
| 📝 开发语言 | **React + TypeScript**（也支持 Vue 3） |
| 📦 当前版本 | Taro 4.x |
| 🌐 支持平台 | 微信 / 支付宝 / 百度 / 抖音 / 飞书 / QQ / 京东 / 鸿蒙 / H5 / React Native |
| ⭐ GitHub Star | 35k+ |

---

## 🧩 为什么选 Taro？

### 多端开发的痛点

```
传统做法：每个平台独立开发

微信小程序  → WXML + WXSS + WXS       → 团队 A
支付宝小程序 → AXML + ACSS + SJS       → 团队 B
H5网页      → HTML + CSS + JS          → 团队 C
抖音小程序  → TTML + TTSS + SJS        → 又要一个团队？

问题：
├── 各平台 API 不统一，学习成本高
├── 多套代码维护困难，改一个需求改三遍
├── 团队资源浪费严重
└── 各端体验难以统一
```

### Taro 的方案

```
Taro 方案：一套代码，编译到多端

React/Vue + TypeScript
         │
    Taro 编译器
    ╱    │    ╲    ╲
微信   支付宝   H5   抖音 ...

优势：
├── 一套代码 → 多端产物
├── 标准 React/Vue 语法 → 零学习成本
├── 统一的 API 封装 → 屏蔽平台差异
└── 丰富的 UI 组件库（NutUI）
```

### 适合 Taro 的场景

| 场景 | 推荐度 | 原因 |
|------|--------|------|
| 需要同时上多个小程序平台 | ⭐⭐⭐⭐⭐ | Taro 的核心价值 |
| 小程序 + H5 共用一套代码 | ⭐⭐⭐⭐⭐ | 最常见的多端组合 |
| 已有 React 技术栈的团队 | ⭐⭐⭐⭐ | 上手成本最低 |
| 只做单一平台小程序 | ⭐⭐ | 原生开发可能更简单 |
| 重交互的游戏类应用 | ⭐ | 小程序本身限制多 |

---

## 🛠 1. 环境搭建

### 前置要求

```bash
# 确认 Node.js 版本（需要 >= 16）
node -v   # v20.x.x

# 确认 npm 版本
npm -v    # 10.x.x

# 推荐使用 pnpm（可选）
npm install -g pnpm
```

### 安装 Taro CLI

```bash
# 全局安装 Taro CLI
npm install -g @tarojs/cli

# 验证安装
taro -v
# 👽 Taro v4.x.x

# 如果已安装旧版，升级到最新
npm update -g @tarojs/cli
```

### 创建项目

```bash
# 交互式创建
taro init my-taro-app

# 选择项目模板
# ➤ 请输入项目名称：my-taro-app
# ➤ 请输入项目介绍：我的第一个 Taro 应用
# ➤ 请选择框架：React
# ➤ 请选择 CSS 预处理器：Sass
# ➤ 请选择编译工具：Webpack5
# ➤ 请选择包管理工具：pnpm
# ➤ 请选择模板：默认模板

cd my-taro-app
```

---

## 📁 2. 项目结构解析

```
my-taro-app/
├── config/                       # 📂 编译配置
│   ├── index.ts                  # 主配置文件
│   ├── dev.ts                    # 开发环境配置
│   └── prod.ts                   # 生产环境配置
├── src/
│   ├── app.ts                    # 📄 应用入口（生命周期）
│   ├── app.config.ts             # 📄 全局配置（页面路由、TabBar）
│   ├── app.scss                  # 📄 全局样式
│   ├── index.html                # 📄 H5 模板
│   └── pages/                    # 📂 页面目录
│       └── index/
│           ├── index.tsx         # 页面组件
│           ├── index.config.ts   # 页面配置
│           └── index.scss        # 页面样式
├── project.config.json           # 微信小程序项目配置
├── project.tt.json               # 抖音小程序项目配置
├── tsconfig.json                 # TypeScript 配置
├── babel.config.js               # Babel 配置
└── package.json
```

### 关键文件解读

```typescript
// src/app.config.ts — 全局配置
export default defineAppConfig({
  pages: [
    'pages/index/index',       // 首页（第一个即为默认页）
    'pages/list/index',
    'pages/mine/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '我的应用',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#999',
    selectedColor: '#6366F1',
    list: [
      { pagePath: 'pages/index/index', text: '首页', iconPath: '', selectedIconPath: '' },
      { pagePath: 'pages/list/index', text: '列表', iconPath: '', selectedIconPath: '' },
      { pagePath: 'pages/mine/index', text: '我的', iconPath: '', selectedIconPath: '' },
    ],
  },
})
```

```typescript
// src/app.ts — 应用入口
import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.scss'

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    console.log('App launched.')
    // 初始化操作：检查登录态、获取系统信息等
  })

  return children
}

export default App
```

---

## 🚀 3. 运行项目

### 各平台启动命令

```bash
# 微信小程序
npm run dev:weapp
# 产物在 dist/ 目录，用微信开发者工具打开

# H5 网页
npm run dev:h5
# 浏览器访问 http://localhost:10086

# 支付宝小程序
npm run dev:alipay
# 用支付宝小程序开发者工具打开 dist/

# 抖音小程序
npm run dev:tt

# 百度小程序
npm run dev:swan

# 飞书小程序
npm run dev:lark

# 生产构建
npm run build:weapp    # 微信小程序
npm run build:h5       # H5
npm run build:alipay   # 支付宝
```

### 微信开发者工具配置

```
1. 下载并安装微信开发者工具
   https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

2. 导入项目
   ├── 选择 dist/ 目录
   ├── 填入 AppID（可用测试号）
   └── 选择"不使用云服务"

3. 设置
   ├── ✅ 不校验合法域名
   └── ✅ 不校验 TLS 版本
```

---

## 📝 4. 第一个页面

```typescript
// src/pages/index/index.tsx
import { View, Text, Button, Image } from '@tarojs/components'
import { useCallback, useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Index() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount(prev => prev + 1)
    Taro.showToast({ title: '点击了！', icon: 'success' })
  }, [])

  const handleNavigate = useCallback(() => {
    Taro.navigateTo({ url: '/pages/list/index' })
  }, [])

  return (
    <View className="index">
      <Image
        className="logo"
        src="https://taro-docs.jd.com/img/logo-taro.png"
        mode="aspectFit"
      />
      <Text className="title">欢迎使用 Taro</Text>
      <Text className="subtitle">一套代码，多端运行 🚀</Text>

      <View className="counter">
        <Text className="count">{count}</Text>
        <Button className="btn" onClick={handleClick}>
          点我 +1
        </Button>
      </View>

      <Button className="nav-btn" onClick={handleNavigate}>
        跳转到列表页 →
      </Button>
    </View>
  )
}
```

```scss
// src/pages/index/index.scss
.index {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 32px;

  .logo {
    width: 160px;
    height: 160px;
    margin-bottom: 24px;
  }

  .title {
    font-size: 36px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 28px;
    color: #666;
    margin-bottom: 48px;
  }

  .counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;

    .count {
      font-size: 80px;
      font-weight: bold;
      color: #6366f1;
    }

    .btn {
      margin-top: 16px;
      background-color: #6366f1;
      color: #fff;
      border-radius: 12px;
      font-size: 28px;
    }
  }

  .nav-btn {
    background-color: transparent;
    color: #6366f1;
    border: 2px solid #6366f1;
    border-radius: 12px;
    font-size: 28px;
  }
}
```

```typescript
// src/pages/index/index.config.ts
export default definePageConfig({
  navigationBarTitleText: '首页',
})
```

> ⚠️ **注意**：Taro 中使用 **rpx** 为单位（设计稿 750px 宽），但在样式中直接写 **px**，
> Taro 会自动转换为 rpx。1px = 1rpx（基于 750 设计稿）。

---

## 🔍 5. Taro 与原生小程序对比

| 概念 | 原生微信小程序 | Taro (React) |
|------|-------------|-------------|
| 模板语法 | WXML `<view wx:for>` | JSX `{list.map()}` |
| 样式文件 | .wxss | .scss / .css |
| 组件通信 | properties + triggerEvent | props + 回调函数 |
| 状态管理 | `this.setData({})` | `useState` / `useReducer` |
| 生命周期 | `onLoad` / `onShow` | `useLoad` / `useDidShow` |
| 路由跳转 | `wx.navigateTo` | `Taro.navigateTo` |
| 条件渲染 | `wx:if` | `{condition && <View/>}` |
| 列表渲染 | `wx:for` | `{list.map(item => ...)}` |

```tsx
// 原生微信：
// <view wx:for="{{list}}" wx:key="id">
//   <text>{{item.name}}</text>
// </view>

// Taro React：
{list.map(item => (
  <View key={item.id}>
    <Text>{item.name}</Text>
  </View>
))}
```

---

## ✅ 本篇小结 Checklist

- [ ] 理解 Taro 的多端编译原理
- [ ] 安装 Taro CLI 并创建项目
- [ ] 理解项目目录结构（config / src / pages）
- [ ] 在微信小程序和 H5 上运行成功
- [ ] 完成第一个计数器页面
- [ ] 理解 Taro 与原生小程序语法的对应关系

---

> **下一篇预告**：《React + TypeScript 基础速览》—— Taro 以 React 为核心框架，
> 本文快速过一遍你需要掌握的 React 知识。

---

*本文是「Taro 从零到一」系列第 1 篇，共 10 篇。*


---
*📝 作者：NIHoa ｜ 系列：Taro从零到一系列 ｜ 更新日期：2024-06-01*
