# 🧠 Taro 从零到一（六）：状态管理 — Zustand 轻量之道

> **系列导读**：小程序也需要全局状态管理。Zustand 是 React 生态中最轻量的状态管理库，
> 配合 Taro 使用体验极佳，零模板代码。

---

## 📊 为什么选 Zustand？

| 方案 | 代码量 | 学习成本 | Taro 兼容 | 适合规模 |
|------|--------|---------|----------|---------|
| useState | 极少 | ⭐ | ✅ | 单组件 |
| Redux Toolkit | 较多 | ⭐⭐⭐ | ✅ | 大型项目 |
| MobX | 中等 | ⭐⭐⭐ | ✅ | 中大型 |
| **Zustand** | **极少** | **⭐** | **✅** | **中小型推荐** |

---

## 🛠 1. 安装与基础用法

```bash
npm install zustand
```

```typescript
// src/store/useCounterStore.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

export default useCounterStore
```

```tsx
// 在组件中使用
import useCounterStore from '@/store/useCounterStore'

function CounterPage() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <View>
      <Text className="count">{count}</Text>
      <Button onClick={increment}>+1</Button>
      <Button onClick={decrement}>-1</Button>
      <Button onClick={reset}>重置</Button>
    </View>
  )
}
```

---

## 🛒 2. 实战：购物车 Store

```typescript
// src/store/useCartStore.ts
import { create } from 'zustand'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalCount: () => number
  totalPrice: () => number
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => set((state) => {
    const existing = state.items.find(item => item.id === product.id)
    if (existing) {
      return {
        items: state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }
    }
    return { items: [...state.items, { ...product, quantity: 1 }] }
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity <= 0
      ? state.items.filter(item => item.id !== id)
      : state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
  })),

  clearCart: () => set({ items: [] }),

  totalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}))

export default useCartStore
```

```tsx
// 商品页 — 添加到购物车
function ProductDetail({ product }) {
  const addItem = useCartStore(state => state.addItem)

  return (
    <Button onClick={() => {
      addItem(product)
      Taro.showToast({ title: '已加入购物车', icon: 'success' })
    }}>
      加入购物车
    </Button>
  )
}

// 购物车页
function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore()

  if (items.length === 0) return <Empty description="购物车空空如也" />

  return (
    <View className="cart-page">
      {items.map(item => (
        <View key={item.id} className="cart-item">
          <Image src={item.image} className="item-image" />
          <View className="item-info">
            <Text className="item-name">{item.name}</Text>
            <Text className="item-price">¥{item.price}</Text>
          </View>
          <View className="quantity-control">
            <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
            <Text>{item.quantity}</Text>
            <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
          </View>
        </View>
      ))}

      <View className="cart-footer">
        <Text className="total">合计：¥{totalPrice().toFixed(2)}</Text>
        <Button type="primary" onClick={() => Taro.navigateTo({ url: '/pages/checkout/index' })}>
          去结算
        </Button>
      </View>
    </View>
  )
}

// TabBar 角标 — 精确选择只需要的数据
function TabBadge() {
  const count = useCartStore(state => state.totalCount())
  // 只有 totalCount 变化才重渲染，其他不受影响
  return count > 0 ? <Text className="badge">{count}</Text> : null
}
```

---

## 💾 3. 持久化存储

```typescript
// 配合 Taro Storage 持久化
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'

// Taro Storage 适配器
const taroStorage = createJSONStorage(() => ({
  getItem: (name: string) => Taro.getStorageSync(name),
  setItem: (name: string, value: string) => Taro.setStorageSync(name, value),
  removeItem: (name: string) => Taro.removeStorageSync(name),
}))

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: '',
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: '', user: null }),
    }),
    {
      name: 'auth-storage',
      storage: taroStorage,
    }
  )
)
```

---

## ✅ 本篇小结 Checklist

- [ ] 安装并使用 Zustand 创建 Store
- [ ] 实现购物车增删改查逻辑
- [ ] 掌握精确选择（selector）优化渲染
- [ ] 配合 Taro Storage 实现持久化

---

> **下一篇预告**：《网络请求与数据处理》

---

*本文是「Taro 从零到一」系列第 6 篇，共 10 篇。*
