# 📧 Flutter 页面分析：发送建议邮件页

Flutter | 页面分析系列

本期聊的是一个非常实用的功能——在 App 里直接唤起系统邮件客户端发邮件。看起来简单，但里面有几个细节处理不好就会翻车，我都踩过。

---

## 🔍 1. 页面拆解：Widget 树总览

页面结构很简洁：

```
Scaffold
├── AppBar（标题：发送建议邮件）
└── Body: Padding
    └── ListView
        ├── TextField（收件人）
        ├── SizedBox(height: 16)
        ├── TextField（主题）
        ├── SizedBox(height: 16)
        ├── TextField（内容，maxLines: 8）
        ├── SizedBox(height: 24)
        └── ElevatedButton.icon（发送邮件）
```

整体是一个竖向表单，滚动容器用的是 `ListView`，下方一个全宽按钮触发发送。

---

## 🧩 2. 关键 Widget 选型解析

### 为什么用 ListView 而不是 Column？

这是我最开始也会犯的错——表单页面习惯性用 `Column`。

**问题**：当系统键盘弹起来，`Column` 不会自动收缩，内容可能被键盘遮住，还会报 overflow 错误。

**用 `ListView` 的原因**：它天生可以滚动，键盘弹起时用户可以向上滑动查看被遮住的输入框，体验好很多。

| 容器 | 键盘弹起表现 | 溢出问题 |
|------|-----------|--------|
| Column | ❌ 可能被遮住、报溢出 | 有 |
| ListView | ✅ 可滚动，内容完整可见 | 无 |

### TextField 的几个细节

收件人那个输入框我加了 `keyboardType: TextInputType.emailAddress`，弹出的键盘会多一个 `@` 键，用户输入邮箱不用手动切换符号键盘——这种小细节用户感觉不到，但不做他们会觉得"卡"。

内容框设置了 `maxLines: 8`，配合 `alignLabelWithHint: true`，标签"内容"会对齐到文本框的顶部而不是垂直居中。不加这个，标签会飘在一个奇怪的位置。

### ElevatedButton.icon 全宽写法

```dart
ElevatedButton.icon(
  style: ElevatedButton.styleFrom(
    minimumSize: const Size(double.infinity, 48),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  ),
  ...
)
```

`double.infinity` 让按钮撑满宽度，`minimumSize` 设置最小高度 48，符合 Material 触控区域规范。圆角 12 是现在比较流行的风格，不要用默认的胶囊形状，太圆了。

---

## ⚙️ 3. 状态管理设计

这个页面用 `StatefulWidget` + 三个 `TextEditingController` 管理状态，是最朴素的做法，完全够用。

```
_toController      → 收件人邮箱（预填 support@example.com）
_subjectController → 主题（预填"用户建议"）
_bodyController    → 邮件正文（空）
```

**数据流向：**
```
用户输入 → TextEditingController → _sendEmail() 读取 .text → 构建 Uri → launchUrl
```

有一点必须做：在 `dispose()` 里释放三个 Controller，每个都要 `.dispose()`。忘了的话内存会慢慢泄露，页面关了 Controller 还在。

---

## 💻 4. 完整代码实现

核心逻辑在 `_sendEmail()` 方法，这里重点看 URI 的构建和降级处理：

```dart
Future<void> _sendEmail() async {
  final String to = _toController.text.trim();
  final String subject = _subjectController.text.trim();
  final String body = _bodyController.text.trim();

  // 简单校验：收件人不能为空
  if (to.isEmpty) {
    ScaffoldMessenger.of(context)
        .showSnackBar(const SnackBar(content: Text('请填写收件人邮箱')));
    return;
  }

  // 构建 mailto URI
  // ⚠️ 注意：query 参数里的 subject 和 body 必须手动 encodeComponent
  // 否则中文、空格、特殊符号都会导致邮件客户端解析失败
  final Uri emailUri = Uri(
    scheme: 'mailto',
    path: to,
    query:
        'subject=${Uri.encodeComponent(subject)}&body=${Uri.encodeComponent(body)}',
  );

  try {
    if (await canLaunchUrl(emailUri)) {
      // ✅ 有邮件客户端，直接调起
      await launchUrl(emailUri, mode: LaunchMode.externalApplication);
    } else {
      // ❌ 没装邮件 App，弹降级提示
      _showNoMailAppDialog(to, subject, body);
    }
  } catch (_) {
    _showNoMailAppDialog(to, subject, body);
  }
}
```

