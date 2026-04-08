---
date: 2025-05-07
tags:
  - AI编程
  - Skills实战
  - 前端开发
  - Vue3
  - Superpowers
cover: /covers/cover-skills-practice-frontend.webp
---
# 用 Skills 搞定前端 — 从组件规范到页面交付的全链路实战

> 🎨 同样让 AI 写一个 Vue 页面，没有 Skills 的人花了 2 小时反复调整组件风格、接口规范和权限逻辑；有 Skills 的人花 20 分钟一次出稿。差距不在 AI 的能力，**在于你有没有提前把你的"审美"和"规范"教给它。**

---

## 🎯 场景与挑战

你接到一个需求：为后台管理系统开发一个**文章管理模块**，包含：

- 文章列表页（搜索 + 筛选 + 分页 + 状态标签）
- 文章编辑页（富文本编辑器 + 封面上传 + 分类选择 + 标签管理）
- 权限控制（编辑权仅管理员，普通用户只读）

**如果不用 Skills，你会经历什么？**

```
Round 1：AI 写了一个列表页
  ❌ 用了 Options API 而不是 Composition API
  ❌ 样式用了行内 style 而不是你团队的 BEM 规范
  ❌ 表格直接裸写 <table>，没有用 UI 框架组件
  → 你把规范讲了一遍，让它重写

Round 2：AI 按规范重写了列表页
  ❌ 请求层直接用了 axios.get，没有走统一封装
  ❌ 分页逻辑和 UI 逻辑混在一个组件里
  → 你又讲了一遍接口封装规范

Round 3：AI 修好了列表页，开始写表单页
  ❌ 它忘了前两轮的规范（上下文太长了）
  ❌ 表单校验用了原生 HTML5 而不是你们的校验库
  → 你第三次从头讲规范……

累不累？三个回合下来你讲了 3 次规范，AI 改了 3 轮代码。
```

**根本问题**：前端开发涉及 UI 框架、样式体系、组件结构、接口规范、权限控制等**多个维度的约束**，你不可能每次都把这些规范口头重复一遍。

---

## 🧰 Skills 组合

本篇用到 5 个原子 Skills 的组合：

| Skill | 管什么 | 核心约束 |
|:---:|:---|:---|
| `vue3-component` | 组件结构 | script setup + TypeScript + BEM |
| `element-plus-ui` | UI 框架用法 | 只用 Element Plus 组件，禁止裸写 HTML |
| `api-request` | 接口封装 | useRequest hook + 泛型响应结构 |
| `form-validation` | 表单校验 | 校验规则与 DTO 对齐 + 中文错误提示 |
| `rbac-permission` | 权限控制 | Permission 组件包裹 + 角色常量 |

```
不同任务加载不同组合：

纯 UI 组件  →  vue3-component + element-plus-ui
接口 Hook  →  api-request
表单页面   →  vue3-component + element-plus-ui + form-validation + api-request
涉及权限   →  + rbac-permission

5 个 Skills 的排列组合 → 覆盖前端 90% 的开发场景
```

---

## 🛠️ 实战过程

### Phase 1：准备 Skills — 把你的规范写下来

以 `vue3-component` Skill 为例，核心内容：

```markdown
---
name: vue3-component
description: >
  创建 Vue 组件、页面、模板时使用。触发关键词：Vue 组件、页面、
  .vue 文件、defineProps、defineEmits、Composition API。
---

# Vue 3 组件规范

## 基本要求
1. 始终使用 `<script setup lang="ts">`
2. 文件顺序：script → template → style
3. 组件名使用 PascalCase，文件名使用 PascalCase

## Props 规范
// ✅ 正确
interface Props {
  /** 文章标题 */
  title: string
  /** 是否可编辑 */
  editable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  editable: false,
})

// ❌ 错误：禁止运行时声明
defineProps({ title: { type: String } })

## 样式规范
- 使用 <style scoped>
- 使用 BEM 命名：.article-card__header--active
- 颜色使用 CSS 变量：var(--color-primary)
- 间距使用设计 Token：var(--spacing-md)
```

以 `element-plus-ui` Skill 为例：

```markdown
---
name: element-plus-ui
description: >
  涉及 UI 组件、表格、表单、弹窗、按钮等界面元素时使用。
---

# Element Plus UI 规范

## 表格
✅ 使用 <el-table> + <el-table-column>
❌ 禁止裸写 <table>

## 按钮
✅ <el-button type="primary">
❌ 禁止 <button class="...">

## 弹窗
✅ <el-dialog> 用于表单
✅ <el-drawer> 用于详情
❌ 禁止自己写 Modal 组件

## 加载状态
✅ 表格用 v-loading 指令
✅ 按钮用 :loading 属性
❌ 禁止自己写 Loading 组件
```

