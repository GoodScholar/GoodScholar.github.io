---
date: 2025-06-11
cover: /covers/cover-ai-app-dev.webp
---
# 🎯 AI 应用开发实战（一）：给你的 App 接上 AI — 架构设计与模型选型

> **系列导读**：这是「AI 应用开发实战」系列的第 1 篇。不是教你用 AI 写代码，
> 而是教你在自己的产品中**落地 AI 能力**。本篇是一切的起点——架构怎么设计，模型怎么选。

**本文目标**：建立 AI 应用的整体认知框架，掌握云端 vs 端侧的决策模型，学会按业务需求选择正确的模型和供应商。

---

## 📊 AI 应用 ≠ 调 API

很多开发者以为「给 App 接上 AI」就是调一下 OpenAI 的接口。现实是：

| 你以为的 | 实际上的 |
|---------|---------|
| 调一个 API | 设计完整的 AI 架构（请求链路、缓存、降级） |
| 用 GPT-4o 解决一切 | 不同任务选不同模型（成本差 100 倍） |
| Prompt 写好就行 | 需要 RAG、Function Calling、上下文管理 |
| 免费/便宜 | Token 成本可能成为最大支出 |
| 响应很快 | 需要流式渲染、加载态、超时处理 |

> **AI 功能的开发量 ≈ 30% 模型调用 + 70% 工程化。**

---

## 🏗 1. AI 应用架构设计

### 典型架构

```
┌─────────────────────────────────────────────────┐
│                    Client                        │
│  React / Flutter / 小程序                        │
│  ┌────────────┐  ┌────────────┐                 │
│  │ AI Chat UI │  │ AI 搜索框  │                 │
│  └──────┬─────┘  └─────┬──────┘                 │
└─────────┼──────────────┼────────────────────────┘
          │              │
          ▼              ▼
┌─────────────────────────────────────────────────┐
│              API Gateway / BFF                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │ 鉴权限流  │ │ Token 预算│ │ 缓存 & 降级策略  ││
│  └──────────┘ └──────────┘ └──────────────────┘│
└─────────────────────┬───────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│  LLM Service │ │ Embedding│ │ Vector DB    │
│  (对话/摘要)  │ │ Service  │ │ (语义搜索)    │
│  GPT-4o/Claude│ │ text-3   │ │ pgvector     │
└──────────────┘ └──────────┘ └──────────────┘
```

### 分层职责

| 层 | 职责 | 关键设计点 |
|----|------|----------|
| **Client** | UI 展示 + 流式渲染 | SSE 接收、打字机效果、加载态 |
| **API Gateway** | 鉴权、限流、路由 | Token 预算、用户配额、A/B 测试 |
| **AI Service** | 模型调用 + 业务编排 | Prompt 管理、RAG 流程、重试逻辑 |
| **Data Layer** | 向量库 + 传统数据库 | Embedding 索引、缓存策略、数据同步 |

---

## 🧠 2. 云端 vs 端侧：在哪里跑模型？

### 决策矩阵

| 维度 | 云端 AI | 端侧 AI |
|------|---------|---------|
| **精度** | ⭐⭐⭐⭐⭐ 最新最强模型 | ⭐⭐⭐ 受限于模型大小 |
| **延迟** | 200ms-5s（含网络） | 10ms-500ms |
| **隐私** | ⚠️ 数据离开设备 | ✅ 数据不出设备 |
| **成本** | 按 Token 付费，可能很贵 | 一次性（模型下载），后续免费 |
| **离线** | ❌ 需要网络 | ✅ 完全离线 |
| **适合** | 复杂推理/生成/对话 | 分类/OCR/图像识别/简单 NLP |

### 什么场景用端侧？

```
端侧 AI 适合:
  ✅ 实时人脸检测（相机取景框）
  ✅ 文本分类（垃圾评论过滤）
  ✅ OCR（名片/发票识别）
  ✅ 语音唤醒词
  ✅ 图像风格分类

云端 AI 适合:
  ✅ 多轮对话
  ✅ 长文本摘要/翻译
  ✅ 代码生成
  ✅ 复杂推理
  ✅ 图像生成
```

---

## 🤖 3. 模型选型指南

### 主流模型对比（2025 年）

| 模型 | 供应商 | 输入价格/1M Token | 输出价格/1M Token | 上下文窗口 | 适合场景 |
|------|--------|-------------------|-------------------|-----------|---------|
| **GPT-4o** | OpenAI | $2.50 | $10.00 | 128K | 复杂推理/多模态 |
| **GPT-4o-mini** | OpenAI | $0.15 | $0.60 | 128K | 分类/摘要/简单任务 |
| **Claude 3.5 Sonnet** | Anthropic | $3.00 | $15.00 | 200K | 长文本/代码/分析 |
| **Claude 3.5 Haiku** | Anthropic | $0.25 | $1.25 | 200K | 高速/低成本任务 |
| **Gemini 1.5 Pro** | Google | $1.25 | $5.00 | 1M | 超长上下文 |
| **Gemini 1.5 Flash** | Google | $0.075 | $0.30 | 1M | 最低成本 |
| **DeepSeek V3** | DeepSeek | $0.27 | $1.10 | 64K | 中文场景/性价比 |

### 选型决策树

