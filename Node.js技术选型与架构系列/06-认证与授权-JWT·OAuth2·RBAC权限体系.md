---
date: 2025-02-06
---
# 🔐 Node.js 技术选型（六）：认证与授权 — JWT · OAuth2 · RBAC 权限体系

> **系列导读**：安全是后端的底线。
> 本篇从 **Session vs JWT** 的认证方案对比出发，深入 **OAuth2 流程、RBAC 权限设计**，
> 搭建一个完整的企业级认证授权体系。

---

## 🔑 1. 认证 vs 授权

```
认证（Authentication）：你是谁？
   → 登录验证 → 身份确认

授权（Authorization）：你能干什么？
   → 权限检查 → 访问控制

完整流程：
用户登录 → 认证成功 → 颁发令牌 → 携带令牌请求 → 验证令牌 → 检查权限 → 返回数据
```

---

## 🆚 2. Session vs JWT

| 维度 | Session | JWT |
|------|---------|-----|
| 存储位置 | 服务端（内存/Redis） | 客户端（Cookie/LocalStorage） |
| 服务端状态 | 有状态（Stateful） | 无状态（Stateless） |
| 扩展性 | 🟡 需要共享 Session（Redis） | 🟢 天然支持分布式 |
| 安全性 | 🟢 服务端可随时吊销 | 🟡 无法主动吊销（过期前有效） |
| 性能 | 🟡 每次查 Redis | 🟢 本地验证签名即可 |
| 跨域 | 🟡 需要 CORS 配置 | 🟢 Header 传递，跨域友好 |
| 移动端 | 🟡 Cookie 支持不佳 | 🟢 完美支持 |
| 适用场景 | 传统 Web 应用 | SPA / 移动端 / 微服务 |

### JWT 结构解析

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.sH1k9gZ6k5tJE7G7T2YN3Q
│                     │                     │
│     Header          │     Payload         │    Signature
│  {"alg":"HS256"}    │  {"sub":"123"...}   │  HMAC(header.payload, secret)
```

```typescript
// JWT Payload 建议结构
{
  sub: '1234567890',     // 用户 ID
  email: 'user@test.com',
  role: 'admin',
  iat: 1709000000,       // 签发时间
  exp: 1709604800,       // 过期时间
}
```

---

## 🛡 3. JWT 认证实战（NestJS）

### 3.1 注册与登录

```typescript
// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 注册
  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email)
    if (existingUser) throw new UnauthorizedException('邮箱已注册')

    const hashedPassword = await bcrypt.hash(dto.password, 12)
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    })

    return this.generateTokens(user)
  }

  // 登录
  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email)
    if (!user) throw new UnauthorizedException('邮箱或密码错误')

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    if (!isPasswordValid) throw new UnauthorizedException('邮箱或密码错误')

    return this.generateTokens(user)
  }

  // 生成双 Token
  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',          // Access Token 短期有效
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',           // Refresh Token 长期有效
      }),
    ])

    return { accessToken, refreshToken }
  }

  // 刷新 Token
  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      })
      const user = await this.userService.findById(payload.sub)
      return this.generateTokens(user)
    } catch {
      throw new UnauthorizedException('Refresh Token 无效或已过期')
    }
  }
}
```

### 3.2 JWT 守卫

```typescript
// jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    })
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }
  }
}

// jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // 检查是否标记为公开接口
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    return super.canActivate(context)
  }
}

// public.decorator.ts
import { SetMetadata } from '@nestjs/common'
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
```

### 3.3 使用

```typescript
// 全局启用 JWT 守卫
// main.ts 或 app.module.ts
app.useGlobalGuards(new JwtAuthGuard());

// controller
@Controller('users')
export class UserController {
  @Public()                       // 公开接口，不需要登录
  @Post('register')
  register(@Body() dto: RegisterDto) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {}

  @Get('profile')                 // 需要登录
  getProfile(@CurrentUser() user: User) {
    return user
  }
}
```

---

## 🌍 4. OAuth2 第三方登录

### 4.1 OAuth2 授权码流程

```
用户                    你的应用               第三方（GitHub/微信）
 │                        │                        │
 │─── 1. 点击登录 ──────→│                        │
 │                        │── 2. 重定向到授权页 ──→│
 │←── 3. 用户授权 ─────────────────────────────→│
 │                        │←─ 4. 返回授权码 code ──│
 │                        │── 5. 用 code 换 token →│
 │                        │←─ 6. 返回 access_token │
 │                        │── 7. 用 token 获取用户 →│
 │                        │←─ 8. 返回用户信息 ──────│
 │←── 9. 登录成功 ────────│                        │
