# Article HTML Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在完整文章交付后按用户确认生成双平台本地 HTML 预览页，提供平台正确的预览和复制入口，并保留现有公众号 HTML 预览兼容能力。

**Architecture:** 新增独立 `generate_article_preview.py` 作为通用入口，复用 `publish_to_wechat.py` 中已有的标题提取、Markdown 转 HTML 和 HTML 转义能力。页面模板按 `wechat` / `juejin` 分支渲染，Skill 只负责在文章完成或修改完成后询问并调用工具；现有公众号发布脚本不承担掘金逻辑。

**Tech Stack:** Python 3 标准库、现有 Markdown 转 HTML helper、内联 CSS、浏览器 Clipboard API、Python `unittest`

## Global Constraints

- 完整文章生成后先询问“是否生成 HTML 预览页？”，用户确认后才生成。
- 修改模式输出完整正文后再次询问，确认后覆盖对应 `.html` 文件。
- 明确要求“预览”“生成 HTML”“方便复制”时视为已确认，可直接生成。
- 微信复制优先使用 `text/html`，同时提供原始 Markdown 复制；掘金提供 Markdown 和正文文本复制。
- 预览工具不读取 `WECHAT_APP_ID`、`WECHAT_APP_SECRET`，不上传文件，不执行发布。
- 保留 `publish_to_wechat.py --html-only` 现有行为。
- 掘金平台不强制图片；在本项目创建新文章 `.md` 文件时仍遵守 `AGENTS.md` 的封面和日期规则。
- `.agents/` 继续被 Git 忽略，不使用 `git add -f`。

---

### Task 1: 建立预览工具契约测试

**Files:**
- Create: `.agents/skills/WeChat-Insight-Skill/tests/test_article_preview.py`

**Interfaces:**
- Consumes: `tools/generate_article_preview.py` CLI contract and generated HTML.
- Produces: 可执行的双平台 fixture 测试，约束入口、路径、平台文案、复制脚本和凭证隔离。

- [ ] **Step 1: 写入失败测试**

```python
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
TOOL = ROOT / "tools" / "generate_article_preview.py"


FIXTURE = """# Preview <Title>

这是 **正文**，包含 [链接](https://example.com)。

## 代码

```python
print('<safe>')
```

## 发布前检查

无

## 转发文案

不应出现在公众号正文 HTML 中
"""


class ArticlePreviewTest(unittest.TestCase):
    def run_tool(self, platform, output=None):
        with tempfile.TemporaryDirectory() as tmp:
            article = Path(tmp) / "article.md"
            article.write_text(FIXTURE, encoding="utf-8")
            args = [sys.executable, str(TOOL), str(article), "--platform", platform]
            if output:
                args.extend(["--output", str(output)])
            result = subprocess.run(args, capture_output=True, text=True)
            generated = output or article.with_suffix(".html")
            html = generated.read_text(encoding="utf-8") if generated.exists() else ""
            return result, html, generated

    def test_wechat_preview_has_rich_and_markdown_copy(self):
        result, html, generated = self.run_tool("wechat")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(generated.is_file())
        self.assertIn("复制排版正文", html)
        self.assertIn("复制 Markdown", html)
        self.assertIn("text/html", html)
        self.assertIn("公众号编辑器", html)
        self.assertNotIn("不应出现在公众号正文 HTML 中", html)
        self.assertIn("&lt;safe&gt;", html)

    def test_juejin_preview_has_markdown_copy_without_wechat_publish_copy(self):
        result, html, generated = self.run_tool("juejin")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(generated.is_file())
        self.assertIn("复制 Markdown", html)
        self.assertIn("复制正文文本", html)
        self.assertNotIn("公众号编辑器", html)
        self.assertNotIn("朋友圈", html)
        self.assertIn("Preview &lt;Title&gt;", html)

    def test_output_flag_controls_path_and_invalid_platform_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp) / "preview.html"
            article = Path(tmp) / "article.md"
            article.write_text(FIXTURE, encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(TOOL), str(article), "--platform", "juejin", "--output", str(output)],
                capture_output=True, text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertTrue(output.is_file())
        invalid = subprocess.run(
            [sys.executable, str(TOOL), str(article), "--platform", "unknown"],
            capture_output=True, text=True,
        )
        self.assertNotEqual(invalid.returncode, 0)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: 运行 RED**

Run:

```bash
python3 .agents/skills/WeChat-Insight-Skill/tests/test_article_preview.py -v
```

Expected: 3 tests fail because `tools/generate_article_preview.py` does not exist.

---

### Task 2: 实现双平台 HTML 预览工具

**Files:**
- Create: `.agents/skills/WeChat-Insight-Skill/tools/generate_article_preview.py`
- Modify: `.agents/skills/WeChat-Insight-Skill/tools/publish_to_wechat.py` only if a shared helper import or compatibility fix is required

**Interfaces:**
- Consumes: `publish_to_wechat.extract_title_and_body`, `publish_to_wechat.md_to_wechat_html`, `publish_to_wechat.escape_html`.
- Produces: `main()` CLI; `generate_preview(markdown_path: Path, platform: str, output_path: Path | None) -> Path`.

- [ ] **Step 1: 写入最小 CLI 和输入校验**

Implement these exact behaviors:

```python
def generate_preview(markdown_path: Path, platform: str, output_path: Path | None = None) -> Path:
    if platform not in {"wechat", "juejin"}:
        raise ValueError("platform must be 'wechat' or 'juejin'")
    if not markdown_path.is_file():
        raise FileNotFoundError(markdown_path)
    markdown = markdown_path.read_text(encoding="utf-8")
    title, _ = extract_title_and_body(markdown)
    article_html = md_to_wechat_html(markdown) if platform == "wechat" else md_to_wechat_html(markdown, primary_color="#2f6feb")
    output = output_path or markdown_path.with_suffix(".html")
    output.write_text(build_page(title, markdown, article_html, platform), encoding="utf-8")
    return output