```
你的 AI 功能需要什么？
    │
    ├── 复杂推理 + 多模态（图片理解）
    │   └── GPT-4o / Claude 3.5 Sonnet
    │
    ├── 简单分类/提取/摘要
    │   └── GPT-4o-mini / Gemini Flash（💰 成本最低）
    │
    ├── 超长文本处理（>100K Token）
    │   └── Gemini 1.5 Pro（1M 上下文）/ Claude（200K）
    │
    ├── 代码生成/辅助
    │   └── Claude 3.5 Sonnet / GPT-4o
    │
    ├── 中文场景 + 极致性价比
    │   └── DeepSeek V3 / 通义千问
    │
    └── 实时对话（低延迟）
        └── GPT-4o-mini / Claude Haiku
```

---

## 💰 4. 成本估算模型

### 按 DAU 估算月费

假设每个用户每天使用 AI 功能 5 次，每次平均消耗 1000 Token（输入+输出）：

| DAU | 月 Token 消耗 | GPT-4o 月费 | GPT-4o-mini 月费 | Gemini Flash 月费 |
|-----|-------------|-------------|-----------------|------------------|
| 100 | 15M | $187 | $11 | $5 |
| 1,000 | 150M | $1,875 | $112 | $56 |
| 10,000 | 1.5B | $18,750 | $1,125 | $562 |
| 100,000 | 15B | $187,500 | $11,250 | $5,625 |

> **关键洞察**：GPT-4o 和 GPT-4o-mini 的成本差距是 **17 倍**。大部分功能用 mini 就够了。
> 只在需要复杂推理的场景才升级到完整模型。

### 成本控制策略

| 策略 | 效果 | 实现难度 |
|------|------|---------|
| **分级模型路由** | 节省 70-90% | ⭐⭐ |
| **语义缓存** | 节省 30-50%（重复问题） | ⭐⭐⭐ |
| **Prompt 压缩** | 节省 20-40% | ⭐⭐ |
| **用户 Token 配额** | 防止滥用 | ⭐ |
| **批量处理** | 降低 50%（Batch API） | ⭐⭐ |

---

## 🛠 5. 技术栈选择

### 后端

| 方案 | 语言 | 适合 | AI SDK |
|------|------|------|--------|
| **Node.js + Express** | TypeScript | 前端全栈 | `openai`, `@anthropic-ai/sdk` |
| **Python + FastAPI** | Python | AI/ML 团队 | `openai`, `langchain` |
| **Next.js API Routes** | TypeScript | Vercel 部署 | `ai` (Vercel AI SDK) |
| **Dart + shelf** | Dart | Flutter 全栈 | `dart_openai` |

### 前端

| 框架 | AI 组件支持 | 流式渲染 |
|------|-----------|---------|
| **React + Vercel AI SDK** | ✅ `useChat` / `useCompletion` | ✅ 内置 |
| **Flutter** | ⚠️ 需要手动实现 | ✅ SSE 解析 |
| **Vue** | ⚠️ 社区方案 | ✅ SSE 解析 |

### 推荐技术栈组合

```
🏆 最快上手：Next.js + Vercel AI SDK + OpenAI
   → 内置流式渲染、React Server Components、Edge Runtime

🏆 Flutter 全栈：Flutter + Dart 后端 + OpenAI API
   → 前后端统一语言

🏆 最灵活：React + Node.js + LangChain
   → 模型可插拔、RAG 生态最丰富
```

---

## 🔧 6. 快速上手：第一个 AI 接口

### Next.js + Vercel AI SDK 示例

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: '你是一个友好的技术助手，用简洁的中文回答问题。',
    messages,
    maxTokens: 1000,
  })

  return result.toDataStreamResponse()
}
```

```typescript
// app/page.tsx
'use client'
import { useChat } from 'ai/react'

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat()

  return (
    <div className="chat-container">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.role}`}>
          {msg.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="输入你的问题..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '思考中...' : '发送'}
        </button>
      </form>
    </div>
  )
}
```

### Flutter 端调用示例

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class AIService {
  static const _baseUrl = 'https://api.openai.com/v1';
  final String _apiKey;

  AIService(this._apiKey);

  /// 流式对话（SSE）
  Stream<String> chat(List<Map<String, String>> messages) async* {
    final request = http.Request('POST', Uri.parse('$_baseUrl/chat/completions'))
      ..headers.addAll({
        'Authorization': 'Bearer $_apiKey',
        'Content-Type': 'application/json',
      })
      ..body = jsonEncode({
        'model': 'gpt-4o-mini',
        'messages': messages,
        'stream': true,
        'max_tokens': 1000,
      });

    final response = await http.Client().send(request);

    await for (final chunk in response.stream.transform(utf8.decoder)) {
      for (final line in chunk.split('\n')) {
        if (line.startsWith('data: ') && line != 'data: [DONE]') {
          final json = jsonDecode(line.substring(6));
          final content = json['choices'][0]['delta']['content'];
          if (content != null) yield content;
        }
      }
    }
  }
}
```

---

## ✅ 本篇小结 Checklist

- [ ] 理解 AI 应用的分层架构
- [ ] 能根据场景选择云端 or 端侧
- [ ] 掌握主流模型的定价和能力差异
- [ ] 能估算 AI 功能的月度成本
- [ ] 知道 Token 成本控制的 5 种策略
- [ ] 能搭建第一个 AI 对话接口

---

> **下一篇预告**：《AI 应用开发实战（二）：语义搜索实战 — Embedding + 向量数据库》——
> 告别关键词匹配，用向量搜索让你的搜索框「理解」用户意图。

---

*本文是「AI 应用开发实战」系列第 1 篇，共 8 篇。*

---
*📝 作者：NIHoa ｜ 系列：AI应用开发实战系列 ｜ 更新日期：2025-06-11*
