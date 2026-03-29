---
date: 2025-04-04
tags:
  - Flutter
  - 图片选择
  - 图片裁剪
  - 相机
  - 相册
---
# Flutter | 第4期 - image_picker + image_cropper：图片选择与裁剪

本期为大家分享如何在 Flutter 中去做图片选择和裁剪功能，用 image_picker 从相册/相机获取图片，再用 image_cropper 进行裁剪编辑，感兴趣的话和我一起来探索一下呗~

---

### 首先，什么是图片选择与裁剪？

在 App 开发中，图片选择和裁剪是最常见的用户交互场景之一 —— 上传头像、发布动态、身份认证等都离不开它。

▪️ **图片选择（Picker）**：从相册选择已有照片，或调用相机拍摄新照片
▪️ **图片裁剪（Cropper）**：对选中的图片进行裁剪、旋转、缩放等编辑
▪️ **压缩控制**：裁剪后可控制输出质量，减小文件体积
▪️ **比例锁定**：支持自由裁剪或锁定特定比例（如 1:1 头像、16:9 封面）
▪️ **双端适配**：Android 和 iOS 的原生相册/相机权限和 UI 各有差异

---

## 插件选型

### 图片选择

| 插件 | 核心特点 | 对比 |
|------|---------|------|
| image_picker（官方） | Flutter 团队维护，API 简洁 | ✅ 官方维护、稳定可靠 |
| file_picker | 支持选择任意文件类型 | ⚠️ 更通用但图片功能不如专用插件 |
| wechat_assets_picker | 仿微信的多图选择器 | ⚠️ 功能强大但体积较大 |

### 图片裁剪

| 插件 | 核心特点 | 对比 |
|------|---------|------|
| image_cropper | 调用原生裁剪界面 | ✅ 原生体验、性能好、支持旋转 |
| crop_your_image | 纯 Flutter 实现的裁剪 | ⚠️ 自定义度高但性能略逊 |
| extended_image | 图片查看+编辑一体 | ⚠️ 功能丰富但 API 较复杂 |

**本期选择 image_picker + image_cropper 组合进行演示。** 一个负责选图，一个负责裁剪，职责单一、配合完美。

---

## 基础集成

### 添加依赖

1️⃣ 在 `pubspec.yaml` 中添加依赖：

```yaml
dependencies:
  image_picker: ^1.2.0
  image_cropper: ^11.0.0
```

2️⃣ 运行安装命令：

```bash
flutter pub get
```

3️⃣ 导入包：

```dart
import 'package:image_picker/image_picker.dart';
import 'package:image_cropper/image_cropper.dart';
```

---

### 平台配置

#### Android 配置

4️⃣ 在 `android/app/src/main/AndroidManifest.xml` 中添加权限：

```xml
<!-- 相机权限 -->
<uses-permission android:name="android.permission.CAMERA"/>
<!-- 读取存储权限（Android 12 及以下） -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<!-- 读取媒体图片权限（Android 13+） -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
```

5️⃣ 在 `android/app/src/main/AndroidManifest.xml` 的 `<application>` 标签内添加 `UCropActivity`（image_cropper 必需）：

```xml
<activity
    android:name="com.yalantis.ucrop.UCropActivity"
    android:screenOrientation="portrait"
    android:theme="@style/Theme.AppCompat.Light.NoActionBar"/>
```

#### iOS 配置

6️⃣ 在 `ios/Runner/Info.plist` 中添加权限描述：

```xml
<!-- 相机权限 -->
<key>NSCameraUsageDescription</key>
<string>需要使用相机来拍摄照片</string>

<!-- 相册权限 -->
<key>NSPhotoLibraryUsageDescription</key>
<string>需要访问相册来选择图片</string>
```

> **注意**：iOS 的权限描述文案会直接展示给用户，建议写清楚使用目的，否则审核可能被拒。

---

## 核心代码

下面是我在实际项目中的完整实现，包含图片选择、裁剪和展示的完整流程：

### 完整页面代码

