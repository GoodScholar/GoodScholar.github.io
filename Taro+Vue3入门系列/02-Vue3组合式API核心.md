# ⚡ Taro+Vue3 入门（二）：Vue3 基础速览 — 组合式 API 核心

> **系列导读**：Taro+Vue3 开发小程序，核心是 Vue3 的组合式 API。
> 本文快速过一遍所有你需要的 Vue3 基础知识。

---

## 🔄 1. 响应式：ref 与 reactive

```vue
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

// ref — 基本类型用 ref，访问需要 .value
const count = ref(0)
const name = ref('张三')
const isLoading = ref(false)

console.log(count.value) // 0（JS 中需要 .value）
// 模板中自动解包，不需要 .value

// reactive — 对象用 reactive，直接访问
const user = reactive({
  name: '张三',
  age: 25,
  tags: ['前端', 'Vue'],
})

user.age = 26  // 直接修改，自动触发更新

// computed — 计算属性（自动缓存）
const doubleCount = computed(() => count.value * 2)
const fullName = computed(() => `${user.name} (${user.age}岁)`)
</script>

<template>
  <view>
    <text>{{ count }}</text>           <!-- 模板中不需要 .value -->
    <text>{{ doubleCount }}</text>
    <text>{{ user.name }}</text>
    <text>{{ fullName }}</text>
  </view>
</template>
```

### ref vs reactive 选择

| 场景 | 推荐 | 原因 |
|------|------|------|
| 基本类型（数字/字符串/布尔） | `ref` | 只能用 ref |
| 对象/数组 | `ref` 或 `reactive` | ref 更统一 |
| 表单数据（多个字段） | `reactive` | 方便集中管理 |
| 替换整个对象 | `ref` | reactive 不能替换引用 |

> 💡 **实践建议**：统一用 `ref` 最简单，始终用 `.value`，减少心智负担。

---

## 👀 2. watch 与 watchEffect

```vue
<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import Taro from '@tarojs/taro'

const keyword = ref('')
const category = ref('all')

// watch — 监听指定数据源
watch(keyword, (newVal, oldVal) => {
  console.log(`搜索词从"${oldVal}"变为"${newVal}"`)
  searchProducts(newVal)
})

// 监听多个数据源
watch([keyword, category], ([newKeyword, newCategory]) => {
  fetchProducts({ keyword: newKeyword, category: newCategory })
})

// watch 选项
watch(keyword, (val) => { searchProducts(val) }, {
  immediate: true,  // 立即执行一次
  deep: true,       // 深度监听（对象内部变化）
})

// watchEffect — 自动收集依赖，立即执行
watchEffect(() => {
  // 自动追踪用到的响应式变量
  console.log(`关键词: ${keyword.value}, 分类: ${category.value}`)
  fetchProducts({ keyword: keyword.value, category: category.value })
})
</script>
```

| 方法 | 需要指定数据源 | 立即执行 | 适合场景 |
|------|-------------|---------|---------|
| `watch` | ✅ 手动指定 | 默认否 | 精确控制监听目标 |
| `watchEffect` | ❌ 自动收集 | 默认是 | 多个依赖自动追踪 |

---

## 🔧 3. 生命周期

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useLoad, useReady, useDidShow, useDidHide, usePullDownRefresh } from '@tarojs/taro'

// ======= Vue3 生命周期 =======
onMounted(() => {
  console.log('组件挂载完成')
})

onUnmounted(() => {
  console.log('组件销毁，清理资源')
})

// ======= Taro 页面生命周期 =======
useLoad((options) => {
  console.log('页面加载，参数:', options)
})

useReady(() => {
  console.log('页面首次渲染完成')
})

useDidShow(() => {
  console.log('页面显示（每次回来都触发）')
})

useDidHide(() => {
  console.log('页面隐藏')
})

usePullDownRefresh(async () => {
  await refreshData()
  Taro.stopPullDownRefresh()
})
</script>
```

### 生命周期对照表

| Vue3 | Taro 页面 | 触发时机 |
|------|-----------|---------|
| `onMounted` | `useReady` | 首次渲染完成 |
| — | `useLoad` | 页面加载（接收参数） |
| — | `useDidShow` | 每次页面显示 |
| — | `useDidHide` | 页面隐藏 |
| `onUnmounted` | `useUnload` | 页面卸载 |

---

## 📦 4. 组件与 Props

```vue
<!-- src/components/ProductCard.vue -->
<script setup lang="ts">
// defineProps — 声明组件属性
interface Props {
  name: string
  price: number
  image: string
  sales?: number
}

