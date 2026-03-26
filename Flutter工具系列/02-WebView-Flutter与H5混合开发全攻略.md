# Flutter | 第2期 - WebView：Flutter 与 H5 混合开发全攻略

本期为大家分享如何在 Flutter 中去做 WebView 混合开发功能，包括 H5 页面加载、JS 与 Flutter 双向通信、登录态同步等实战场景，感兴趣的话和我一起来探索一下呗~

---

### 首先，什么是 WebView?

WebView 是一个可以在原生应用中嵌入和展示网页内容的组件，是混合开发（Hybrid App）的核心技术。

▪️ **嵌入 H5 页面**：在 Flutter App 中直接加载和展示 Web 页面
▪️ **双向通信**：Flutter 可以向 JS 发送数据，JS 也可以回调 Flutter
▪️ **登录态共享**：App 登录后可以将登录态同步给 H5 页面
▪️ **灵活更新**：H5 内容可随时更新，无需发版即可生效
▪️ **降低成本**：复用已有 H5 页面，避免全部用原生重写

---

## 方案对比

| 插件 | 核心特点 | 对比 | Stars |
|------|---------|------|-------|
| webview_flutter（官方） | Flutter 团队维护，API 简洁 | ✅ 官方维护、稳定可靠、社区活跃 | 2k+ |
| flutter_inappwebview | 功能丰富（下载、截图、打印） | ⚠️ 功能多但体积大，API 较复杂 | 3k+ |
| url_launcher | 跳转外部浏览器 | ❌ 不是真正的 WebView，无法内嵌 | 1k+ |

**本期选择 webview_flutter（官方插件）进行演示。** 它由 Flutter 团队维护，API 设计优雅，覆盖了绝大部分混合开发场景。

---

## 基础集成

### 添加依赖

1️⃣ 在 `pubspec.yaml` 中添加依赖：

```yaml
dependencies:
  webview_flutter: ^4.13.0
```

2️⃣ 运行安装命令：

```bash
flutter pub get
```

3️⃣ 导入包：

```dart
import 'package:webview_flutter/webview_flutter.dart';
```

> **注意**：Android 平台默认需要网络权限。确保 `AndroidManifest.xml` 中已添加：
> ```xml
> <uses-permission android:name="android.permission.INTERNET"/>
> ```

> **提示**：iOS 平台如果要加载非 HTTPS 的 HTTP 页面，需要在 `Info.plist` 中配置 `NSAppTransportSecurity` → `NSAllowsArbitraryLoads` 为 `true`。

---

## 一、H5 页面加载

webview_flutter 提供了 **四种** 方式来加载 H5 内容，适用于不同场景：

| 加载方式 | API | 适用场景 |
|---------|-----|---------|
| 加载远程 URL | `loadRequest(Uri)` | ✅ 加载线上 H5 页面 |
| 加载 HTML 字符串 | `loadHtmlString(String)` | ✅ 动态生成的 HTML 内容 |
| 加载 Assets 文件 | `loadFlutterAsset(String)` | ✅ 本地打包的 H5 资源 |
| 加载本地文件 | `loadFile(String)` | ✅ 运行时写入的 HTML 文件 |

---

### 方式一：加载远程 URL

最常见的用法，直接加载一个线上 H5 页面：

```dart
class Flutter2jsByUrl extends StatefulWidget {
  const Flutter2jsByUrl({super.key});

  @override
  State<Flutter2jsByUrl> createState() => _Flutter2jsByUrlState();
}

class _Flutter2jsByUrlState extends State<Flutter2jsByUrl> {
  int progress = 0;
  late WebViewController controller;

  @override
  void initState() {
    super.initState();

    controller = WebViewController()
      // 开启 JS 执行（默认是关闭的）
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            setState(() {
              // 实时更新加载进度
              this.progress = progress;
            });
          },
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('加载远程 URL'),
        actions: <Widget>[
          FilledButton(
            onPressed: () {
              // 通过 loadRequest 加载远程 URL
              controller.loadRequest(
                Uri.parse('https://www.example.com?name=geekailab'),
              );
            },
            child: const Text('加载H5'),
          ),
        ],
      ),
      body: Stack(
        children: <Widget>[
          WebViewWidget(controller: controller),
          // 显示加载进度
          Positioned(
            left: 100,
            bottom: 100,
            child: Text('加载进度：$progress%'),
          ),
        ],
      ),
    );
  }
}
```

🚀 通过 `loadRequest` + `onProgress` 回调，我们可以轻松加载远程页面并实时显示加载进度！

---

### 方式二：加载 Assets 本地资源

将 H5 文件打包到项目的 `assets` 目录中，通过 `loadFlutterAsset` 加载：

