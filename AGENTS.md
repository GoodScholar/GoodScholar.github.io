# 全局 Agent 指令

## 文章日期验证规则

在**创建或修改**任何 `.md` 文章文件时，必须严格遵循以下日期规则：

### 规则一：日期不可大于当前时间

文章中任何日期字段的值**不得超过当前日期**（即今天或更早）。

需检查以下两处：

1. **YAML Frontmatter 的 `date` 字段**（若存在）：
   ```yaml
   ---
   date: 2026-03-26
   ---
   ```

2. **文章末尾签名行的「更新日期」**：
   ```
   *📝 作者：NIHoa ｜ 系列：xxx ｜ 更新日期：2026-03-26*
   ```

### 规则二：日期不可重复

在设定文章日期前，**必须扫描项目中所有已有文章的日期（包括 frontmatter `date` 和末尾签名行的更新日期）**，确保新文章的日期不与任何已有文章的日期重复。

具体操作步骤：
1. 使用搜索工具扫描项目中所有 `.md` 文件的 `更新日期：` 和 `date:` 字段
2. 收集所有已使用的日期
3. 确保新文章的日期不在已使用列表中
4. 如果拟定的日期已被占用，需选择另一个可用的日期，并告知用户

### 规则三：两处日期需保持一致

如果同一篇文章同时存在 YAML frontmatter `date` 字段和末尾签名行的「更新日期」，两者的日期值**必须相同**。

### 日期格式

统一使用 `YYYY-MM-DD` 格式，例如：`2026-03-26`

<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->
