---
date: 2025-03-01
---
# 🎯 Flutter 从零到一（一）：Dart 语言基础 — Flutter 的敲门砖

> **系列导读**：这是「Flutter 从零到一」系列的第 1 篇。即使你从未写过一行 Dart 代码，
> 读完本文也能掌握 Flutter 开发所需的全部语言基础。

**本文目标**：掌握 Dart 的变量、类型、函数、面向对象、集合、异步编程六大核心模块，
每个知识点都附带可运行的代码示例。

---

## 📊 Dart 语言速览

| 维度 | 说明 |
|------|------|
| 🏢 出品方 | Google（2011 年发布） |
| 🎯 定位 | 客户端优化语言，Flutter 唯一开发语言 |
| 📝 类型系统 | 强类型 + 类型推断 + 空安全 |
| 🔄 编译方式 | JIT（开发热重载）+ AOT（发布高性能） |
| 🌐 运行平台 | 移动端 / Web / 桌面 / 服务端 |
| 📦 包管理器 | pub.dev |

---

## 🔤 1. 变量与类型

### 变量声明

```dart
void main() {
  // var — 类型自动推断
  var name = '张三';           // 推断为 String
  var age = 25;                // 推断为 int
  var isStudent = true;        // 推断为 bool

  // 显式类型声明
  String city = '深圳';
  int score = 100;
  double price = 99.9;
  bool isActive = true;

  // final — 运行时常量（只能赋值一次）
  final DateTime now = DateTime.now();  // 运行时确定
  final username = 'flutter_dev';       // 一旦赋值不可修改

  // const — 编译时常量（必须是编译期可确定的值）
  const double pi = 3.14159;
  const String appName = 'My Flutter App';

  print('$name, $age 岁, 来自 $city');
  // 输出：张三, 25 岁, 来自 深圳
}
```

### var vs final vs const

| 关键字 | 可否重新赋值 | 何时确定值 | 使用场景 |
|--------|------------|-----------|---------|
| `var` | ✅ 可以 | 运行时 | 会变化的变量 |
| `final` | ❌ 不可以 | 运行时 | 运行时确定的不变值 |
| `const` | ❌ 不可以 | 编译时 | 编译期就确定的常量 |

```dart
void main() {
  var count = 0;
  count = 10;       // ✅ var 可以重新赋值

  final time = DateTime.now();
  // time = DateTime.now();  // ❌ 错误！final 不能重新赋值

  const pi = 3.14;
  // const now = DateTime.now();  // ❌ 错误！DateTime.now() 不是编译时常量
}
```

### 基本数据类型

```dart
void main() {
  // 数字类型
  int count = 42;
  double price = 29.99;
  num anything = 100;    // num 是 int 和 double 的父类
  anything = 3.14;       // 可以赋值 double

  // 字符串
  String greeting = 'Hello, Flutter!';
  String multiLine = '''
    这是一个
    多行字符串
  ''';

  // 字符串插值
  String name = '小明';
  String message = '你好, $name！你今年 ${age + 1} 岁了。';

  // 布尔
  bool isReady = true;
  bool isEmpty = false;

  // 类型转换
  String numStr = '42';
  int parsed = int.parse(numStr);       // 字符串 → 整数
  double parsed2 = double.parse('3.14'); // 字符串 → 浮点数
  String back = 42.toString();          // 数字 → 字符串
  String fixed = 3.14159.toStringAsFixed(2);  // '3.14'

  print('价格: ¥${price.toStringAsFixed(2)}');  // 价格: ¥29.99
}
```

### 空安全（Null Safety）