> **关键原则**：每个 Skill 只管一个维度，用 ✅/❌ 对比告诉 AI 什么能做、什么不能做。

---

### Phase 2：开发文章列表页 — 3 个 Skills 协同

你输入：

```
帮我创建文章列表页 ArticleList.vue，需要：
- 搜索栏（标题关键词 + 状态筛选）
- 文章表格（标题、作者、状态、创建时间、操作）
- 分页
- 管理员可以编辑和删除，普通用户只能查看
```

AI 自动加载 `vue3-component` + `element-plus-ui` + `api-request` + `rbac-permission`，产出：

```vue
<script setup lang="ts">
/**
 * @component ArticleList
 * @description 文章列表页，支持搜索筛选、分页和权限控制
 */
import { ref, reactive } from 'vue'
import { useArticleList, useDeleteArticle } from '@/api/article'
import Permission from '@/components/Permission.vue'

// ✅ api-request Skill：使用统一的 useRequest hook
const searchForm = reactive({
  keyword: '',
  status: '' as '' | 'draft' | 'published',
})
const pagination = reactive({ page: 1, pageSize: 20 })

const { data: articleList, loading, refresh } = useArticleList(
  () => ({ ...searchForm, ...pagination })
)

// ✅ api-request Skill：删除操作也走 hook
const { execute: deleteArticle } = useDeleteArticle()

async function handleDelete(id: string) {
  await ElMessageBox.confirm('确认删除这篇文章？')
  await deleteArticle(id)
  refresh()
}

function handleSearch() {
  pagination.page = 1
  refresh()
}
</script>

<template>
  <div class="article-list">
    <!-- ✅ element-plus-ui Skill：使用 el-form 做搜索栏 -->
    <el-form :model="searchForm" inline class="article-list__search">
      <el-form-item label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索文章标题"
          clearable
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" clearable>
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- ✅ element-plus-ui Skill：使用 el-table + v-loading -->
    <el-table :data="articleList?.list" v-loading="loading">
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'">
            {{ row.status === 'published' ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <!-- ✅ rbac-permission Skill：用 Permission 组件控制 -->
          <Permission :roles="['admin']">
            <el-button link type="primary" @click="handleEdit(row.id)">
              编辑
            </el-button>
            <el-button link type="danger" @click="handleDelete(row.id)">
              删除
            </el-button>
          </Permission>
        </template>
      </el-table-column>
    </el-table>

    <!-- ✅ element-plus-ui Skill：使用 el-pagination -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :total="articleList?.total ?? 0"
      layout="total, sizes, prev, pager, next"
      @size-change="refresh"
      @current-change="refresh"
    />
  </div>
</template>

<style scoped>
/* ✅ vue3-component Skill：BEM 命名 + CSS 变量 */
.article-list {
  padding: var(--spacing-lg);
}
.article-list__search {
  margin-bottom: var(--spacing-md);
}
</style>
```

**注意看**：AI 生成的代码，每一处都能对应到具体的 Skill 约束。这不是巧合，这是规范的力量。

---

### Phase 3：开发文章编辑表单 — 4 个 Skills 协同

```
帮我创建文章编辑表单 ArticleForm.vue，在 Drawer 中使用，
支持新增和编辑模式，包含：标题、内容（富文本）、分类、标签、封面图。
```

AI 自动加载 `vue3-component` + `element-plus-ui` + `form-validation` + `api-request`：

```vue
<script setup lang="ts">
/**
 * @component ArticleForm
 * @description 文章编辑表单，支持新增/编辑两种模式
 */
import type { CreateArticleDTO, UpdateArticleDTO } from '@/types/article'

interface Props {
  /** 编辑模式传入文章 ID */
  articleId?: string
  /** 控制 Drawer 显隐 */
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  saved: []
}>()

const isEdit = computed(() => !!props.articleId)

// ✅ form-validation Skill：校验规则与 DTO 字段对齐
const rules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2-100 之间', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' },
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
  ],
}

// ✅ api-request Skill：统一 hook 封装
const { execute: createArticle, loading: creating } = useCreateArticle()
const { execute: updateArticle, loading: updating } = useUpdateArticle()

async function handleSubmit() {
  await formRef.value?.validate()
  if (isEdit.value) {
    await updateArticle(props.articleId!, formData)
  } else {
    await createArticle(formData)
  }
  ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
  emit('saved')
  emit('update:visible', false)
}
</script>

<template>
  <!-- ✅ element-plus-ui Skill：详情表单用 Drawer -->
  <el-drawer
    :model-value="visible"
    :title="isEdit ? '编辑文章' : '新建文章'"
    size="60%"
    @update:model-value="emit('update:visible', $event)"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" maxlength="100" show-word-limit />
      </el-form-item>

      <el-form-item label="分类" prop="categoryId">
        <el-tree-select
          v-model="formData.categoryId"
          :data="categoryTree"
          check-strictly
          placeholder="选择分类"
        />
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <el-select v-model="formData.tags" multiple filterable allow-create>
          <el-option
            v-for="tag in tagOptions"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="封面">
        <el-upload
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleCoverUpload"
        >
          <img v-if="formData.cover" :src="formData.cover" class="article-form__cover" />
          <el-icon v-else class="article-form__upload-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <RichTextEditor v-model="formData.content" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">取消</el-button>
      <el-button
        type="primary"
        :loading="creating || updating"
        @click="handleSubmit"
      >
        {{ isEdit ? '更新' : '创建' }}
      </el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
.article-form__cover {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
}
.article-form__upload-icon {
  width: 200px;
  height: 120px;
  border: 1px dashed var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--color-text-placeholder);
}
</style>
```

