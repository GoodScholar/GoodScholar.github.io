---
date: 2026-07-28
tags:
  - GSAP
  - 前端动画
  - JavaScript
  - AI编程
  - 提示词
cover: /covers/cover-gsap-13-scenes-juejin.jpg
---
# 13 个 GSAP 高频场景速查表：复制提示词给 AI，动画直接搞定

做官网、落地页、产品页时，动画总是那个"说好了简单、做起来半天"的环节。

你可能也有过这种经历：脑子里有个效果，去查 GSAP 文档，发现 API 好多，stagger、timeline、ScrollTrigger、scrub、pin、Draggable、Flip... 每个都得看半天。好不容易拼出来，调 easing 又调半小时。最后一算，一个入场动画花了一个下午。

我把做落地页时最常用的 13 个 GSAP 场景整理成了速查表——每个场景配一个可直接复制给 AI 的提示词，以及对应的官方 API 写法和关键参数。下次做动画，复制提示词粘贴给 AI，几秒钟出结果，不行再调参数。

> 本文基于 GSAP 3.x 版本。核心库（gsap.to/timeline/stagger 等）完全免费；ScrollTrigger、Draggable、Flip 等插件也包含在免费许可中，可用于免费网站和商业项目；MorphSVG、Physics2D 等高级插件需要 Club GreenSock 付费会员。

---

## 先搞懂三个核心概念

用 GSAP 之前，搞懂三个概念就够了：

**Tween（补间动画）**：单个元素从 A 状态到 B 状态的过渡。`gsap.to()`、`gsap.from()`、`gsap.fromTo()` 都是 Tween。

**Timeline（时间轴）**：把多个 Tween 按时间顺序串起来的容器。可以精确控制每个动画的开始时间、重叠、延迟。

**Plugin（插件）**：扩展 GSAP 能力的模块。ScrollTrigger 管滚动触发、Draggable 管拖拽、Flip 管布局切换动画。用到什么注册什么。

安装也简单：

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Draggable.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Flip.min.js"></script>

<script>
  gsap.registerPlugin(ScrollTrigger, Draggable, Flip);
</script>
```

---

## 13 个高频场景

### 01 stagger 依次入场

**效果说明**：多个元素按顺序依次出现，每个元素之间有短暂间隔。常用于卡片列表、图标网格、导航菜单等。

**AI 提示词**（可直接复制）：

```
用 GSAP 实现 stagger 依次入场动画：
- 目标元素：.card（6 个卡片）
- 从 opacity:0, y:30 入场
- 每个间隔 0.1 秒
- 持续时间 0.6 秒
- ease: power2.out
- 页面加载后自动触发
```

**官方 API 写法**：

```javascript
gsap.from(".card", {
  opacity: 0,
  y: 30,
  stagger: 0.1,
  duration: 0.6,
  ease: "power2.out",
  delay: 0.3
});
```

**关键参数**：

| 参数 | 作用 | 常见值 |
|:---:|:---|:---|
| `stagger` | 每个元素动画的间隔时间 | `0.1`（秒），或对象 `{amount: 0.5, from: "center"}` |
| `from` | stagger 从哪个方向开始 | `"start"` / `"center"` / `"end"` / `"random"` / `"edges"` |
| `amount` | 所有元素 stagger 总时长 | `1`（1 秒内所有元素启动完毕） |

**进阶用法**：stagger 还可以配 easing 和方向，比如从中间向两边扩散：

```javascript
stagger: { each: 0.08, from: "center", ease: "power2.inOut" }
```

---

### 02 timeline 顺序开场

**效果说明**：多个动画按时间顺序依次执行，形成一段完整的开场动画。比如 logo 先出现，然后标题滑入，然后副标题淡入，最后按钮弹出来。

**AI 提示词**（可直接复制）：

```
用 GSAP timeline 实现页面开场动画：
- 1. .logo 从 opacity:0, scale:0.8 淡入缩放，0.5秒，elastic 缓动
- 2. .title 从 x:-50, opacity:0 滑入，0.6秒，power2.out
- 3. .subtitle 从 y:20, opacity:0 上移淡入，0.4秒
- 4. .btn 从 scale:0 弹入，0.5秒，back.out(2)
- 前一个动画结束后延迟 0.1 秒开始下一个
- 页面加载完成后自动播放
```

**官方 API 写法**：

```javascript
const tl = gsap.timeline({ delay: 0.2 });

