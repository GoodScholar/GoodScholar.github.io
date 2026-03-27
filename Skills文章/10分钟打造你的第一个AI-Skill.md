---
date: 2026-03-25
---
# 10 分钟打造你的第一个 AI Skill

> 与其在网上找别人的 Skill 然后发现不合适，不如花 10 分钟自己写一个量身定制的。这篇文章手把手教你从零创建一个真正有用的 Skill，并且让你理解为什么"自造 Skill"是 AI 时代最值得投资的技能。

---

## 🤔 为什么要自己写 Skill？

GitHub 上有 50 万+ 的 Skills 可以直接用，为什么还要自己写？

因为**真正有价值的规范是你自己的**。

| 场景 | 用别人的 Skill | 用自己写的 Skill |
|------|-------------|--------------|
| 代码风格 | 可能跟你团队的不一样 | 完美匹配你的偏好 |
| 技术栈 | 通用方案，不够精准 | 针对你的项目量身定制 |
| 工作习惯 | 别人的流程不一定适合你 | 把你最高效的工作方式固化下来 |
| 踩坑记录 | 别人没踩过你踩过的坑 | 把你的血泪教训写进去 |

一句话：**别人的 Skill 是"行业通用版"，你自己写的 Skill 是"私人定制版"。**

---

## 📐 Skill 的文件结构

一个 Skill 最简单的形态就是一个 `SKILL.md` 文件。更完整的 Skill 可以包含目录结构：

```
my-skill/
├── SKILL.md           # 📖 核心指令文件（必须）
├── scripts/           # 🔧 辅助脚本（可选）
│   └── generate.sh
├── examples/          # 📝 示例代码（可选）
│   └── example.vue
└── references/        # 📚 参考文档（可选）
    └── naming-rules.md
```

但今天我们先从最简单的开始——**一个文件搞定**。

---

## 🚀 实战：创建一个「Vue 3 组件规范」Skill

### 场景假设

你是一个 Vue 3 开发者，你希望 AI 每次帮你写 Vue 组件时都遵循以下规范：

- 使用 `<script setup lang="ts">` 组合式 API
- Props 用 `defineProps` + TypeScript 接口
- Emit 用 `defineEmits` + 类型声明
- 样式用 `<style scoped>` + BEM 命名
- 每个组件必须包含 JSDoc 注释

### Step 1：创建目录

```bash
# 在你的项目中创建 Skills 目录
mkdir -p .agent/skills/vue3-component-standard
```

### Step 2：编写 SKILL.md

```markdown
---
name: vue3-component-standard
description: >
  当用户要求创建 Vue 组件、编写 Vue 页面、生成 Vue 模板时使用此 skill。
  触发关键词包括：Vue 组件、Vue 页面、.vue 文件、组件开发、
  defineProps、defineEmits、组合式 API、Composition API。
---

# Vue 3 组件开发规范

## 基本原则

1. **始终使用** `<script setup lang="ts">`，不使用 Options API
2. **始终使用** TypeScript，为所有 Props 和 Emits 定义类型
3. **文件组织**：`<script>` → `<template>` → `<style>` 的顺序

## Props 规范

使用 `defineProps` 配合 TypeScript 接口：

` ` `typescript
// ✅ 正确
interface Props {
  /** 用户名称 */
  name: string
  /** 年龄，默认 18 */
  age?: number
  /** 是否显示头像 */
  showAvatar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  age: 18,
  showAvatar: true,
})

// ❌ 错误：不要用运行时声明
defineProps({
  name: { type: String, required: true },
})
` ` `

## Emits 规范

使用 `defineEmits` 配合类型声明：

` ` `typescript
// ✅ 正确
const emit = defineEmits<{
  /** 提交表单时触发 */
  submit: [data: FormData]
  /** 取消操作时触发 */
  cancel: []
  /** 值变化时触发 */
  'update:modelValue': [value: string]
}>()

// ❌ 错误：不要用字符串数组
defineEmits(['submit', 'cancel'])
` ` `

## 样式规范

- 始终使用 `<style scoped>`
- 使用 BEM 命名规范
- 使用 CSS 变量管理主题色

` ` `css
<style scoped>
.user-card {
  padding: var(--spacing-md);
}
.user-card__header {
  display: flex;
  align-items: center;
}
.user-card__header--active {
  color: var(--color-primary);
}
</style>
` ` `

## 组件 JSDoc 注释

每个组件文件顶部必须包含注释说明：

` ` `typescript
/**
 * @component UserCard
 * @description 用户信息卡片组件，用于展示用户头像、名称和基本信息
 * @example
 * <UserCard name="张三" :age="25" @submit="handleSubmit" />
 */
` ` `

## 完整组件模板

` ` `vue
<script setup lang="ts">
/**
 * @component [组件名]
 * @description [组件描述]
 */

interface Props {
  // 定义 Props
}

const props = withDefaults(defineProps<Props>(), {
  // 默认值
})

const emit = defineEmits<{
  // 定义事件
}>()

// 组合式逻辑
</script>

<template>
  <div class="[component-name]">
    <!-- 模板内容 -->
  </div>
</template>

<style scoped>
.[component-name] {
  /* 样式 */
}
</style>
` ` `
```

> 💡 **注意**：以上代码块中的反引号因排版需要加了空格，实际使用时去掉空格即可。

