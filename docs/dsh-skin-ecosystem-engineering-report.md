# How third-party themes/plugins for DeepSeek Harness (DSH) are engineered and distributed

Engineering report compiled from live clones (`/tmp/research-skins/`) of `kingOfSoySauce/dsh-skin-market`, `dsh-market/dsh-market`, `RayYeung1989/claude-parchment-theme`, `WuWL-98/dsh-theme-paper`, `ZJUZhiyuCai/dsh-ivory`, `PAKIKNOWLEDGE/dsh-client-ui-skin-claude`, plus the installed harness at `~/.local/lib/node_modules/@deepseek-ai/dsh/` (where `@deepseek-ai/dsh-client-ui-theme` ships). All quotes are verbatim from those files. Facts I could not verify are marked **unverified**.

---

## 1. `dsh-skin-market` — what it is exactly

It is **all four things at once**, but its essence is a **DSH web-profile plugin** ("native skin marketplace and lifecycle manager") whose repository doubles as the **crowd-sourced registry** and whose GitHub Pages deployment is the **online catalog**.

| Surface | What it is |
|---|---|
| DSH plugin | npm package `dsh-skin-market` (v0.1.49 at clone time), installed with `dsh plugin --profile web add "dsh-skin-market@latest"`. Renders "设置 → 皮肤市场" in the settings page; installs/activates/deactivates/updates/uninstalls skins by spawning `dsh plugin --profile web add/remove …` (and `pnpm add` for Windows `&path:` targets) against the profile. |
| Registry (machine-readable) | `registry/skins/<owner>__<repo>.yml` — **one YAML file per skin** (302 entries at clone time). JSON Schema at `registry/skin.schema.json`. Generated aggregate: `data/catalog.json` (`schemaVersion: 1`, 300 skins + `npmSources`), published to GitHub Pages. |
| Website | static site in `site/` deployed to `https://kingofsoysauce.github.io/dsh-skin-market/`, generated from the same catalog. |
| Ops pipeline | `scripts/hydrate-submission.mjs` + `scripts/build-registry.mjs` + GitHub Actions (`registry-pr.yml` validates PRs touching `registry/skins/**`; `sync-catalog.yml` re-generates the catalog; `pages.yml` builds the site + WebP media). |

It is **not** itself a CLI installer; it drives the real DSH CLI (`src/install-command.ts`):

```ts
// src/install-command.ts
export function createDshPluginAddCommand(target: string, profile = 'web'): string {
  return `dsh plugin --profile ${profile} add ${quoteInstallTarget(target)}`
}
```

### Repo structure

```
dsh-skin-market/
├── package.json            # npm manifest with "dsh" fields (see below)
├── cordis.patch.yml        # - insert: - id: dsh-skin-market / name: dsh-skin-market
├── registry/
│   ├── skin.schema.json    # JSON Schema for one registry entry
│   └── skins/*.yml         # 302 entries, one per skin, name = <owner>__<repo>.yml
├── data/catalog.json       # generated aggregate (schemaVersion 1) — shipped in the package
├── site/                   # GitHub Pages online market
├── src/                    # TS host: catalog-wire, install-resolution, lifecycle,
│   │                       #   loader-ownership, pnpm-compat, reset, self-update, …
│   └── client/             # client plugin: SkinMarketSection.tsx, catalog-cache.ts, …
├── client/client.js        # committed __ModuleLoader__ bundle (tsdown)
├── lib/                    # compiled host (tsc)
├── scripts/                # build-registry.mjs, hydrate-submission.mjs, skin-health.mjs, …
├── docs/recently-added.md  # human-readable submission log
└── .github/workflows/      # registry-pr.yml, sync-catalog.yml, pages.yml
```

Its own `package.json` `dsh` field (verbatim):

```json
"dsh": {
  "bundle": {
    "patch": "./cordis.patch.yml"
  },
  "client": {
    "inject": [
      "@deepseek-ai/dsh-client-runtime",
      "@deepseek-ai/dsh-client-locale",
      "@deepseek-ai/dsh-client-ui-settings"
    ],
    "platform": "web"
  }
}
```

### Machine-readable registry — exact schema of one entry

**YAML entry** — the live source of truth. `registry/skins/RayYeung1989__claude-parchment-theme.yml` printed verbatim:

