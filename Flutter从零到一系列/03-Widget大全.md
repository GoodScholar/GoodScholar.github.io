---
date: 2025-03-03
---
# 🧱 Flutter 从零到一（三）：Widget 大全 — Flutter 的积木世界

> **系列导读**：掌握了 Dart 语言和 Flutter 基础概念后，接下来就是**认识积木**。
> Flutter 提供了丰富的内置 Widget，本文帮你掌握最常用的 30+ 个。

---

## 📊 Widget 分类总览

| 分类 | 包含 Widget | 用途 |
|------|-----------|------|
| 📝 文本显示 | Text / RichText / SelectableText | 展示文字信息 |
| 🖼 图片媒体 | Image / Icon / CircleAvatar | 展示图片和图标 |
| 🔘 按钮交互 | ElevatedButton / TextButton / IconButton / FloatingActionButton | 用户点击操作 |
| 📥 输入组件 | TextField / Checkbox / Switch / Radio / Slider | 用户输入和选择 |
| 📦 容器装饰 | Container / Card / DecoratedBox / ClipRRect | 包裹和装饰 |
| 📏 间距尺寸 | SizedBox / Padding / Spacer / Divider | 控制间距和尺寸 |
| 📜 滚动组件 | ListView / GridView / SingleChildScrollView | 滚动内容 |
| 💬 反馈提示 | SnackBar / Dialog / BottomSheet / Tooltip | 信息反馈 |
| 📱 页面结构 | Scaffold / AppBar / Drawer / BottomNavigationBar | 页面骨架 |

---

## 📝 1. 文本显示

### Text

```dart
// 基础文本
const Text('Hello Flutter')

// 带样式的文本
Text(
  '这是一段重要的提示信息',
  style: TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: Colors.indigo,
    letterSpacing: 1.2,       // 字间距
    height: 1.5,              // 行高
    decoration: TextDecoration.underline,  // 下划线
  ),
)

// 文本截断
Text(
  '这是一段非常长的文本，在空间不够时需要截断显示处理',
  maxLines: 2,                          // 最多 2 行
  overflow: TextOverflow.ellipsis,      // 超出显示省略号
)

// 文本对齐
Text(
  '居中显示的文本',
  textAlign: TextAlign.center,
  style: TextStyle(fontSize: 16),
)
```

### RichText — 富文本

```dart
// 在一段文字中使用不同样式
RichText(
  text: TextSpan(
    style: TextStyle(fontSize: 16, color: Colors.black),
    children: [
      TextSpan(text: '价格：'),
      TextSpan(
        text: '¥99.00',
        style: TextStyle(
          color: Colors.red,
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
      ),
      TextSpan(
        text: ' /月',
        style: TextStyle(color: Colors.grey, fontSize: 12),
      ),
    ],
  ),
)
```

### SelectableText — 可选择复制

```dart
// 用户可以长按选择复制的文本
const SelectableText(
  '这段文字可以被选中和复制',
  style: TextStyle(fontSize: 16),
)
```

---

## 🖼 2. 图片与图标

### Image

```dart
// 网络图片
Image.network(
  'https://picsum.photos/300/200',
  width: 300,
  height: 200,
  fit: BoxFit.cover,                    // 裁切方式
  loadingBuilder: (context, child, progress) {
    if (progress == null) return child;  // 加载完成
    return Center(child: CircularProgressIndicator());  // 加载中
  },
  errorBuilder: (context, error, stack) {
    return Icon(Icons.broken_image, size: 48);  // 加载失败
  },
)

// 本地图片（需在 pubspec.yaml 声明 assets）
Image.asset(
  'assets/images/logo.png',
  width: 120,
  height: 120,
)

// 圆角图片
ClipRRect(
  borderRadius: BorderRadius.circular(12),
  child: Image.network(
    'https://picsum.photos/200',
    width: 200,
    height: 200,
    fit: BoxFit.cover,
  ),
)

// 圆形图片
CircleAvatar(
  radius: 40,
  backgroundImage: NetworkImage('https://picsum.photos/100'),
)
```

### Icon

```dart
// Material 图标
const Icon(Icons.favorite, color: Colors.red, size: 32)
const Icon(Icons.home, color: Colors.blue)
const Icon(Icons.settings, size: 24)

// 带背景的图标按钮
CircleAvatar(
  backgroundColor: Colors.indigo.withValues(alpha: 0.1),
  child: Icon(Icons.person, color: Colors.indigo),
)
```

---

## 🔘 3. 按钮