```dart
class FlutterH5JumpAssets extends StatefulWidget {
  const FlutterH5JumpAssets({super.key});

  @override
  State<FlutterH5JumpAssets> createState() => _FlutterH5JumpAssetsState();
}

class _FlutterH5JumpAssetsState extends State<FlutterH5JumpAssets> {
  late WebViewController controller;

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('加载 Assets H5')),
      body: WebViewWidget(controller: controller),
    );
  }

  Future<void> _onLoadFlutterAssets() async {
    // 加载项目 assets 下的 H5 页面
    await controller.loadFlutterAsset('assets/hiH5/index.html');
  }
}
```

> **注意**：使用 `loadFlutterAsset` 时，assets 目录的增删或修改文件后，**必须重新启动项目**（热重载无效），否则会加载不到最新内容。

> **提示**：别忘了在 `pubspec.yaml` 中声明 assets 路径：
> ```yaml
> flutter:
>   assets:
>     - assets/hiH5/
> ```

---

### 方式三：加载本地文件（loadFile）

在运行时动态生成 HTML 并写入本地文件，再通过 `loadFile` 加载：

```dart
import 'dart:io';
import 'package:path_provider/path_provider.dart';

const String h5String = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>通过 loadFile 加载 H5</title>
</head>
<body>
    <div style="font-size: 2.5em;">通过 loadFile 加载的 H5 页面</div>
</body>
</html>
''';

// 将 HTML 字符串保存到本地文件
Future<String> _prepareFile() async {
  final String tmpDir = (await getTemporaryDirectory()).path;

  // 创建文件（递归创建目录）
  final File file = File(
    <String>{tmpDir, 'hi', 'index.html'}.join(Platform.pathSeparator),
  );

  await file.create(recursive: true);
  // 写入 HTML 内容
  await file.writeAsString(h5String);
  return file.path;
}

// 使用时
Future<void> _onLoadLocalFile() async {
  final String path = await _prepareFile();
  await controller.loadFile(path);
}
```

> **提示**：`loadFile` 适合需要在运行时动态生成或下载 HTML 的场景，比如加载用户生成的富文本内容。

---

## 二、JS ↔ Flutter 双向通信

混合开发的核心在于 **JS 和 Flutter 之间的数据互通**。webview_flutter 提供了多种通信方式：

| 通信方向 | 方式 | API | 适用场景 |
|---------|------|-----|---------|
| JS → Flutter | URL 拦截 | `onNavigationRequest` | ✅ 简单参数传递 |
| JS → Flutter | Channel | `addJavaScriptChannel` | ✅ 复杂数据通信（推荐） |
| Flutter → JS | URL 传参 | `loadRequest(url?params)` | ✅ 初始化参数 |
| Flutter → JS | runJavaScript | `runJavaScript()` | ✅ 随时调用 JS 函数（推荐） |

---

### 方式一：JS 通过 URL 向 Flutter 传递数据

原理：H5 中通过修改 `document.location` 触发导航，Flutter 端在 `onNavigationRequest` 中拦截并解析参数。

**H5 端代码：**

```html
<button id="btn" style="font-size: 2.5em;">传递参数</button>
<script type="text/javascript">
    var btn = document.getElementById('btn');
    btn.addEventListener('click', function() {
        // 通过自定义协议向 Flutter 传递参数
        document.location = 'hi://webview?name=张三&age=25';
    });
</script>
```

**Flutter 端代码：**

```dart
class Js2flutterByUrl extends StatefulWidget {
  const Js2flutterByUrl({super.key});

  @override
  State<Js2flutterByUrl> createState() => _Js2flutterByUrlState();
}

class _Js2flutterByUrlState extends State<Js2flutterByUrl> {
  late WebViewController controller;

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (NavigationRequest request) {
            // 拦截自定义协议的 URL
            if (request.url.startsWith('hi://webview')) {
              final Uri uri = Uri.parse(request.url);
              final String? name = uri.queryParameters['name'];
              final String? age = uri.queryParameters['age'];

              debugPrint('收到参数：name=$name, age=$age');

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('收到参数：name=$name, age=$age')),
              );

              // 阻止导航，仅处理数据
              return NavigationDecision.prevent;
            } else {
              return NavigationDecision.navigate;
            }
          },
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('JS 通过 URL 传参')),
      body: WebViewWidget(controller: controller),
    );
  }
}
```

> **注意**：URL 方式适合简单参数传递，但有长度限制且不适合传递复杂数据。推荐使用 Channel 方式。

---

### 方式二：JS 通过 Channel 向 Flutter 传递数据（推荐）

原理：Flutter 端注册一个 JavaScript Channel，H5 端通过 `channelName.postMessage()` 发送消息。

**H5 端代码：**

