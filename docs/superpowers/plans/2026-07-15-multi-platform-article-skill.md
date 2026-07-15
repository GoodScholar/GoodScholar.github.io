# Multi-Platform Article Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有微信公众号写作 Skill 扩展为同时支持微信公众号与掘金，并仅在平台未明确时询问用户。

**Architecture:** 保留素材核验、事实门控和正文结构等通用流程，在 `SKILL.md` 最前方增加平台路由，再分别加载微信公众号与掘金排版契约。公众号现有配置、图片和草稿箱发布保持不变；掘金只输出可发布 Markdown，不新增自动发布。

**Tech Stack:** Markdown、YAML frontmatter、Python `unittest`、Skill Creator `quick_validate.py`

## Global Constraints

- 仅支持两个目标平台：`微信公众号`、`掘金`。
- 当前请求或上下文已明确平台时直接执行；未明确时必须先询问平台。
- 保留 `.wechat-writer-config.json`、`.wechat-writer-series/`、微信凭证环境变量和 `publish_to_wechat.py`。
- 掘金分支不使用公众号摘要、朋友圈转发文案、微信编辑器限制、强制配图或草稿箱发布流程。
- 不新增掘金自动发布能力。
- `.agents/` 继续保持 Git 忽略状态，不使用 `git add -f`。

---

### Task 1: 建立平台行为契约测试

**Files:**
- Create: `.agents/skills/WeChat-Insight-Skill/tests/test_multi_platform_contract.py`

**Interfaces:**
- Consumes: `SKILL.md`、`references/juejin-layout.md`、`README.md`、项目技能路由文件。
- Produces: 可重复执行的静态契约测试，验证命名、平台询问条件、引用文件和路由一致性。

- [ ] **Step 1: 写入失败测试**

```python
from pathlib import Path
import unittest


SKILL_ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = SKILL_ROOT.parents[2]


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


class MultiPlatformSkillContractTest(unittest.TestCase):
    def test_skill_declares_multi_platform_identity_and_triggers(self):
        skill = read(SKILL_ROOT / "SKILL.md")
        self.assertIn("name: multi-platform-article-writer", skill)
        for keyword in ("微信公众号", "掘金文章", "掘金版本"):
            self.assertIn(keyword, skill)

    def test_platform_gate_only_asks_when_platform_is_unknown(self):
        skill = read(SKILL_ROOT / "SKILL.md")
        self.assertIn("平台路由（第一步，必须执行）", skill)
        self.assertIn("已明确为微信公众号", skill)
        self.assertIn("已明确为掘金", skill)
        self.assertIn("未明确目标平台", skill)
        self.assertIn("必须先询问", skill)

    def test_juejin_layout_is_routed_from_skill(self):
        layout = SKILL_ROOT / "references" / "juejin-layout.md"
        self.assertTrue(layout.is_file())
        skill = read(SKILL_ROOT / "SKILL.md")
        self.assertIn("references/juejin-layout.md", skill)
        layout_text = read(layout)
        for contract in ("标准 Markdown", "完整代码", "标签建议", "不自动发布"):
            self.assertIn(contract, layout_text)

    def test_project_routes_name_both_platforms(self):
        files = (
            PROJECT_ROOT / "ARTICLE_SKILLS.md",
            PROJECT_ROOT / ".agents/skills/article-writing/SKILL.md",
            PROJECT_ROOT / ".agents/skills/tech-article-expert/SKILL.md",
        )
        for path in files:
            text = read(path)
            self.assertIn("multi-platform-article-writer", text, path)
            self.assertIn("掘金", text, path)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: 运行测试并确认 RED**

Run:

```bash
python3 .agents/skills/WeChat-Insight-Skill/tests/test_multi_platform_contract.py -v
```

Expected: 4 个测试失败，原因分别包含旧 Skill 名称、缺少平台门控、缺少 `juejin-layout.md`、项目路由仍使用 `wechat-article-writer`。

---

### Task 2: 实现核心平台路由与掘金排版契约

**Files:**
- Modify: `.agents/skills/WeChat-Insight-Skill/SKILL.md`
- Create: `.agents/skills/WeChat-Insight-Skill/references/juejin-layout.md`
- Modify: `.agents/skills/WeChat-Insight-Skill/references/writing-playbook.md`

**Interfaces:**
- Consumes: Task 1 的静态契约测试、现有公众号排版和发布引用。
- Produces: `multi-platform-article-writer`；`目标平台` 路由状态；微信公众号与掘金两套输出契约。

- [ ] **Step 1: 修改 frontmatter、标题和第一步平台路由**

将 `SKILL.md` 的 frontmatter 和开头替换为：

```markdown
---
name: multi-platform-article-writer
description: |
  Use when the user requests a Chinese article for WeChat Official Account or Juejin, including
  微信公众号草稿、公众号版本、微信推文、掘金文章、掘金版本、发布到公众号或发布到掘金，
  or asks for a platform-ready article without naming the publishing platform.