```dart
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';

class UploadCropImage extends StatefulWidget {
  const UploadCropImage({super.key});

  @override
  State<UploadCropImage> createState() => _UploadCropImageState();
}

class _UploadCropImageState extends State<UploadCropImage> {
  File? file;

  /// 选择并裁剪图片
  Future<dynamic> uploadImage(ImageSource source) async {
    // 1️⃣ 使用 ImagePicker 选择图片
    final XFile? image = await ImagePicker().pickImage(
      source: source,
    );
    if (image == null) return; // 用户取消选择

    final File imageFile = File(image.path);

    // 2️⃣ 使用 ImageCropper 裁剪图片
    final File? croppedFile = await cropImage(imageFile);

    // 3️⃣ 更新 UI
    setState(() {
      file = croppedFile;
    });
  }

  /// 裁剪图片
  Future<File?> cropImage(File pickedFile) async {
    final CroppedFile? croppedFile = await ImageCropper().cropImage(
      sourcePath: pickedFile.path,
      compressQuality: 100, // 压缩质量（0-100）
      uiSettings: <PlatformUiSettings>[
        // Android 裁剪界面配置
        AndroidUiSettings(
          toolbarTitle: 'Cropper',
          initAspectRatio: CropAspectRatioPreset.original,
          lockAspectRatio: false, // 不锁定比例，自由裁剪
        ),
        // iOS 裁剪界面配置
        IOSUiSettings(
          title: 'Cropper',
        ),
      ],
    );

    if (croppedFile != null) {
      return File(croppedFile.path);
    } else {
      // 用户取消裁剪，返回原图
      return File(pickedFile.path);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('图片上传裁剪')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // 图片预览区域
            imageContainer(file: file),
            const SizedBox(height: 20),
            // 从相册选择
            SizedBox(
              width: 180,
              child: FilledButton(
                onPressed: () {
                  uploadImage(ImageSource.gallery);
                },
                child: const Text('Pick from Gallery'),
              ),
            ),
            const SizedBox(height: 10),
            // 从相机拍摄
            SizedBox(
              width: 180,
              child: FilledButton(
                onPressed: () {
                  uploadImage(ImageSource.camera);
                },
                child: const Text('Pick from Camera'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

### 图片预览容器

```dart
Widget imageContainer({required File? file}) {
  return Container(
    padding: const EdgeInsets.all(5),
    decoration: BoxDecoration(
      border: Border.all(color: Colors.grey),
      borderRadius: BorderRadius.circular(10),
    ),
    height: 250,
    width: 250,
    child: file != null
        ? ClipRRect(
            borderRadius: BorderRadius.circular(5),
            child: Image.file(
              File(file.path),
              height: 200,
              fit: BoxFit.cover,
            ),
          )
        : const Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Icon(Icons.image, size: 40, color: Colors.grey),
              Text(
                'Your image will be uploaded here.',
                style: TextStyle(color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            ],
          ),
  );
}
```

🚀 整个流程非常流畅：点击按钮 → 选择/拍摄图片 → 进入裁剪界面 → 裁剪完成 → 预览展示！

---

## 流程分解

整个图片选择裁剪的流程如下：

```
用户点击按钮
    ↓
ImagePicker.pickImage()
    ├── source: ImageSource.gallery → 打开系统相册
    └── source: ImageSource.camera  → 打开系统相机
    ↓
用户选择/拍摄图片 → 返回 XFile
    ↓
ImageCropper().cropImage()
    ├── 进入原生裁剪界面
    ├── 用户裁剪、旋转、缩放
    └── 确认裁剪 → 返回 CroppedFile
    ↓
setState() → 更新 UI 展示裁剪后的图片
```

---

## ImagePicker 常用 API

```dart
final ImagePicker picker = ImagePicker();

// 选择单张图片
final XFile? image = await picker.pickImage(
  source: ImageSource.gallery,    // gallery 相册 / camera 相机
  maxWidth: 1080,                 // 最大宽度（像素）
  maxHeight: 1080,                // 最大高度（像素）
  imageQuality: 85,               // 压缩质量（0-100）
  preferredCameraDevice: CameraDevice.rear,  // 前/后摄像头
);

