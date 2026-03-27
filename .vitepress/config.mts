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
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/GoodScholar' }
    ]
  }
})
