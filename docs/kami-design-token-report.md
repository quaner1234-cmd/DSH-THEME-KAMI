# Kami — Design Token Report

Research performed by cloning `https://github.com/tw93/Kami` to `/tmp/research-kami`
(shallow clone + history fetch), reading the real source. All values below are
quoted from actual files at commit `4dab24cc4c527dbb35aa8fae09e02822992dfbe2`.

---

## 1. Repo Identity

| Field | Value |
|---|---|
| Repo | `tw93/Kami` — https://github.com/tw93/Kami |
| Homepage | https://kami.tw93.fun |
| Description | "👩‍🚒 Good content deserves good paper." |
| Default branch | `main` |
| Latest commit (HEAD) | `4dab24cc4c527dbb35aa8fae09e02822992dfbe2` — "docs: simplify copy and localize the Kami website" (2026-09-08, author youxi798) |
| Repo created | 2026-04-20T16:35:19Z; first commit `d068e87` "Kami is born" 2026-04-21 |
| Latest release | `V1.15.0` (tags: V1.15.0 … V1.11.0) |
| Stars / forks | 11,345 / 516 |
| License | **MIT** (`spdx_id: MIT` from API; `LICENSE` at repo root) |

**What Kami actually is.** Not a website theme and not an app — it is an
*agent skill + template system for typesetting documents*: resumes, one-pagers,
white papers (long-doc), letters, portfolios, equity reports, changelogs,
slide decks, and product landing pages. An AI agent fills `{{PLACEHOLDER}}`
HTML templates; the repo's Python scripts render them to PDF via WeasyPrint
(HTML→PDF is the default path), optional PPTX via python-pptx, PNG for social
posts, and a Marp theme for Markdown slide decks. Kami (紙) means "paper" in
Japanese; it is the third of a trilogy — Kaku (書く) writes code, Waza (技)
drills habits, Kami (紙) delivers documents.

**Tech stack** (no build system for the skill itself — the skill is shipped
verbatim by `npx skills add tw93/kami`):
- HTML templates with inline CSS (`skills/kami/assets/templates/*.html`), rendered by WeasyPrint (A4 print CSS)
- Python: `skills/kami/scripts/{build,render,checks,lint,tokens,content,highlight,visual,verify,...}.py`
- A Markdown agent skill definition (`skills/kami/SKILL.md`)
- Mermaid diagrams: `beautiful-mermaid` + `scripts/mermaid_normalize.py` (theme in `references/mermaid-theme.json`)
- A zero-dependency MCP server (`skills/kami/scripts/mcp_server.py`)
- A small Node.js MathJax runtime (`scripts/mathjax-runtime/`)
- The repo's own promotional site (`site/` — static HTML + 1,233-line `styles.css`), which is itself a live deployment of the design system
- `plugins/kami/` is a packaged copy of the skill for Claude Code / Codex plugin installs

**License & redistribution:**

- Code, templates, CSS, SVGs: **MIT** (repo root `LICENSE`, and a second `skills/kami/LICENSE`, both "Copyright (c) 2026 Tw93"). Redistribution, modification, commercial use of the code/CSS is explicitly allowed (MIT), with attribution retained.
- Fonts — three cases:
  - **TsangerJinKai02 (仓耳今楷02)** — bundled in repo (`assets/fonts/TsangerJinKai02-W04.ttf`, `-W05.ttf`) and served via jsDelivr CDN. Per README "License" section: *"TsangerJinKai02 is free for personal use only; commercial use requires a license from tsanger.cn"*. The repo ships **no license file** for it. It is deliberately excluded from the packaged skill ZIP (`SKILL.md`: "the commercial TsangerJinKai02 files stay in the repo for local preview and CDN fallback but never go inside a Claude Desktop skill ZIP"). → **Do not redistribute or use commercially without a tsanger.cn license.**
  - **Source Han Serif K / KR (Noto Serif KR)** — bundled OTFs (`assets/fonts/SourceHanSerifKR-Regular.otf`, `-Medium.otf`), **SIL Open Font License 1.1** (`skills/kami/assets/fonts/LICENSE-SourceHanSerifK.txt`), free to bundle/redistribute.
  - **Charter, YuMincho** — system fonts, per README "system-bundled or open-licensed"; **JetBrainsMono.woff2** bundled in `skills/kami/assets/fonts/` (OFL font; no license file shipped alongside it).

