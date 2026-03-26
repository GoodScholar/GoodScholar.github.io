import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({
  author: 'NIHoa',
  // 文章默认作者
  friend: [],
  // 推荐文章
  recommend: {
    title: '🔥 相关文章',
    nextText: '换一组',
    pageSize: 9,
    empty: '暂无相关文章'
  },
  // 评论（暂不开启）
  // comment: {},
  // 文章元信息
  article: {
    readingTime: true,
  },
  // 首页文章列表
  home: {
    name: 'NIHoa 的技术博客',
    motto: '深耕跨端技术，探索 Flutter、Taro、React Native 与 AI 的无限可能',
    inspiring: '',
    pageSize: 10,
    avatarMode: 'card',
    logo: '/avatar.jpg',
  },
  // 作者头像
  authorList: [
    {
      nickname: 'NIHoa',
      url: 'https://github.com/GoodScholar',
      des: '深耕跨端技术',
    }
  ],
  // 搜索
  search: false
})

export default defineConfig({
  extends: blogTheme,
  title: 'NIHoa 的技术博客',
  description: '跨端开发 · Flutter · Taro · React Native · AI',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  vite: {
    optimizeDeps: {
      include: ['element-plus'],
      exclude: ['@sugarat/theme']
    }
  },

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
      {
        text: 'AI 编程',
        items: [
          { text: 'Skills 系列', link: '/Skills文章/01-Skills入门-AI编程助手的技能加点指南' },
          { text: 'Vibe Coding 系列', link: '/Skills文章/Vibe-Coding不是让AI写代码这么简单' },
          { text: 'GStack 系列', link: '/GStack实战指南系列/01-初识GStack-把ClaudeCode变成虚拟开发团队' },
        ]
      },
      { text: '程序人生', link: '/程序人生/距离软件行业大裁员还有不到2年' },
    ],

    sidebar: {
      '/跨端技术系列/': [
        {
          text: '跨端技术系列',
          items: [
            { text: '01-跨端应用框架对比', link: '/跨端技术系列/01-跨端应用框架对比-Flutter-RN-UniApp-Taro' },
            { text: '02-Flutter+Taro双栈打造全平台产品', link: '/跨端技术系列/02-从零到一-Flutter+Taro双栈打造全平台产品' },
            { text: '03-Flutter入门指南', link: '/跨端技术系列/03-Flutter入门指南-从前端工程师到App开发者' },
            { text: '04-Flutter状态管理Riverpod3.x', link: '/跨端技术系列/04-Flutter状态管理终极指南-Riverpod3.x从入门到精通' },
            { text: '05-Taro4.x多端小程序开发', link: '/跨端技术系列/05-Taro4.x多端小程序开发实战' },
            { text: '06-Flutter动画从零到炫酷', link: '/跨端技术系列/06-Flutter动画从零到炫酷-让你的App动起来' },
            { text: '07-Flutter+Dart后端全栈实战', link: '/跨端技术系列/07-Flutter+Dart后端全栈实战-DartFrog打通前后端' },
            { text: '08-移动端性能优化实战', link: '/跨端技术系列/08-移动端性能优化实战-Flutter从卡顿到丝滑' },
            { text: '09-2026鸿蒙适配实战', link: '/跨端技术系列/09-2026鸿蒙适配实战-Flutter-Taro双端上架全流程' },
            { text: '10-跨端项目工程化', link: '/跨端技术系列/10-跨端项目工程化-Monorepo+CICD+自动化测试' },
          ]
        }
      ],
      '/Flutter从零到一系列/': [
        {
          text: 'Flutter从零到一系列',
          items: [
            { text: '01-Dart语言基础', link: '/Flutter从零到一系列/01-Dart语言基础' },
            { text: '02-Flutter初体验', link: '/Flutter从零到一系列/02-Flutter初体验' },
            { text: '03-Widget大全', link: '/Flutter从零到一系列/03-Widget大全' },
            { text: '04-布局系统精讲', link: '/Flutter从零到一系列/04-布局系统精讲' },
            { text: '05-导航与路由', link: '/Flutter从零到一系列/05-导航与路由' },
            { text: '06-状态管理三部曲', link: '/Flutter从零到一系列/06-状态管理三部曲' },
            { text: '07-网络请求与数据处理', link: '/Flutter从零到一系列/07-网络请求与数据处理' },
            { text: '08-列表与滚动', link: '/Flutter从零到一系列/08-列表与滚动' },
            { text: '09-主题与样式', link: '/Flutter从零到一系列/09-主题与样式' },
            { text: '10-表单与用户输入', link: '/Flutter从零到一系列/10-表单与用户输入' },
            { text: '11-本地存储与持久化', link: '/Flutter从零到一系列/11-本地存储与持久化' },
            { text: '12-动画入门', link: '/Flutter从零到一系列/12-动画入门' },
            { text: '13-实战项目', link: '/Flutter从零到一系列/13-实战项目' },
          ]
        }
      ],
      '/Flutter工具系列/': [
        {
          text: 'Flutter工具系列',
          items: [
            { text: '01-OKToast 优雅的Toast提示', link: '/Flutter工具系列/01-OKToast-优雅的Toast提示方案' },
            { text: '02-WebView 混合开发全攻略', link: '/Flutter工具系列/02-WebView-Flutter与H5混合开发全攻略' },
            { text: '03-flutter_native_splash 启动屏', link: '/Flutter工具系列/03-flutter_native_splash-一键生成启动屏' },
            { text: '04-图片选择与裁剪', link: '/Flutter工具系列/04-image_picker+image_cropper-图片选择与裁剪' },
            { text: '05-Skeletonizer 骨架屏', link: '/Flutter工具系列/05-Skeletonizer-一行代码实现骨架屏' },
            { text: '05-like_button 点赞动画', link: '/Flutter工具系列/05-like_button-一键实现点赞动画效果' },
            { text: '06-拖拽排序列表', link: '/Flutter工具系列/06-ReorderableListView-拖拽排序列表' },
            { text: '08-Flutter官方Skills', link: '/Flutter工具系列/08-Flutter官方Skills-AI Agent开发技能库' },
          ]
        }
      ],
      '/Flutter页面分析专栏/': [
        {
          text: 'Flutter页面分析专栏',
          items: [
            { text: 'Toast工具类封装与动画', link: '/Flutter页面分析专栏/Flutter页面分析_Toast工具类封装与动画实现' },
            { text: '仿闲鱼首页布局', link: '/Flutter页面分析专栏/Flutter页面分析_仿闲鱼首页多SliverAppBar与瀑布流布局' },
            { text: '发送建议邮件页', link: '/Flutter页面分析专栏/Flutter页面分析_发送建议邮件页' },
            { text: '液态玻璃效果', link: '/Flutter页面分析专栏/Flutter页面分析_液态玻璃效果实现与参数详解' },
          ]
        }
      ],
      '/RN从零到一系列/': [
        {
          text: 'RN从零到一系列',
          items: [
            { text: '01-RN是什么与环境搭建', link: '/RN从零到一系列/01-RN是什么与环境搭建' },
            { text: '02-核心组件与样式', link: '/RN从零到一系列/02-核心组件与样式' },
            { text: '03-列表与高性能渲染', link: '/RN从零到一系列/03-列表与高性能渲染' },
            { text: '04-导航与路由', link: '/RN从零到一系列/04-导航与路由' },
            { text: '05-状态管理', link: '/RN从零到一系列/05-状态管理' },
            { text: '06-网络请求与数据处理', link: '/RN从零到一系列/06-网络请求与数据处理' },
            { text: '07-表单与用户输入', link: '/RN从零到一系列/07-表单与用户输入' },
            { text: '08-本地存储与设备能力', link: '/RN从零到一系列/08-本地存储与设备能力' },
            { text: '09-动画与手势', link: '/RN从零到一系列/09-动画与手势' },
            { text: '10-实战项目', link: '/RN从零到一系列/10-实战项目' },
          ]
        }
      ],
      '/Taro从零到一系列/': [
        {
          text: 'Taro从零到一系列',
          items: [
            { text: '01-Taro是什么与环境搭建', link: '/Taro从零到一系列/01-Taro是什么与环境搭建' },
            { text: '02-React+TypeScript基础', link: '/Taro从零到一系列/02-React+TypeScript基础速览' },
            { text: '03-页面与组件开发', link: '/Taro从零到一系列/03-页面与组件开发' },
            { text: '04-路由与页面导航', link: '/Taro从零到一系列/04-路由与页面导航' },
            { text: '05-样式与UI组件库', link: '/Taro从零到一系列/05-样式与UI组件库' },
            { text: '06-状态管理Zustand', link: '/Taro从零到一系列/06-状态管理Zustand' },
            { text: '07-网络请求与数据处理', link: '/Taro从零到一系列/07-网络请求与数据处理' },
            { text: '08-多端适配与条件编译', link: '/Taro从零到一系列/08-多端适配与条件编译' },
            { text: '09-小程序原生能力调用', link: '/Taro从零到一系列/09-小程序原生能力调用' },
            { text: '10-实战项目', link: '/Taro从零到一系列/10-实战项目' },
          ]
        }
      ],
      '/Taro+Vue3入门系列/': [
        {
          text: 'Taro+Vue3入门系列',
          items: [
            { text: '01-环境搭建与第一个小程序', link: '/Taro+Vue3入门系列/01-环境搭建与第一个小程序' },
            { text: '02-Vue3组合式API核心', link: '/Taro+Vue3入门系列/02-Vue3组合式API核心' },
            { text: '03-内置组件与页面开发', link: '/Taro+Vue3入门系列/03-内置组件与页面开发' },
            { text: '04-路由与页面导航', link: '/Taro+Vue3入门系列/04-路由与页面导航' },
            { text: '05-样式方案与NutUI', link: '/Taro+Vue3入门系列/05-样式方案与NutUI' },
            { text: '06-状态管理Pinia', link: '/Taro+Vue3入门系列/06-状态管理Pinia' },
            { text: '07-网络请求封装', link: '/Taro+Vue3入门系列/07-网络请求封装' },
            { text: '08-多端适配与条件编译', link: '/Taro+Vue3入门系列/08-多端适配与条件编译' },
            { text: '09-小程序原生能力', link: '/Taro+Vue3入门系列/09-小程序原生能力' },
            { text: '10-实战项目', link: '/Taro+Vue3入门系列/10-实战项目' },
          ]
        }
      ],
      '/前端转AI学习手册/': [
        {
          text: '前端转AI学习手册',
          items: [
            { text: '01-Python基础语法', link: '/前端转AI学习手册/01_Python基础语法' },
            { text: '02-Python进阶与环境管理', link: '/前端转AI学习手册/02_Python进阶与环境管理' },
            { text: '03-FastAPI入门', link: '/前端转AI学习手册/03_FastAPI入门' },
            { text: '04-数据库与综合项目', link: '/前端转AI学习手册/04_数据库与综合项目' },
            { text: '05-LLM与Prompt工程', link: '/前端转AI学习手册/05_LLM与Prompt工程' },
            { text: '06-Embedding向量与RAG概念', link: '/前端转AI学习手册/06_Embedding向量与RAG概念' },
            { text: '07-全栈AI聊天应用', link: '/前端转AI学习手册/07_全栈AI聊天应用' },
            { text: '08-RAG知识库系统', link: '/前端转AI学习手册/08_RAG知识库系统' },
            { text: '09-AI Agent开发', link: '/前端转AI学习手册/09_AI_Agent开发' },
            { text: '10-差异化方向与求职', link: '/前端转AI学习手册/10_差异化方向与求职' },
          ]
        }
      ],
      '/Skills文章/': [
        {
          text: 'Skills 系列',
          items: [
            { text: '01-Skills入门：技能加点指南', link: '/Skills文章/01-Skills入门-AI编程助手的技能加点指南' },
            { text: '02-从提示词到Skills', link: '/Skills文章/从提示词到Skills-AI编程的进化之路' },
            { text: '03-10分钟打造你的第一个Skill', link: '/Skills文章/10分钟打造你的第一个AI-Skill' },
            { text: '04-AI编程工具三国杀', link: '/Skills文章/AI编程工具三国杀-Cursor-vs-ClaudeCode-vs-Gemini' },
          ]
        },
        {
          text: 'Vibe Coding 系列',
          items: [
            { text: '01-Vibe Coding不是让AI写代码这么简单', link: '/Skills文章/Vibe-Coding不是让AI写代码这么简单' },
            { text: '02-我用Vibe Coding从零做了一个AI推理游戏', link: '/Skills文章/我用Vibe-Coding从零做了一个AI推理游戏' },
            { text: '03-Vibe Coding工具怎么选', link: '/Skills文章/Vibe-Coding工具怎么选-Cursor-vs-ClaudeCode-vs-Bolt' },
            { text: '04-不看代码行不行？质量红线', link: '/Skills文章/不看代码行不行-Vibe-Coding的质量红线' },
            { text: '05-Vibe Coding时代的新技能树', link: '/Skills文章/Vibe-Coding时代程序员的新技能树' },
          ]
        },
        {
          text: '番外篇',
          items: [
            { text: 'Vibe Coding提示词模式大全', link: '/Skills文章/Vibe-Coding提示词模式大全' },
            { text: '从Skills到Vibe Coding', link: '/Skills文章/从Skills到Vibe-Coding-AI编程的进化路径' },
            { text: 'GStack vs Superpowers', link: '/Skills文章/GStack-vs-Superpowers-两大AI编程技能包深度对比' },
            { text: 'GStack实战使用指南', link: '/Skills文章/GStack细节分析与实战使用指南' },
          ]
        }
      ],
      '/程序人生/': [
        {
          text: '程序人生',
          items: [
            { text: '距离软件行业大裁员还有不到2年', link: '/程序人生/距离软件行业大裁员还有不到2年' },
            { text: 'AI Skills 正在重新定义「10x 程序员」', link: '/程序人生/AI-Skills正在重新定义10x程序员' },
            { text: 'UI/UX 设计师会被 AI 取代吗', link: '/程序人生/UIUX设计师会被AI取代吗' },
            { text: 'AI 时代的互联网新分工', link: '/程序人生/AI时代的互联网新分工' },
          ]
        }
      ],
      '/GStack实战指南系列/': [
        {
          text: 'GStack 实战指南',
          items: [
            { text: '01-初识 GStack 流水库', link: '/GStack实战指南系列/01-初识GStack-把ClaudeCode变成虚拟开发团队' },
            { text: '02-产品把控与架构审定', link: '/GStack实战指南系列/02-产品与架构-用CEO与技术总监视角锁定项目边界' },
            { text: '03-防御级代码审查拦截', link: '/GStack实战指南系列/03-对抗性审查-深入探索review代码深度审计防线' },
            { text: '04-无头浏览器端到端测试', link: '/GStack实战指南系列/04-自动化QA-让AI亲自操控网页做端到端测试' },
            { text: '05-一键出海自动化交付闭环', link: '/GStack实战指南系列/05-交付闭环-从提交流水线到ship一键发版' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/GoodScholar' }
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文章', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },

    outline: {
      level: [2, 3],
      label: '目录'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    footer: {
      message: '用 ❤️ 和 VitePress 构建',
      copyright: '© 2026 NIHoa 的技术博客'
    }
  },

  markdown: {
    lineNumbers: true
  }
})