```dart
void main() {
  // 默认情况下变量不能为 null
  String name = '张三';  // 不能赋值为 null
  // name = null;        // ❌ 编译错误

  // 用 ? 声明可空类型
  String? nickname;      // 默认值为 null
  nickname = '小张';
  nickname = null;       // ✅ 可空类型可以赋值 null

  // 空值判断
  print(nickname?.length);    // 安全访问：如果 null 返回 null
  print(nickname ?? '无昵称');  // 空值替代：如果 null 使用默认值
  
  // 非空断言（确定不为 null 时使用）
  String? input = getUserInput();
  if (input != null) {
    print(input.length);  // 编译器知道这里不为 null
  }

  // ! 强制非空（谨慎使用，可能抛出异常）
  // print(nickname!.length);  // 如果 nickname 为 null 会崩溃
}
```

---

## 🔧 2. 函数

### 基本函数

```dart
// 有返回值的函数
int add(int a, int b) {
  return a + b;
}

// 无返回值
void greet(String name) {
  print('Hello, $name!');
}

// 箭头函数（一行表达式）
int multiply(int a, int b) => a * b;
void sayHi() => print('Hi!');

void main() {
  print(add(3, 5));       // 8
  greet('Flutter');        // Hello, Flutter!
  print(multiply(4, 6));  // 24
}
```

### 参数类型

```dart
// ① 必需参数
int add(int a, int b) => a + b;

// ② 可选命名参数（用 {} 包裹）— Flutter 中最常用！
void createUser({
  required String name,   // required 标记为必填
  int age = 0,            // 默认值
  String? email,          // 可选
}) {
  print('姓名: $name, 年龄: $age, 邮箱: ${email ?? "未填写"}');
}

// ③ 可选位置参数（用 [] 包裹）
String greet(String name, [String? title]) {
  if (title != null) {
    return '$title $name, 您好！';
  }
  return '$name, 您好！';
}

void main() {
  createUser(name: '张三');                    // 姓名: 张三, 年龄: 0
  createUser(name: '李四', age: 25, email: 'li@test.com');
  
  print(greet('王五'));             // 王五, 您好！
  print(greet('王五', '教授'));      // 教授 王五, 您好！
}
```

### 高阶函数与闭包

```dart
void main() {
  // 函数作为参数
  List<int> numbers = [1, 2, 3, 4, 5];

  // map — 转换每个元素
  var doubled = numbers.map((n) => n * 2).toList();
  print(doubled);  // [2, 4, 6, 8, 10]

  // where — 过滤
  var evens = numbers.where((n) => n % 2 == 0).toList();
  print(evens);  // [2, 4]

  // reduce — 聚合
  var sum = numbers.reduce((a, b) => a + b);
  print(sum);  // 15

  // forEach — 遍历
  numbers.forEach((n) => print('数字: $n'));

  // 闭包
  Function makeCounter() {
    int count = 0;
    return () {
      count++;
      return count;
    };
  }

  var counter = makeCounter();
  print(counter());  // 1
  print(counter());  // 2
  print(counter());  // 3
}
```

---

## 🏛 3. 面向对象

### 类的基本定义

```dart
class Person {
  // 属性
  String name;
  int age;
  String? email;  // 可选属性

  // 构造函数 — Dart 的简写方式
  Person({required this.name, required this.age, this.email});

  // 命名构造函数
  Person.guest() : name = '游客', age = 0;

  Person.fromJson(Map<String, dynamic> json)
      : name = json['name'] as String,
        age = json['age'] as int,
        email = json['email'] as String?;

  // 方法
  String introduce() {
    return '我是 $name，今年 $age 岁';
  }

  // Getter
  bool get isAdult => age >= 18;

  // toString
  @override
  String toString() => 'Person(name: $name, age: $age)';
}

void main() {
  var person = Person(name: '张三', age: 25);
  print(person.introduce());  // 我是 张三，今年 25 岁
  print(person.isAdult);      // true

  var guest = Person.guest();
  print(guest);  // Person(name: 游客, age: 0)

  var fromData = Person.fromJson({'name': '李四', 'age': 30, 'email': null});
  print(fromData.introduce());  // 我是 李四，今年 30 岁
}
```

### 继承