```yaml
id: rayyeung1989.claude-parchment-theme
name:
  zh: claude-parchment-theme
  en: claude-parchment-theme
author: RayYeung1989
description: 一款 Claude 风格的 dsh插件：为 DSH WebUI 打造，暖羊皮纸 Parchment 色板、Terracotta 品牌色与衬线字体
repo: https://github.com/RayYeung1989/claude-parchment-theme
package: "@dsh-local/claude-parchment-theme"
rowId: ui-claude-theme
category: theme
tags:
  - motion
  - token-theme
  - light-dark
modes:
  - light
  - dark
install:
  target: github:RayYeung1989/claude-parchment-theme#824cef053f1cabcfaca93ae6b63261f66279f238
  version: 1.0.0
  commit: 824cef053f1cabcfaca93ae6b63261f66279f238
compatibility:
  dsh: unverified
  platform:
    - web
screenshots:
  - https://opengraph.githubassets.com/placeholder/rayyeung1989.claude-parchment-theme
review:
  compatibility: unverified
  preview: repository-card
  installation: verified
health:
  status: improvements
  checks:
    readmeScreenshots: improve
    compatibility: improve
    installation: pass
    installCommand: improve
    topic: pass
  suggestions:
    - 建议在 README 中加入至少一张仓库内的真实界面截图，并让图片路径随仓库一起版本化，方便用户预览和市场稳定展示。
    - 建议在 README 或 package.json 中明确声明支持的 DSH Web 版本范围（例如 0.1.0-rc.6 或兼容区间），方便用户在安装前确认环境。
    - 建议在 README 中补充可复制的 DSH 安装命令，方便用户直接使用。
license:
  code: MIT
  commercialUse: true
featuredRank: 91
starsSnapshot: 2
releaseUpdatedAt: 2026-08-16 13:53:45.052000+00:00
metadataUpdatedAt: 2026-08-18 15:43:27.543000+00:00
starsUpdatedAt: 2026-08-28T04:08:55.879Z
updatedAt: 2026-08-28T04:08:55.879Z
```