tl.from(".logo", { opacity: 0, scale: 0.8, duration: 0.5, ease: "elastic.out(1, 0.5)" })
  .from(".title", { x: -50, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.1")
  .from(".subtitle", { y: 20, opacity: 0, duration: 0.4 }, "-=0.2")
  .from(".btn", { scale: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.1");
```

**关键参数**：

| 写法 | 作用 | 示例 |
|:---:|:---|:---|
| `"-=0.5"` | 在上一个动画结束前 0.5 秒开始（重叠） | `tl.from(a, {...}).from(b, {...}, "-=0.3")` |
| `"+=0.3"` | 在上一个动画结束后延迟 0.3 秒开始 | `tl.to(a, {...}).to(b, {...}, "+=0.5")` |
| `3` | 在第 3 秒位置开始（绝对时间） | `tl.to(a, {...}, 1)` |
| `"myLabel"` | 在标签位置开始 | `tl.addLabel("start").to(a, {...}, "start")` |

**小技巧**：timeline 可以嵌套。一个复杂页面可以拆成多个 timeline，再用一个总 timeline 统一控制。

---

### 03 ScrollTrigger 滚动触发

**效果说明**：元素滚动到视口内时才触发动画。用户滚动页面，看到哪、动画播到哪。

**AI 提示词**（可直接复制）：

```
用 GSAP ScrollTrigger 实现滚动触发动画：
- 目标：.feature-card（每个功能卡片）
- 触发条件：元素顶部到达视口 80% 位置时
- 动画：从 opacity:0, y:40 到正常状态
- 持续时间 0.8 秒，ease: power2.out
- 每个卡片 stagger 0.15 秒
- 只播放一次，滚回去不重播
- 开发时开启 markers 方便调试
```

**官方 API 写法**：

```javascript
gsap.from(".feature-card", {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: "power2.out",
  stagger: 0.15,
  scrollTrigger: {
    trigger: ".feature-section",
    start: "top 80%", // 触发元素顶部到达视口 80% 时
    end: "bottom 20%",
    toggleActions: "play none none none", // 只播放一次
    markers: true // 开发调试用，上线关掉
  }
});
```

**关键参数**：

| 参数 | 作用 | 常见值 |
|:---:|:---|:---|
| `trigger` | 触发元素 | `".section"` |
| `start` | 开始位置 | `"top center"`（触发元素顶部碰到视口中心） |
| `end` | 结束位置 | `"bottom top"`（触发元素底部碰到视口顶部） |
| `toggleActions` | 四个阶段的动作 | `"play pause resume reverse"` |
| `markers` | 显示调试标记 | `true` / `false` |

**start/end 怎么读**：两个值，第一个是触发元素的位置，第二个是视口的位置。`"top 80%"` = 触发元素的顶部碰到视口 80% 的高度线时触发。

---

### 04 scrub 滚动联动

**效果说明**：动画进度与滚动位置完全绑定——用户滚得快，动画播放得快；滚回去，动画倒放。就像用滚动条拖拽时间轴。

**AI 提示词**（可直接复制）：

```
用 GSAP ScrollTrigger + scrub 实现滚动联动动画：
- 目标：.hero-title
- 滚动时标题逐渐从左向右移动，同时透明度从 0 变到 1
- 滚动范围：从 .hero-section 顶部进入视口，到底部离开视口
- scrub: true（与滚动完全同步）
- 视差效果：背景图 y 轴移动 -100px
```

**官方 API 写法**：

```javascript
// 标题随滚动淡入并右移
gsap.to(".hero-title", {
  x: 100,
  opacity: 1,
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true // 与滚动位置完全绑定
  }
});

// 背景视差
gsap.to(".hero-bg", {
  y: -100,
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
```

**关键参数**：

| `scrub` 值 | 效果 |
|:---:|:---|
| `true` | 完全同步，滚动到哪动画到哪 |
| `1` | 1 秒延迟平滑跟随，滚动停了动画还会继续滑一会儿 |
| `0.5` | 0.5 秒延迟，更丝滑的跟随感 |

**常见场景**：视差滚动、进度条、数字随滚动增长、颜色渐变。

---

### 05 pin 固定叙事

**效果说明**：滚动到某一区域时，内容固定在屏幕上不动，内部继续展示动画或叙事。滚完了再跟着页面继续走。常用于产品演示、步骤说明、故事型落地页。

**AI 提示词**（可直接复制）：

```
用 GSAP ScrollTrigger + pin 实现固定叙事：
- 固定元素：.phone-mockup（手机样机）
- 触发区域：.showcase-section（高度 300vh，提供滚动空间）
- pin 住手机样机，滚动时手机保持在屏幕中央
- 同时手机屏幕内容切换：从 screen-1 渐变为 screen-2 再到 screen-3
- 每个屏幕对应 1/3 的滚动距离
- 使用 timeline + scrub 控制切换
```

**官方 API 写法**：

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".showcase-section",
    start: "top top",
    end: "bottom bottom",
    pin: ".phone-mockup", // 固定这个元素
    scrub: 1,
    markers: true
  }
});

tl.to(".screen-1", { opacity: 0, duration: 1 })
  .from(".screen-2", { opacity: 0, duration: 1 })
  .to(".screen-2", { opacity: 0, duration: 1 })
  .from(".screen-3", { opacity: 0, duration: 1 });
```

**关键参数**：

| 参数 | 作用 |
|:---:|:---|
| `pin: true` | 固定 trigger 元素 |
| `pin: ".element"` | 固定指定元素 |
| `pinSpacing: true` | 自动添加 padding 撑开空间（默认 true） |
| `pinSpacing: "margin"` | 用 margin 而不是 padding 撑开 |
| `pinSpacing: false` | 不撑开空间（下面内容会滚上去） |

**注意**：pin 的元素如果有 transform 或 will-change，可能导致 `position: fixed` 失效。如果固定后位置不对，检查父元素是否有 transform。

---

### 06 按钮点击反馈

**效果说明**：用户点击按钮时，按钮有一个微小的缩放回弹，增强手感。

**AI 提示词**（可直接复制）：

```
用 GSAP 实现按钮点击反馈动画：
- 点击 .btn 时，先缩小到 0.95
- 然后回弹到 1.05
- 再回到原始大小 1
- 总时长 0.3 秒
- ease: power2.out
- 点击事件绑定在 mousedown/touchstart 上
```

**官方 API 写法**：

```javascript
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("mousedown", () => {
    gsap.to(btn, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out"
    });
  });

  btn.addEventListener("mouseup", () => {
    gsap.to(btn, {
      scale: 1,
      duration: 0.2,
      ease: "back.out(2)"
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { scale: 1, duration: 0.2 });
  });
});
```

**关键参数**：

| 缓动函数 | 手感 |
|:---:|:---|
| `"back.out(2)"` | 弹性回弹，数字越大弹得越夸张 |
| `"elastic.out(1, 0.5)"` | 橡皮筋效果，弹簧感更强 |
| `"power2.out"` | 平滑减速，更克制 |

**经验之谈**：按压用短时长（0.1s），回弹用稍长时间（0.2-0.3s）。压下去快、弹回来慢，手感更真实。

---

### 07 hover 微交互

**效果说明**：鼠标悬停在元素上时，元素有微妙的位移、缩放或阴影变化，吸引用户点击。

**AI 提示词**（可直接复制）：

```
用 GSAP 实现卡片 hover 微交互：
- hover .card 时：
  - 上移 8px (y: -8)
  - 阴影变大 (box-shadow 加深)
  - 轻微缩放 1.02 倍
- 离开时恢复原样
- 时长 0.3 秒，ease: power2.out
- 多个卡片 stagger 入场（页面加载时）
- hover 动画如果正在播放，重新 hover 时要从当前位置开始，不要跳变
```

**官方 API 写法**：

```javascript
// 入场动画
gsap.from(".card", {
  opacity: 0,
  y: 30,
  stagger: 0.1,
  duration: 0.6,
  ease: "power2.out"
});

// hover 交互
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      duration: 0.3,
      ease: "power2.out"
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      duration: 0.3,
      ease: "power2.out"
    });
  });
});
```

**注意**：GSAP 会自动处理动画叠加——如果一个动画正在播放，新的 `gsap.to()` 会从当前状态继续，不会跳变。这是 GSAP 相比 CSS transition 的一大优势。

---

### 08 手风琴展开

**效果说明**：点击标题，内容区域平滑展开/收起。经典的 FAQ、分类筛选、侧边栏菜单。

**AI 提示词**（可直接复制）：

```
用 GSAP 实现手风琴展开效果：
- 结构：.accordion-item > .accordion-header + .accordion-content
- 点击 .accordion-header 时，对应 .accordion-content 高度从 0 展开到 auto
- 同时展开图标旋转 180 度
- 一次只能展开一个（手风琴模式），其他已展开的自动收起
- 动画时长 0.4 秒，ease: power2.inOut
```

**官方 API 写法**：

```javascript
document.querySelectorAll(".accordion-item").forEach(item => {
  const header = item.querySelector(".accordion-header");
  const content = item.querySelector(".accordion-content");
  const icon = item.querySelector(".accordion-icon");

  // 初始收起
  gsap.set(content, { height: 0, overflow: "hidden" });

  header.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    // 先关闭所有其他项
    document.querySelectorAll(".accordion-item.open").forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove("open");
        gsap.to(openItem.querySelector(".accordion-content"), {
          height: 0,
          duration: 0.4,
          ease: "power2.inOut"
        });
        gsap.to(openItem.querySelector(".accordion-icon"), {
          rotation: 0,
          duration: 0.4,
          ease: "power2.inOut"
        });
      }
    });

    // 切换当前项
    if (!isOpen) {
      item.classList.add("open");
      gsap.to(content, {
        height: "auto",
        duration: 0.4,
        ease: "power2.inOut"
      });
      gsap.to(icon, { rotation: 180, duration: 0.4, ease: "power2.inOut" });
    } else {
      item.classList.remove("open");
      gsap.to(content, {
        height: 0,
        duration: 0.4,
        ease: "power2.inOut"
      });
      gsap.to(icon, { rotation: 0, duration: 0.4, ease: "power2.inOut" });
    }
  });
});
```

**关键技巧**：`height: "auto"` 是 GSAP 的一个神器——它会自动计算元素的自然高度并动画到那个值，不用你手动算高度。CSS transition 做不到这一点。

---

### 09 Draggable 拖拽

**效果说明**：元素可以被鼠标或手指拖动。可用于滑块、可拖拽面板、拼图游戏、旋转控件等。

**AI 提示词**（可直接复制）：

```
用 GSAP Draggable 实现可拖拽元素：
- 目标：.drag-item（可拖拽卡片）
- 拖动方向：x, y（自由拖拽）
- 限制范围：.drag-container（容器边界内）
- 松手后有惯性滑行（inertia）
- 拖拽时元素轻微放大 1.05 倍
- 拖拽结束后回到原大小
- 碰撞边界时有过冲回弹效果
```

**官方 API 写法**：

```javascript
Draggable.create(".drag-item", {
  type: "x,y",
  bounds: ".drag-container",
  inertia: true,
  onDragStart: function() {
    gsap.to(this.target, { scale: 1.05, duration: 0.2, ease: "power2.out" });
  },
  onDragEnd: function() {
    gsap.to(this.target, { scale: 1, duration: 0.3, ease: "back.out(2)" });
  }
});
```

**关键参数**：

| 参数 | 作用 | 常见值 |
|:---:|:---|:---|
| `type` | 拖拽类型 | `"x"` / `"y"` / `"x,y"` / `"rotation"` |
| `bounds` | 拖拽边界 | `".container"` / `{minX: 0, maxX: 500}` |
| `inertia` | 惯性滑行 | `true` / `false`（需 InertiaPlugin，付费） |
| `onDrag` | 拖拽中回调 | `function() { console.log(this.x) }` |
| `onDragEnd` | 拖拽结束回调 | 处理吸附、对齐等逻辑 |

**注意**：`inertia` 惯性滑行需要 InertiaPlugin，这是 Club GreenSock 付费会员插件。免费版 Draggable 本身可以拖拽，但松手即停，没有惯性。

---

### 10 Flip 筛选重排

**效果说明**：点击筛选按钮后，卡片重新排列布局，但不是生硬地跳变，而是平滑地滑动到新位置。

**AI 提示词**（可直接复制）：

```
用 GSAP Flip 实现筛选重排动画：
- 结构：.filter-grid 包含多个 .filter-item 卡片
- 点击 .filter-btn 时，给对应分类的卡片加 .active，隐藏其他卡片
- 使用 Flip 插件实现平滑的布局过渡动画
- 动画时长 0.5 秒，ease: power2.inOut
- 重新出现的卡片有淡入效果
- 消失的卡片有淡出效果
```

**官方 API 写法**：

```javascript
const grid = document.querySelector(".filter-grid");
const items = document.querySelectorAll(".filter-item");

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;

    // 1. 记录当前状态
    const state = Flip.getState(items);

    // 2. 改变布局（添加/移除类名）
    items.forEach(item => {
      if (category === "all" || item.dataset.category === category) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });

    // 3. Flip 动画
    Flip.from(state, {
      duration: 0.5,
      ease: "power2.inOut",
      absolute: true, // 动画中用 absolute 定位，避免布局抖动
      fade: true, // 淡入淡出新增/消失的元素
      stagger: 0.03,
      onEnter: elements => gsap.fromTo(elements,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4 }
      ),
      onLeave: elements => gsap.to(elements,
        { opacity: 0, scale: 0.8, duration: 0.3 }
      )
    });
  });
});
```

**三步法口诀**：**Get State → Make Changes → Flip.from**。先拍照、再改布局、最后让 Flip 补中间的动画。

**适用场景**：筛选重排、标签切换、列表与网格视图切换、图片画廊展开收起。任何涉及布局变化又想要平滑过渡的地方，Flip 都能搞定。

---

### 11 数字滚动计数

**效果说明**：数字从 0 平滑增长到目标值，常用于数据展示、统计面板、成就数字等。

**AI 提示词**（可直接复制）：

```
用 GSAP 实现数字滚动计数动画：
- 目标元素：.stat-number（3 个统计数字）
- 每个数字有 data-target 属性，存目标值
- 从 0 滚动到 data-target 的值
- 滚动到视口内时触发（用 ScrollTrigger）
- 持续时间 2 秒，ease: power2.out
- 数字保留 0 位小数
- 数字千分位加逗号（如 12,345）
- 三个数字 stagger 0.2 秒
```

**官方 API 写法**：

```javascript
function formatNumber(num) {
  return Math.round(num).toLocaleString();
}

document.querySelectorAll(".stat-number").forEach(el => {
  const target = parseFloat(el.dataset.target);

  gsap.fromTo(el,
    { innerHTML: 0 },
    {
      innerHTML: target,
      duration: 2,
      ease: "power2.out",
      snap: { innerHTML: 1 }, // 确保数字始终是整数
      onUpdate: function() {
        el.innerHTML = formatNumber(this.targets()[0].innerHTML);
      },
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
});
```

**关键技巧**：

- `snap: { innerHTML: 1 }` 让 innerHTML 每次变化都是整数，不会出现小数
- `onUpdate` 回调里做格式化，加千分位、百分号、货币符号等
- 配合 ScrollTrigger 实现"滚到哪、数到哪"的效果

---

### 12 标题逐字入场

**效果说明**：标题文字一个字一个字依次出现，配合轻微上移动画，比整行淡入更有节奏感和高级感。

**AI 提示词**（可直接复制）：

```
用 GSAP 实现标题逐字入场动画：
- 目标：.hero-title 中的每个字
- 先把标题拆分成单个 <span class="char">
- 每个字从 y: 30, opacity: 0 入场
- 每个字间隔 0.04 秒
- 持续时间 0.6 秒
- ease: power3.out
- 页面加载后延迟 0.5 秒开始
```

**官方 API 写法**：

```javascript
// 拆分文字
const title = document.querySelector(".hero-title");
const text = title.textContent;
title.innerHTML = "";

[...text].forEach(char => {
  const span = document.createElement("span");
  span.className = "char";
  span.textContent = char === " " ? "\u00A0" : char;
  span.style.display = "inline-block";
  title.appendChild(span);
});

// 逐字入场
gsap.from(".char", {
  y: 30,
  opacity: 0,
  stagger: 0.04,
  duration: 0.6,
  delay: 0.5,
  ease: "power3.out"
});
```

**进阶用法**：

```javascript
// 从中间向两边扩散
stagger: { each: 0.03, from: "center" }

// 随机顺序
stagger: { each: 0.05, from: "random" }

// 配合弹性缓动
ease: "back.out(2)"
```

**注意**：中文标题一个字一个字拆没问题。英文标题建议按单词拆（`text.split(" ")`），否则每个字母拆开会有点碎。

---

### 13 quickTo 鼠标跟随

**效果说明**：元素跟随鼠标移动，但有延迟和惯性，不是硬跟着走，而是有一种"追赶"的丝滑感。常用于光标替换、悬浮跟随指示器、3D 倾斜效果等。

**AI 提示词**（可直接复制）：

```
用 GSAP quickTo 实现鼠标跟随效果：
- 目标：.cursor-follower（自定义光标元素）
- 鼠标移动时，元素平滑跟随
- x 和 y 分别用 quickTo 创建
- 持续时间 0.3 秒，ease: power2.out
- 比实时跟随有延迟感，更丝滑
- 鼠标按下时缩小到 0.5，松开恢复
```

**官方 API 写法**：

```javascript
const follower = document.querySelector(".cursor-follower");

// 创建 quickTo 实例（性能优化，避免每次创建新 tween）
const xTo = gsap.quickTo(follower, "x", { duration: 0.3, ease: "power2.out" });
const yTo = gsap.quickTo(follower, "y", { duration: 0.3, ease: "power2.out" });

// 鼠标移动
window.addEventListener("mousemove", e => {
  xTo(e.clientX);
  yTo(e.clientY);
});

// 点击缩小
window.addEventListener("mousedown", () => {
  gsap.to(follower, { scale: 0.5, duration: 0.15, ease: "power2.out" });
});

window.addEventListener("mouseup", () => {
  gsap.to(follower, { scale: 1, duration: 0.3, ease: "back.out(2)" });
});
```

**为什么用 quickTo 而不是 gsap.to**：`gsap.to` 每次调用都会创建一个新的 tween 实例，鼠标每秒触发几十次 mousemove，会创建大量 tween，性能差。`quickTo` 是 GSAP 3.3+ 新增的高性能方法，专门为这种高频更新场景优化——它复用同一个 tween，只更新目标值，性能好得多。

---

## AI 写 GSAP 的 5 个坑

用 AI 生成 GSAP 代码很爽，但也有几个常见坑，这里提前说清楚，省得你调半天。

### 坑 1：v2 旧 API 混进来

AI 有时候会吐出 `TweenMax`、`TweenLite`、`TimelineMax` 这些 v2 时代的老 API。GSAP 3 已经统一成 `gsap` 一个对象了。

**判断方法**：看到 `TweenMax`、`TweenLite`、`TimelineMax`、`TimelineLite`，一律要求 AI 改成 v3 写法。

**正确写法**：`gsap.to()`、`gsap.from()`、`gsap.timeline()`。

### 坑 2：ScrollTrigger 忘了注册

AI 写了 ScrollTrigger 配置，但忘了 `gsap.registerPlugin(ScrollTrigger)`。结果就是动画不生效，也不报错，查半天。

**判断方法**：ScrollTrigger 动画不生效，先检查有没有 registerPlugin。

**正确写法**：引入插件 JS 文件后，必须调用 `gsap.registerPlugin(ScrollTrigger, Draggable, Flip)`。

### 坑 3：pin 定位错乱

pin 的元素如果父级有 `transform` 或 `will-change: transform`，会导致 `position: fixed` 失效，pin 出来位置不对。这是浏览器的行为，不是 GSAP 的 bug。

**解决方法**：
- 确保 pin 元素的祖先元素没有 transform
- 实在不行试试 `pinReparent: true`（会把元素临时移到 body 下）

### 坑 4：移动端性能翻车

桌面端跑得丝滑，手机上卡成 PPT。通常是这几个原因：
- 动画了太多元素（同时动 50+ 个 DOM 元素）
- 动了 `width`、`height`、`top`、`left` 这些触发布局重排的属性
- 没加 `will-change: transform` 提示浏览器优化

**优化原则**：
- 尽量用 `transform` 和 `opacity` 做动画（不触发重排）
- 移动端减少同时动画的元素数量
- 用 `stagger` 的 `amount` 控制总时长，避免元素过多
- 低端设备可以考虑降级：检测性能，不行就关动画

### 坑 5：React/Vue 里生命周期没清理

框架里用 GSAP，组件卸载时如果没清掉动画和 ScrollTrigger，会导致内存泄漏和奇怪的 bug。

**React 正确写法**：

```jsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from(".box", { x: 100 });
    ScrollTrigger.create({ trigger: ".section", start: "top center" });
  }, containerRef.current);

  return () => ctx.revert(); // 卸载时全部清理
}, []);
```

`gsap.context()` 是 v3.11+ 的神器，能自动收集范围内所有动画和 ScrollTrigger，一行 `ctx.revert()` 全部清理。

---

## 收藏清单

最后，把这 13 个场景浓缩成一张速查表，存到你笔记里，做官网的时候翻出来对照：

| # | 场景 | 核心 API | 难度 | 常用程度 |
|:---:|:---|:---|:---:|:---:|
| 01 | 依次入场 | `stagger` | ★☆☆ | ★★★★★ |
| 02 | 顺序开场 | `timeline` | ★★☆ | ★★★★★ |
| 03 | 滚动触发 | `ScrollTrigger` + toggle | ★★☆ | ★★★★★ |
| 04 | 滚动联动 | `ScrollTrigger` + `scrub` | ★★☆ | ★★★★☆ |
| 05 | 固定叙事 | `ScrollTrigger` + `pin` | ★★★ | ★★★☆☆ |
| 06 | 点击反馈 | `gsap.to` + 事件 | ★☆☆ | ★★★★★ |
| 07 | Hover 微交互 | `gsap.to` + mouseenter/leave | ★☆☆ | ★★★★★ |
| 08 | 手风琴展开 | `height: "auto"` | ★★☆ | ★★★★☆ |
| 09 | 拖拽 | `Draggable` | ★★★ | ★★★☆☆ |
| 10 | 筛选重排 | `Flip` | ★★★ | ★★★☆☆ |
| 11 | 数字计数 | `innerHTML` + `snap` | ★★☆ | ★★★★☆ |
| 12 | 逐字入场 | 拆分字符 + `stagger` | ★★☆ | ★★★★☆ |
| 13 | 鼠标跟随 | `quickTo` | ★★☆ | ★★★☆☆ |

---

## 最后说两句

GSAP 是那种"学了一次、能用一辈子"的工具——API 设计很稳定，从 Flash 时代到现在，核心思路没变过。掌握了这 13 个场景，日常做 landing page、官网、产品页的动效基本都能搞定。

但也别贪多。动画的目的是引导注意力、增强体验，不是炫技。一个落地页有 2-3 处精心设计的动画，比满屏乱飞强得多。克制，才是高级感的来源。

你项目里最常用的 GSAP 场景是哪个？或者有哪个动画效果一直搞不定？评论区说说，下篇可以挑一个做深度拆解。
