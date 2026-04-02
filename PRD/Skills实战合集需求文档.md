# Skills 实战合集 - 需求文档

## 项目背景

将原有的「Superpowers 实战指南系列」（7 篇线性教程）重构为场景驱动的独立实战文章合集，面向 Vibe Coding / AI Coding 用户。

## 核心定位

- **独立成篇**：每篇文章可独立阅读，无顺序依赖
- **场景驱动**：围绕真实开发场景展示 Skills 组合使用
- **可持续扩展**：后期可随时补充新文章

## 文章规范

### Frontmatter 格式
```yaml
---
date: YYYY-MM-DD
tags:
  - AI编程
  - Skills实战
  - [具体 Skill 标签]
cover: /covers/cover-skills-practice-XX.webp
---
```

### 统一结构
1. 场景与挑战
2. Skills 组合清单
3. 实战过程
4. 效果对比
5. 实战心得

### 末尾签名
```
*📝 作者：NIHoa ｜ 更新日期：YYYY-MM-DD*
```

## 首批文章清单

| 序号 | 标题 | Skills 组合 |
|:---:|:---|:---|
| 1 | 从零搭建CLI工具 | brainstorming + TDD + writing-plans |
| 2 | 生产Bug排查实录 | systematic-debugging + TDD |
| 3 | 让AI管AI开发 | subagent + dispatching-parallel-agents + verification |
| 4 | GStack+Superpowers组合拳 | GStack全套 + Superpowers执行链 |
| 5 | OpenSpec+Superpowers持续迭代 | OpenSpec提案归档 + Superpowers质量保障 |

## 技术要求

- 目录名：`Skills实战合集/`
- 文件名：描述性命名，不使用序号前缀
- VitePress sidebar 和 nav 需同步更新
- 每篇文章需生成 16:9 科技风封面图
