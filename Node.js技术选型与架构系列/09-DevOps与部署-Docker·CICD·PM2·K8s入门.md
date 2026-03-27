# 🚀 Node.js 技术选型（九）：DevOps 与部署 — Docker · CI/CD · PM2 · K8s 入门

> **系列导读**：代码写完只是开始，能稳定上线才是能力。
> 本篇从 **Docker 容器化、CI/CD 流水线、PM2 进程管理、Kubernetes 入门**四个维度，
> 带你搭建一套 Node.js 项目的完整 DevOps 体系。

---

## 🐳 1. Docker 容器化

### 1.1 为什么用 Docker

```
传统部署：
  开发者："我本地是好的啊" → 服务器环境不一致 → 线上 Bug 💥

Docker 部署：
  开发/测试/生产 → 同一个 Docker 镜像 → 环境完全一致 ✅
```

### 1.2 NestJS Dockerfile 最佳实践

```dockerfile
# =================== 阶段一：构建 ===================
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制依赖文件（利用 Docker 层缓存）
COPY package*.json ./
RUN npm ci --only=production && \
    cp -R node_modules /prod_modules && \
    npm ci

# 复制源码并构建
COPY . .
RUN npm run build

# =================== 阶段二：运行 ===================
FROM node:20-alpine AS runner

WORKDIR /app

# 创建非 root 用户（安全）
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# 只复制生产需要的文件
COPY --from=builder /prod_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# 安全：不用 root
USER nestjs

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### 1.3 docker-compose 本地开发

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

volumes:
  pgdata:
```

```bash
# 常用命令
docker compose up -d          # 后台启动所有服务
docker compose logs -f app    # 查看应用日志
docker compose down           # 停止所有服务
docker compose exec app sh    # 进入容器
```

### 1.4 镜像优化

| 优化手段 | 效果 |
|---------|------|
| 多阶段构建 | 最终镜像不含构建工具，体积减少 50%+ |
| `node:alpine` 基础镜像 | 从 ~900MB 减到 ~120MB |
| `.dockerignore` | 排除 node_modules、.git 等 |
| `npm ci` 替代 `npm install` | 严格按 lock 文件安装，更快更稳 |
| 非 root 用户 | 容器安全最佳实践 |

---

## 🔄 2. CI/CD 流水线

### 2.1 GitHub Actions 实战

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # ===== 阶段一：测试 =====
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: test_db
        ports: ['5432:5432']
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/test_db

  # ===== 阶段二：构建并推送镜像 =====
  build:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Registry
        uses: docker/login-action@v3
        with:
          registry: registry.example.com
          username: ${{ secrets.DOCKER_USER }}
          password: ${{ secrets.DOCKER_PASS }}

      - name: Build & Push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            registry.example.com/myapp:latest
            registry.example.com/myapp:${{ github.sha }}

  # ===== 阶段三：部署 =====
  deploy:
    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker pull registry.example.com/myapp:latest
            docker compose -f /app/docker-compose.prod.yml up -d
```

### 2.2 CI/CD 工具对比

| 工具 | 类型 | 适用场景 |
|------|------|---------|
| GitHub Actions | SaaS | GitHub 项目首选 |
| GitLab CI | 自托管/SaaS | GitLab 项目首选 |
| Jenkins | 自托管 | 企业级，高度可定制 |
| CircleCI | SaaS | 配置简洁，Docker 友好 |

---

## 📦 3. PM2 进程管理

### 3.1 为什么用 PM2

```
直接 node app.js：
  - 进程崩溃 → 服务中断 ❌
  - 只用 1 个 CPU 核心 ❌
  - 无日志管理 ❌
  - 无法零停机重启 ❌

PM2 管理：
  - 自动重启 ✅
  - 集群模式（多核利用） ✅
  - 日志聚合 + 轮转 ✅
  - 零停机重载 ✅
  - 监控面板 ✅
