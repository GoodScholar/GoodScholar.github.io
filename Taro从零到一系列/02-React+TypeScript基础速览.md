---
date: 2024-06-02
---
# ⚛️ Taro 从零到一（二）：React + TypeScript 基础速览

> **系列导读**：Taro 以 React 为核心框架，如果你还不太熟悉 React 和 TypeScript，
> 本文帮你快速掌握 Taro 开发所需的全部基础。

---

## 🧩 1. JSX — 在 JS 中写 HTML

```tsx
// JSX = JavaScript + XML，让你在 JS 中写 UI
function Welcome() {
  const name = '张三'
  const isVip = true

  return (
    <View className="welcome">
      {/* 文本插值 */}
      <Text>你好，{name}！</Text>

      {/* 条件渲染 */}
      {isVip && <Text className="vip-badge">VIP</Text>}

      {/* 三元表达式 */}
      <Text>{isVip ? '尊贵会员' : '普通用户'}</Text>
    </View>
  )
}
```

### 列表渲染

```tsx
function UserList() {
  const users = [
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 },
    { id: 3, name: '王五', age: 28 },
  ]

  return (
    <View>
      {users.map(user => (
        <View key={user.id} className="user-card">
          <Text>{user.name}</Text>
          <Text>{user.age} 岁</Text>
        </View>
      ))}
    </View>
  )
}
```

---

## 🔄 2. useState — 状态管理

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)          // 数字状态
  const [name, setName] = useState('')           // 字符串状态
  const [items, setItems] = useState<string[]>([]) // 数组状态

  return (
    <View>
      {/* 数字 */}
      <Text>{count}</Text>
      <Button onClick={() => setCount(count + 1)}>+1</Button>
      <Button onClick={() => setCount(prev => prev - 1)}>-1</Button>

      {/* 数组 */}
      <Button onClick={() => setItems([...items, `Item ${items.length + 1}`])}>
        添加
      </Button>
      {items.map((item, i) => (
        <Text key={i}>{item}</Text>
      ))}
    </View>
  )
}
```

---

## ⚡ 3. useEffect — 副作用

```tsx
import { useState, useEffect } from 'react'

function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 组件挂载时获取数据
  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      const res = await Taro.request({ url: 'https://api.example.com/user' })
      setUser(res.data)
      setLoading(false)
    }
    fetchUser()
  }, [])  // 空数组 = 只在挂载时执行一次

  if (loading) return <Text>加载中...</Text>

  return <Text>{user?.name}</Text>
}
```

### useEffect 依赖规则

```tsx
// ① 空数组 — 只执行一次（挂载时）
useEffect(() => { /* 初始化 */ }, [])

// ② 有依赖 — 依赖变化时执行
useEffect(() => { /* keyword 变化时重新搜索 */ }, [keyword])

// ③ 清理函数 — 组件卸载时执行
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000)
  return () => clearInterval(timer)  // 清理定时器
}, [])
```

---

## 🧱 4. 组件与 Props

```tsx
// 定义 Props 类型
interface ProductCardProps {
  name: string
  price: number
  image: string
  onBuy?: () => void   // 可选回调
}

// 函数组件
function ProductCard({ name, price, image, onBuy }: ProductCardProps) {
  return (
    <View className="product-card">
      <Image src={image} mode="aspectFill" />
      <Text className="name">{name}</Text>
      <Text className="price">¥{price.toFixed(2)}</Text>
      {onBuy && <Button onClick={onBuy}>购买</Button>}
    </View>
  )
}

// 使用组件
function ProductList() {
  return (
    <View>
      <ProductCard
        name="Flutter 实战"
        price={59}
        image="/assets/book.png"
        onBuy={() => Taro.showToast({ title: '已加入购物车' })}
      />
    </View>
  )
}
```

---

## 🪝 5. 自定义 Hook

```tsx
// 封装通用逻辑
function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  return { value, toggle, setTrue, setFalse }
}

// 使用
function PasswordInput() {
  const { value: visible, toggle } = useToggle(false)

  return (
    <View>
      <Input type={visible ? 'text' : 'password'} placeholder="请输入密码" />
      <Button onClick={toggle}>{visible ? '隐藏' : '显示'}</Button>
    </View>
  )
}
```

```tsx
// 通用请求 Hook
function useRequest<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [fetcher])

  useEffect(() => { run() }, [run])

  return { data, loading, error, refresh: run }
}

// 使用
function ProductPage() {
  const { data: products, loading, refresh } = useRequest(() =>
    fetchProducts()
  )

  if (loading) return <Text>加载中...</Text>
  return (
    <View>
      {products?.map(p => <ProductCard key={p.id} {...p} />)}
    </View>
  )
}
```

---

## 📝 6. TypeScript 在 Taro 中的最佳实践

```typescript
// 接口定义
interface User {
  id: string
  name: string
  avatar: string
  age?: number           // 可选属性
}

// API 响应类型
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 使用泛型
async function fetchApi<T>(url: string): Promise<T> {
  const res = await Taro.request<ApiResponse<T>>({ url })
  if (res.data.code !== 0) {
    throw new Error(res.data.message)
  }
  return res.data.data
}

// 调用
const users = await fetchApi<User[]>('/api/users')
const user = await fetchApi<User>('/api/user/123')
```

### 常用类型工具

```typescript
// Partial — 所有属性变可选
type UserUpdate = Partial<User>  // { id?: string, name?: string, ... }

// Pick — 选取部分属性
type UserBrief = Pick<User, 'id' | 'name'>  // { id: string, name: string }

// Omit — 排除部分属性
type NewUser = Omit<User, 'id'>  // { name: string, avatar: string, age?: number }

// Record — 键值对映射
type UserMap = Record<string, User>  // { [key: string]: User }
```

---

## ✅ 本篇小结 Checklist

- [ ] 掌握 JSX 语法（插值、条件渲染、列表渲染）
- [ ] 掌握 useState 状态管理
- [ ] 理解 useEffect 副作用和依赖规则
- [ ] 会定义组件 Props 类型
- [ ] 掌握自定义 Hook 封装
- [ ] 了解 TypeScript 泛型和类型工具

---

> **下一篇预告**：《页面与组件开发》—— 学习 Taro 内置组件体系和页面生命周期。

---

*本文是「Taro 从零到一」系列第 2 篇，共 10 篇。*


---
*📝 作者：NIHoa ｜ 系列：Taro从零到一系列 ｜ 更新日期：2024-06-02*