const props = withDefaults(defineProps<Props>(), {
  sales: 0,  // 默认值
})

// defineEmits — 声明组件事件
const emit = defineEmits<{
  tap: [id: string]
  addCart: [product: Props]
}>()

function handleTap() {
  emit('tap', props.name)
}

function handleAddCart() {
  emit('addCart', props)
}
</script>

<template>
  <view class="product-card" @tap="handleTap">
    <image :src="image" mode="aspectFill" class="product-img" />
    <view class="product-info">
      <text class="product-name">{{ name }}</text>
      <view class="product-bottom">
        <text class="product-price">¥{{ price }}</text>
        <text class="product-sales">已售 {{ sales }}</text>
      </view>
    </view>
    <button class="cart-btn" @tap.stop="handleAddCart">加入购物车</button>
  </view>
</template>
```

```vue
<!-- 使用组件 -->
<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue'

function handleTap(id: string) {
  Taro.navigateTo({ url: `/pages/detail/index?id=${id}` })
}

function handleAddCart(product: any) {
  Taro.showToast({ title: `已添加 ${product.name}` })
}
</script>

<template>
  <ProductCard
    v-for="item in products"
    :key="item.id"
    :name="item.name"
    :price="item.price"
    :image="item.image"
    :sales="item.sales"
    @tap="handleTap"
    @add-cart="handleAddCart"
  />
</template>
```

---

## 🪝 5. 组合式函数（Composables）

```typescript
// src/composables/useToggle.ts
import { ref } from 'vue'

export function useToggle(initial = false) {
  const value = ref(initial)
  const toggle = () => { value.value = !value.value }
  const setTrue = () => { value.value = true }
  const setFalse = () => { value.value = false }
  return { value, toggle, setTrue, setFalse }
}
```

```typescript
// src/composables/useRequest.ts
import { ref } from 'vue'

export function useRequest<T>(fetcher: () => Promise<T>) {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function run() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  run()  // 立即执行

  return { data, loading, error, refresh: run }
}
```

```vue
<!-- 使用 composable -->
<script setup lang="ts">
import { useToggle } from '@/composables/useToggle'
import { useRequest } from '@/composables/useRequest'

const { value: showFilter, toggle: toggleFilter } = useToggle()
const { data: products, loading, refresh } = useRequest(() => productApi.getList())
</script>

<template>
  <button @tap="toggleFilter">{{ showFilter ? '收起' : '筛选' }}</button>
  <view v-if="showFilter" class="filter-panel">筛选面板</view>

  <text v-if="loading">加载中...</text>
  <ProductCard v-for="p in products" :key="p.id" v-bind="p" />
</template>
```

---

## 🔗 6. provide / inject — 跨层级通信

```vue
<!-- 父组件提供数据 -->
<script setup lang="ts">
import { provide, ref } from 'vue'

const theme = ref<'light' | 'dark'>('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

provide('theme', theme)
provide('toggleTheme', toggleTheme)
</script>

<!-- 任意后代组件注入 -->
<script setup lang="ts">
import { inject } from 'vue'

const theme = inject<Ref<string>>('theme')
const toggleTheme = inject<() => void>('toggleTheme')
</script>

<template>
  <view :class="`container ${theme}`">
    <button @tap="toggleTheme">切换主题</button>
  </view>
</template>
```

---

## ✅ 本篇小结 Checklist

- [ ] 掌握 `ref` / `reactive` / `computed` 响应式
- [ ] 区分 `watch` 和 `watchEffect`
- [ ] 理解 Vue3 + Taro 双重生命周期
- [ ] 会用 `defineProps` / `defineEmits` 定义组件接口
- [ ] 能封装 Composables 复用逻辑
- [ ] 了解 `provide` / `inject` 跨层通信

---

> **下一篇预告**：《Taro 内置组件与页面开发》

---

*本文是「Taro+Vue3 入门」系列第 2 篇，共 10 篇。*