---

### Phase 4：验收审查 — code-review Skill 自动检查

```
对 ArticleList.vue 和 ArticleForm.vue 进行代码审查。
```

AI 加载 `code-review` Skill，输出：

```markdown
## 审查报告

### ArticleList.vue
✅ [PASS] 使用 script setup + TypeScript
✅ [PASS] 所有 UI 组件来自 Element Plus
✅ [PASS] 操作按钮有 Permission 包裹
✅ [PASS] API 使用统一 hook 封装
✅ [PASS] BEM 命名规范
⚠️ [WARN] handleEdit 函数未定义 → 需要补充路由跳转逻辑

### ArticleForm.vue
✅ [PASS] 表单校验规则与 DTO 字段对齐
✅ [PASS] 新增/编辑模式通过 Props 切换
✅ [PASS] 提交按钮有 loading 状态
⚠️ [WARN] 缺少表单重置逻辑 → 关闭 Drawer 时应重置表单
```

**2 个 WARN，0 个 ERROR。** 比没有 Skills 时的"改 3 轮"强太多了。

---

## 📊 效果对比

| 维度 | 没有 Skills | **有 Skills** |
|:---:|:---|:---|
| 组件风格一致性 | 每次都要重新交代 | **写一次，永远一致** |
| UI 框架误用 | 常混用裸 HTML 和组件 | **强制使用指定 UI 库** |
| 接口层规范 | 有时走封装有时不走 | **统一 hook 封装** |
| 权限遗漏 | 经常忘记加权限控制 | **Skill 强制约束** |
| 表单校验 | 有时有有时没有 | **校验规则与 DTO 自动对齐** |
| 修改轮次 | 3-5 轮 | **1-2 轮** |
| 开发一个完整模块 | ~2 小时 | **~30 分钟** |

---

## 💡 实战心得

### 1. 前端 Skills 的核心是"审美固化"

后端 Skills 固化的是"逻辑规范"（接口格式、错误处理），前端 Skills 固化的是"审美标准"——**你团队认为好的代码长什么样**。一旦把审美写成 Skill，AI 就能输出你满意的代码。

### 2. 一个 Skill 不要超过 200 行

前端规范容易写得太长。原则是：**能用 ✅/❌ 对比说清楚的事，不要用 3 段文字解释**。AI 对简洁的规则理解得更好。

### 3. 先有"标准答案"再写 Skill

不是先写 Skill 再写代码。而是**先手写一个你满意的标准组件**，然后从中提炼出 Skill。这样 Skill 的每条规则都有真实代码做支撑。

### 4. 适用场景

| 场景 | 是否适合 Skills |
|:---:|:---|
| 团队有统一的 UI 框架和规范 | ✅ 完美场景 |
| 新项目，需要快速建立规范 | ✅ 先写 Skill，再让 AI 按 Skill 生成代码 |
| 一次性页面（活动页）| ⚠️ 可以只用 vue3-component + UI Skill |
| 设计稿高度定制，没有标准组件 | ❌ 这种场景 Skills 帮不了太多 |

---

## 🚀 行动清单

1. 🔍 **审视你最近写的 3 个 Vue 页面**——它们有哪些共同的规范？
2. ✏️ **提炼出 2-3 个原子 Skills**——组件规范、UI 框架用法、接口封装
3. 🧪 **用 AI 生成一个你熟悉的页面**——对比有 Skills 和没 Skills 的差异
4. 🔄 **发现 AI 还犯的错误，补充到 Skill 里**——持续迭代

> **别人让 AI 写前端，每次都从头教规范。你让 AI 写前端，它已经把你的代码风格刻进了 DNA。**

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~

---
*📝 作者：NIHoa ｜ 更新日期：2025-05-07*