```

Use `argparse` with positional `markdown`, required `--platform {wechat,juejin}`, optional `--output`. Catch known input errors, print a concise error to stderr, and return non-zero. Do not load config or call any publish API.

- [ ] **Step 2: 添加安全的页面模板和平台文案**

`build_page(title, markdown, article_html, platform)` must:

- HTML-escape the visible title and JSON-serialize the Markdown/HTML before embedding them in JavaScript.
- Use a responsive two-column layout with `#preview` and `#sidebar`; at `max-width: 760px`, stack them vertically.
- Include buttons with stable IDs `copy-rich`, `copy-markdown`, and for Juejin `copy-text`.
- WeChat page text includes `微信公众号预览`, `复制排版正文`, `复制 Markdown`, and `公众号编辑器`.
- Juejin page text includes `掘金预览`, `复制 Markdown`, `复制正文文本`, and excludes `公众号编辑器`, `朋友圈`, `草稿箱`.
- `copy-rich` uses `ClipboardItem({'text/html': Blob(...)})` when available and a hidden selection fallback; `copy-markdown` uses `navigator.clipboard.writeText`; all buttons show success/error status.
- Copy operations use the embedded original Markdown or rendered article HTML only; never include the sidebar or internal metadata sections.

- [ ] **Step 3: 运行 GREEN 和兼容检查**

Run:

```bash
python3 .agents/skills/WeChat-Insight-Skill/tests/test_article_preview.py -v
python3 .agents/skills/WeChat-Insight-Skill/tools/generate_article_preview.py --help
python3 .agents/skills/WeChat-Insight-Skill/tools/publish_to_wechat.py .agents/skills/WeChat-Insight-Skill/examples/demo-article.md --html-only
```

Expected: 3 preview tests pass; `--help` exits 0 and lists `--platform`; existing `--html-only` exits 0 and writes the demo article `.html` preview. Remove the generated demo HTML after verification so it is not delivered as a repository artifact.

---

### Task 3: 接入 Skill 询问流程和平台文档

**Files:**
- Modify: `.agents/skills/WeChat-Insight-Skill/SKILL.md`
- Modify: `.agents/skills/WeChat-Insight-Skill/README.md`
- Modify: `.agents/skills/WeChat-Insight-Skill/references/juejin-layout.md`
- Modify: `.agents/skills/WeChat-Insight-Skill/references/iteration-mode.md`
- Modify: `.agents/skills/WeChat-Insight-Skill/references/wechat-publish.md`
- Modify: `ARTICLE_SKILLS.md`

**Interfaces:**
- Consumes: `generate_article_preview.py` CLI and `generate_preview()` output path.
- Produces: 用户确认后调用预览工具的 Skill 流程；双平台文档中的预览入口说明。

- [ ] **Step 1: 增加预览询问门控**

在 `SKILL.md` 完整文章输出和修改模式结束处加入以下契约：

```markdown
### HTML 预览（用户确认后生成）

完整文章输出后询问：“是否生成 HTML 预览页，方便预览和复制？”

- 用户确认，或明确提出“预览”“生成 HTML”“方便复制”时：执行 `python tools/generate_article_preview.py <文章> --platform wechat|juejin`，返回生成的 HTML 路径。
- 用户未确认或拒绝时：不生成 HTML，不把预览页当作文章正文输出。
- 修改模式输出完整正文后重复询问；确认后覆盖同名 `.html` 文件。
- 生成失败不影响文章交付，说明错误并保留 Markdown。
```

平台参数必须来自当前 `目标平台`，公众号使用 `wechat`，掘金使用 `juejin`。该步骤不调用 `publish_to_wechat.py` 发布接口。

- [ ] **Step 2: 同步平台参考文档**

在 `juejin-layout.md` 增加“HTML 预览与复制”小节：掘金确认后调用通用工具，预览显示 Markdown 渲染结果，复制 Markdown/正文文本，不显示公众号发布动作。`iteration-mode.md` 的两个平台修改输出契约中增加同一询问规则。

在 `wechat-publish.md` 明确 `--html-only` 是旧版公众号兼容入口；新文章预览优先使用通用工具，HTML 生成与草稿箱发布是两个独立动作。

- [ ] **Step 3: 更新 README 与项目技能指南**

README 增加：

```markdown
## HTML 预览与复制

完整文章生成后，Skill 会询问是否生成本地 HTML 预览页。确认后按目标平台生成 `<文章名>.html`：公众号提供富文本和 Markdown 复制，掘金提供 Markdown 和正文文本复制。修改文章并确认后会覆盖旧预览页。

手动生成：

```bash
python tools/generate_article_preview.py article.md --platform wechat
python tools/generate_article_preview.py article.md --platform juejin
```
```

更新 `ARTICLE_SKILLS.md` 的多平台职责，说明本地 HTML 预览是确认后生成、不会自动发布，并保留 `--html-only` 兼容说明。

- [ ] **Step 4: 运行文档和结构验证**

Run:

```bash
python3 .agents/skills/WeChat-Insight-Skill/tests/test_article_preview.py -v
python3 .agents/skills/WeChat-Insight-Skill/tests/test_multi_platform_contract.py -v
python3 /Users/shen/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/WeChat-Insight-Skill
git diff --check
```

Expected: 预览测试 3/3 通过，多平台契约测试 7/7 通过，Skill 输出 `Skill is valid!`，Git diff 无空白错误。检查 `.agents/` 忽略状态和没有残留凭证、临时 HTML 或旧平台泄漏。