```dart
// 基类
class Animal {
  String name;
  Animal(this.name);

  void speak() {
    print('$name 发出声音');
  }
}

// 子类
class Dog extends Animal {
  String breed;

  Dog({required String name, required this.breed}) : super(name);

  @override
  void speak() {
    print('$name ($breed): 汪汪汪！');
  }

  void fetch() {
    print('$name 去捡球了');
  }
}

class Cat extends Animal {
  Cat(String name) : super(name);

  @override
  void speak() {
    print('$name: 喵～');
  }
}

void main() {
  var dog = Dog(name: '旺财', breed: '金毛');
  dog.speak();   // 旺财 (金毛): 汪汪汪！
  dog.fetch();   // 旺财 去捡球了

  var cat = Cat('咪咪');
  cat.speak();   // 咪咪: 喵～

  // 多态
  List<Animal> animals = [dog, cat];
  for (var animal in animals) {
    animal.speak();  // 各自调用自己的 speak
  }
}
```

### 抽象类与接口

```dart
// 抽象类 — 定义契约
abstract class Shape {
  double get area;         // 抽象 getter
  double get perimeter;    // 抽象 getter
  String describe();       // 抽象方法
}

// 实现抽象类
class Circle extends Shape {
  final double radius;
  Circle(this.radius);

  @override
  double get area => 3.14159 * radius * radius;

  @override
  double get perimeter => 2 * 3.14159 * radius;

  @override
  String describe() => '圆形: 半径=$radius, 面积=${area.toStringAsFixed(2)}';
}

class Rectangle extends Shape {
  final double width;
  final double height;
  Rectangle(this.width, this.height);

  @override
  double get area => width * height;

  @override
  double get perimeter => 2 * (width + height);

  @override
  String describe() => '矩形: ${width}x$height, 面积=$area';
}

void main() {
  List<Shape> shapes = [Circle(5), Rectangle(4, 6)];
  for (var shape in shapes) {
    print(shape.describe());
  }
  // 圆形: 半径=5.0, 面积=78.54
  // 矩形: 4.0x6.0, 面积=24.0
}
```

### Mixin（混入）

```dart
// Mixin — 复用代码而不用继承
mixin Loggable {
  void log(String message) {
    print('[${DateTime.now()}] $message');
  }
}

mixin Validatable {
  bool validate(String value) {
    return value.isNotEmpty;
  }
}

// 一个类可以混入多个 Mixin
class UserService with Loggable, Validatable {
  void createUser(String name) {
    if (!validate(name)) {
      log('错误：用户名不能为空');
      return;
    }
    log('创建用户: $name');
  }
}

void main() {
  var service = UserService();
  service.createUser('');      // [时间] 错误：用户名不能为空
  service.createUser('张三');  // [时间] 创建用户: 张三
}
```

---

## 📦 4. 集合

### List（列表）

```dart
void main() {
  // 创建列表
  var fruits = ['苹果', '香蕉', '橙子'];
  List<int> numbers = [1, 2, 3, 4, 5];
  var empty = <String>[];  // 空列表

  // 添加元素
  fruits.add('葡萄');
  fruits.addAll(['西瓜', '草莓']);
  fruits.insert(0, '芒果');  // 在索引 0 插入

  // 访问元素
  print(fruits[0]);         // 芒果
  print(fruits.first);      // 芒果
  print(fruits.last);       // 草莓
  print(fruits.length);     // 7

  // 删除元素
  fruits.remove('香蕉');
  fruits.removeAt(0);
  fruits.removeLast();

  // 查找
  print(fruits.contains('苹果'));  // true
  print(fruits.indexOf('橙子'));   // 索引位置

  // 遍历与转换
  var prices = [10, 20, 30, 40];
  var discounted = prices.map((p) => p * 0.8).toList();
  var expensive = prices.where((p) => p > 20).toList();
  var total = prices.reduce((a, b) => a + b);

  print(discounted);  // [8.0, 16.0, 24.0, 32.0]
  print(expensive);   // [30, 40]
  print(total);       // 100

  // 展开运算符
  var list1 = [1, 2, 3];
  var list2 = [0, ...list1, 4, 5];
  print(list2);  // [0, 1, 2, 3, 4, 5]

  // 集合 if / for
  var nav = [
    '首页',
    '分类',
    if (isLoggedIn) '我的',
    for (var page in extraPages) page,
  ];
}
```