```dart
// ElevatedButton — 凸起按钮（主操作）
ElevatedButton(
  onPressed: () { print('点击了'); },
  child: const Text('登录'),
)

// 带图标的按钮
ElevatedButton.icon(
  onPressed: () {},
  icon: const Icon(Icons.login),
  label: const Text('登录'),
)

// FilledButton — 填充按钮（Material 3 推荐主操作）
FilledButton(
  onPressed: () {},
  child: const Text('确认'),
)

// TextButton — 文字按钮（次要操作）
TextButton(
  onPressed: () {},
  child: const Text('取消'),
)

// OutlinedButton — 描边按钮
OutlinedButton(
  onPressed: () {},
  child: const Text('查看详情'),
)

// IconButton — 图标按钮
IconButton(
  onPressed: () {},
  icon: const Icon(Icons.share),
  tooltip: '分享',
)

// FloatingActionButton — 浮动操作按钮
FloatingActionButton(
  onPressed: () {},
  child: const Icon(Icons.add),
)

// 自定义样式按钮
ElevatedButton(
  onPressed: () {},
  style: ElevatedButton.styleFrom(
    backgroundColor: Colors.indigo,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    elevation: 4,
  ),
  child: const Text('自定义按钮', style: TextStyle(fontSize: 16)),
)

// 禁用按钮
ElevatedButton(
  onPressed: null,  // null 表示禁用
  child: const Text('不可点击'),
)
```

---

## 📥 4. 输入与选择

### TextField

```dart
class InputDemo extends StatefulWidget {
  @override
  State<InputDemo> createState() => _InputDemoState();
}

class _InputDemoState extends State<InputDemo> {
  final _controller = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _controller.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 基础输入框
        TextField(
          controller: _controller,
          decoration: InputDecoration(
            labelText: '用户名',
            hintText: '请输入用户名',
            prefixIcon: Icon(Icons.person),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          onChanged: (value) => print('输入了: $value'),
        ),

        SizedBox(height: 16),

        // 密码输入框
        TextField(
          controller: _passwordController,
          obscureText: _obscurePassword,
          decoration: InputDecoration(
            labelText: '密码',
            prefixIcon: Icon(Icons.lock),
            suffixIcon: IconButton(
              icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
              onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),

        SizedBox(height: 16),

        // 多行输入
        TextField(
          maxLines: 4,
          decoration: InputDecoration(
            labelText: '备注',
            alignLabelWithHint: true,
            border: OutlineInputBorder(),
          ),
        ),
      ],
    );
  }
}
```

### 选择组件

```dart
class SelectionDemo extends StatefulWidget {
  @override
  State<SelectionDemo> createState() => _SelectionDemoState();
}

class _SelectionDemoState extends State<SelectionDemo> {
  bool _agreeTerms = false;
  bool _enableNotification = true;
  String _selectedGender = '男';
  double _fontSize = 16;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Checkbox 多选框
        CheckboxListTile(
          title: const Text('同意用户协议'),
          value: _agreeTerms,
          onChanged: (v) => setState(() => _agreeTerms = v!),
        ),

        // Switch 开关
        SwitchListTile(
          title: const Text('消息通知'),
          subtitle: const Text('接收最新活动推送'),
          value: _enableNotification,
          onChanged: (v) => setState(() => _enableNotification = v),
        ),

        // Radio 单选
        ...['男', '女', '保密'].map((gender) => RadioListTile<String>(
          title: Text(gender),
          value: gender,
          groupValue: _selectedGender,
          onChanged: (v) => setState(() => _selectedGender = v!),
        )),

        // Slider 滑块
        ListTile(
          title: Text('字体大小: ${_fontSize.round()}'),
          subtitle: Slider(
            value: _fontSize,
            min: 12,
            max: 32,
            divisions: 20,
            label: '${_fontSize.round()}',
            onChanged: (v) => setState(() => _fontSize = v),
          ),
        ),
      ],
    );
  }
}
```

---

## 📦 5. 容器与装饰

### Container

```dart
// 基础容器
Container(
  width: 200,
  height: 100,
  padding: const EdgeInsets.all(16),
  margin: const EdgeInsets.all(8),
  decoration: BoxDecoration(
    color: Colors.indigo,
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: Colors.indigo.withValues(alpha: 0.3),
        blurRadius: 12,
        offset: const Offset(0, 6),
      ),
    ],
  ),
  child: const Center(
    child: Text('卡片', style: TextStyle(color: Colors.white, fontSize: 18)),
  ),
)

// 渐变背景
Container(
  width: double.infinity,
  height: 200,
  decoration: BoxDecoration(
    gradient: LinearGradient(
      colors: [Colors.indigo, Colors.purple],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    borderRadius: BorderRadius.circular(16),
  ),
  child: Center(
    child: Text('渐变卡片', style: TextStyle(color: Colors.white, fontSize: 24)),
  ),
)
```

### Card

