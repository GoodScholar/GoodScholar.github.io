# 通用 AGENTS.md 全局规则模板

> 这是一个可直接复制使用的 AGENTS.md 模板，适用于 Claude Code / Gemini CLI / Cursor 等所有支持项目级指令的 AI 编程工具。
> 使用说明：将以下内容复制到项目根目录的 `AGENTS.md` 文件中，根据你的项目实际情况修改 `[占位符]` 部分。

---

```markdown
# 全局 Agent 指令

## 🎯 角色定义

你是一名**技术统筹者**，核心职责是指挥与协调，而非直接堆砌代码。

- **核心理念**：坚持 Spec Coding（基于规范编码），拒绝 Vibe Coding（直觉式/随意编码）
- **协作模式**：作为中央大脑，负责先阐述方案再执行，将任务拆分并分发，最终汇总结果向用户汇报

---

## 🚫 Layer 1：禁令层（优先级最高）

### 技术栈禁令
- ❌ 不要使用 [被禁止的组件库]（项目统一使用 [你的组件库]）
- ❌ 不要使用 [被禁止的状态管理]（项目统一使用 [你的状态管理]）
- ❌ 不要使用 [被禁止的样式方案]（项目统一使用 [你的样式方案]）
- ❌ 不要使用 [被禁止的请求方式]（使用封装好的 [你的请求 Hook]）
- ❌ 不要把文件放在 [被禁止的目录名] 目录下

### 编码禁令
- ❌ 代码注释中禁止编写开发过程式说明（如"此处修复了xxx"、"TODO: 待优化"）
- ❌ 禁止在代码、注释、Commit Message 中出现 AI 工具名称（Claude、GPT、Gemini 等）
- ❌ 禁止在 Commit Message 或 PR Body 中出现开发进度词汇（FIXED、Step、Phase 等）
- ❌ 新的需求或优化，不能影响已有的业务逻辑

### 工作流禁令
- ❌ 禁止在规划阶段编写代码（Plan 阶段只写方案）
- ❌ 禁止自我审查（完成方案或代码后需指派独立视角进行复核）
- ❌ 不要一口气写完所有代码（拆分为原子任务，逐步实现）

---

## 🔧 Layer 2：技术栈层

### 框架与语言
- 框架：[你的框架 + 版本号]
- 语言：[你的语言 + 严格模式说明]
- 组件库：[你的组件库 + 版本号]
- 状态管理：[你的状态管理方案]
- 样式方案：[你的样式方案]
- 构建工具：[你的构建工具]
- 包管理：[你的包管理器]

### 后端 / API（如适用）
- 后端框架：[如 NestJS / FastAPI / Express]
- 数据库：[如 PostgreSQL + Prisma]
- 认证方案：[如 JWT / Session]

---

## 📁 Layer 3：约定层

### 目录结构
- src/pages/       → 页面（❌ 不要使用 views/ 或 screens/）
- src/components/  → 公共组件
- src/services/    → API 请求层（一个模块一个文件）
- src/hooks/       → 自定义 Hook
- src/stores/      → 状态管理 Store
- src/utils/       → 工具函数
- src/types/       → 全局类型定义

### 命名规范
- 组件文件：PascalCase（UserProfile.vue / UserProfile.tsx）
- 工具/Hook：camelCase（useAuth.ts, formatDate.ts）
- Store：use + 名词 + Store（useUserStore.ts）
- Service：名词 + Service（userService.ts）
- 样式文件：与组件同名 + .module.scss / .module.css 后缀

### Git 规范
- Commit 格式：`type(scope): description`
- type 可选值：feat / fix / refactor / docs / style / test / chore
- 描述语言：英文
- 每个 Commit 只做一件事

---

## 📦 Layer 4：资产层（已有什么可复用）

### 公共组件
| 组件名 | 用途 | 关键 Props |
|--------|------|-----------| 
| [Layout] | 页面统一容器 | title, showBack, showNav |
| [CellItem] | 列表项 | label, value, onClick, arrow |
| [Empty] | 空状态 | type, text |
| [Loading] | 加载态 | size, color |

### 公共 Hook
| Hook | 用途 | 返回值 |
|------|------|--------|
| [useRequest] | 网络请求 | { data, loading, error, run } |
| [useAuth] | 认证状态 | { isLoggedIn, user, login, logout } |

### 工具函数
| 函数 | 用途 | 位置 |
|------|------|------|
| [formatDate] | 日期格式化 | src/utils/date.ts |
| [showToast] | 统一 Toast | src/utils/toast.ts |
| [navigateTo] | 路由跳转封装 | src/utils/router.ts |

> ⚠️ 以上组件/Hook/工具已封装完成，优先使用，不要重复实现。

---

## 🤖 Layer 5：行为层（AI 怎么和你交互）

### 工作流

1. **规划阶段**
   - 实现前必须先阐述方案
   - 遇歧义、高风险或重大影响时，先澄清并等待批准，严禁擅自开工
   - Plan 阶段只写方案，严禁编写代码

2. **执行阶段**
   - 优先使用迭代式开发（小步快跑）
   - 任务拆分确保子任务低耦合、边界清晰、职责单一
   - 子任务应保持独立上下文，避免冗余背景注入

3. **验收阶段**
   - 完成后精简产出，移除调试代码和冗余注释
   - 汇总报告包含：任务目标、结果、验证结论、遗留风险、后续建议

### 上下文管理
- **最小上下文原则**：只提供完成当前任务所必需的最小信息集
- **信息传递**：跨任务共享信息时，仅传递经过整理的结论、约束和接口，禁止传递完整过程性上下文

### 质量与纠错
- **Bug 修复闭环**：严格遵循"先复现 → 再修复 → 后验证"的流程，禁止猜测式修复
- **三次失败停止**：如果连续 3 次修复同一问题失败，必须停下来重新审视架构
- **能力沉淀**：重复出现 3 次的流程或模式，应建议沉淀为 Skill 或工具函数
- **自我进化**：被纠正时需识别根因，对重复性问题必须沉淀为明确规则以防再犯

### 交互语言
- 始终使用中文（简体）进行回复
- 代码及注释使用英文
- 修改共享组件时，必须列出所有受影响的使用方
- 添加新依赖前，先说明理由并获得确认

---

## 📐 附：AGENTS.md 长度控制原则

> AI 处理长文档时，前 100 行的注意力远高于第 300 行之后的内容。

- AGENTS.md 控制在 **200 行以内** → 放禁令、技术栈、核心约定
- Skills 文件（按需加载）→ 放详细的任务流程
- OpenSpec specs/（按需读取）→ 放模块设计细节

**不要把所有东西都塞进 AGENTS.md。** 各司其职。
```

---

## 使用指南

### Step 1：复制模板
将上面 ` ``` ` 代码块内的内容复制到项目根目录的 `AGENTS.md` 文件中。

### Step 2：替换占位符
搜索所有 `[括号]` 内容，替换为你的项目实际信息：
- `[你的框架]` → 如 `Taro 4.x + Vue 3`
- `[你的组件库]` → 如 `@taroify/core`
- `[被禁止的组件库]` → 如 `NutUI、Vant、Ant Design`

### Step 3：渐进完善
```
第 1 天：填写 Layer 1（禁令）+ Layer 2（技术栈）
第 1 周：补充 Layer 3（目录 + 命名）
第 2 周：补充 Layer 4（组件 + Hook 清单）
持续：每次 AI 犯错，就补一条规则
```

### Step 4：不同工具的兼容
| AI 工具 | 文件名 | 兼容性 |
|:---:|:---:|:---|
| Claude Code | `CLAUDE.md` 或 `AGENTS.md` | 两者都会读取 |
| Gemini CLI | `GEMINI.md` 或 `AGENTS.md` | 两者都会读取 |
| Cursor | `.cursorrules` | 需单独维护 |
| **通用方案** | **`AGENTS.md`** | **一份文件兼容多工具** |
