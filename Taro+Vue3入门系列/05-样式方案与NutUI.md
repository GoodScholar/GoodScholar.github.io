# 🎨 Taro+Vue3 入门（五）：样式方案与 NutUI-Vue

> **系列导读**：本文教你 Taro 中的样式体系以及 NutUI 的 Vue3 版本使用。

---

## 📏 1. 样式基础

```vue
<style lang="scss" scoped>
// 变量
$primary: #42b883;
$text-color: #1a1a1a;

// Taro 自动将 px 转为 rpx（750 设计稿）
.container {
  padding: 32px;       // → 32rpx
  font-size: 28px;     // → 28rpx ≈ 14pt
}

// 不想转换用大写 PX
.thin-border {
  border: 1PX solid #eee;
}

// scoped 保证样式只作用于当前组件
.card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

  &-title {
    font-size: 32px;
    font-weight: bold;
    color: $text-color;
  }

  &-price {
    font-size: 36px;
    color: #ef4444;
    font-weight: bold;
  }
}
</style>
```

---

## 🍞 2. NutUI Vue3 版

```bash
npm install @nutui/nutui-taro
```

```typescript
// src/app.ts — 全局引入
import { createApp } from 'vue'
import { Button, Cell, Icon, Navbar, Tabbar, TabbarItem } from '@nutui/nutui-taro'
import '@nutui/nutui-taro/dist/style.css'

const app = createApp(App)
app.use(Button).use(Cell).use(Icon).use(Navbar).use(Tabbar).use(TabbarItem)
```

### 常用组件示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <!-- 按钮 -->
  <nut-button type="primary" size="large" block>主要按钮</nut-button>
  <nut-button type="success">成功按钮</nut-button>
  <nut-button type="primary" plain>描边按钮</nut-button>
  <nut-button type="primary" loading>加载中</nut-button>

  <!-- Cell 列表项 -->
  <nut-cell title="我的订单" is-link />
  <nut-cell title="收货地址" desc="北京市朝阳区" is-link />

  <!-- 表单 -->
  <nut-form :model-value="formData" @submit="onSubmit">
    <nut-form-item label="姓名" prop="name" required>
      <nut-input v-model="formData.name" placeholder="请输入" />
    </nut-form-item>
    <nut-form-item label="手机" prop="phone">
      <nut-input v-model="formData.phone" placeholder="请输入" type="tel" />
    </nut-form-item>
  </nut-form>

  <!-- 对话框 -->
  <nut-dialog
    v-model:visible="showDialog"
    title="确认删除"
    content="删除后无法恢复"
    @ok="handleDelete"
    @cancel="showDialog = false"
  />

  <!-- 弹出层 -->
  <nut-popup v-model:visible="showPopup" position="bottom" round>
    <view style="padding: 32px">弹出内容</view>
  </nut-popup>

  <!-- Skeleton 骨架屏 -->
  <nut-skeleton :loading="loading" title animated :row="3">
    <view>实际内容</view>
  </nut-skeleton>
</template>
```

### 商城首页布局

```vue
<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import ProductCard from '@/components/ProductCard.vue'

const banners = ref([
  { id: 1, image: 'https://picsum.photos/750/320?1' },
  { id: 2, image: 'https://picsum.photos/750/320?2' },
])

const categories = [
  { id: 1, name: '手机', icon: '📱' },
  { id: 2, name: '电脑', icon: '💻' },
  { id: 3, name: '耳机', icon: '🎧' },
  { id: 4, name: '手表', icon: '⌚' },
  { id: 5, name: '更多', icon: '📦' },
]
</script>

<template>
  <view class="home">
    <nut-searchbar placeholder="搜索商品" disabled @click-input="() => Taro.navigateTo({ url: '/pages/search/index' })" />

    <swiper class="banner" autoplay circular :indicator-dots="true">
      <swiper-item v-for="b in banners" :key="b.id">
        <image :src="b.image" mode="aspectFill" class="banner-img" />
      </swiper-item>
    </swiper>

    <nut-grid :column-num="5">
      <nut-grid-item v-for="cat in categories" :key="cat.id" :text="cat.name">
        <text style="font-size: 40px">{{ cat.icon }}</text>
      </nut-grid-item>
    </nut-grid>

    <view class="section">
      <text class="section-title">🔥 热门推荐</text>
      <view class="product-grid">
        <ProductCard v-for="p in products" :key="p.id" v-bind="p" />
      </view>
    </view>
  </view>
</template>
```

---

## ✅ 本篇小结 Checklist

- [ ] 理解 px → rpx 自动转换
- [ ] 掌握 scoped 样式和 Scss
- [ ] 安装配置 NutUI Vue3 版
- [ ] 会用 Button / Cell / Form / Dialog / Popup 组件

---

*本文是「Taro+Vue3 入门」系列第 5 篇，共 10 篇。*


---
*📝 作者：NIHoa ｜ 系列：Taro+Vue3入门系列 ｜ 更新日期：2024-05-05*
