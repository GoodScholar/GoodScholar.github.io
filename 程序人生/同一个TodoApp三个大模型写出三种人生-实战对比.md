---
date: 2026-03-14
tags:
  - AI编程
  - 大模型实测
  - Gemini
  - GPT
  - Claude
  - React
cover: /covers/cover-ai-models-showdown.webp
---
# 同一个 Todo App，三个大模型写出三种人生 — Gemini vs GPT vs Claude 实战对比

> 🔬 理论对比千篇一律，实战见真章才有意义。我用完全相同的 Prompt，让 Gemini 3.1 Pro、GPT-5 和 Claude Opus 4.6 各写了一个 Todo App，结果差异大到让我重新审视了对它们的认知。

---

## 实验规则

为了保证公平，我制定了严格的对比规则：

### 实验条件

| 条件 | 设定 |
|------|------|
| **Prompt** | 三个模型使用完全相同的自然语言提示词 |
| **框架** | React 18 + TypeScript |
| **轮数** | 第一轮：零上下文直接生成；不追加修改 |
| **评分维度** | 代码质量、功能完整度、UI 美观度、工程规范、可维护性 |
| **Skills 加持** | 无。所有模型都在「裸奔」状态下工作 |

### 统一 Prompt

```
请用 React 18 + TypeScript 帮我写一个 Todo App，要求：

1. 支持添加、完成、删除待办事项
2. 支持按「全部 / 未完成 / 已完成」筛选
3. 显示剩余未完成数量
4. 数据持久化到 localStorage
5. UI 要美观，使用现代化的设计风格
6. 代码要有良好的类型定义和组件拆分
```

就这 6 条，没有任何框架偏好、CSS 方案限制、或架构指导。让我们看看三个模型各自「脑补」出什么来。

---

## 🟢 选手一：Gemini 3.1 Pro

### 第一印象

Gemini 反应最快，几乎是瞬间就开始输出代码。它给出了一个 **单文件方案**——所有逻辑和组件都写在一个 `App.tsx` 里，附带一个独立的 `App.css`。

### 代码特点

```typescript
// Gemini 的类型定义 —— 简洁直白
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';
```

**✅ 优点：**

- **出活速度最快**，从 Prompt 到完整可运行代码的时间最短
- CSS 样式意外地精致——用了**渐变背景 + 卡片式布局 + 过渡动画**，视觉效果三者中最好看
- `localStorage` 的读写使用了 `useEffect` 监听，实现正确
- 自动给删除按钮加了 `hover` 效果和 `transition`

**❌ 不足：**

- **整个应用只有一个组件**，没有拆分 `TodoItem`、`TodoInput`、`FilterBar` 等子组件
- 没有用 `useCallback` 优化回调函数，列表大了会有性能问题
- `id` 用的是 `Date.now().toString()`——两次连续快速添加可能产生重复 id
- 没有空状态提示（列表为空时什么都不显示）

### 它的风格

Gemini 像一个**手速极快的全栈工程师**——先出一个能跑的版本，样式还挺好看，但代码结构不够讲究。适合快速原型和 Demo。

### 评分

| 维度 | 评分 | 点评 |
|------|------|------|
| 代码质量 | ⭐⭐⭐ | 单文件，没有组件拆分 |
| 功能完整度 | ⭐⭐⭐⭐ | 6 条需求全部满足 |
| UI 美观度 | ⭐⭐⭐⭐⭐ | 渐变 + 动画，三者最漂亮 |
| 工程规范 | ⭐⭐⭐ | 无拆分，无优化 |
| 可维护性 | ⭐⭐⭐ | 单文件 250 行，后期难维护 |

---

## 🟠 选手二：GPT-5 Codex

### 第一印象

GPT-5 的输出速度中等，但它做了一件其他两个模型都没做的事——**先输出了一份简短的项目结构说明**，然后再逐文件生成代码。

```
项目结构：
src/
├── components/
│   ├── TodoInput.tsx
│   ├── TodoItem.tsx
│   ├── TodoList.tsx
│   └── FilterBar.tsx
├── hooks/
│   └── useLocalStorage.ts
├── types/
│   └── todo.ts
├── App.tsx
└── App.css
```

### 代码特点