### Map（映射）

```dart
void main() {
  // 创建 Map
  var user = {
    'name': '张三',
    'age': 25,
    'city': '深圳',
  };

  Map<String, int> scores = {
    '语文': 90,
    '数学': 95,
    '英语': 88,
  };

  // 访问
  print(user['name']);       // 张三
  print(scores['数学']);     // 95

  // 添加 / 修改
  user['email'] = 'zhangsan@example.com';
  scores['物理'] = 92;

  // 删除
  user.remove('city');

  // 遍历
  scores.forEach((subject, score) {
    print('$subject: $score 分');
  });

  // 转换
  var entries = scores.entries.toList();
  var keys = scores.keys.toList();
  var values = scores.values.toList();

  // 检查
  print(scores.containsKey('数学'));  // true
  print(scores.isEmpty);             // false
}
```

### Set（集合）

```dart
void main() {
  // Set — 不重复的集合
  var tags = {'Flutter', 'Dart', 'Mobile'};
  tags.add('Flutter');  // 不会重复添加
  print(tags);  // {Flutter, Dart, Mobile}

  // 去重
  var list = [1, 2, 2, 3, 3, 3];
  var unique = list.toSet().toList();
  print(unique);  // [1, 2, 3]

  // 集合运算
  var a = {1, 2, 3, 4};
  var b = {3, 4, 5, 6};
  print(a.intersection(b));  // {3, 4}（交集）
  print(a.union(b));         // {1, 2, 3, 4, 5, 6}（并集）
  print(a.difference(b));    // {1, 2}（差集）
}
```

---

## ⏳ 5. 异步编程

### Future（单次异步）

```dart
// 模拟网络请求
Future<String> fetchUserName() async {
  // 模拟 2 秒延迟
  await Future.delayed(const Duration(seconds: 2));
  return '张三';
}

Future<int> fetchUserAge() async {
  await Future.delayed(const Duration(seconds: 1));
  return 25;
}

void main() async {
  print('开始获取数据...');

  // 顺序执行
  var name = await fetchUserName();
  var age = await fetchUserAge();
  print('$name, $age 岁');  // 总共 3 秒

  // 并行执行（节省时间！）
  var results = await Future.wait([
    fetchUserName(),
    fetchUserAge(),
  ]);
  print('${results[0]}, ${results[1]} 岁');  // 只需 2 秒
}
```

### 错误处理

```dart
Future<String> fetchData() async {
  await Future.delayed(const Duration(seconds: 1));
  throw Exception('网络连接失败');
}

void main() async {
  // try-catch 处理异步错误
  try {
    var data = await fetchData();
    print(data);
  } on FormatException catch (e) {
    print('格式错误: $e');
  } on Exception catch (e) {
    print('请求异常: $e');
  } catch (e) {
    print('未知错误: $e');
  } finally {
    print('请求结束');
  }

  // 使用 .then / .catchError（链式写法）
  fetchData()
      .then((data) => print(data))
      .catchError((e) => print('错误: $e'));
}
```

### Stream（持续数据流）

```dart
// 创建 Stream
Stream<int> countDown(int from) async* {
  for (var i = from; i >= 0; i--) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;  // 逐个发送数据
  }
}

void main() async {
  // 监听 Stream
  print('倒计时开始：');
  await for (var value in countDown(5)) {
    print(value);  // 5, 4, 3, 2, 1, 0（每秒输出一个）
  }
  print('倒计时结束！');

  // Stream 转换
  var numbers = Stream.fromIterable([1, 2, 3, 4, 5]);
  var evens = numbers.where((n) => n % 2 == 0);
  await evens.forEach((n) => print('偶数: $n'));  // 偶数: 2, 偶数: 4
}
```