---

# 微信公众号与掘金文章写作

把素材变成适合目标平台阅读和发布的完整文章。先确定平台，再执行通用的事实核验与内容组织，最后加载对应的平台排版和交付规则。

## 平台路由（第一步，必须执行）

生成、改写或适配文章前，先确定 `目标平台`：

- 当前请求或上下文已明确为微信公众号：设置为 `微信公众号`，直接执行，不重复询问。
- 当前请求或上下文已明确为掘金：设置为 `掘金`，直接执行，不重复询问。
- 未明确目标平台：必须先询问“这篇文章要发布到微信公众号还是掘金？”，得到答案前不进入写作流程。

修改已有文章时，用户已明确原稿平台则沿用；原稿平台和当前请求都无法判断时，仍按未明确平台处理。
```

- [ ] **Step 2: 将配置、系列和默认输出改为条件分支**

在“启动时先读配置”中明确：只有 `目标平台 = 微信公众号` 时读取 `.wechat-writer-config.json` 和微信环境变量；掘金分支使用当前请求中的作者、读者和标签信息，不读取微信凭证。系列状态文件继续只用于公众号分支，掘金系列依赖当前项目已有文章和用户提供的系列资料。

将默认输出改为：

```markdown
- 微信公众号：可直接粘贴到公众号编辑器的完整图文草稿。
- 掘金：可直接粘贴到掘金编辑器的标准 Markdown，保留必要的完整代码、命令和验证步骤。
```

- [ ] **Step 3: 为排版、配图、输出状态和发布步骤增加平台分支**

在 `SKILL.md` 中落实以下条件：

```markdown
- `目标平台 = 微信公众号`：继续读取 `wechat-layout.md`，执行现有封面、正文图、橘猫角色声明、摘要、转发文案和草稿箱发布规则。
- `目标平台 = 掘金`：读取 `juejin-layout.md`；图片仅在提高理解时生成，不强制封面、正文图或橘猫；输出摘要、正文、标签建议和发布前检查；只交付 Markdown，不调用微信发布工具，也不声称已自动发布到掘金。
```

把“公众号输出优先”改为“平台成稿优先”，把“输出格式”拆成微信公众号与掘金两个有序列表。保留“发布到公众号草稿箱”作为明确标注的微信公众号专属可选步骤。

- [ ] **Step 4: 新增掘金排版引用**

创建 `references/juejin-layout.md`，完整内容为：

```markdown
# 掘金文章排版与交付规范

生成完整掘金文章时读取本文。目标是交付可直接粘贴到掘金编辑器的标准 Markdown，服务主动阅读的开发者。

## 内容深度

- 保留理解方案所需的完整代码、命令、配置、日志和验证步骤，不为手机扫读强行截短。
- 代码块必须标注语言；跨文件示例注明文件路径；省略代码时明确说明省略范围。
- 教程写清前置条件、操作、成功信号、失败信号和验证命令。
- 方案或复盘写清取舍、适用边界和未解决问题。

## 标准 Markdown

- 正文只保留一个一级标题，主体从二级标题开始。
- 使用标准 Markdown 标题、列表、引用、链接、图片和围栏代码块。
- 表格只用于列结构稳定、单元格简短的对比；内容较长时改用分节或列表。
- 不使用依赖微信公众号编辑器的 HTML、内联样式、留白技巧或图片长图替代代码。
- 外部资料在相关结论首次出现处给出可访问链接；时效信息标明核验日期。

## 图片

- 图片按信息价值决定，不强制封面图或正文图。
- 优先使用真实截图、运行结果、架构图和流程图。
- 不强制使用微信公众号的封面裁切、暖橙视觉系统或橘猫角色声明。
- 图片缺失不阻塞纯 Markdown 成稿，但发布前检查必须列出确实需要补充的截图或图示。

## 输出契约

完整掘金稿按以下顺序交付：

1. 使用假设：文章类型、目标读者、核心目标和作者调性。
2. 备选标题：默认 5 个，标记 1 个推荐标题。
3. 摘要：概括问题、核心方案和读者收益，不写公众号摘要提示语。
4. 正文：标准 Markdown，包含必要的完整代码、验证步骤、坑点和边界。
5. 标签建议：给出 3-5 个与正文直接相关的技术标签，不虚构平台分类。
6. 发布前检查：只列真实待确认项；没有则写“无”。
7. 本次修改说明：仅修改模式输出。

## 发布边界

当前 Skill 不自动发布到掘金。用户说“发布到掘金”时，输出可直接发布的 Markdown，并明确说明未执行平台发布；除非当前环境另有已授权且可验证的掘金发布工具，否则不得声称发布成功。

