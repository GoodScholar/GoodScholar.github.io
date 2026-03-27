# NIHoa 的技术博客 🚀

这是基于 [VitePress](https://vitepress.dev/) 以及强大的 [@sugarat/theme](https://theme.sugarat.top/) 主题体系搭建的个人技术实战沉淀与分享中心。

## 🎯 博客内容概览

通过专栏及长期打磨的系列文档，这里会记录以下核心领域的深耕进展：

- **大前端跨端架构**：深入梳理 Flutter、Taro、React Native 以及由多框架融合打造的全平台级产品实践及性能剖析方案。
- **现代化 Node.js 后端生态**：从 V8 事件循环内核，涵盖 NestJS 微服务体系、企业级 ORM 选型，再到完整的 Kubernetes 和 Vercel 的 DevOps 链路。
- **AI 效能与超级开发者**：全面记录 Claude、Cursor、Gemini 以及 GStack 等前沿代码辅助技术生态下的“超级开发者（Vibe Coding）”演进步伐。

## 🛠 本地开发与写作

如果您希望在本地预览环境并参与编辑，按如下命令启动即可：

```bash
# 1. 安装依赖包环境
npm install

# 2. 启动基于 Vite 的本地热更新文档服务器
npm run docs:dev

# (选做) 3. 全局构建并本地预览
npm run docs:build
npm run docs:preview
```

## 🌐 在线部署方案
目前仓库直接关联了 **Vercel** 服务端，所有的 Markdown 资源通过 Push 到主分支即可完成基于原生静态生成的秒级无损全站发布更新。