降级 Dialog 里还做了一个 Android 专属处理——如果检测到是 Android 设备，多出一个按钮跳转 Gmail 网页版：

```dart
if (Platform.isAndroid)
  TextButton(
    onPressed: () async {
      final Uri gmailUri = Uri.parse(
        'https://mail.google.com/mail/?view=cm&to=$to&su=${Uri.encodeComponent(subject)}&body=${Uri.encodeComponent(body)}',
      );
      if (await canLaunchUrl(gmailUri)) {
        await launchUrl(gmailUri, mode: LaunchMode.externalApplication);
      }
      if (context.mounted) Navigator.pop(context);
    },
    child: const Text('使用 Gmail 网页'),
  ),
```

注意 `context.mounted` 的判断——`await` 之后 context 有可能已经不在树上了，不检查直接用会报错。

---

## 📦 5. 平台配置（重要，容易漏）

代码本身写完了，但如果不加平台配置，`canLaunchUrl` 在 Android 上永远返回 false。

**Android — AndroidManifest.xml：**

```xml
<queries>
    <intent>
        <action android:name="android.intent.action.VIEW" />
        <data android:scheme="mailto" />
    </intent>
</queries>
```

**iOS — Info.plist：**

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>mailto</string>
</array>
```

这两个配置告诉系统"我需要查询哪些 scheme 是否可用"——Android 11+ 对包可见性有严格限制，不加就查不到。

---

## 🚀 6. 性能 & 优化要点

**不需要 Riverpod / Bloc 的理由**

这个页面的状态极其简单：三个输入框的文字。`TextEditingController` 本身就是响应式的，页面销毁时跟着销毁。引入状态管理反而增加复杂度，看到有人给这种页面套一层 Provider 我是真没看懂。

**const 修饰符**

代码里能加 `const` 的地方都加了——`SizedBox`、`InputDecoration`、`Icon`、`Text`。这些 Widget 每次 build 不会重新创建，减少无意义的对象分配。

**可以继续优化的方向：**
- 加发送中的 Loading 状态（按钮禁用 + 转圈）
- 邮件格式校验（现在只校验了非空）
- 成功/失败 Toast 提示

---

## 💡 7. 延伸思考

- `Uri.encodeComponent` 和 `Uri.encodeFull` 有什么区别？在 mailto 里用错了会怎样？
- 如果要支持附件发送，`mailto` 协议能做到吗？怎么做？
- 除了掉起邮件客户端，还有没有在 App 内直接发邮件的方案？（提示：SMTP 协议）

---

## 📝 小结

- [x] 表单页面用 `ListView` 代替 `Column`，键盘弹起时不会溢出
- [x] `keyboardType: TextInputType.emailAddress` 提升邮件输入体验
- [x] `mailto` URI 的 query 参数必须手动 `encodeComponent`，否则中文乱码
- [x] `canLaunchUrl` 在 Android 11+ 需要 `<queries>` 配置，iOS 需要 `LSApplicationQueriesSchemes`
- [x] `await` 后使用 context 前记得检查 `context.mounted`
- [x] `dispose()` 里每个 `TextEditingController` 都要释放

> 调起系统邮件客户端这件事，真正麻烦的不是代码本身，而是各平台的权限配置和"没有邮件 App 怎么办"的降级方案。把这两个做好，用户体验就稳了。

---

好了，本期内容就到这里，感兴趣的话欢迎点赞、在看，我们下期见！Bye~

**标签**：`#Flutter` `#url_launcher` `#邮件发送` `#TextField` `#页面分析`