## 发布前检查

- [ ] 标题、摘要、正文和标签指向同一主题。
- [ ] 代码块语言、文件路径、依赖版本和命令完整。
- [ ] 示例结果经过验证，或明确标注未验证范围。
- [ ] 外链可访问，时效信息已重新核实。
- [ ] 没有混入公众号摘要、朋友圈转发文案、微信编辑器限制或草稿箱发布步骤。
- [ ] 不自动发布；交付状态准确。
```

- [ ] **Step 5: 中和通用写作引用中的公众号专属措辞**

在 `references/writing-playbook.md` 中做四处精准替换：

```text
“微信公众号写作细则” → “平台文章写作细则”
“公众号式草稿” → “目标平台草稿”
“降级也要像公众号” → “降级也要符合目标平台”
“当前公众号能力和平台规则” → “目标平台能力和规则”
```

保留其他事实核验、真实案例、标题、结构与 CTA 规则，不做无关重写。

- [ ] **Step 6: 运行核心契约测试**

Run:

```bash
python3 .agents/skills/WeChat-Insight-Skill/tests/test_multi_platform_contract.py -v
```

Expected: 前 3 个测试通过；项目路由一致性测试仍失败。

---

### Task 3: 同步说明文档与技能路由

**Files:**
- Modify: `.agents/skills/WeChat-Insight-Skill/README.md`
- Modify: `.agents/skills/article-writing/SKILL.md`
- Modify: `.agents/skills/tech-article-expert/SKILL.md`
- Modify: `ARTICLE_SKILLS.md`

**Interfaces:**
- Consumes: `multi-platform-article-writer` 名称及两套平台输出契约。
- Produces: 项目内一致的 Skill 发现、选择和使用说明。

- [ ] **Step 1: 更新 README 的定位与使用方式**

把标题改为 `# Multi-Platform-Article-Writer`，开头明确支持微信公众号和掘金。在“使用”前增加：

```markdown
## 平台选择

- 请求中明确“微信公众号”或“掘金”时，直接按对应平台生成。
- 未指定平台时，Skill 会先询问发布平台，再开始写作。
```

增加掘金示例：

```text
把这份项目复盘整理成掘金文章，保留完整代码和验证命令。
```

把默认输出、图片模式、适用边界和文件结构改成平台分支；公众号发布章节与旧配置说明保持原样；新增 `juejin-layout.md` 索引并说明掘金不支持自动发布。

- [ ] **Step 2: 更新两个相邻 Skill 的路由**

将 `article-writing/SKILL.md` 第 8 行替换为：

```markdown
负责“写什么、为什么值得写、准备怎么写”，不负责完整文章成稿、排版或润色。进入正文写作后使用 `tech-article-expert`；明确面向微信公众号或掘金发布时使用 `multi-platform-article-writer`。
```

将 `tech-article-expert/SKILL.md` 的平台路由行替换为：

```markdown
| 明确要求微信公众号或掘金成稿、平台适配或平台发布 | 改用 `multi-platform-article-writer` |
```

- [ ] **Step 3: 更新项目技能指南**

在 `ARTICLE_SKILLS.md` 中：

- 将 `wechat-article-writer` 全部替换为 `multi-platform-article-writer`。
- 将“三个职责”中的第三项改为“微信公众号与掘金平台交付”。
- 快速选择树增加“明确要求微信公众号或掘金内容/发布”。
- 职责段同时列出公众号移动端适配与掘金 Markdown/代码适配。
- 维护规范改为“平台特有的排版、配图、系列状态和发布规则放入 `WeChat-Insight-Skill`”。
- 保留目录名 `WeChat-Insight-Skill/` 和现有 `quick_validate.py` 路径。

- [ ] **Step 4: 运行完整验证**

Run:

```bash
python3 .agents/skills/WeChat-Insight-Skill/tests/test_multi_platform_contract.py -v
python3 /Users/shen/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/WeChat-Insight-Skill
rg -n "wechat-article-writer" ARTICLE_SKILLS.md .agents/skills/article-writing/SKILL.md .agents/skills/tech-article-expert/SKILL.md
```

Expected:

- 4 个契约测试全部通过。
- `quick_validate.py` 输出 `Skill is valid!`。
- `rg` 无输出并返回状态 1，证明相邻路由中没有残留旧名称。

- [ ] **Step 5: 检查 Git 状态并仅提交可跟踪文件**

Run:

```bash
git status --short
git add ARTICLE_SKILLS.md docs/superpowers/plans/2026-07-15-multi-platform-article-skill.md
git commit -m "docs: 更新多平台文章 skill 指南"
```

Expected: `.agents/` 改动不会出现在 Git 暂存区；提交仅包含项目技能指南和实施计划。