### Step 3：验证效果

在你的 AI 编程助手中输入：

```
帮我创建一个 UserProfile 组件，展示用户头像、名称和邮箱，
支持点击编辑按钮触发编辑事件。
```

**没有 Skill 时**，AI 可能给你：
- Options API 写法
- 没有 TypeScript
- 没有注释
- 样式不规范

**有了 Skill 后**，AI 会：
- ✅ 自动使用 `<script setup lang="ts">`
- ✅ 用接口定义 Props
- ✅ 用类型声明定义 Emits
- ✅ 添加 JSDoc 注释
- ✅ 使用 BEM 风格的 scoped 样式

---

## 📐 写好 Skill 的 5 个关键原则

### 原则 1：Description 要精准

`description` 是 AI 决定「要不要用这个 Skill」的唯一依据。

```yaml
# ❌ 太模糊
description: Vue 相关的开发规范

# ✅ 精准列出触发关键词
description: >
  当用户要求创建 Vue 组件、编写 Vue 页面、生成 .vue 文件时使用。
  触发关键词：Vue 组件、defineProps、组合式 API、Composition API。
```

### 原则 2：给正确和错误的示例

AI 最怕的不是不知道该怎么做，而是不知道什么是错的。

```markdown
// ✅ 正确：使用 TypeScript 接口
interface Props { name: string }
const props = defineProps<Props>()

// ❌ 错误：不要用运行时声明
defineProps({ name: { type: String } })
```

**对比式教学**是最有效的 Skill 编写方式。

### 原则 3：提供完整模板

不要只写规则，要写模板。给 AI 一个可以直接"填空"的完整示例，准确率远高于抽象描述。

### 原则 4：单一职责

一个 Skill 只管一件事：
- ✅ `vue3-component-standard` —— 只管 Vue 组件规范
- ✅ `git-commit-convention` —— 只管 commit 格式
- ❌ `全栈开发大全` —— 什么都管 = 什么都管不好

### 原则 5：持续迭代

Skill 不是写完就不动了。你在使用中发现 AI 还是会犯的错误，就加到 Skill 里：

```markdown
## 常见错误提醒
- ⚠️ 不要在 `<script setup>` 中使用 `export default`
- ⚠️ 不要忘记给 v-for 加 :key
- ⚠️ 不要用 any 类型，至少用 unknown
```

---

## 🎨 4 个实用 Skill 创意

写完第一个 Skill 之后，你可能会上瘾。这里是 4 个值得考虑的方向：

### 1. Git Commit Message 规范

```yaml
---
name: git-commit-convention
description: 当用户要 commit、提交代码、写 commit message 时使用
---
```
让 AI 按照 `feat: 添加用户登录功能` 的 Conventional Commits 格式生成 commit，还可以加 emoji 映射：`✨ feat` / `🐛 fix` / `📝 docs`。

### 2. API 接口文档生成

```yaml
---
name: api-doc-generator
description: 当用户写 API 接口、创建路由、编写 Controller 时使用
---
```
让 AI 每次写接口代码时自动附带 Swagger/OpenAPI 格式的文档注释。

### 3. 代码审查清单

```yaml
---
name: code-review-checklist
description: 当用户要求审查代码、review 代码、检查代码时使用
---
```
定义审查维度（安全、性能、可读性、错误处理）和严重等级，让 AI 按清单式审查。

### 4. 项目 README 模板

```yaml
---
name: readme-generator
description: 当用户要求生成 README、编写项目文档时使用
---
```
固定 README 结构：项目简介 → 功能特性 → 快速开始 → 技术栈 → 目录结构 → 贡献指南。

---

## ❓ 常见问题

### Q：我需要会编程才能写 Skill 吗？

不需要。Skill 是用 Markdown 写的，你只需要会写自然语言 + 贴代码示例就行。这也是 Skills 相比传统插件最大的优势——**降低了创造门槛**。

### Q：一个 Skill 能写多长？

理论上没有限制，但建议控制在 500 行以内。太长的 Skill 会占用大量上下文窗口，影响 AI 处理其他任务的能力。如果你的规范很复杂，可以拆分成多个 Skill，或把详细内容放到 `references/` 目录做延伸阅读。

### Q：怎么测试 Skill 有没有生效？

最简单的方法：给 AI 一个你知道"标准答案"的任务。比如让它写一个你很熟悉的组件，看生成的代码是否遵循了你在 Skill 里定义的规范。

### Q：可以和团队共享 Skill 吗？

可以！而且强烈建议。把 Skills 放在项目的 `.agent/skills/` 目录下，跟代码一起提交到 Git，这样团队每个人的 AI 助手都遵循相同的规范。

---

## 🎯 行动清单

1. ✏️ **现在就动手**创建你的第一个 `SKILL.md` 文件
2. 🧪 **测试它**——给 AI 一个任务，看 Skill 有没有生效
3. 🔄 **迭代它**——发现 AI 还犯的错误，就补充到 Skill 里
4. 👥 **分享它**——把 Skill 提交到项目的 Git 仓库中

记住：**每个你写下的 Skill 都是你经验和智慧的数字化沉淀。** 它会在每一次 AI 交互中为你工作，永不遗忘、永不偷懒。

---

*📝 作者：NIHoa ｜ 更新日期：2026-03-25*