```

### 3.2 配置文件

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'api-server',
      script: 'dist/main.js',
      instances: 'max',          // 按 CPU 核心数启动
      exec_mode: 'cluster',      // 集群模式
      max_memory_restart: '500M', // 内存超限自动重启
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // 日志配置
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      merge_logs: true,
      // 监控配置
      max_restarts: 10,
      min_uptime: '10s',
      // 零停机重启配置
      listen_timeout: 8000,
      kill_timeout: 5000,
      wait_ready: true,
    },
  ],
}
```

### 3.3 常用命令

```bash
# 启动
pm2 start ecosystem.config.js

# 零停机重载（推荐用于部署）
pm2 reload api-server

# 查看状态
pm2 status                # 列表
pm2 monit                 # 实时监控面板
pm2 logs                  # 查看日志
pm2 logs --lines 100      # 最近 100 行日志

# 管理
pm2 restart api-server    # 重启
pm2 stop api-server       # 停止
pm2 delete api-server     # 删除

# 保存 & 开机自启
pm2 save                  # 保存当前进程列表
pm2 startup               # 生成开机自启脚本
```

---

## ☸️ 4. Kubernetes（K8s）入门

### 4.1 K8s 核心概念

```
┌─── K8s 集群 ──────────────────────────────────┐
│                                                │
│  ┌─── Node（工作节点） ────────────────────┐   │
│  │                                          │   │
│  │  ┌─── Pod ──────────┐  ┌─── Pod ─────┐  │   │
│  │  │  Container(app)  │  │  Container   │  │   │
│  │  │  Container(sidecar)│ │             │  │   │
│  │  └──────────────────┘  └─────────────┘  │   │
│  │                                          │   │
│  └──────────────────────────────────────────┘   │
│                                                │
│  Service（服务发现 + 负载均衡）                  │
│  Deployment（声明期望状态，自动维护）             │
│  Ingress（外部流量入口）                         │
│  ConfigMap / Secret（配置和密钥管理）             │
└────────────────────────────────────────────────┘
```

### 4.2 K8s 部署配置

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 3                    # 3 个副本
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
        - name: api-server
          image: registry.example.com/myapp:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: 'production'
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
          resources:
            requests:
              memory: '128Mi'
              cpu: '100m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          readinessProbe:        # 就绪探针
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:         # 存活探针
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
  strategy:
    type: RollingUpdate          # 滚动更新
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0          # 零停机

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-server
spec:
  selector:
    app: api-server
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: 'true'
spec:
  tls:
    - hosts:
        - api.example.com
      secretName: tls-secret
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-server
                port:
                  number: 80
```

### 4.3 常用 K8s 命令

```bash
# 部署
kubectl apply -f k8s/           # 应用所有配置
kubectl rollout status deploy/api-server  # 查看部署状态

# 查看
kubectl get pods                # 查看 Pod 列表
kubectl get svc                 # 查看 Service 列表
kubectl describe pod <pod-name> # 查看 Pod 详情
kubectl logs <pod-name> -f      # 查看日志

# 扩缩容
kubectl scale deploy/api-server --replicas=5

# 回滚
kubectl rollout undo deploy/api-server
```

---

## 🎯 5. 部署方案选型

```
项目规模和团队能力？
│
├── 个人项目 / 小型项目
│   └── PM2 + 单台服务器（最简单）
│
├── 中型项目（团队 3-8 人）
│   ├── Docker + docker-compose + CI/CD
│   └── PM2 集群模式 或 Docker Swarm
│
└── 大型项目 / 企业级
    └── Kubernetes + Helm + 完整 CI/CD 流水线
```

---

## ✅ 本篇重点 Checklist

- [ ] 会写多阶段构建 Dockerfile
- [ ] 掌握 docker-compose 本地开发环境搭建
- [ ] 了解 GitHub Actions CI/CD 流水线配置
- [ ] 掌握 PM2 集群模式和零停机重载
- [ ] 理解 K8s 核心概念（Pod/Deployment/Service/Ingress）
- [ ] 能根据项目规模选择合适的部署方案

---

> 能把代码部上线的开发者，比只会写代码的开发者值钱 10 倍。
> 最后一篇，我们聊 **性能优化与监控 — 压测 · APM · 日志 · 链路追踪**。

---
*📝 作者：NIHoa ｜ 系列：Node.js技术选型与架构系列 ｜ 更新日期：2025-02-09*
