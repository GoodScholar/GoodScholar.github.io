# 🏢 Node.js 技术选型（三）：NestJS 企业级架构 — 模块 · 依赖注入 · 装饰器

> **系列导读**：大型项目最怕"一锅粥"。NestJS 借鉴 Angular 和 Spring 的设计，
> 通过 **Module / Controller / Service / DI** 四件套，
> 让 Node.js 后端也能拥有 Java 级别的架构规范。

---

## 🏗 1. NestJS 分层架构全景

```
┌──────────────────────────────────────────────────┐
│                   客户端请求                       │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│  Middleware（中间件）                              │
│  → 日志记录、CORS、压缩等                          │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│  Guard（守卫）                                    │
│  → 认证、授权、角色校验                             │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│  Interceptor（拦截器 - 前）                        │
│  → 请求日志、缓存检查、超时控制                      │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│  Pipe（管道）                                     │
│  → 参数验证、类型转换                               │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│  Controller（控制器）                              │
│  → 路由映射、参数提取、调用 Service                  │
│                                                   │
│  Service（服务）                                   │
│  → 核心业务逻辑、数据库操作                          │
│                                                   │
│  Repository / ORM                                 │
│  → 数据访问层                                      │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│  Interceptor（拦截器 - 后）                        │
│  → 响应转换、日志记录                               │
└────────────────────┬─────────────────────────────┘
                     ▼
┌──────────────────────────────────────────────────┐
│  Exception Filter（异常过滤器）                     │
│  → 统一错误格式、错误日志                            │
└────────────────────┬─────────────────────────────┘
                     ▼
                 客户端响应
```

---

## 📦 2. Module：模块化组织代码

### 2.1 模块是什么

模块是 NestJS 的基本组织单元，一个功能域 = 一个模块。

```typescript
// src/user/user.module.ts
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserRepository } from './user.repository'

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService], // 导出给其他模块使用
})
export class UserModule {}
```

### 2.2 推荐目录结构

```
src/
├── app.module.ts               # 根模块
├── main.ts                     # 入口文件
├── common/                     # 公共模块
│   ├── decorators/             # 自定义装饰器
│   ├── filters/                # 异常过滤器
│   ├── guards/                 # 守卫
│   ├── interceptors/           # 拦截器
│   ├── pipes/                  # 管道
│   └── interfaces/             # 公共接口
├── config/                     # 配置模块
│   ├── config.module.ts
│   └── configuration.ts
├── user/                       # 用户模块
│   ├── user.module.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.repository.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── entities/
│       └── user.entity.ts
├── auth/                       # 认证模块
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── guards/
│       └── jwt-auth.guard.ts
└── order/                      # 订单模块
    ├── order.module.ts
    ├── order.controller.ts
    └── order.service.ts
```

### 2.3 模块间依赖

```typescript
// app.module.ts — 根模块聚合所有子模块
import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { OrderModule } from './order/order.module'

@Module({
  imports: [
    ConfigModule.forRoot(),   // 全局配置
    UserModule,
    AuthModule,
    OrderModule,
  ],
})
export class AppModule {}
```

---

## 💉 3. 依赖注入（DI）：核心中的核心

### 3.1 什么是依赖注入

```typescript
// ❌ 没有 DI：硬编码依赖，无法测试、无法替换
class UserController {
  private userService = new UserService(
    new UserRepository(new DatabaseConnection()) // 层层嵌套
  )
}

// ✅ 有 DI：IoC 容器自动注入，松耦合
@Controller('users')
class UserController {
  constructor(
    private readonly userService: UserService // 自动注入
  ) {}
}
```

### 3.2 Provider 的三种注册方式

```typescript
@Module({
  providers: [
    // 方式一：类 Provider（最常用）
    UserService,
    // 等价于：{ provide: UserService, useClass: UserService }

    // 方式二：值 Provider（注入常量）
    {
      provide: 'API_KEY',
      useValue: 'sk-xxxxx',
    },

    // 方式三：工厂 Provider（动态创建）
    {
      provide: 'ASYNC_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get('database')
        return createConnection(dbConfig)
      },
      inject: [ConfigService], // 工厂需要的依赖
    },
  ],
})
export class AppModule {}
```

### 3.3 作用域