// 选择多张图片
final List<XFile> images = await picker.pickMultiImage(
  maxWidth: 1080,
  imageQuality: 85,
);

// 选择视频
final XFile? video = await picker.pickVideo(
  source: ImageSource.camera,
  maxDuration: const Duration(seconds: 30),  // 最大录制时长
);
```

---

## ImageCropper 常用配置

### Android 裁剪界面配置

```dart
AndroidUiSettings(
  toolbarTitle: '裁剪图片',          // 标题栏文字
  toolbarColor: Colors.blue,        // 标题栏颜色
  toolbarWidgetColor: Colors.white, // 标题栏控件颜色
  activeControlsWidgetColor: Colors.blue, // 选中控件颜色
  initAspectRatio: CropAspectRatioPreset.square, // 初始比例
  lockAspectRatio: true,            // 锁定比例
  hideBottomControls: false,        // 隐藏底部控件
  cropGridColor: Colors.white,      // 裁剪网格颜色
  cropFrameColor: Colors.white,     // 裁剪框颜色
)
```

### iOS 裁剪界面配置

```dart
IOSUiSettings(
  title: '裁剪图片',
  cancelButtonTitle: '取消',
  doneButtonTitle: '完成',
  aspectRatioLockEnabled: true,     // 锁定比例
  resetAspectRatioEnabled: false,   // 禁用重置比例
  aspectRatioPickerButtonHidden: true, // 隐藏比例选择器
  rotateButtonsHidden: false,       // 隐藏旋转按钮
  rotateClockwiseButtonHidden: true,// 隐藏顺时针旋转按钮
  minimumAspectRatio: 1.0,          // 最小纵横比
)
```

### 裁剪比例预设

```dart
// 内置的比例预设
CropAspectRatioPreset.original   // 原始比例
CropAspectRatioPreset.square     // 1:1 正方形（适合头像）
CropAspectRatioPreset.ratio3x2   // 3:2
CropAspectRatioPreset.ratio4x3   // 4:3
CropAspectRatioPreset.ratio5x3   // 5:3
CropAspectRatioPreset.ratio5x4   // 5:4
CropAspectRatioPreset.ratio7x5   // 7:5
CropAspectRatioPreset.ratio16x9  // 16:9（适合封面）

// 限制可选的比例列表
ImageCropper().cropImage(
  sourcePath: file.path,
  aspectRatioPresets: [
    CropAspectRatioPreset.square,
    CropAspectRatioPreset.ratio16x9,
  ],
);
```

---

## 进阶：常见应用场景

### 场景一：头像上传（1:1 正方形裁剪）

```dart
Future<File?> cropAvatar(File pickedFile) async {
  final CroppedFile? croppedFile = await ImageCropper().cropImage(
    sourcePath: pickedFile.path,
    compressQuality: 80,
    // 限制为正方形裁剪
    aspectRatioPresets: [CropAspectRatioPreset.square],
    uiSettings: <PlatformUiSettings>[
      AndroidUiSettings(
        toolbarTitle: '裁剪头像',
        toolbarColor: Colors.blue,
        toolbarWidgetColor: Colors.white,
        initAspectRatio: CropAspectRatioPreset.square,
        lockAspectRatio: true, // 锁定 1:1 比例
      ),
      IOSUiSettings(
        title: '裁剪头像',
        aspectRatioLockEnabled: true,
        resetAspectRatioEnabled: false,
      ),
    ],
  );
  return croppedFile != null ? File(croppedFile.path) : null;
}
```

### 场景二：封面图裁剪（16:9 比例）

```dart
Future<File?> cropCover(File pickedFile) async {
  final CroppedFile? croppedFile = await ImageCropper().cropImage(
    sourcePath: pickedFile.path,
    compressQuality: 90,
    aspectRatioPresets: [CropAspectRatioPreset.ratio16x9],
    uiSettings: <PlatformUiSettings>[
      AndroidUiSettings(
        toolbarTitle: '裁剪封面',
        initAspectRatio: CropAspectRatioPreset.ratio16x9,
        lockAspectRatio: true,
      ),
      IOSUiSettings(
        title: '裁剪封面',
        aspectRatioLockEnabled: true,
      ),
    ],
  );
  return croppedFile != null ? File(croppedFile.path) : null;
}
```

### 场景三：多图选择（仅选择不裁剪）

```dart
Future<List<File>> pickMultipleImages() async {
  final List<XFile> images = await ImagePicker().pickMultiImage(
    maxWidth: 1080,
    imageQuality: 85,
  );

  return images.map((XFile xFile) => File(xFile.path)).toList();
}
```

---

## 封装建议

在实际项目中，建议将图片选择和裁剪封装为工具类，统一管理：

```dart
class ImageUtil {
  static final ImagePicker _picker = ImagePicker();

