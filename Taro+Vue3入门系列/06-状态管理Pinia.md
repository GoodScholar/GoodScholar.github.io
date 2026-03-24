# 🧠 Taro+Vue3 入门（六）：状态管理 — Pinia

> **系列导读**：Vue3 生态的官方状态管理是 Pinia。在 Taro+Vue3 项目中，
> Pinia 完美替代 Vuex，API 更简洁、TypeScript 支持更好。

---

## 🛠 1. 安装与配置

```bash
npm install pinia
```

```typescript
// src/app.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())  // 注册 Pinia
```

---

## 📦 2. 定义 Store

```typescript
// src/stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 组合式写法（推荐！和 <script setup> 一致）
export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)

  // getter
  const doubleCount = computed(() => count.value * 2)

  // action
  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = 0 }

  return { count, doubleCount, increment, decrement, reset }
})
```

```vue
<!-- 使用 Store -->
<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <view>
    <text>{{ counter.count }}</text>
    <text>双倍: {{ counter.doubleCount }}</text>
    <button @tap="counter.increment">+1</button>
    <button @tap="counter.reset">重置</button>
  </view>
</template>
```

---

## 🛒 3. 实战：购物车 Store

```typescript
// src/stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // 计算属性
  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  const isEmpty = computed(() => items.value.length === 0)

  // 添加商品
  function addItem(product: Omit<CartItem, 'quantity'>) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
    Taro.showToast({ title: '已加入购物车', icon: 'success' })
  }

  // 修改数量
  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      items.value = items.value.filter(i => i.id !== id)
      return
    }
    const item = items.value.find(i => i.id === id)
    if (item) item.quantity = quantity
  }

  // 删除
  function removeItem(id: string) {
    items.value = items.value.filter(i => i.id !== id)
  }

  // 清空
  function clearCart() {
    items.value = []
  }

  return { items, totalCount, totalPrice, isEmpty, addItem, updateQuantity, removeItem, clearCart }
})
```

```vue
<!-- 购物车页面 -->
<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
// storeToRefs 保证解构后的属性仍是响应式的
const { items, totalCount, totalPrice, isEmpty } = storeToRefs(cartStore)
</script>

<template>
  <view v-if="isEmpty" class="empty">
    <text>购物车空空如也</text>
    <nut-button type="primary" @click="() => Taro.switchTab({ url: '/pages/list/index' })">
      去逛逛
    </nut-button>
  </view>

  <view v-else class="cart">
    <view v-for="item in items" :key="item.id" class="cart-item">
      <image :src="item.image" class="item-img" />
      <view class="item-info">
        <text class="item-name">{{ item.name }}</text>
        <text class="item-price">¥{{ item.price }}</text>
      </view>
      <nut-input-number
        :model-value="item.quantity"
        :min="0"
        :max="99"
        @change="(v: number) => cartStore.updateQuantity(item.id, v)"
      />
    </view>

    <view class="footer">
      <text class="total">合计: ¥{{ totalPrice.toFixed(2) }}</text>
      <nut-button type="primary">去结算({{ totalCount }})</nut-button>
    </view>
  </view>
</template>
```

---

## 💾 4. 持久化

```typescript
// src/stores/plugins/persist.ts
import Taro from '@tarojs/taro'
import type { PiniaPluginContext } from 'pinia'

export function taroPersist({ store }: PiniaPluginContext) {
  // 初始化时恢复数据
  const saved = Taro.getStorageSync(`pinia-${store.$id}`)
  if (saved) {
    store.$patch(JSON.parse(saved))
  }

  // 状态变化时保存
  store.$subscribe((_, state) => {
    Taro.setStorageSync(`pinia-${store.$id}`, JSON.stringify(state))
  })
}

// app.ts 中注册
const pinia = createPinia()
pinia.use(taroPersist)
app.use(pinia)
```

---

## ✅ 本篇小结 Checklist

- [ ] 安装配置 Pinia
- [ ] 掌握组合式 Store 写法
- [ ] 实现购物车完整逻辑
- [ ] 会用 `storeToRefs` 解构
- [ ] 配合 Taro Storage 持久化

---

*本文是「Taro+Vue3 入门」系列第 6 篇，共 10 篇。*