```dart
Card(
  elevation: 4,
  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('卡片标题', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        SizedBox(height: 8),
        Text('这是卡片的内容描述文字。', style: TextStyle(color: Colors.grey)),
        SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            TextButton(onPressed: () {}, child: Text('取消')),
            ElevatedButton(onPressed: () {}, child: Text('确认')),
          ],
        ),
      ],
    ),
  ),
)
```

---

## 📏 6. 间距与尺寸

```dart
Column(
  children: [
    // SizedBox — 固定尺寸/间隔
    const SizedBox(height: 16),          // 垂直间隔
    const SizedBox(width: 8),            // 水平间隔
    SizedBox(width: 100, height: 100),   // 固定大小

    // Padding — 内边距
    Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Text('有内边距的文字'),
    ),

    // Spacer — 弹性空间（在 Row/Column 中使用）
    Row(
      children: [
        Text('左侧'),
        const Spacer(),   // 占满中间空间
        Text('右侧'),
      ],
    ),

    // Divider — 分割线
    const Divider(thickness: 1, color: Colors.grey),
  ],
)
```

---

## 💬 7. 反馈提示

```dart
class FeedbackDemo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // SnackBar — 底部提示条
        ElevatedButton(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('操作成功！'),
                action: SnackBarAction(label: '撤销', onPressed: () {}),
                duration: const Duration(seconds: 3),
              ),
            );
          },
          child: const Text('显示 SnackBar'),
        ),

        // Dialog — 对话框
        ElevatedButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (context) => AlertDialog(
                title: const Text('确认删除？'),
                content: const Text('删除后不可恢复'),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('取消'),
                  ),
                  FilledButton(
                    onPressed: () {
                      // 执行删除
                      Navigator.pop(context);
                    },
                    child: const Text('删除'),
                  ),
                ],
              ),
            );
          },
          child: const Text('显示对话框'),
        ),

        // BottomSheet — 底部弹出面板
        ElevatedButton(
          onPressed: () {
            showModalBottomSheet(
              context: context,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
              ),
              builder: (context) => Container(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ListTile(
                      leading: Icon(Icons.camera_alt),
                      title: Text('拍照'),
                      onTap: () => Navigator.pop(context),
                    ),
                    ListTile(
                      leading: Icon(Icons.photo_library),
                      title: Text('从相册选择'),
                      onTap: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
            );
          },
          child: const Text('显示 BottomSheet'),
        ),
      ],
    );
  }
}
```

---

## 📱 8. 页面结构 — Scaffold

```dart
Scaffold(
  // 顶部导航栏
  appBar: AppBar(
    leading: IconButton(
      icon: const Icon(Icons.menu),
      onPressed: () {},
    ),
    title: const Text('首页'),
    centerTitle: true,
    actions: [
      IconButton(icon: const Icon(Icons.search), onPressed: () {}),
      IconButton(icon: const Icon(Icons.notifications), onPressed: () {}),
    ],
  ),

  // 主内容区
  body: const Center(child: Text('页面内容')),

  // 浮动操作按钮
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: const Icon(Icons.add),
  ),
  floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,

  // 底部导航栏
  bottomNavigationBar: NavigationBar(
    selectedIndex: 0,
    destinations: const [
      NavigationDestination(icon: Icon(Icons.home), label: '首页'),
      NavigationDestination(icon: Icon(Icons.explore), label: '发现'),
      NavigationDestination(icon: Icon(Icons.person), label: '我的'),
    ],
  ),

  // 侧边抽屉
  drawer: Drawer(
    child: ListView(
      children: [
        DrawerHeader(
          decoration: BoxDecoration(color: Colors.indigo),
          child: Text('菜单', style: TextStyle(color: Colors.white, fontSize: 24)),
        ),
        ListTile(leading: Icon(Icons.settings), title: Text('设置'), onTap: () {}),
        ListTile(leading: Icon(Icons.info), title: Text('关于'), onTap: () {}),
      ],
    ),
  ),
)
```

---

## ✅ 本篇小结 Checklist

- [ ] 掌握 Text / RichText 文本显示
- [ ] 会使用 Image 加载网络/本地图片
- [ ] 知道 5 种按钮类型和自定义样式
- [ ] 掌握 TextField 输入框配置
- [ ] 会用 Container + BoxDecoration 装饰
- [ ] 理解 SizedBox / Padding / Spacer 的用途
- [ ] 掌握 SnackBar / Dialog / BottomSheet 反馈
- [ ] 理解 Scaffold 页面结构

---

> **下一篇预告**：《布局系统精讲：从 CSS 思维到 Flutter 思维》——
> 掌握 Row / Column / Stack / Flex 布局，告别"布局写不出来"的困扰。

---

*本文是「Flutter 从零到一」系列第 3 篇，共 13 篇。*


---
*📝 作者：NIHoa ｜ 系列：Flutter从零到一系列 ｜ 更新日期：2025-03-03*
