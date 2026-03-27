import { defineConfig } from 'vitepress'
import { getThemeConfig } from '@sugarat/theme/node'

// 所有的博客相关主题功能都可以在此对象内部自由添加，比如评论、RSS、文章摘要等
const blogTheme = getThemeConfig({
  author: 'NIHoa'
})

export default defineConfig({
  extends: blogTheme,
  title: "NIHoa 的技术博客",
  description: "跨端开发 · Flutter · Taro · React Native · AI",
  lang: 'zh-CN',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/avatar.jpg' }]
  ],

  themeConfig: {
    logo: '/avatar.jpg',
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
      {
        text: 'AI 学习',
        items: [
          { text: '前端转AI学习手册', link: '/前端转AI学习手册/01_Python基础语法' },
          { text: 'GStack实战指南系列', link: '/GStack实战指南系列/01-初识GStack-把ClaudeCode变成虚拟开发团队' },
          { text: 'Superpowers实战指南系列', link: '/Superpowers实战指南系列/01-初识Superpowers-给你的AI编程助手注入工程纪律' }
        ]
      },
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
            { text: '03-NestJS企业级架构', link: '/Node.js技术选型与架构系列/03-NestJS企业级架构-模块·依赖注入·装饰器' },
            { text: '04-数据库选型与ORM', link: '/Node.js技术选型与架构系列/04-数据库选型与ORM-MySQL·PostgreSQL·MongoDB·Prisma' },
            { text: '05-API设计范式', link: '/Node.js技术选型与架构系列/05-API设计范式-RESTful-vs-GraphQL-vs-tRPC' },
            { text: '06-认证与授权', link: '/Node.js技术选型与架构系列/06-认证与授权-JWT·OAuth2·RBAC权限体系' },
            { text: '07-缓存与消息队列', link: '/Node.js技术选型与架构系列/07-缓存与消息队列-Redis·Bull·RabbitMQ' },
            { text: '08-微服务架构', link: '/Node.js技术选型与架构系列/08-微服务架构-拆分策略·服务通信·API-Gateway' },
            { text: '09-DevOps与部署', link: '/Node.js技术选型与架构系列/09-DevOps与部署-Docker·CICD·PM2·K8s入门' },
            { text: '10-性能优化与监控', link: '/Node.js技术选型与架构系列/10-性能优化与监控-压测·APM·日志·链路追踪' }
          ]
        }
      ],
      '/GStack实战指南系列/': [
        {
          text: 'GStack实战指南',
          items: [
            { text: '01-初识GStack', link: '/GStack实战指南系列/01-初识GStack-把ClaudeCode变成虚拟开发团队' },
            { text: '02-产品与架构', link: '/GStack实战指南系列/02-产品与架构-用CEO与技术总监视角锁定项目边界' },
            { text: '03-对抗性审查', link: '/GStack实战指南系列/03-对抗性审查-深入探索review代码深度审计防线' },
            { text: '04-自动化QA', link: '/GStack实战指南系列/04-自动化QA-让AI亲自操控网页做端到端测试' },
            { text: '05-交付闭环', link: '/GStack实战指南系列/05-交付闭环-从提交流水线到ship一键发版' },
            { text: '06-完整实战', link: '/GStack实战指南系列/06-完整实战-用GStack从零开发一个AI日报生成器' }
          ]
        }
      ],
      '/Superpowers实战指南系列/': [
        {
          text: 'Superpowers实战指南',
          items: [
            { text: '01-初识Superpowers', link: '/Superpowers实战指南系列/01-初识Superpowers-给你的AI编程助手注入工程纪律' },
            { text: '02-头脑风暴', link: '/Superpowers实战指南系列/02-头脑风暴-在写代码前先把设计想明白' },
            { text: '03-TDD铁律', link: '/Superpowers实战指南系列/03-TDD铁律-没有失败的测试就不许写代码' },
            { text: '04-系统化调试', link: '/Superpowers实战指南系列/04-系统化调试-四阶段根因追踪告别碰运气式修Bug' },
            { text: '05-子代理驱动开发', link: '/Superpowers实战指南系列/05-子代理驱动开发-AI管理AI写代码的全新范式' },
            { text: '06-完整实战', link: '/Superpowers实战指南系列/06-完整实战-用Superpowers从零构建一个Markdown笔记应用' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/GoodScholar' }
    ]
  }
})