```typescript
// GPT-5 的自定义 Hook —— 抽象程度最高
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

**✅ 优点：**

- **组件拆分最合理**——TodoInput、TodoItem、TodoList、FilterBar 各司其职
- 把 `localStorage` 逻辑抽成了 `useLocalStorage` 自定义 Hook，**复用性最强**
- 类型定义集中到 `types/todo.ts`，工程结构清晰
- 错误处理最完善——`localStorage` 的读写都包了 `try-catch`
- 使用了 `crypto.randomUUID()` 生成 id，不会重复

**❌ 不足：**

- **CSS 样式比较朴素**——用了标准的浅灰背景 + 白色卡片，没有渐变和动画，看起来像 Bootstrap 默认风格
- 代码略显「模板化」——感觉在背一套标准答案
- FilterBar 组件的 props 传递层级有点深，小项目里有些 over-engineering

### 它的风格

GPT-5 像一个**刚从大厂出来的中级工程师**——代码结构规范、拆分合理、错误处理到位，但缺少灵气和设计感。写出来的代码放到 Code Review 里不会被挑毛病，但也不会让人眼前一亮。

### 评分

| 维度 | 评分 | 点评 |
|------|------|------|
| 代码质量 | ⭐⭐⭐⭐⭐ | 拆分合理，Hook 复用好 |
| 功能完整度 | ⭐⭐⭐⭐ | 6 条需求全部满足 |
| UI 美观度 | ⭐⭐⭐ | 偏朴素，缺少设计感 |
| 工程规范 | ⭐⭐⭐⭐⭐ | 目录结构 + 类型集中 + 错误处理 |
| 可维护性 | ⭐⭐⭐⭐⭐ | 组件独立，容易扩展 |

---

## 🔵 选手三：Claude Opus 4.6

### 第一印象

Claude 的输出速度最慢——但你能明显感觉到它在「想」。它的输出前面有一段**设计思考**（虽然不是很长），解释了它为什么要这样组织代码。

### 代码特点

```typescript
// Claude 的 Reducer 模式 —— 最严谨的状态管理
type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'CLEAR_COMPLETED' };

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: crypto.randomUUID(),
          text: action.payload.trim(),
          completed: false,
          createdAt: Date.now(),
        },
      ];
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload);
    case 'CLEAR_COMPLETED':
      return state.filter((todo) => !todo.completed);
    default:
      return state;
  }
}
```

**✅ 优点：**

- **状态管理用了 `useReducer` + Action 类型**——这是三者中架构思想最成熟的方案
- Todo 数据结构多了 `createdAt` 字段——虽然 Prompt 没要求，但这为后续排序功能预留了扩展空间
- 主动增加了 Prompt 没要求的「清除已完成」功能——说明它在思考用户真实使用场景
- 输入框有**空字符串校验**和 **trim 处理**——防御性编程做得最好
- 有完善的**空状态 UI**——当列表为空时显示「暂无待办事项，添加一个吧！」
- 组件拆分合理，同时保持了适度——既不像 Gemini 全堆一个文件，也不像 GPT-5 拆得太细

**❌ 不足：**

- **速度最慢**——等待输出的时间明显长于另外两个
- CSS 用了 CSS Modules（`.module.css`），样式**整洁但缺少视觉冲击力**——比 GPT-5 好看一些，但不如 Gemini 惊艳
- `useReducer` 对于一个 Todo App 来说可能有些 over-design——简单场景下 `useState` 就够了
- 没有做动画过渡效果

### 它的风格

Claude 像一个**有洁癖的高级工程师**——代码每一行都有意图，状态管理选型深思熟虑，主动思考需求背后的真实场景。但它不太在意视觉效果，更关心代码本身的「正确性」和「可演进性」。

### 评分

| 维度 | 评分 | 点评 |
|------|------|------|
| 代码质量 | ⭐⭐⭐⭐⭐ | Reducer 模式，防御性编程 |
| 功能完整度 | ⭐⭐⭐⭐⭐ | 超出预期，主动增加功能 |
| UI 美观度 | ⭐⭐⭐⭐ | 整洁但不惊艳 |
| 工程规范 | ⭐⭐⭐⭐⭐ | 类型安全 + 空状态 + 输入校验 |
| 可维护性 | ⭐⭐⭐⭐⭐ | 架构预留了扩展空间 |

---

## 📊 三方对决总评

### 综合评分

| 维度 | 🟢 Gemini 3.1 Pro | 🟠 GPT-5 Codex | 🔵 Claude Opus 4.6 |
|------|:-:|:-:|:-:|
| 代码质量 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 功能完整度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| UI 美观度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 工程规范 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 可维护性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **出活速度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **总分** | **23** | **26** | **27** |

### 如果用一句话形容

| 模型 | 一句话 | 适合什么场景 |
|------|--------|------------|
| 🟢 Gemini | 「先跑起来，样式还贼好看」 | 快速原型、Demo 演示、Hackathon |
| 🟠 GPT-5 | 「标准答案，规规矩矩」 | 中规中矩的日常开发、团队协作项目 |
| 🔵 Claude | 「想得比你多，写得比你严谨」 | 长期维护项目、需要扩展性的正式产品 |

---

## 🔍 细节对决：三个容易忽略的地方

除了整体结构和代码风格，还有几个细节值得深挖：

### 1. id 生成策略

| 模型 | 方案 | 问题 |
|------|------|------|
| Gemini | `Date.now().toString()` | ⚠️ 快速连续添加会重复 |
| GPT-5 | `crypto.randomUUID()` | ✅ 无碰撞风险 |
| Claude | `crypto.randomUUID()` | ✅ 无碰撞风险 |

**这个细节很有代表性。** Gemini 追求速度，用了最快捷的方案但埋了隐雷。GPT-5 和 Claude 都选择了更健壮的标准 API。

### 2. 空状态处理

| 模型 | 有空状态 UI 吗？ |
|------|-----------------|
| Gemini | ❌ 列表为空时显示空白 |
| GPT-5 | ❌ 列表为空时显示空白 |
| Claude | ✅ 显示友好的空状态提示 |

只有 Claude 主动考虑了这个用户体验细节——用户看到空白页面会困惑。这正是 Claude「想得比你多」的体现。

### 3. 额外功能

| 模型 | Prompt 没要求但自己加的 |
|------|----------------------|
| Gemini | 删除按钮 hover 动画 |
| GPT-5 | 无额外功能 |
| Claude | 「清除已完成」按钮 + `createdAt` 时间戳字段 |

Gemini 在 UI 层面「加戏」，Claude 在功能层面「加戏」，GPT-5 严格按照 Prompt 交付——三种不同的「产品思维」。

---

## 💡 最值得带走的洞察

### 洞察 1：模型的「性格」真的存在

这三个模型不只是「能力高低」的差异，它们有明显的**思维方式差异**：

- **Gemini**：先动手，边做边完善（Builder 型）
- **GPT-5**：按模板交付，确保不出错（Engineer 型）
- **Claude**：先想后做，主动思考需求背后的意图（Architect 型）

### 洞察 2：「裸奔」模式下的差距会被 Skills 抹平

这次实验故意不加任何 Skills。如果加上了呢？

比如给三个模型都加上一条 Skill 规则：

```markdown
## 组件规范
- 必须拆分为独立的子组件，每个组件不超过 80 行
- 必须使用 `crypto.randomUUID()` 生成 id
- 必须提供空状态 UI
- 使用 CSS Modules 进行样式隔离
```

这 4 条规则就能让 Gemini 的「单文件问题」、GPT-5 的「样式朴素问题」、Claude 的「速度问题」（因为不用自己思考这些约束了）**全部被解决**。

**这就是 Skills 的价值——它把模型之间的工程规范差距从「看运气」变成了「有保证」。**

### 洞察 3：最佳策略还是组合

结合上一篇文章的结论，最高效的工作流是：

```
1. 用 Gemini 快速出原型 → 验证想法可行
2. 用 GPT-5 重新生成规范化的代码结构 → 建立工程基础
3. 用 Claude 审查和重构 → 确保架构健壮
```

---

## 结语：没有最好的模型，只有最好的用法

如果这个实验教会了我一件事，那就是：

**每个模型都有盲区，每个模型也都有超出预期的时刻。**

Gemini 的 UI 让我惊喜，Claude 的 `createdAt` 预留让我佩服，GPT-5 的 `useLocalStorage` 抽象让我觉得实用。它们不是竞争对手，而是你工具箱里不同型号的螺丝刀。

关键从来不是「哪个大模型最强」。

关键是：**你有没有能力把它们的优势组合起来、用 Skills 填补它们的短板、用工程思维把产出变成真正可维护的产品。**

这，才是 AI 时代程序员的真正竞争力。

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发。Bye~

---

**标签**：`#AI编程` `#大模型实测` `#Gemini` `#GPT` `#Claude` `#React`

---

*📝 作者：NIHoa ｜ 系列：程序人生 ｜ 更新日期：2026-03-14*