```typescript
import { Injectable, Scope } from '@nestjs/common'

// 默认：单例（整个应用只有一个实例）
@Injectable()
export class SingletonService {}

// 请求级：每个请求创建新实例
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}

// 临时的：每次注入都创建新实例（很少用）
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}
```

---

## 🎭 4. 装饰器（Decorator）：语法糖的艺术

### 4.1 内置装饰器一览

| 装饰器 | 用途 | 示例 |
|--------|------|------|
| `@Controller()` | 声明控制器 | `@Controller('users')` |
| `@Get/@Post/@Put/@Delete` | HTTP 方法路由 | `@Get(':id')` |
| `@Body/@Query/@Param` | 提取请求参数 | `@Body() dto: CreateUserDto` |
| `@Injectable()` | 声明可注入的 Provider | `@Injectable()` |
| `@Module()` | 声明模块 | `@Module({...})` |
| `@UseGuards()` | 绑定守卫 | `@UseGuards(JwtAuthGuard)` |
| `@UsePipes()` | 绑定管道 | `@UsePipes(ValidationPipe)` |
| `@UseInterceptors()` | 绑定拦截器 | `@UseInterceptors(CacheInterceptor)` |
| `@UseFilters()` | 绑定异常过滤器 | `@UseFilters(HttpExceptionFilter)` |

### 4.2 自定义装饰器

```typescript
// 自定义角色装饰器
import { SetMetadata } from '@nestjs/common'

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)

// 自定义当前用户装饰器
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    return data ? user?.[data] : user
  }
)

// 使用
@Controller('profile')
export class ProfileController {
  @Get()
  @Roles('admin', 'user')
  getProfile(@CurrentUser() user: User) {
    return user
  }

  @Get('name')
  getName(@CurrentUser('name') name: string) {
    return { name }
  }
}
```

---

## 🛡 5. Guard / Pipe / Interceptor / Filter 实战

### 5.1 Guard（守卫）— 认证授权

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.some((role) => user.roles?.includes(role))
  }
}
```

### 5.2 Pipe（管道）— 参数验证

```typescript
// DTO + class-validator 自动验证
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: '用户名至少 2 个字符' })
  name: string

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string

  @IsString()
  @MinLength(8, { message: '密码至少 8 位' })
  password: string

  @IsOptional()
  @IsString()
  avatar?: string
}

// main.ts 全局启用验证管道
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,      // 自动剔除 DTO 中未定义的属性
  transform: true,      // 自动类型转换
  forbidNonWhitelisted: true,  // 额外属性直接报错
}))
```

### 5.3 Interceptor（拦截器）— 统一响应格式

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
  code: number
  message: string
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: 'success',
        data,
      }))
    )
  }
}
```

### 5.4 Exception Filter（异常过滤器）— 统一错误处理

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR

    const message = exception instanceof HttpException
      ? exception.message
      : '服务器内部错误'

    response.status(status).json({
      code: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
```

---

## ⚙️ 6. 配置管理

```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'mydb',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES || '7d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
})

// app.module.ts
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,               // 全局可用
      load: [configuration],        // 加载配置
      envFilePath: ['.env.local', '.env'],
    }),
  ],
})
export class AppModule {}

// 使用配置
@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getDbHost(): string {
    return this.configService.get<string>('database.host')
  }
}
```

---

## ✅ 本篇重点 Checklist

- [ ] 理解 NestJS 请求生命周期（Middleware → Guard → Interceptor → Pipe → Controller → Interceptor → Filter）
- [ ] 掌握 Module 模块化组织方式
- [ ] 理解 DI 依赖注入的三种 Provider 注册方式
- [ ] 会用装饰器声明路由、提取参数、设置元数据
- [ ] 掌握 Guard / Pipe / Interceptor / Filter 四大工具的使用
- [ ] 了解 ConfigModule 配置管理最佳实践

---

> NestJS 的强约束就像"限速标志"—— 看起来限制了你，实际上保护了整个项目。
> 下一篇我们聊 **数据库选型与 ORM**，看看 Prisma / TypeORM / Mongoose 怎么选。

---
*📝 作者：NIHoa ｜ 系列：Node.js技术选型与架构系列 ｜ 更新日期：2025-02-03*