The most complete entry (includes npm source + static scan) is `registry/skins/TaiyakiOffical__claude-style-skin.yml` — the added fields are `install.desktop` (`managed` npm or `manual-only` + `reason`), `install.npm` (`name/version/integrity/repository/gitHead`), `listScreenshot`, `health.scan` (`commit/packageVersion/scannerVersion/dshVersion/mode/result/checkedAt/findings`), and sometimes `marketScreenshots` (market-captured shots served from the market's own Pages). The schema constraints (`registry/skin.schema.json`) pins: `install.target` must match `^github:[^#]+#[0-9a-f]{40}(?:&path:/[A-Za-z0-9._/-]+)?$`; `modes` ∈ `["light","dark"]`; `compatibility.platform` must contain `"web"`; screenshots must be `https://` or `skin-screenshots/` URIs.

**Generated aggregate** `data/catalog.json`:

```json
{ "schemaVersion": 1, "generatedAt": "...", "skins": [ …300 entries… ], "npmSources": { "<skinId>": { "name": "…", "version": "…", "integrity": "sha512-…", "repository": "https://github.com/…", "gitHead": "<40 hex>" } } }
```

`npmSources` is a backwards-compatible wire layer: older market builds read only GitHub install targets; newer builds verify name/version/integrity/repository/gitHead against the skin entry before preferring npm.

### Exact submission process a theme author must follow

From `README.md` (「收录你的皮肤」) — an author must prepare a **public GitHub repo**, then open **one PR** to `kingOfSoySauce/dsh-skin-market` adding **one YAML file** `registry/skins/<owner>__<repo>.yml`:

```yaml
url: https://github.com/<owner>/<repo>
```

- A monorepo sub-package adds `subpath:` (e.g. `subpath: packages/foo`).
- The thin entry is allowed: "默认只写仓库地址，CI 会补全 package、commit、loader id 和预览图" — CI (`hydrate-submission.mjs` + `build-registry.mjs`) fetches the repo via the GitHub API, reads `package.json` (`dsh.client`/`dsh.bundle` declarations and the loader row from its `cordis.patch.yml` via `scripts/loader-rows.mjs`), pins the install target to the full 40-hex commit, extracts screenshots from `README`/`screenshots.json`, and grades `review`/`health`.
- Requirements (`README.md`「收录要求」): must be public + installable as a DSH Web skin (either a full plugin with `dsh.bundle`, or a pure front-end skin with only `dsh.client` — in which case the market writes the skin's audited `rowId` + package registration rows itself on install); install source pinned to full commit SHA; explicit `package`, `row id`, license, and DSH compat range; preview images must be real screenshots from the repo. Listing ≠ security endorsement.
- The README even ships a copy-paste agent prompt that does steps 1–7 (read-only verify, fork, one thin YAML, `npm run registry:check`, PR titled `feat(registry): add <皮肤名>`).
- PR validation runs `npm run registry:check` (a `--check` mode of `build-registry.mjs`) which hydrates and schema-validates the new entry on CI; once merged to `main`, `sync-catalog.yml` regenerates `data/catalog.json` and deploys the Pages catalog. **Contributors never edit `data/catalog.json`.**

---

## 2. The themes/skins it catalogs

300 skins in `data/catalog.json`, categories: `theme`, `interactive`, `ui`, `wallpaper`, `desktop` etc. To keep the table useful, below are the token-based theme plugins plus the **parchment / paper / Claude / Terracotta** family (description = one-line summary from the registry). npm name = `package` field; `—` = no npm package (GitHub-install only).

| skin id | name | pkg (npm) | repo | one-line description (from registry) |
|---|---|---|---|---|
| `rayyeung1989.claude-parchment-theme` ★ | claude-parchment-theme | `@dsh-local/claude-parchment-theme` (not on npm) | RayYeung1989/claude-parchment-theme | 暖羊皮纸 Parchment 色板、Terracotta 品牌色与衬线字体 |
| `wuwl-98.dsh-theme-paper` ★ | dsh-theme-paper | `dsh-theme-paper` (not on npm) | WuWL-98/dsh-theme-paper | 纸质仿 claude 主题 (cream paper, ink text, terracotta accents) |
| `zjuzhiyucai.dsh-ivory` ★ | dsh-ivory | `dsh-ivory` 0.2.7 | ZJUZhiyuCai/dsh-ivory | 暖中性色明暗主题，响应式布局，零遥测 |
| `pakiknowledge.dsh-client-ui-skin-claude` ★ | dsh-client-ui-skin-claude | `@pakiknowledge/dsh-client-ui-skin-claude` 0.2.1 | PAKIKNOWLEDGE/dsh-client-ui-skin-claude | 暖黑画布、陶橙点缀、衬线 UI，跟随原生亮/暗主题 |
| `taiyakioffical.claude-style-skin` | claude-style-skin | `claude-style-skin` 0.1.1 | TaiyakiOffical/claude-style-skin | Claude Style 暖象牙 |
| `le-soleil-se-couche.dsh-skin-claude-code` | dsh-skin-claude-code | `@deepseek-ai/dsh-client-ui-skin-claude-code` (not on npm) | le-soleil-se-couche/dsh-skin-claude-code | 复刻 Claude Code 皮肤 |
| `chajiuqqq.dsh-claude-theme` | dsh-claude-theme | `dsh-claude-theme` (not on npm) | chajiuqqq/dsh-claude-theme | DSH 的 claude 风格界面 |
| `kelemiao.dsh-animation-optimization` | dsh-animation-optimization | `dsh-animation-optimization` (not on npm) | kelemiao/dsh-animation-optimization | Claude Code 风格外观 + 思考块/工具输出流式化 |
| `sweetcandy-gift.dsh-beige-theme` | dsh-beige-theme | `dsh-beige-theme` (not on npm) | SweetCandy-gift/dsh-beige-theme | 面向长期 AI 编程的温暖米黄色主题 |
| `ymh0000123.dsh-theme-endfield` | dsh-theme-endfield | `dsh-theme-endfield` (not on npm) | ymh0000123/dsh-theme-endfield | 奶油纸底、墨黑文字、信号黄强调 |
| `zhang66633.dsh-pixel-ui` | dsh-pixel-ui | `dsh-pixel-ui` (not on npm) | zhang66633/dsh-pixel-ui | 四主题切换，含「像素·羊皮纸」 |
| `eachsheep.dsh-valley-pixel-skin` | dsh-valley-pixel-skin | `dsh-client-ui-skin-valley-spring` (npm) | EachSheep/dsh-valley-pixel-skin | 工作区羊皮纸色半透明表面 |

★ = repos I cloned and disassembled in §3.

Other notable token-theme plugins in the catalog (not deep-dived): dsh-catppuccin (`@nonamelego/dsh-catppuccin`), dsh-ivory-adjacent warm skins, dsh-dracula (`dsh-dracula-theme`), dsh-theme-taffy, dsh-theme-kit (32 palettes), dsh-stylevault (30 open palettes), freestyle-dsh-theme (OKLCH theme designer), dsh-skin-studio (in-browser skin authoring tool, itself a `dsh.bundle` plugin), dsh-skin-lab, dsh-theme-customizer, lxxz1918, dsh-theme-tuner, shawnlone.

---

## 3. Deep-dive: three (plus one) complete theme plugins

### 3.1 `RayYeung1989/claude-parchment-theme` (★ the exact "parchment/Terracotta" skin)

**`package.json`** (verbatim, full file is 40 lines):

```json
{
  "name": "@dsh-local/claude-parchment-theme",
  "version": "1.0.0",
  "description": "一款 Claude 风格的 dsh插件：为 DeepSeek Harness WebUI 打造的 Anthropic Claude 风格主题 —— 暖羊皮纸色板、Terracotta 品牌色、衬线标题、暖调中性灰，覆盖 DSW 全部主题 token",
  "type": "module",
  "main": "lib/index.js",
  "exports": { ".": "./lib/index.js", "./client": "./lib/client.js", "./package.json": "./package.json" },
  "files": ["lib"],
  "dsh": {
    "client": {
      "inject": ["@deepseek-ai/dsh-client-ui-theme"],
      "platform": "web",
      "immediately": true
    }
  },
  "keywords": [ "dsh-plugin", "dsh", "deepseek-harness", "theme", "claude", "anthropic" ],
  "license": "MIT"
}
```

Note: no `dsh.bundle`, no `cordis.patch.yml` — this is the **pure `dsh.client` "double-faced" package** the market README describes (host half is an inert carrier so the browser half reaches the loader module table). `dsh.client.immediately: true` appears only here among my samples (**unverified** what the flag does — presumably "load before shell hydration", matching its anti-FOUC goal).

**File layout** (the whole repo):

```
claude-parchment-theme/
├── package.json
├── lib/index.js     # host: export function apply() {} // no-op
├── lib/client.js    # committed hand-written client bundle (285 lines)
├── README.md / README.en.md / LICENSE
```

**Registration + CSS injection** (`lib/client.js`): registers via the ModuleLoader contract (§4); exports `exports.apply`. Inside `apply(ctx)`:

```js
function apply(ctx) {
  // 核心 13 token：theme Service 覆盖层（存在时使用；CSS 已自带兜底）
  const theme = ctx.get('theme')
  if (theme !== undefined) {
    ctx.effect(() => theme.overrideTokens('claude-parchment', ALIAS), 'claude-parchment: token layer')
  }
  // 全局样式表（持久化标签，卸载时自动移除）
  ctx.effect(() => {
    const tagId = '@dsh-local/claude-parchment-theme/theme.css'
    if (typeof document !== 'undefined' && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      const tag = document.createElement('style')
      tag.dataset.plugin = '@dsh-local/claude-parchment-theme'
      tag.dataset.pluginCss = tagId
      tag.textContent = CSS
      document.head.appendChild(tag)
      return () => tag.remove()
    }
    return () => {}
  }, 'claude-parchment: stylesheet')
}
```

So: **yes, it writes a `<style>` tag into `document.head`**, deduped by `data-plugin-css` attribute, torn down by returning a disposer from `ctx.effect`. **And** it calls `theme.overrideTokens(source, tokens)` so the 13 core alias tokens go through the theme service layer. The `overrideTokens` value shape is `{ light: '#f5f4ed', dark: '#141413' }` — which the harness's `@deepseek-ai/dsh-client-ui-theme` **requires** (`validateOverrides` throws on a bare string: "pass { light, dark } … a single value goes illegible when the user switches color scheme"). The same bundle *also* emits the pair objects into the light-mode CSS via `pairCss(ALIAS)` (which stringifies to `[object Object]` — an apparent minor bug in the CSS fallback; the theme-service layer is what actually works; flagged as **observation, not runtime-verified**).

**Light/dark**: pure CSS-based, keyed off the attribute the **host** sets — `body[data-ds-dark-theme] { … }` block with `darkCss` + `EXTRA_DARK` + same warm statics re-declared at higher specificity ("基础 CSS 在暗色块重复声明了全部静态色（特异性更高），必须在此再覆盖一次"). It does **not** touch `@deepseek-ai/dsh-client-ui-theme`'s `preference` and never calls `setTheme` — it overrides tokens for whichever active scheme is resolved. Also sets serif fonts via `--dsw-font-*` and `--ds-font-family-code`, terracotta `::selection`, focus ring.

**Enable/disable/uninstall** (README): install = `pnpm add "github:RayYeung1989/claude-parchment-theme"` in `$DSH_HOME/profiles/web` **plus** appending to the profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: ui-claude-theme
      name: '@dsh-local/claude-parchment-theme'
```

then restart DSH web. Disable = toggle the row in 设置 → 插件管理 or remove the patch block; uninstall = remove dependency + patch lines. **No build step** — the bundle is committed; installation is instant. Not on npm (E404 verified). Install command in README is the manual `pnpm add github:…` + patch edit (the market version does it one-click because it writes the row for `dsh.client`-only skins).

### 3.2 `WuWL-98/dsh-theme-paper`

**`package.json`** `dsh` field (verbatim):

```json
"dsh": {
  "bundle": { "patch": "./cordis.patch.yml" },
  "client": {
    "platform": "web",
    "inject": ["@deepseek-ai/dsh-client-ui-theme", "@deepseek-ai/dsh-client-locale", "@deepseek-ai/dsh-client-runtime"]
  }
}
```

Full plugin shape: `dsh.bundle.patch` + `dsh.client`. `cordis.patch.yml`:

```yaml
# dsh-theme-paper bundle patch: inserts the plugin entry.
# A package declaring dsh.bundle.patch becomes a profile bundle layer:
# "dsh plugin --profile web add <this-package>" installs it AND activates it.
- insert:
    - id: theme-paper
      name: dsh-theme-paper
```

**File layout**: `package.json`, `cordis.patch.yml`, `lib/index.js` (inert `export function apply() {}`), `lib/client.js` (280-line committed bundle), `install.ps1`, `docs/*.png`, `README.md`.

**Registration + CSS injection**: fully service-based — `theme.register({ id: "paper", colorScheme: "light", tokens: PAPER_TOKENS })`, then `theme.setTheme(id)`; a 102-token light palette. Plus a module-level injected stylesheet for the Appearance-row UI (scoped `body[data-ds-paper-theme]` with the same `style[data-plugin-css="dsh-theme-paper/paper.css"]` dedupe; note the header comment that the loader "removes plugin-owned tags on unload", and the shell ships a same-key boot mirror to avoid first-paint flash).

**Light/dark & preference**: this is the key contrast with 3.1 — it **does** interact with the built-in Appearance preference. It shadows the native appearance row at the same `settings.general.item` slot with `priority: -1` (side note: the native row registers `id: "appearance", order: 10`; `order` alone is used by the claude skin and others, `priority` is the cordis-level tiebreak) and renders **4 cubes: 浅色 / 深色 / 跟随系统 / 纸质**. Selecting 纸质 saves the prior real preference to `localStorage["dsh.ui-theme.paper.previous"]`, sets `localStorage["dsh.ui-theme.paper"]="1"`, and calls `theme.setTheme("paper")`. It mirrors the theme snapshot:

```js
const sync = (snapshot) => { bound?.sync(snapshot.preference, snapshot.revision) }
const manageAttribute = (snapshot) => {
  if (typeof document === "undefined" || document.body === null) return
  document.body.toggleAttribute("data-ds-paper-theme", snapshot.active.id === "paper")
}
```

and it listens on `ctx.on("theme/change", onThemeChange)`; if the platform re-adopts the persisted light/dark/system preference while the paper flag is set, it re-asserts `theme.setTheme("paper")`. (So `preference` is a string that can be any theme id, not just light/dark/system — `buildSnapshot` resolves `preference === "system"` via the media query else looks up `themes.find(t.id === preference)`.) It sets its **own** body attribute `data-ds-paper-theme`, and stays a light-only theme (`colorScheme: "light"`).

**Enable/disable/uninstall** (README): install = `dsh plugin --profile web add github:WuWL-98/dsh-theme-paper` (or `add <local path>`; Windows junction script `install.ps1`; manual = junction into `~/.dsh/profiles/web/node_modules/dsh-theme-paper` + add to `dsh.profile.bundles`). README quotes the exact manual bundle registration:

```json
"dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-theme-paper"] } }
```

Uninstall = `dsh plugin --profile web remove dsh-theme-paper`; disable temporarily = add `disabled: true` to its patch row:

```yaml
- id: theme-paper
  name: dsh-theme-paper
  disabled: true
```

**Build step**: the committed `lib/client.js` is the only artifact (repo has no bundler config); `package.json` has no build script. Not on npm (E404 verified).

### 3.3 `ZJUZhiyuCai/dsh-ivory` (healthiest repo: CI, SECURITY.md, ARCHITECTURE.md, QA suites)

**`package.json`** `dsh` field (verbatim):

```json
"dsh": {
  "bundle": { "patch": "./cordis.patch.yml" },
  "client": {
    "inject": [
      "@deepseek-ai/dsh-client-runtime",
      "@deepseek-ai/dsh-client-locale",
      "@deepseek-ai/dsh-client-ui-settings",
      "@deepseek-ai/dsh-client-ui-slots"
    ],
    "platform": "web"
  }
}
```

Version 0.2.7, published on npm as `dsh-ivory`. `cordis.patch.yml`: `- insert: - id: dsh-ivory / name: 'dsh-ivory'`. Peer deps constrain the client DSH modules to `>=0.1.0-rc.6 <0.2.0` — this is ivories' own version-compatibility statement.

**File layout**: repo has `src/skin.css` (100 KB source!), `src/client.template.js`, `src/markdown.js` and a **generator** `scripts/build.mjs` that splices them into the committed `lib/client.js` (1171 lines, "generated — do not edit by hand"). Build = `npm run build` (no bundler; a deterministic hand-rolled splice, so GitHub installs and npm installs get byte-identical artifacts without a build permission).

**Registration + CSS injection**: `ensureStyle()` injects `<style data-plugin data-plugin-css="dsh-ivory">` into `document.head` (SKIN_CSS + SETTINGS_CSS), and toggles `body` class `dsh-ivory` (+ optional `dsh-ivory-focus`). It also `ctx.slots.inject('settings.section', …)` for an "Ivory Theme" settings section and registers zh/en dictionaries via `ctx.locale`. Teardown: one `ctx.effect(() => () => { … })` disconnects observers and removes the classes ("dsh-ivory: cleanup"); the style tag is **not** in a `ctx.effect` disposer but self-healed by a MutationObserver: it watches `document.head` childList (the loader/HMR can drop plugin-owned tags) and `data-ds-dark-theme` attribute flips, re-injecting the tag — the README notes "While the body class survives theme flips, the style tag may not”.

**Light/dark**: ivory does **not** use the `theme` service at all (no theme.inject) — it uses **localStorage `dsh-ivory.enabled` (default ON), keeps its own `--cl-*` custom-property namespace** (`--cl-page`, `--cl-surface`, `--cl-ink`, `--cl-accent` …) re-declared under `body.dsh-ivory` and `body.dsh-ivory[data-ds-dark-theme]`, plus overrides of ~80 `--dsw-alias-*` tokens, and a MutationObserver on the host's `data-ds-dark-theme` attribute. Precisely the difference from the parchment theme: parchment consumes the host attribute *in CSS only*; ivory *observes* the attribute and re-probes.

**Enable/disable/uninstall**: `dsh plugin --profile web add dsh-ivory` / `add github:ZJUZhiyuCai/dsh-ivory#v0.2.7` / dev `add link:$PWD` / `remove dsh-ivory`. Hard-refresh needed after install.

### 3.4 bonus: `PAKIKNOWLEDGE/dsh-client-ui-skin-claude` (hand-written official-shape skin, bundled fonts)

`package.json` `dsh`:

```json
"dsh": {
  "bundle": { "patch": "./cordis.patch.yml" },
  "client": { "platform": "web" }
}
```

No `inject` list; instead the bundle does `require('react')`, `require('react/jsx-runtime')`, `require('@deepseek-ai/dsh-client-store')`, `require('@deepseek-ai/dsh-client-ui-primitives')` and declares `exports.inject = ['slots','locale']` at the end. Includes a `skin.json` metadata file (`id: "claude"`, `bodyAttr: "data-dsh-claude"`, palette docs) and `fonts/Anthropic*.ttf` (fonts are **not** shipped in the npm tarball — the README says the user must install fonts manually; font files are Anthropic-licensed, not MIT). CSS is a 400-line array joined into one `<style id="dsh-skin-claude-style">` injected on apply; body attributes `data-dsh-claude` + `data-dsh-font`; title pinned to "Claude · DeepSeek Harness"; **all** writes retracted by the single `ctx.effect` disposer (checks `document.title === SKIN_TITLE` before restoring, so it never clobbers a session title). Light/dark via the host attribute (`body[data-dsh-claude]:not([data-ds-dark-theme]) { … }`). Registers a `settings.general.item` row (`id: 'claude-skin-font', order: 40`) for font mode, persisted in localStorage (deliberately, because "DSH's Host settings wire only exposes allowlisted namespaces to browser clients"). Install: `dsh plugin --profile web add @pakiknowledge/dsh-client-ui-skin-claude` (npm 0.2.1) — README explicitly warns to uninstall `dsh-anthropic-fonts` first to avoid double font variables.

---

## 4. The exact client-plugin bundle contract

The loadable format — verified from **five** independent real bundles (dshmarket, dsh-skin-market, claude-parchment, dsh-theme-paper, dsh-ivory, dsh-client-ui-skin-claude) and enforced by the market's own `scripts/preflight.mjs`:

```js
window.__ModuleLoader__.load({ id: "<npm package name>", factory: (require) => { … } })
```

Preflight (`dsh-market/scripts/preflight.mjs`) asserts the file **starts with exactly** `window.__ModuleLoader__.load({ id: "dshmarket"` and that `cordis.patch.yml` inserts by the package name; `dsh-market/scripts/normalize-client-banner.mjs` says the published contract is the *one-line* prefix, and that hosts sniff the loader id from the file head.

**Real minimal example — `dsh-market/client/client.js` first 45 lines** (verbatim; prettier-formatted by the repo's normalize step):

```js
window.__ModuleLoader__.load({ id: "dshmarket", factory: (require) => {


		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		…rolldown commonjs helpers…
		//#endregion
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		_deepseek_ai_dsh_client_ui_primitives = __toESM(_deepseek_ai_dsh_client_ui_primitives, 1);
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom = require("react-dom");
		//#region src/client/locales.ts
		…
```

(hand-written cousin, `dsh-client-ui-skin-claude/lib/client.js`: `window.__ModuleLoader__.load({\n  id: '@pakiknowledge/dsh-client-ui-skin-claude',\n  factory: (require) => {\n    'use strict'\n    var module = { exports: {} }\n    var exports = module.exports`.)

**What `factory(require)` receives**: a `require` bound to the host's **loader module table** of externals — the platform seed packages: `react`, `react/jsx-runtime`, `react-dom`, and the `@deepseek-ai/dsh-client-*` client packages (in dsh-market's `tsdown.config.ts`: `CLIENT_EXTERNALS = ['react','react/jsx-runtime','react-dom','@deepseek-ai/dsh-client-ui-primitives']`, and `noExternal` inlines **everything else** into the bundle). Anything the table can't answer must be inlined at build time ("a require() the table cannot answer is a guaranteed runtime throw").

**What it must return/export**: the factory runs in a CommonJS-ish wrapper (`var module = {exports:{}}`, `var exports = module.exports`) and must set `exports.apply` (and optionally `exports.inject`, `exports.name`) — i.e. `module.exports = { name?, inject?: string[], apply(ctx) }`, a plain Cordis plugin object. dsh-theme-paper ends with `exports.apply = apply; exports.inject = inject; return module.exports;`; parchment with `exports.apply = apply`; claude-skin with `exports.inject = ['slots','locale']; exports.apply = apply`.

**CSS**: a plugin may (a) inject its own `<style>` into `document.head` tagged `data-plugin` / `data-plugin-css` (convention used by every theme; the loader removes plugin-owned tags on unload — so `ctx.effect(() => { …append…; return () => tag.remove() })` is the correct teardown, and self-healing observers are needed against HMR), (b) register token layers through the `theme` service (`overrideTokens(source, {light,dark} map)` → disposer, or `register({id, colorScheme, tokens})`), or (c) both. CSS-module-based bundles have their CSS text auto-injected "at factory execution" by the loader, per tsdown's comments ("the loader removes plugin-owned tags on unload").

**Slots**: a client plugin registers UI via `ctx.slots.inject('<slot>', () => ctx.slots.register({ name, id, order?, priority?, store?, locale?, inject? }, Component))`. Real slot names seen in the wild: `settings.section`, `settings.general.item`, `settings.plugin.item`, `shell.overlay`. Locale via `ctx.locale.register(ns, {zh, en})` + `ctx.locale.bind(ns)`; app events via `ctx.on('theme/change', …)`; optional services via `ctx.get('theme')` with fallback.

---

## 5. The `--dsw-*` token surface

**Where the authoritative full list lives**: `@deepseek-ai/dsh-client-ui-theme` (shipped inside the harness install). In the installed copy `…/node_modules/@deepseek-ai/dsh-client-ui-theme/lib/client.js` I count **356 distinct `--dsw-*` names**: 78 `--dsw-alias-*` (alias layer), 11 `--dsw-specific-*`, 73 `--dsw-static-*` (static palette, e.g. `--dsw-static-neutral-bluish-*`, `--dsw-static-deepseek-*`), plus 194 other (fonts `--dsw-font-*`, shadows `--dsw-shadow-*`, linears `--dsw-linear-*`, …). The theme service also **documents the runtime contract in its own source**: `register(definition)` (throws for `id === "system"` or duplicate ids), `setTheme(id)`, `getTheme() → { preference, fontSize, active, themes, revision }`, `overrideTokens(source, tokens)` where **every value must be `{ light, dark }`** (bare strings throw a teaching TypeError), and `theme/change` emitted on `ctx`.

**Tokens overridden by the four studied themes** (complete name sets; values are per-theme):

- **claude-parchment-theme** — 128 distinct names in its bundle: 13 core alias `{light,dark}` pairs (`--dsw-alias-bg-base` `#f5f4ed`/`#141413`, `bg-layer-1` `#faf9f5`/`#30302e`, `bg-layer-2` `#f0eee6`/`#262624`, `bg-overlay`, `border-l1` `#f0eee6`/`#262624`, `border-l2` `#e8e6dc`/`#30302e`, `brand-primary` `#c96442`/`#d97757` = Terracotta/Coral, `label-primary` `#141413`/`#faf9f5`, `label-secondary` `#5e5d59`/`#b0aea5`, `state-error/success/warn-primary`, `specific-sidebar-fill`), ~45 `EXTRA_LIGHT`/`EXTRA_DARK` alias tokens (links `state-business-primary: #c96442`, `button-info-fill`, `interactive-bg-*`, `markdown-*` code/citation/tag, `scrollbar-*`, `specific-bubble`, `specific-menu`, `specific-input-major`, `toast-bg`, `tooltip-bg`, `bg-mask-*`, …), 20 `--dsw-static-neutral-bluish-*` warm remaps (`-600: #87867f` … `-950: #141413`), 10 `--dsw-static-deepseek-*` (brand blue → terracotta `#c96442`/coral `#d97757`), and ~20 `--dsw-font-*` (Georgia serif stack).
- **dsh-theme-paper** — 103 distinct names; 102-token palette per README. Full alias ladder (`bg-base` `#FAF9F5`, `bg-layer-1..3`, `bg-mask-1..3/photo/drop`, `bg-module-platform`, `border-l1..l4`, `brand-primary` `#C96442`, `brand-text` `#3D3929`, `button-*`, `interactive-*`, `label-primary` `#3D3929` / `label-secondary` `#6F6A5E` / `label-tertiary`/`caption`/`dimmed`, `markdown-*`, `scrollbar-*`, `state-*` incl. `state-error-primary #B5442F`, `state-success-*`, `state-warn-*`, `toast-bg`/`tooltip-bg`, `specific-*` incl. `specific-sidebar-fill #F1EEE5`, `linear-gradient-think`, gradients) **plus shiki syntax tokens** `--shiki-token-{constant,string,comment,keyword,parameter,function,string-expression,punctuation,link}` and fonts (`--dsw-font-family` Georgia/Noto Serif SC, `--ds-font-family-code`).
- **dsh-ivory** — 89 distinct names in the bundle; its `src/skin.css` lists 88 `--dsw-*` names (aliases incl. the *new* `--dsw-alias-brand-primary-invert`, `--dsw-alias-button-tool-bar-fill(-invisible)`, `--dsw-alias-label-primary-bluish`, `--dsw-alias-border-l2-darkmode-thin`, `--dsw-alias-state-error-secondary`, plus `--dsw-specific-login-input`, `--dsw-shadow-lv1..3`, `--dsw-font-markdown-*`) **on top of its own `--cl-*` namespace**. Its brand/ink values: light `--cl-page:#fcfcfb`, `--cl-accent:#9a4d12` (burnt amber), dark `--cl-page:#151515`, dark `--cl-accent:#b45309`.
- **dsh-client-ui-skin-claude** — 64 distinct names (alias subset + fonts; values per Anthropic brand: dark bg `#141413`, elevated `#262624`, text `#faf9f5`, accent clay `#d97757`, light bg `#faf9f5`).

The token names differ per skin because DSH's CSS-module class hashes and newly-added alias tokens vary across rc builds — **expect the name set to drift between DSH versions** (ivory's README: verified against a specific revision, with `dshcs-contract-mismatch` degradation).

---

## 6. Known pitfalls / compatibility notes (as documented by these authors)

- **DSH version floor is `0.1.0-rc.6`** for the whole ecosystem: skin-market compat section says "当前面向 DSH Web `0.1.0-rc.6`" and the market verified itself against a fresh install of that tag; dsh-market requires "dsh web 0.1.0-rc.6 or newer" and disables itself on older hosts ("the market disables itself and says so in the browser console"; also warns a **desktop build bundles its own dsh which may be older than npm's**). dsh-theme-paper declares `dsh: 0.1.0-rc.6`; dsh-ivory pins its client peers to `>=0.1.0-rc.6 <0.2.0` and is "verified against DSH 0.1.2-alpha.1"; some skins target `0.1.1-rc.2` or `^0.1.0-rc.6`.
- **rc.7+ gates the plugin-settings card**: skin-market's own `dsh.client.inject` and dsh-market's settings card only exist where `settingsScope` is available (rc.7); both use *nested* `ctx.inject(['settingsScope'], cb)` so the rest of the plugin still runs on rc.6.
- **Mutual exclusion / conflicts**: the market prompts to disable other skin plugins before installing; its own README says "安装前请确保已关闭其他皮肤插件，避免冲突"; only one skin active at a time (the market's `switchClientSkin` deactivates the rest).
- **Windows `&path:` truncation**: `dsh plugin add "github:owner/repo#commit&path:/subdir"` breaks under cmd.exe (the `&` is a command separator) — use the market one-click install or PowerShell `pnpm add "…&path:/…" --dir $env:USERPROFILE\.dsh\profiles\web`.
- **pnpm / allowBuilds**: install failures on Windows are usually "pnpm not recognized" or "allowBuilds" build-approval keys, not manifest corruption; the market's recovery restores the profile manifest snapshot on failed install/update/activate.
- **Style-tag lifecycle (HMR)**: host module reloads and the loader's unload path remove plugin-owned `<style data-plugin-css>` tags; themes must re-inject (ivory self-heals via MutationObserver on `document.head`; parchment/papers re-add in `apply`). CSS injected outside `ctx.effect` won't be torn down.
- **theme service value shape**: `overrideTokens` rejects bare strings — pass `{ light, dark }` pairs (this is the reason parchment's ALIAS uses pair objects).
- **`"system"` cannot be registered as a theme id** (it is a preference); re-registering an id or calling `setTheme` for an unregistered theme resets to default.
- **No "real" themeService-based dark palette in register()-based skins unless you register per-scheme**: dsh-theme-paper registers one light theme (`colorScheme: "light"`) and drives dark via its own body attribute/palette — so "modes: [light, dark]" in the registry does **not** imply the platform preference switches work natively.
- **localStorage vs Host settings**: browser clients can only write plugin-config namespaces allowlisted by the Host, so skins persist preferences in localStorage (ivory `dsh-ivory.enabled`, paper `dsh.ui-theme.paper`, claude-skin font mode); DSH's own Appearance preference persists via `settings.yaml` through `settingsScope`.
- **Selector-contract drift is expected and breaks structural theming**: DSH is in developer preview and may make breaking UI changes; ivory anchors structural styles on `[data-slot]` seams + class fallbacks and degrades to token-only theming (`dshcs-contract-mismatch`) rather than breaking the layout when the contract can't be proven; it also re-probes on `data-ds-dark-theme` flips.
- **Fonts are a legal/distribution snag**: dsh-client-ui-skin-claude ships Anthropic `.ttf`s in the repo but **not** in the npm tarball (user must install fonts manually; NOT MIT — Anthropic copyright); uninstall `dsh-anthropic-fonts` first to avoid double `font-family` variables. paper/ivory use widely-available serif stacks instead.
- **Committed-bundle installs need no build permission**: ivory commits the generated `lib/client.js` "so GitHub installs need no build permission" — a real constraint for GitHub-source installs of themes that *would* need `prepare` scripts (see registry `install.desktop.reason: "npm-lifecycle-scripts:prepack"` for dsh-ivory's desktop manual-only mode).
- **Not possible today (as documented)**: the market "浏览器只能提交 registry 中的 `skinId`，不能提交任意命令或安装地址" (browser cannot run arbitrary install commands); freshness of stars comes from a snapshot task, not live GitHub API; a `dsh.client`-only skin has no host behavior (no filesystem/network/process access); persistent Host-side settings for third-party plugins are only reachable through allowlisted namespaces.
- **What breaks on older hosts**: dsh-market on < rc.6 → market absent; missing `@deepseek-ai/dsh-client-ui-primitives` rc.6 exports → dsh-market's settings section disabled with a console warning; missing `settingsScope` → the plugin-settings card silently absent; mis-declared `dsh.inject` service in `inject` (module-level) unmounts the whole plugin if the service is absent (that's why the markets use nested injects and `ctx.get`).

---

## Appendix: quick install/removal commands gathered from the READMEs

| plugin | install | remove | npm |
|---|---|---|---|
| dsh-skin-market | `dsh plugin --profile web add "dsh-skin-market@latest"` | page update / same `add` command | dsh-skin-market 0.1.49 |
| dshmarket | `dsh plugin --profile web add dshmarket` | Settings → Plugin Market | dshmarket 1.45.1 |
| dsh-ivory | `dsh plugin --profile web add dsh-ivory` | `dsh plugin --profile web remove dsh-ivory` | dsh-ivory 0.2.7 |
| @pakiknowledge/dsh-client-ui-skin-claude | `dsh plugin --profile web add @pakiknowledge/dsh-client-ui-skin-claude` | `dsh plugin --profile web remove …` | 0.2.1 |
| claude-parchment-theme | `pnpm add "github:RayYeung1989/claude-parchment-theme"` + profile `cordis.patch.yml` row | remove dep + row | — |
| dsh-theme-paper | `dsh plugin --profile web add github:WuWL-98/dsh-theme-paper` | `dsh plugin --profile web remove dsh-theme-paper` | — |