```

### 4.2 GitHub OAuth 实战

```typescript
// auth.controller.ts
@Controller('auth')
export class AuthController {
  @Get('github')
  @Public()
  githubLogin(@Res() res: Response) {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}` +
      `&scope=user:email`
    res.redirect(githubAuthUrl)
  }

  @Get('github/callback')
  @Public()
  async githubCallback(@Query('code') code: string) {
    // 1. 用 code 换 access_token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })
    const { access_token } = await tokenRes.json()

    // 2. 用 access_token 获取用户信息
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    const githubUser = await userRes.json()

    // 3. 查找或创建本地用户
    let user = await this.userService.findByGithubId(githubUser.id)
    if (!user) {
      user = await this.userService.create({
        githubId: githubUser.id,
        name: githubUser.name,
        email: githubUser.email,
        avatar: githubUser.avatar_url,
      })
    }

    // 4. 生成 JWT
    return this.authService.generateTokens(user)
  }
}
```

---

## 👥 5. RBAC 权限体系设计

### 5.1 权限模型

```
RBAC（Role-Based Access Control）：基于角色的访问控制

用户 ──→ 角色 ──→ 权限

User          Role           Permission
┌──────┐     ┌──────┐      ┌──────────────┐
│ Alice │──→  │ Admin │──→  │ user:create  │
└──────┘     └──────┘      │ user:read    │
┌──────┐     ┌──────┐      │ user:update  │
│  Bob  │──→  │ Editor│──→  │ user:delete  │
└──────┘     └──────┘      │ post:create  │
                            │ post:read    │
                            │ post:update  │
                            │ post:delete  │
                            └──────────────┘
```

### 5.2 数据模型

```prisma
// schema.prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  roles    UserRole[]
}

model Role {
  id          Int          @id @default(autoincrement())
  name        String       @unique   // admin / editor / viewer
  description String?
  permissions RolePermission[]
  users       UserRole[]
}

model Permission {
  id          Int              @id @default(autoincrement())
  resource    String           // user / post / order
  action      String           // create / read / update / delete
  roles       RolePermission[]

  @@unique([resource, action])
}

model UserRole {
  user   User @relation(fields: [userId], references: [id])
  userId Int
  role   Role @relation(fields: [roleId], references: [id])
  roleId Int

  @@id([userId, roleId])
}

model RolePermission {
  role         Role       @relation(fields: [roleId], references: [id])
  roleId       Int
  permission   Permission @relation(fields: [permissionId], references: [id])
  permissionId Int

  @@id([roleId, permissionId])
}
```

### 5.3 权限守卫实现

```typescript
// permissions.decorator.ts
import { SetMetadata } from '@nestjs/common'

export const PERMISSIONS_KEY = 'permissions'
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)

// permissions.guard.ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    )
    if (!requiredPermissions) return true

    const { user } = context.switchToHttp().getRequest()
    const userWithRoles = await this.userService.findWithPermissions(user.id)

    // 收集用户所有权限
    const userPermissions = new Set<string>()
    for (const userRole of userWithRoles.roles) {
      for (const rolePermission of userRole.role.permissions) {
        const { resource, action } = rolePermission.permission
        userPermissions.add(`${resource}:${action}`)
      }
    }

    // 检查是否拥有所有必需权限
    return requiredPermissions.every((p) => userPermissions.has(p))
  }
}

// 使用
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  @Get()
  @RequirePermissions('user:read')
  findAll() {}

  @Post()
  @RequirePermissions('user:create')
  create() {}

  @Delete(':id')
  @RequirePermissions('user:delete')
  delete() {}
}
```

---

## 🔒 6. 安全最佳实践清单

| 维度 | 做法 |
|------|------|
| 密码存储 | bcrypt 哈希，salt rounds ≥ 12 |
| JWT Secret | 至少 256 位随机字符串，环境变量存储 |
| Access Token | 短有效期（15-30 分钟） |
| Refresh Token | 长有效期（7-30 天），可吊销 |
| HTTPS | 生产环境必须全站 HTTPS |
| 限频 | 登录接口限制每 IP 每分钟 5 次 |
| 敏感操作 | 二次验证（邮箱/短信验证码） |
| 日志 | 记录登录、权限变更等安全事件 |

---

## ✅ 本篇重点 Checklist

- [ ] 理解 Session 和 JWT 的区别及适用场景
- [ ] 掌握 JWT 双 Token（Access + Refresh）机制
- [ ] 了解 OAuth2 授权码流程
- [ ] 掌握 RBAC 权限模型的数据设计
- [ ] 会实现 NestJS Guard + 自定义装饰器的权限检查
- [ ] 了解安全最佳实践（bcrypt/HTTPS/限频）

---

> 安全不是可选项，是必选项。
> 下一篇我们聊 **缓存与消息队列 — Redis · Bull · RabbitMQ**。

---
*📝 作者：NIHoa ｜ 系列：Node.js技术选型与架构系列 ｜ 更新日期：2025-02-06*