```html
<button id="btn" style="font-size: 2.5em;">传递参数</button>
<script type="text/javascript">
    var btn = document.getElementById('btn');
    btn.addEventListener('click', function() {
        // 通过注册的 channel 向 Flutter 传递消息
        hiPop.postMessage('hello flutter');
    });
</script>
```

**Flutter 端代码：**

```dart
@override
void initState() {
  super.initState();
  controller = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    // 注册 JavaScript Channel
    ..addJavaScriptChannel(
      'hiPop',  // channel 名称，H5 中通过 hiPop.postMessage() 调用
      onMessageReceived: (JavaScriptMessage message) {
        // 接收 JS 传递的消息
        debugPrint('收到 JS 消息：${message.message}');

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('收到消息: ${message.message}')),
        );
      },
    );
}
```

🚀 Channel 方式是最推荐的 JS → Flutter 通信方案，API 简洁、支持复杂数据、不受 URL 长度限制！

---

### 方式三：Flutter 通过 runJavaScript 向 JS 传递数据

原理：Flutter 端直接调用 `runJavaScript` 执行 JS 代码，可以调用 H5 中定义的函数并传参。

**H5 端代码：**

```html
<div id="resultText" style="font-size: 2.5em;">等待 Flutter 传数据</div>
<script type="text/javascript">
    // 定义接收数据的函数
    function hiCallJs(msg) {
        document.getElementById("resultText").innerHTML =
            'Flutter 传来的数据：' + msg;
    }

    // 定义带返回值的函数
    function hiCallJsWithResult(v1, v2) {
        return parseInt(v1) + parseInt(v2);
    }
</script>
```

**Flutter 端代码：**

```dart
Widget get _fireData => FilledButton(
  onPressed: () async {
    const String name = '张三';

    // 方式1：调用 JS 函数（无返回值）
    // 注意：字符串参数需要带引号
    await controller.runJavaScript("hiCallJs('$name')");

    // 方式2：调用 JS 函数并获取返回值
    final Object result = await controller.runJavaScriptReturningResult(
      "hiCallJsWithResult('10', '20')",
    );
    debugPrint('计算结果: $result');  // 输出: 30
  },
  child: const Text('发送数据'),
);
```

> **注意**：`runJavaScript` 中调用 JS 函数时，如果参数是字符串类型，**必须用引号包裹**（`'$name'`），否则 JS 会把它当作变量名而报错。

> **提示**：如果需要获取 JS 函数的返回值，使用 `runJavaScriptReturningResult` 而不是 `runJavaScript`。

---

## 三、登录态同步

在混合开发中，一个非常常见的需求是：**用户在 App 中登录后，打开 H5 页面时自动同步登录态**，避免用户重复登录。

webview_flutter 提供了两种方案：

---

### 方式一：通过 Cookie 同步登录态

原理：将 App 的登录 Token 写入 WebView 的 Cookie 中，H5 页面可以通过 `document.cookie` 读取。

```dart
class FlutterH5LoginSyncByCookie extends StatefulWidget {
  const FlutterH5LoginSyncByCookie({super.key});

  @override
  State<FlutterH5LoginSyncByCookie> createState() =>
      _FlutterH5LoginSyncByCookieState();
}

class _FlutterH5LoginSyncByCookieState
    extends State<FlutterH5LoginSyncByCookie> {
  late WebViewController controller;
  // Cookie 管理器
  late final WebViewCookieManager cookieManager = WebViewCookieManager();

  @override
  void initState() {
    super.initState();
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted);
  }

  // 设置 Cookie（同步登录态）
  Future<void> _onSetCookie() async {
    await cookieManager.setCookie(
      const WebViewCookie(
        name: 'token',
        value: 'asdhalsjdlas2123123123',
        domain: 'www.geekailab.com',
      ),
    );

    await cookieManager.setCookie(
      const WebViewCookie(
        name: 'uid',
        value: '883123',
        domain: 'www.geekailab.com',
      ),
    );

    // 验证：读取 H5 中的 Cookie
    await controller
        .runJavaScriptReturningResult('document.cookie')
        .then((Object value) {
      debugPrint('H5 中 cookie: $value');
    });
  }

  // 清除 Cookie（退出登录时调用）
  Future<void> _onClearCookie() async {
    await cookieManager.clearCookies();
    debugPrint('Cookie 清除成功');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cookie 同步登录态'),
        actions: <Widget>[
          FilledButton(onPressed: _onSetCookie, child: const Text('设置Cookie')),
          FilledButton(onPressed: _onClearCookie, child: const Text('清除Cookie')),
        ],
      ),
      body: WebViewWidget(controller: controller),
    );
  }
}
```

> **提示**：Cookie 方式的 `domain` 参数必须与 H5 页面的域名一致，否则 Cookie 不会被发送。

---

### 方式二：通过 Channel 同步登录态