---

## 2. Color Tokens

### 2.1 Canonical source of truth: `skills/kami/references/tokens.json` (verbatim, 17 tokens)

```json
{
  "--parchment":         "#f5f4ed",
  "--ivory":             "#faf9f5",
  "--inline-code-bg":    "#f0eee6",
  "--border":            "#e8e6dc",
  "--border-soft":       "#e5e3d8",
  "--brand":             "#1B365D",
  "--brand-tint":        "#EEF2F7",
  "--tag-bg":            "#E4ECF5",
  "--near-black":        "#141413",
  "--dark-warm":         "#3d3d3a",
  "--charcoal":          "#4d4c48",
  "--olive":             "#504e49",
  "--stone":             "#6b6a64",
  "--breaking-bg":       "#f0e0d8",
  "--breaking-fg":       "#8b4513"
}
```

`scripts/tokens.py` enforces that every template's `:root` block and the
PPTX `RGBColor(0x..)` constants and `references/mermaid-theme.json` stay in
sync with this file (build fails otherwise).

### 2.2 Complete expanded palette (union of every token actually shipped)

Sources: `site/styles.css:18-43`, `skills/kami/assets/templates/landing-page.html:79-108`, per-template `:root` blocks, `references/design.md`.

| Role | Token | Hex | Notes / file evidence |
|---|---|---|---|
| Page background / canvas | `--parchment` | `#f5f4ed` | "warm cream, the emotional foundation". Never pure white (`design.md`). Also `@page { background: #f5f4ed }` so print margins are warm |
| Filled container / card | `--ivory` | `#faf9f5` | "brighter than parchment"; lifted surface is carried by this fill, **never a closed border** |
| Inline-code fill (screen) | `--inline-code-bg` | `#f0eee6` | one warm step darker than parchment |
| Button / interactive surface | `--warm-sand` | `#e8e6dc` | `site/styles.css:21`, `landing-page.html:83` |
| Secondary border line | `--line` | `#d8d5c8` | landing-page only (`landing-page.html:96`) |
| Hairline border (primary) | `--border` | `#e8e6dc` | section dividers, table headers, controls |
| Hairline border (soft) | `--border-soft` | `#e5e3d8` | row separators, subtle dividers |
| Primary text | `--near-black` | `#141413` | deepest but NOT pure black; warm olive undertone |
| Secondary text / table header / links | `--dark-warm` | `#3d3d3a` | |
| Subtext / captions | `--olive` | `#504e49` | JA/KO override `#4d4c48` (`site/styles.css:53,64`) — darker for thin Mincho strokes |
| Tertiary text / dates / metadata | `--stone` | `#6b6a64` | |
| JA/KO text variant | `--charcoal` | `#4d4c48` | registered in `tokens.json`, PDF-side dark-olive; also the JA override of `--olive` |
| **Accent (the only chromatic color)** | `--brand` | `#1B365D` | "Ink Blue". ≤5 % of document surface area (`design.md` invariant #2) |
| Accent on dark / hover | `--brand-light` | `#2D5A8A` | landing pages + `design.md` |
| Accent tint (recede tag) | `--brand-tint` | `#EEF2F7` | solid equivalent of `rgba(#1B365D, ~0.08)` |
| Default tag fill | `--tag-bg` | `#E4ECF5` | solid equivalent of `rgba(#1B365D, ~0.12)`; no `rgba()` anywhere (WeasyPrint double-rectangle bug) |
| Warning chip bg (sole exception) | `--breaking-bg` | `#f0e0d8` | changelog `.tag.breaking`; muted warm peach |
| Warning chip fg | `--breaking-fg` | `#8b4513` | warm brown |
| Dark section surface | `--dark-surface` | `#30302e` | token only, `site/styles.css:23`; "warm charcoal" |
| Dark page background | `--deep-dark` | `#141413` | token only, `site/styles.css:24`; not pure black, olive undertone |
| Screenshot frame bg | `--shot-bg` | `#141318` | landing-page gallery frame + optional dark code blocks (`landing-page.html:107`) |

**Link color:** links share `--brand` (`#1B365D`), no underline (print and
landing); screen hover lightens to `--brand-light`/`#2D5A8A`
(`landing-page.html:124-129`). Non-links must never be brand-colored
(`design.md` «Links»).

**Success / warning / error:** there is **no green/amber/red semantic set**.
The only sanctioned semantic exception is the changelog breaking chip above;
`design.md` states any other off-token color is a violation.

### 2.3 Dark mode: **does not exist**

There is **no `prefers-color-scheme` dark mode** anywhere (grep over all
templates and `site/styles.css` finds none). Design doc §5 describes a
*section-level* alternation ("Long docs alternate parchment `#f5f4ed` and
`#141413` dark sections") but **no shipped template implements it** — grep for
`background: #141413` / `--dark-surface` in `assets/templates/` finds only
`--shot-bg: #141318`. The only dark surfaces that actually render are:
(a) landing-page gallery frames and optional dark code blocks
(`--shot-bg`), with a 6-color dark syntax palette (`design.md` §11):
Comment `#79756a`, Keyword `#84aad6`, String `#8cbb91`, Number `#cbab86`,
Function/Class `#d6c78c`, Builtin `#b59ccd`; and (b) the site's "Deep Dark"
swatch display. Treat Kami as a **light-only, print-first** system.

### 2.4 Mermaid theme (`skills/kami/references/mermaid-theme.json`)

```json
"colors": { "bg": "#f5f4ed", "fg": "#141413", "line": "#504e49",
            "accent": "#1B365D", "muted": "#6b6a64",
            "surface": "#faf9f5", "border": "#e8e6dc" }
```

---

## 3. Typography

Core rule (`design.md`): **one serif family per page** — `--sans` is always
`var(--serif)`. A distinct sans is used only for screen UI chrome
(`--latin-ui`) and mono for code/labels.

### 3.1 Font stacks (verbatim from templates)

English (`skills/kami/assets/templates/resume-en.html:34-39`, identical shape in all `*-en.html`):

```css
--serif: Charter, Georgia,
         Palatino, "Times New Roman", serif;
--sans: var(--serif);
--mono:  "JetBrains Mono", "SF Mono", "Fira Code",
         Consolas, Monaco, monospace;
```

Chinese (`skills/kami/assets/templates/one-pager.html:53-55`, `long-doc.html:74-75`):

```css
--serif: "TsangerJinKai02", "Source Han Serif SC", "Source Han Serif CN",
         "Noto Serif CJK SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun",
         Georgia, serif;
--sans: var(--serif);
```

Japanese (`site/styles.css:51-53`):

```css
--serif: "YuMincho", "Yu Mincho", "Hiragino Mincho ProN",
         "Noto Serif CJK JP", "Source Han Serif JP", "TsangerJinKai02", Georgia, serif;
```

Korean (`skills/kami/assets/templates/*-ko.html:53+`):

```css
--serif: "Source Han Serif K", "Source Han Serif KR", "Noto Serif KR",
         "Apple SD Gothic Neo", "AppleMyungjo", Charter, Georgia, serif;
```

Mono with CJK fallback (mandatory — a mono-only stack renders missing-glyph
boxes in WeasyPrint; `long-doc.html:271-274`):

```css
font-family: "JetBrains Mono", "SF Mono", Consolas,
             "TsangerJinKai02", "Source Han Serif SC",
             "Noto Serif CJK SC", "Songti SC", monospace;
```

Screen UI face (landing pages only): `--latin-ui` —
`"PingFang SC", system-ui, -apple-system, sans-serif` (CN),
`"Inter", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif` (EN/KO).

CN font load: two `@font-face` slots — weight **400 = W04** file,
weight **500 = W05** file, local path first then jsDelivr CDN
(`one-pager.html:18-33`).

### 3.2 Size scale (print, from `design.md` §2; matches shipped templates)

| Role | Size | Weight | Line-height | Notes |
|---|---|---|---|---|
| Display | 36pt | 500 | 1.10 | cover title / one-pager hero |
| H1 | 22pt | 500 | 1.20 | long-doc chapter title (`long-doc.html:184-192`) |
| H2 | 16pt | 500 | 1.25 | subsection |
| H3 | 13pt | 500 | 1.30 | item titles; color `--dark-warm` |
| Body lead | 11–12pt | 400 | 1.50–1.55 | intro paragraphs |
| Body | 10–10.5pt | 400 | 1.45–1.55 | reading body |
| Body dense | 9.2pt | 400 | 1.42 | resume / one-pager |
| Caption | 8.5–9pt | 400 | 1.45 | notes, captions |
| Label | 9pt | 600 | 1.35 | tags, small labels |
| Tiny | 9pt | 400 | 1.40 | footer, metadata |

Screen ≈ pt × 1.33 (9pt ≈ 12px). Web text floor 12px; slide captions ≥24px.
Actual template body values: one-pager `10pt/1.45/0.3pt`, long-doc
`10.5pt/1.55/0.3pt`, slides `13pt/1.55/0.3pt`, landing page `15px/1.58/0.4px`,
site `14px/1.55` `letter-spacing: 0` (EN).

**CN vs EN H1 optical adjustment** (`one-pager.html:96-106` comment): CN H1
24pt with line-height 1.15 vs EN 26pt / 1.12 "so optical density stays aligned".

### 3.3 Weights

- Serif body **400** (W04), headings **500** (W05 real bold file, never synthetic)
- `strong { font-weight: 500 }` in long-doc — locks bold to W05
- Sans labels/small titles 500–600
- **Forbidden**: 900 black, 100 thin, and synthetic 600/700 on serif
- KO adds `font-synthesis: none;`

### 3.4 Line-heights

Tight headline 1.10–1.30 · dense body 1.40–1.45 · reading body 1.50–1.55 ·
label/caption 1.30–1.40 · CJK screen body (slides) 1.55–1.65. Forbidden:
1.60+ on print body, 1.00–1.05.

### 3.5 Letter-spacing

Body 0 (EN); **CN/JA body with TsangerJinKai02: `0.3pt`** (baseline every CN/JA
template ships); CN lede 14–22pt: 0.03–0.06em; CN/JA display 24pt+: 0.2–1pt;
labels <10pt +0.2–0.5pt; all-caps overlines +0.5 to +1pt mandatory; slide scale
halves print tracking. `design.md`: "letter-spacing matters more than font-size
for CJK density."

### 3.6 CJK handling summary

TsangerJinKai02 (a 楷体/kai print face) primary for zh-CN; YuMincho best-effort
for JA; Source Han Serif K for KO; every CJK stack carries Songti SC/STSong
fallbacks; mono stack always re-appends the CJK serif; CJK body copy gets
0.3pt tracking; `@page` running footers declare the CJK stack too.

---

## 4. Spacing, Layout, Borders, Radii, Shadows

### 4.1 Spacing scale (design.md §3) — base unit **4pt/4px**

| Tier | Value | Use |
|---|---|---|
| xs | 2–3pt | inline adjacent elements |
| sm | 4–5pt | tag padding, dense layout |
| md | 8–10pt | component interior |
| lg | 16–20pt | between components / card padding |
| xl | 24–32pt | section-title margins |
| 2xl | 40–60pt | between major sections |
| 3xl | 80–120pt | between chapters |

Long-doc rhythm tokens: `--rhythm-module: 14pt; --rhythm-section: 18pt;`
(`long-doc.html:77-78`). Slide padding baseline `--slide-pad: 80px`. Screen
section rhythm: 96/72 desktop, 72/54 tablet, 56/42 phone
(`design.md` §11).

### 4.2 A4 page margins (design.md §3)

| Document | Top | Right | Bottom | Left |
|---|---|---|---|---|
| Resume (dense) | 11mm | 13mm | 11mm | 13mm |
| One-Pager | 15mm | 18mm | 15mm | 18mm |
| Long Doc | 20mm | 22mm | 22mm | 22mm |
| Letter | 25mm | 25mm | 25mm | 25mm |
| Portfolio | 12mm | 15mm | 12mm | 15mm |

Slides: `@page 280mm × 158mm`, padding `16mm 20mm`; page background set on
`@page` so the warm tone extends past the margin box (`long-doc.html:34-38`).

### 4.3 Borders

**Hairline-only system.** Exact widths found in templates:
- table header / total rule: `0.6pt solid var(--border)`
- table body row: `0.25pt solid var(--border)`
- one-pager header rule: `0.5pt solid var(--border)`
- dotted hairlines: `0.3pt dotted var(--border)` — TOC rows, metric strip, one-pager footer (`one-pager.html:136,328`)
- 0.3pt solid: value-anchor separators, module-head hairline
- screen: `1px solid var(--border-soft)` for section dividers, cards, inputs; `1.5px` button borders

Rule (`design.md` «Subtractive»): a line only earns a place separating content,
encoding state, or carrying data. **No decorative ticks, short cover rules,
heading side bars, quotation side bars, callout accent edges.**

### 4.4 Radii

Print: **2–6pt range**; screen 8px+ reserved for screen surfaces only.
- 2pt: inline `code`, recede tags, funnel track
- 3pt: callout, tag (one-pager), takeaway (long-doc)
- 4pt: cards, `pre` block, figure images, `.tag` default
- 5pt: product-shot frame
- 6pt: exec-summary, site code blocks
- 8px: cards (screen), gallery frame, buttons, lang menu
- **999px pills**: landing CTAs
- Closed sub-1pt border + radius is forbidden (WeasyPrint double ring + lint)

### 4.5 Shadows

**Flat by default — "whisper shadows" only for floating things.** The only
shipped shadows:
- Product screenshot frame (`one-pager.html:173`):
  `box-shadow: 0 1.5pt 6pt rgba(20, 20, 19, 0.16);`
- Site language menu (`site/styles.css:137`):
  `box-shadow: 0 8px 24px rgba(20, 19, 19, 0.08);`
- Forbidden pattern (documented): `box-shadow: 0 2px 8px rgba(0,0,0,0.3)` and relatives; no card hover elevation.

### 4.6 Cards / containers

```css
.card {
  background: var(--ivory);
  border-radius: 4pt;
  padding: 16pt 20pt;
}
```
"A lifted surface is carried by the fill, not by an outline" — no closed
hairline on cards. Same for `.callout` (ivory + 3pt radius + padding only).

---

## 5. Structural / Editorial Patterns

- **Document header signature** (`design.md` §4): uppercase **eyebrow** text →
  serif title → right-aligned meta → optional `0.5pt` full-width hairline
  closing the block. Used by one-pager, changelog, equity-report, long-doc
  cover. No leading tick, no centered version block, no short decorative rule.
- **Cover (long-doc)**: 36pt serif 500 title, left-aligned, `cover-eyebrow`
  10pt brand uppercase +1.5pt tracking, subtitle `--olive`, meta bottom
  (author/version/date), heavy whitespace; `break-after: page`.
- **Eyebrow / overline**: uppercase; brand or stone; +0.4pt→2pt tracking;
  `text-transform: uppercase`; the mono `.eyebrow` on slides is 9.5pt mono,
  +2pt tracking, stone.
- **Small-caps / numbered sections**: screen pages number sections
  `00 · Label` … `04 · Label` with `section-num` (brand serif 500 14px,
  `design.md` §11; live in `site/index-zh.html`: "00 · See it", "01 · Usage",
  "02 · 常见问题", "03 · Background", "04 · Manifesto"). Chapter numerals in
  print: `.chapter-num` / `.toc-num` brand 10pt, +1pt tracking, uppercase.
- **TOC**: dotted `0.3pt` hairlines between rows, brand-colored numbers,
  auto page numbers via `target-counter(attr(href), page)`.
- **Blockquote / quote**: indented olive serif text, `margin: 12pt 16pt`,
  `padding: 4pt 0`, **no fill, no side rule**; `.cite` small stone. Callout
  variants `.callout`/`.takeaway` = ivory fill + radius, label uppercase brand.
- **Lists**: native markers, brand-colored — `ul li::marker { color: var(--brand) }`,
  `ol li::marker { color: var(--brand); font-weight: 500 }`. `ul.dash` is an
  alias that renders the **native disc** (explicitly no `::before` en-dash fake).
- **Tables**: hairline hierarchy (0.6pt header/total, 0.25pt body), left-aligned
  headers 500 `--dark-warm`, no vertical rules, no tinted headers, no frames.
  Variants: `.compact` (8pt, 3/2.5pt padding), `.financial` (right-align +
  `tabular-nums`), `.striped` (ivory even rows, only 8+ rows), `.total` row.
- **Code**: inline `code` = ivory bg, 2pt radius, no border, `--dark-warm`;
  `pre`/`.code-block` = ivory fill, 4pt radius print / 1px+6px screen, mono 9pt
  print / 13.5px screen, `white-space: pre-wrap` in print, tabular-nums.
  Syntax: keyword `--brand`, comment `--stone`, string `--olive`, number
  `--dark-warm`, function/class `--near-black` (print); dark-surface palette
  for screen.
- **Link underline style**: print/landing = **no underline**, brand color,
  hover → brand-light; prose doc pages: underline on hover only
  (`site/styles.css:964-971`). Brand color on non-links is forbidden.
- **Metrics**: transparent baseline flex row; value = serif 500 brand
  `tabular-nums`; label stone/olive; `.metric-suffix` 0.58em offset; landing
  page stacks vertically.
- **Tags**: solid `--tag-bg`, uppercase, 9pt 500–600, 1pt 5-6pt padding,
  2–4pt radius, +0.3–0.4pt tracking.
- **Footer**: hairline top, 9pt stone, space-between (left label / right page
  or URL), `letter-spacing: 0.3pt`; long-doc `@bottom-center` running footer
  `counter(page) " · " title` in the serif stack.
- **Pagination hygiene**: `break-inside: avoid` on cards/metrics/quotes/code/
  tables; `h1,h2,h3 { break-after: avoid }`; `widows/orphans`; `.page-break`.
- **Hero product shot** (one-pager): one real screenshot in a `overflow:hidden`
  rounded frame with the whisper shadow, `object-fit: cover`, single factual
  caption.

---

## 6. Reusable CSS (verbatim blocks)

**A. Canonical tokens — `skills/kami/references/tokens.json`** (quoted fully in §2.1).

**B. Full site token root — `site/styles.css:18-43` (verbatim, includes dark tokens + all stacks):**

```css
:root {
  --parchment:    #f5f4ed;
  --ivory:        #faf9f5;
  --warm-sand:    #e8e6dc;
  --inline-code-bg: #f0eee6;
  --dark-surface: #30302e;
  --deep-dark:    #141413;

  --brand:        #1B365D;
  --brand-light:  #2D5A8A;

  --near-black:   #141413;
  --dark-warm:    #3d3d3a;
  --olive:        #504e49;
  --stone:        #6b6a64;

  --border:       #e8e6dc;
  --border-soft:  #e5e3d8;

  /* Slide-scale spacing */
  --slide-pad:    80px;

  --serif: Charter, Georgia, "TsangerJinKai02", "Source Han Serif SC", "Source Han Serif CN", "Noto Serif CJK SC", "Noto Serif SC", "Songti SC", Palatino, serif;
  --sans: var(--serif);
  --mono: "JetBrains Mono", "Fira Code", "SF Mono", Consolas, Monaco, monospace;
}
```
plus per-locale overrides: `html[lang="zh-CN"]` swaps `--serif` to the
TsangerJinKai02-first stack; `html[lang="ja"]` uses the YuMincho stack and
`--olive: #4d4c48`; `html[lang="zh-Hant"]` uses「Source Han Serif TC」;
`html[lang="ko"]` uses the Nanum/Source Han Serif K stack and `--olive: #4d4c48`.

**C. Landing-page token root — `skills/kami/assets/templates/landing-page.html:79-108` (verbatim):**

```css
:root {
  --parchment:    #f5f4ed;
  --ivory:        #faf9f5;
  --inline-code-bg: #f0eee6;
  --warm-sand:    #e8e6dc;

  --brand:        #1B365D;
  --brand-light:  #2D5A8A;
  --brand-tint:   #EEF2F7;

  --near-black:   #141413;
  --dark-warm:    #3d3d3a;
  --olive:        #504e49;
  --stone:        #6b6a64;

  --border:       #e8e6dc;
  --border-soft:  #e5e3d8;
  --line:         #d8d5c8;

  --serif: "TsangerJinKai02", "Source Han Serif SC", "Source Han Serif CN",
           "Noto Serif CJK SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun",
           Georgia, serif;
  --sans:  var(--serif);
  --mono:  "JetBrains Mono", "SF Mono", Consolas,
           "TsangerJinKai02", "Source Han Serif SC",
           monospace;
  --latin-ui: "PingFang SC", system-ui, -apple-system, sans-serif;

  --shot-bg: #141318;
}
```

**D. Marp theme — `skills/kami/assets/templates/marp/slides-marp.css:22-55`:** same
14 tokens (`--parchment`…`--border-soft`, `--brand-tint`), `--serif` CJK mega-stack
(CN+KR), `--mono` with CJK fallback, `--rhythm-module/--rhythm-section`, and
`section { width: 280mm; height: 158mm; padding: 16mm 20mm; background: var(--parchment);
font-family: var(--sans); font-size: 13pt; line-height: 1.55; letter-spacing: 0.3pt; }`.

**E. Print core rules — `skills/kami/assets/templates/long-doc.html:63-95`:** `:root`
core subset (parchment→border-soft + `--tag-bg`), `@page { size: A4; margin: 20mm 22mm 22mm 22mm; background: #f5f4ed; }`, and

```css
body {
  color: var(--near-black);
  font-family: var(--serif);
  font-size: 10.5pt;
  line-height: 1.55;
  letter-spacing: 0.3pt;
  widows: 3;
  orphans: 3;
}
```

---

## 7. What Makes Kami Distinctive (vs generic "paper/editorial" themes)

1. **Serif-only identity with `--sans: var(--serif)`.** One typeface family per
   page — body and headings are the same face, differentiated purely by size,
   weight 400/500, and margins. Generic paper themes usually pair serif body
   with a separate sans UI; Kami refuses a second family even for labels.
2. **Weight discipline: 400/500 only, no bold, no italic in print.** `strong
   { font-weight: 500 }` binds bold to the W05 real-bold file; `font-style:
   italic` is banned from every PDF template (landing page only). "Ink-blue
   carries focus" — emphasis is a color change, not a weight/face change.
3. **The ink-blue ≤5 % surface rule and single-accent law** with exactly one
   documented exception (the warm breaking chip) — enforced by a token-drift
   linter, not just prose.
4. **TsangerJinKai02 (仓耳今楷02) primary CN face** — a modern 楷体 (kai)
   brush-print font. This is the single most identifying trait vs:
   - Western paper themes (Charter/Georgia serif, no CJK)
   - generic Chinese "宋体/Songti academic" themes (STSong/SimSun)
   Kami reads like a *hand-set Chinese print job*, not a Word-style document.
5. **Print-engineering rigor normally invisible in themes**: `@page` background
   extending past margins (no white print edges), `target-counter()` live TOC
   page numbers, `widows/orphans: 3`, `break-inside: avoid` cascades, solid-hex
   tag tints instead of `rgba()` (a documented WeasyPrint double-rectangle
   bug), `font-synthesis: none`, and a PDF font gate check.
6. **Warm-gray rigor**: every gray has R≈G>B (yellow-brown undertone); `#141413`
   near-black instead of `#111/#000`; mnemonic "cool grays are forbidden" —
   even `#f8f9fa` is banned as a surface.
7. **Documented editorial machinery**: `.metric` baseline value rows with
   `tabular-nums`, `0.3pt` dotted hairlines for TOC/metric/footer separators
   (dotted rules are otherwise rare), uppercase mono eyebrows on slides
   (9.5pt mono +2pt tracking), numbered **`00 · Label`** screen sections,
   "header signature" pattern (eyebrow→title→meta→hairline), and a
   subtractive rule list that explicitly deletes decorative ticks/side bars.
8. **Print sizes in pt with mm page geometry + a deliberate pt for
   screen** convention, plus a slide recipe where "micro scale halves, macro
   scale multiplies ×1.6" — a system designed around WeasyPrint A4, which is
   why its tokens transfer so cleanly to PDF rendering pipelines.
9. **Anti-future stance**: SKILL.md's "When not to use" lists dark/cyberpunk/
   neon, saturated multi-color, and web-app UI. It is deliberately flat,
   warm, and print-adjacent — dark mode is not part of the identity at all.
10. **CJK-first typographic tuning** — 0.3pt body tracking, CN H1 24pt vs EN
    26pt optical compensation, YuMincho `--olive` darkening, JA display
    spacing — i.e. the palette/scale is calibrated on CJK glyphs first, not
    Latin.

**Everything you asked about that does NOT exist, plainly:** no dark mode, no
success/warning/error color set, no gradient usage, no closed-border cards, no
pure-white canvas, no bold-heavy weights, no italics in print, and no CSS file
in the repo that is *only* tokens (tokens live in `references/tokens.json`
for linting, and are copied verbatim into each template's `<style>` `:root`
and into `site/styles.css`).