  /// 选择并裁剪图片（通用方法）
  static Future<File?> pickAndCrop({
    required ImageSource source,
    CropAspectRatioPreset aspectRatio = CropAspectRatioPreset.original,
    bool lockRatio = false,
    int quality = 90,
  }) async {
    // 选择图片
    final XFile? image = await _picker.pickImage(source: source);
    if (image == null) return null;

    // 裁剪图片
    final CroppedFile? cropped = await ImageCropper().cropImage(
      sourcePath: image.path,
      compressQuality: quality,
      aspectRatioPresets: [aspectRatio],
      uiSettings: <PlatformUiSettings>[
        AndroidUiSettings(
          toolbarTitle: '裁剪图片',
          initAspectRatio: aspectRatio,
          lockAspectRatio: lockRatio,
        ),
        IOSUiSettings(
          title: '裁剪图片',
          aspectRatioLockEnabled: lockRatio,
        ),
      ],
    );

    return cropped != null ? File(cropped.path) : null;
  }

  /// 选择头像（1:1 锁定）
  static Future<File?> pickAvatar({ImageSource source = ImageSource.gallery}) {
    return pickAndCrop(
      source: source,
      aspectRatio: CropAspectRatioPreset.square,
      lockRatio: true,
      quality: 80,
    );
  }

  /// 选择封面（16:9 锁定）
  static Future<File?> pickCover({ImageSource source = ImageSource.gallery}) {
    return pickAndCrop(
      source: source,
      aspectRatio: CropAspectRatioPreset.ratio16x9,
      lockRatio: true,
      quality: 90,
    );
  }
}
```

使用时一行代码搞定：

```dart
// 选择头像
final File? avatar = await ImageUtil.pickAvatar();

// 从相机拍摄封面
final File? cover = await ImageUtil.pickCover(source: ImageSource.camera);

// 自由裁剪
final File? image = await ImageUtil.pickAndCrop(
  source: ImageSource.gallery,
);
```

---

## 常见问题与踩坑

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| iOS 闪退无权限弹窗 | 缺少 `Info.plist` 权限描述 | 添加 `NSCameraUsageDescription` 等 |
| Android 裁剪界面崩溃 | 缺少 `UCropActivity` 注册 | 在 `AndroidManifest.xml` 中注册 |
| 选图后返回 null | 用户取消了选择 | 做 `null` 判断，不要强制解包 |
| 裁剪后图片过大 | `compressQuality` 设为 100 | 根据场景设置合理的压缩质量（80-90） |
| Android 13+ 无法选图 | 权限变更 | 使用 `READ_MEDIA_IMAGES` 替代 `READ_EXTERNAL_STORAGE` |
| 多图选择无裁剪 | `pickMultiImage` 不支持裁剪 | 选择后逐一调用 `cropImage` 或仅支持单图裁剪 |

---

好了，本期的内容到这里就结束了，如果你觉得对你有帮助的话，欢迎点赞、在看、转发，我们下期见！Bye~


*📝 作者：NIHoa ｜ 系列：Flutter工具系列 ｜ 更新日期：2025-04-04*