原理：H5 页面通过 Channel 向 Flutter 请求登录信息，Flutter 收到请求后通过 `runJavaScript` 将登录信息传回 H5。

**H5 端代码：**

```html
<button id="btn" style="font-size: 2.5em;">获取登录信息</button>
<div id="resultTxt" style="font-size: 2.5em;">等待获取登录信息</div>

<script type="text/javascript">
    var btn = document.getElementById('btn')
    btn.addEventListener('click', function(){
        // 通过 Channel 向 Flutter 请求登录信息
        getLoginInfo.postMessage('')
    }, false)

    // Flutter 调用此函数传回登录信息
    function hiCallJs(msg) {
        document.getElementById('resultTxt').innerHTML =
            'Flutter 传来的数据：' + msg
    }
</script>
```

**Flutter 端代码：**

```dart
@override
void initState() {
  super.initState();

  controller = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..addJavaScriptChannel(
      'getLoginInfo',
      onMessageReceived: (JavaScriptMessage message) {
        // H5 请求登录信息 → Flutter 组装数据 → 回传给 H5
        final Map<String, Object> info = <String, Object>{
          'name': '张三',
          'age': 25,
          'isLogin': true,
        };
        final String infoString = json.encode(info);
        // 调用 H5 的 hiCallJs 函数，将登录信息传回
        controller.runJavaScript("hiCallJs('$infoString')");
      },
    );
}
```

🚀 Channel 方式更加灵活，H5 随时可以向 Flutter 请求数据，适合需要实时同步用户状态的场景！

---

## 通信方式选型总结

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| JS 传简单参数给 Flutter | URL 拦截 | 简单直接，适合少量参数 |
| JS 传复杂数据给 Flutter | ✅ Channel（推荐） | 无长度限制，API 简洁 |
| Flutter 传数据给 JS | ✅ runJavaScript（推荐） | 随时调用，支持返回值 |
| Flutter 初始化参数传给 H5 | URL 查询参数 | 加载时一次性传递 |
| 登录态同步 | Cookie 或 Channel | Cookie 适合传统方式，Channel 更灵活 |

---

## WebViewController 常用 API 速查

```dart
final controller = WebViewController()
  // 基础配置
  ..setJavaScriptMode(JavaScriptMode.unrestricted)   // 开启 JS
  ..setBackgroundColor(Colors.white)                  // 背景色
  ..setUserAgent('CustomUserAgent/1.0')               // 自定义 UA

  // 页面加载
  ..loadRequest(Uri.parse('https://example.com'))     // 远程 URL
  ..loadHtmlString('<h1>Hello</h1>')                  // HTML 字符串
  ..loadFlutterAsset('assets/web/index.html')         // Assets 文件
  ..loadFile('/path/to/local/file.html')              // 本地文件

  // 导航控制
  ..goBack()                                          // 后退
  ..goForward()                                       // 前进
  ..reload()                                          // 刷新
  ..clearCache()                                      // 清除缓存

  // JS 互操作
  ..runJavaScript("alert('hi')")                      // 执行 JS
  ..runJavaScriptReturningResult("1+1")               // 执行 JS 并获取返回值
  ..addJavaScriptChannel('name', onMessageReceived: ...)  // 注册 Channel

  // 导航代理
  ..setNavigationDelegate(NavigationDelegate(
    onPageStarted: (url) {},                          // 页面开始加载
    onPageFinished: (url) {},                         // 页面加载完成
    onProgress: (progress) {},                        // 加载进度
    onNavigationRequest: (request) {},                // 拦截导航
    onWebResourceError: (error) {},                   // 加载错误
  ));
```

---

## 项目文件结构参考

```
lib/features/h5/
├── presentation/
│   ├── h5_screen.dart                          # 导航入口页
│   └── widgets/
│       ├── base/                               # 基础通信
│       │   ├── js2flutter_by_url.dart          # JS→Flutter（URL方式）
│       │   ├── js2flutter_by_channel.dart      # JS→Flutter（Channel方式）
│       │   ├── flutter2js_by_url.dart          # Flutter→JS（URL方式）
│       │   └── flutter2js_by_RunJavascript.dart # Flutter→JS（runJS方式）
│       ├── jump/                               # 页面加载
│       │   ├── flutter_h5_jump_assets.dart     # 加载 Assets H5
│       │   └── flutter_h5_jump_html_file.dart  # 加载本地文件 H5
│       └── login/                              # 登录态同步
│           ├── flutter_h5_login_sync_by_cookie.dart  # Cookie 方式
│           └── flutter_h5_sync_by_channel.dart       # Channel 方式
```

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~


*📝 作者：NIHoa ｜ 系列：Flutter工具系列 ｜ 更新日期：2025-04-02*