---

## 🧩 6. Dart 独有特性

### 枚举增强

```dart
enum Status {
  idle('空闲', '⚪'),
  loading('加载中', '🔵'),
  success('成功', '🟢'),
  error('失败', '🔴');

  final String label;
  final String icon;
  const Status(this.label, this.icon);

  @override
  String toString() => '$icon $label';
}

void main() {
  var status = Status.loading;
  print(status);         // 🔵 加载中
  print(status.label);   // 加载中

  // switch 表达式
  var message = switch (status) {
    Status.idle => '等待操作',
    Status.loading => '请稍候...',
    Status.success => '操作完成！',
    Status.error => '出错了！',
  };
  print(message);
}
```

### 扩展方法

```dart
// 给 String 类型添加新方法
extension StringExtension on String {
  // 首字母大写
  String get capitalize =>
      isEmpty ? '' : '${this[0].toUpperCase()}${substring(1)}';

  // 是否是有效邮箱
  bool get isValidEmail =>
      RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(this);

  // 脱敏处理
  String get masked {
    if (length <= 3) return '***';
    return '${substring(0, 1)}${'*' * (length - 2)}${substring(length - 1)}';
  }
}

// 给 int 添加方法
extension IntExtension on int {
  // 格式化为货币
  String get currency => '¥${toStringAsFixed(2)}';

  // 是否是偶数（比 isEven 更语义化的用法）
  Duration get seconds => Duration(seconds: this);
  Duration get milliseconds => Duration(milliseconds: this);
}

void main() {
  print('hello'.capitalize);           // Hello
  print('test@email.com'.isValidEmail); // true
  print('张三丰'.masked);              // 张*丰

  // 使用扩展的 Duration
  await Future.delayed(2.seconds);
}
```

### 模式匹配（Dart 3）

```dart
// sealed class + 模式匹配
sealed class Result<T> {}
class Success<T> extends Result<T> {
  final T data;
  Success(this.data);
}
class Failure<T> extends Result<T> {
  final String message;
  Failure(this.message);
}
class Loading<T> extends Result<T> {}

void handleResult(Result<String> result) {
  // switch 表达式 — 编译器确保覆盖所有情况
  var output = switch (result) {
    Success(data: var d) => '数据: $d',
    Failure(message: var m) => '错误: $m',
    Loading() => '加载中...',
  };
  print(output);
}

// 解构赋值
void main() {
  var (name, age) = ('张三', 25);
  print('$name, $age');

  var {'x': x, 'y': y} = {'x': 10, 'y': 20};
  print('坐标: ($x, $y)');

  // if-case 模式匹配
  var json = {'name': '张三', 'age': 25};
  if (json case {'name': String name, 'age': int age}) {
    print('$name, $age 岁');
  }
}
```

---

## ✅ 本篇小结 Checklist

- [ ] 理解 `var` / `final` / `const` 的区别
- [ ] 掌握 Dart 基本类型和字符串插值
- [ ] 理解空安全（`?` / `??` / `!`）
- [ ] 会写函数（命名参数 / 箭头函数）
- [ ] 理解类的定义、继承、Mixin
- [ ] 掌握 List / Map / Set 常用操作
- [ ] 理解 `async` / `await` / `Future`
- [ ] 了解 Dart 3 的模式匹配和 sealed class

---

> **下一篇预告**：《Flutter 初体验：第一个 App 的诞生》—— 搭建开发环境，
> 创建并运行你的第一个 Flutter 应用，理解 Widget 的核心概念。

---

*本文是「Flutter 从零到一」系列第 1 篇，共 13 篇。[查看完整目录](#)*


---
*📝 作者：NIHoa ｜ 系列：Flutter从零到一系列 ｜ 更新日期：2025-03-01*
