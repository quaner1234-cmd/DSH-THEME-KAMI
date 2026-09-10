# dsh-kami-theme

Kami 风格（纸媒 / editorial）DeepSeek Harness WebUI 主题。

打开 DSH 后，你会觉得是在一张安静、克制的纸张上工作：暖羊皮纸画布、
墨蓝强调色、衬线正文与标题、发丝线边框、克制的阴影——而不是又一个
SaaS 聊天界面或 Claude / Anthropic 仿制皮肤。

视觉语言直接蒸馏自 [tw93/Kami](https://github.com/tw93/Kami)（MIT）；
工程结构与 DSH 官方 theme/plugin 接口完全兼容，遵循社区已验证的
[dsh-skin-market](https://github.com/kingOfSoySauce/dsh-skin-market) /
awesome-dsh-plugin 生态惯例。

![Kami light](assets/preview-light.png)
![Kami dark](assets/preview-dark.png)

## 视觉要点（与 Kami 的对应）

| Kami token（来源 `skills/kami/references/tokens.json`） | 本主题用法 |
| --- | --- |
| `--parchment #f5f4ed` / `--ivory #faf9f5` | 画布底色 / 抬升表面（会话、菜单、浮层） |
| `--brand #1B365D` / `--brand-light #2D5A8A` | 主强调色 ink blue：主按钮、链接、选中态；另有 4 个低饱和辅助色**仅用于状态**（见「深色模式的色彩层级」） |
| `--near-black #141413 → --olive #504e49` 暖灰梯 | 正文 → 次要 → 三级文字（二级 `--dark-warm #3d3d3a`） |
| `--border` / `--line` 发丝线 | 全界面边框与分隔线（暖灰而非冷灰） |
| Kami 的 `--sans: var(--serif)` 规则 | 全界面 serif-led：正文、标题、甚至 UI 控件全部衬线（Latin Charter、中文宋体），仅代码保持等宽 |
| `--breaking-bg #f0e0d8` + `--breaking-fg #8b4513` | 警告色 |
| 不超过两种阴影的"耳语阴影" | 浮层、弹窗、toast |

Kami 本身没有深色模式；本主题的深色「夜纸」是一种原创改编
（暖黑画布 + 钢蓝墨），遵循同样的编排规则，跟随 DSH 原生
浅色 / 深色 / 跟随系统 偏好自动切换。

## 状态层：一眼可辨的 idle / running / disabled

状态识别靠**形状 + 填充 + 描边三层同时变化**，而不是只改颜色深浅；
三态在任何一档外观下都不需要思考就能区分。

| 发送键状态 | 浅色填充 | 浅色图形 | 深色填充 | 深色图形 | 区分手段 |
| --- | --- | --- | --- | --- | --- |
| **disabled**（未输入） | 透明（中空） | `#a5a294` | `#212220` | `#787568` | 只有 1px 发丝环，无投影、无实底 |
| **idle**（可发送） | `#1B365D` **实底** | `#faf9f5` | `#3a6ea8` **实底** | `#f5f2e8` | 实心填充 + 1px 微投影，唯一「有重量」的一态 |
| **running**（生成中） | `#e6edea` | `#2f5b54` | `#1f2b28` | `#8fc3b9` | 图案变为停止方块 + 1.5px 描边 + 呼吸光晕 |

- 关键约束：三态图形与自身填充的对比度分别为 **idle 11.51:1 / running 6.44:1 /
  disabled 2.32:1（浅色）**、**4.72:1 / 7.44:1 / 3.75:1（深色）**。disabled 永远
  是最弱的一档（WCAG 1.4.3 豁免禁用控件），running 靠**中空 + 描边 + 动效**与
  idle 的实底拉开，因此不存在「浅蓝被误读为 disabled」的歧义。
- 浅色 hover 更深（`#1B365D → #12283f`）、深色 hover 更亮（`#3a6ea8 → #4a7eba`）：
  两种模式都朝「与画布对比更强」的方向走，所以 hover 反馈的方向始终一致。
- 动效只有 `@keyframes kami-send-live`（描边 + 光晕呼吸），并在
  `prefers-reduced-motion: reduce` 下完全关闭。

## 当前预设（「创造模式」所在位置）的激活态

模型/模式选择器是 composer 里的胶囊按钮。折叠→展开→展开时 hover 三级：

| 状态 | 填充 | 描边 | 文字 / 图标 |
| --- | --- | --- | --- |
| 折叠 | `#eae8dd` | `#dcd9cb` 发丝 | 图标墨蓝，chevron 保持安静（`#6b6a64`） |
| **展开（当前生效）** | `#e4ecf6` 墨蓝薄染 | **`#1B365D` 1px 墨蓝环** | 标签 / 图标 / chevron **全部转为墨蓝** |
| 展开 + hover | `#d6e3f2` 再深一档 | 墨蓝环保持 | 全部保持墨蓝 |

这一组变化是「当前模式」最明确的表达：颜色、描边、chevron 三者同时收敛到墨蓝。
深色对应值为 `#242520` / `#243546` / `#2c4055`，环与文字为 `#7ea6da` / `#8fb1e0`。

同一套「墨蓝薄染 + 墨蓝环 + 墨蓝文字」也用于**当前选中的预设卡片**
（设置里的 active 卡片）与**已选中的菜单项**，所以「选中」在全界面只有一种语言。

> **限制**：CSS 无法单独定位「创造模式」这一个预设。胶囊按钮只暴露
> `title` 与 `aria-expanded`，标签是 `span` 里的纯文本节点，没有 preset-id
> 属性。因此激活态表达的是**「当前预设是哪一个」**（谁当前生效谁被点亮），
> 而不是给某个特定模式写死一套配色——在插件边界内这是唯一诚实的做法。

## 深色模式的色彩层级：五个低饱和辅助色

深色原本几乎只有暖灰 + 钢蓝，状态之间只能靠明度区分。现在引入**五个同明度带
的辅助色**，靠**色相**而不是**响度**分隔——这就是「少量辅助色」不会变成
彩色 UI 的原因：

| 角色 | 浅色 | 深色 | 深色对画布对比度 | 用途 |
| --- | --- | --- | --- | --- |
| ink 墨蓝 | `#1B365D` | `#8fb1e0` | 7.86:1 | 强调、选中、当前生效 |
| live 松石 | `#2f5b54` | `#8fc3b9` | 8.80:1 | 运行中 / 进行中（唯一的"活着"信号） |
| sage 苔绿 | `#4c6432` | `#9cbb7c` | 8.09:1 | success |
| brass 黄铜 | `#8b4513` | `#dcab6b` | 8.31:1 | warning |
| clay 陶土 | `#b3402e` | `#e1916f` | 6.99:1 | error |

- 五个角色在深色画布上都落在 7–9:1 这一窄带内，**差异来自色相与彩度**，
  所以任何一色都不会比别的更"吵"。
- 辅助色只用于**状态**：selected（ink 薄染）、hover（ink 低透明 wash）、
  running（live）、success / warning / error（sage / brass / clay）。
  正文、标题、边框仍是暖灰梯——Kami 的克制没有让步。
- 深色表面层次同步抬升一档，让 hover / selected 真的"看得见"：
  `specific-bubble #20293a → #22303f`、`sidebar-nav-item-active #20293a → #243546`、
  `sidebar-nav-item-hover α.08 → α.11`、`button-ghost-active-hover #2a3a4d → #2f4459`。
- 状态色**单一来源**：每档外观各有 6 个 `--dsw-alias-state-*` / `label-*` token
  改为指向 `var(--kami-*)`，不再各自写死十六进制，避免浅深两套调色板各自漂移。

## 兼容版本

- 目标运行时：`dsh web` **0.1.0-rc.6 或更新**（社区插件市场的最低门槛）。
- 已在 `0.1.2-alpha.5` 上实测，并在 `0.1.5-rc.1` 上复验（见下方验证记录）。
- 依赖：无。不打包任何字体文件；全部使用系统字体 / 操作系统自带中文字体栈。

## 安装

### 方式一：dsh plugin CLI（推荐）

```sh
# 从本仓库（GitHub 安装需要提交 / 发布后路径）
dsh plugin --profile web add "github:quaner1234-cmd/DSH-THEME-KAMI"

# 发布到 npm 之后（占位命令，名称以实际发布为准）
dsh plugin --profile web add dsh-kami-theme
```

### 方式二：本地开发安装

```sh
dsh plugin --profile web add "file:/path/to/DSH-THEME-KAMI"
```

### 方式三：插件市场

本主题在 awesome-dsh-plugin / dsh-skin-market 收录后，可在
设置 → 插件市场 → Themes 中一键安装、一键切换（主题之间互斥）。

安装后**刷新页面或重启 `dsh web`** 生效。

## 启用 / 关闭 / 卸载

> **生效时机**：本主题与 DSH 的所有插件一致——**roster（插件清单）在
> `dsh web` 启动时组装**。运行期间修改启用状态，需要**重启 `dsh web`
> 或刷新页面**（刷新只对新 bundle 版本生效；改变 disabled 需要重启服务）。
> 运行时**退出**（插件被停用/卸载时的清理）由 `ctx.effect` disposer 保证：
> 立刻移除 `data-dsh-kami` 属性与唯一的 `<style>` 标签，逐像素还原。

- **启用**：安装即默认启用（patch 行已插入 roster）。若曾显式关闭，把
  `cordis.patch.yml` 中对应行的 `disabled: true` 移除，然后重启 `dsh web`。
- **临时关闭（不卸载）**：在已安装包的 `cordis.patch.yml`（或
  `~/.dsh/profiles/<profile>/cordis.patch.yml`，若该 profile 自带 patch）
  中给对应行加 `disabled: true`，然后重启 `dsh web`：

  ```yaml
  # 已安装包：~/.dsh/profiles/web/node_modules/dsh-kami-theme/cordis.patch.yml
  - insert:
      - id: dsh-kami-theme
        name: 'dsh-kami-theme'
        disabled: true
  ```

- **卸载**：

  ```sh
  dsh plugin --profile web remove dsh-kami-theme
  ```

  该命令移除依赖、并从 `dsh.profile.bundles` 中摘除本包名，然后重启生效。
  本主题没有任何全局副作用：不写 localStorage / profile 配置 / 其它目录，
  卸载后仓库外零残留（唯一足迹就是 profile 依赖、bundles 条目与该包目录，
  全部由以上命令清理）。

- **恢复原始界面**：本主题不修改任何 DSH 源码、不修改框架 token 定义，
  只通过**挂在 `body[data-dsh-kami]` 属性上的追加 CSS** 覆盖 token 值。
  插件卸载 / 关闭时，`ctx.effect` 的 disposer 会移除该属性与唯一的
  `<style>` 标签，**逐像素恢复原生外观**，不留任何污染（无 JS 内联样式残留）。

## 工作方式（工程说明）

- 纯浏览器端主题：`lib/index.js` 为主机半段（刻意 inert，无任何文件 / 网络
  / 服务权限），`lib/client.js` 为浏览器半段。
- 遵循 DSH 官方 bundle 契约：`window.__ModuleLoader__.load({ id, factory })`，
  无需构建步骤；`package.json` 声明 `dsh.bundle.patch` 与 `dsh.client.platform: "web"`。
- 通过 `body[data-ds-dark-theme]`（由 `@deepseek-ai/dsh-client-ui-theme`
  的 ThemePresenter 维护）自动跟随原生浅色 / 深色 / 跟随系统偏好。
- **级联契约**：DSH 每次切换外观都会重新追加自己的 token 样式表，文档顺序
  不可依赖。本主题每条规则都以 `html body[data-dsh-kami]` 前缀提升优先级，
  两个调色板块互斥（浅色用 `:not([data-ds-dark-theme])` 限定），在**优先级**
  层面永远压过框架的 `body[data-ds-dark-theme]`，并且浅色值永远不会漏进深色。
- 在不修改框架的前提下，覆盖的是**同一套 `--dsw-alias-*` / `--dsw-specific-*`
  / `--dsw-font-*` 设计 token**；对选择器（代码块发丝线、选区、标题字距、
  链接下划线）仅做 attribute 作用域下的元素级微调，类名片段（如
  `md-code-block`）均为尽力而为——若未来版本改名，规则自动停止匹配，
  不影响任何布局与功能。

## 已知限制

- **roster 生效需重启**：与 DSH 所有插件一致，启用状态（`disabled: true`）
  与卸载在服务启动时组装生效；运行期间改配置需要重启 `dsh web`。
- **衬线字形有限**：Charter 只有 Regular/Bold 两档（400/700），500 会渲染为
  400。标题层级依赖**字号级差 + 负字距 + 字距**而非字重；小标题（h4+）用
  600 承担。中文衬线经系统栈回退到宋体（Songti/Source Han/SimSun），不打包
  任何字体。
- **「深度求索中…」流光**保留 DSH 原生的渐变文字动效（`background-clip:text`
  + 扫光），只是把色板换成墨蓝；浅色下扫光高光段对比度较低（约 1.2:1），
  这是原组件的装饰性设计，正文文字主色 11:1，不影响阅读。
- DSH 大量圆角由组件级 CSS 决定（`--dsl-*` 局部变量等），token 层无法以
  不碰源码的方式统一收窄；本主题保留 DSH 默认圆角，但通过发丝线、留白与
  衬线字让整体观感保持 Kami 的「平、细、静」。
- Kami 原始仓库没有深色模式与完整的成功/错误色板；本主题为 DSH 必要状态
  （错误、警告、成功）提供了暖色系的克制配色，保证对比度与可辨别性，但
  这些并不声称是 Kami 原文。
- **状态层依赖类名片段与结构特征**：发送键的 idle / running 之分靠
  `:has(> svg > rect)`（停止方块 = running）与 `[class*="_primary"]`，
  预设胶囊靠 `[class*="_seat"]` / `[class*="_chevron"]`，running 标记靠
  `[class*="_markBusy"]` / `[class*="_glyphProgress"]`。这些片段与结构已在本
  版本实测确认；若未来 DSH 改变图标结构或类名，对应规则会**自动停止匹配并
  回落到原生外观**，不会误伤其它元素，也不需要改布局。
- **浅色下 hover / selected 的填充差本身很小**（胶囊底 `#eae8dd` 对画布
  1.11:1，墨蓝薄染对胶囊底 1.03:1），这是浅底色的物理限制。因此浅色的选中与
  hover 表达**主要靠描边与墨蓝文字**（墨蓝于薄染底 10.18:1），而不是靠填充深浅。
- **「创造模式」无法被 CSS 单独定位**（见上文限制框）：胶囊按钮没有 preset-id
  属性，激活态只能表达"当前预设"。若将来 DSH 暴露该属性，可在此加一条规则。
- 若未来 DSH 前端大面积重构 token 名，本主题会像社区其他皮肤一样随版本
  跟进（token 覆盖天然有向后兼容的降级空间）。

## 验证记录

在真实运行中的 DSH WebUI 中实测（2026-09-10，先在 `0.1.2-alpha.5`，后又在用户升级的 `0.1.5-rc.1` 上复验）：

- **浅色**：正文 `#141413` 于 `#f5f4ed` 画布，对比度 16.72:1；全页对比度
  扫描 0 个违规（含错误/警告/成功状态、代码、选中态、hover 态）。
- **深色**：正文 `#e8e6dc` 于 `#1a1b17` 画布，对比度 13.84:1；全页扫描
  0 个违规；「深度求索中…」流光两端 7.86:1 / 15.65:1。
- **衬线落地**：`--dsw-font-family` 一处翻转使全页文本节点（2048 个）进入
  Charter/宋体；几何对比显示**零布局回归**（无截断、无溢出、无换行变化）。
- **浅/深回环**：经设置 UI 在 浅色→深色→浅色 间切换后逐 token 复查，暖色
  梯形与墨蓝在所有模式下保持，无冷色回漏。
- **better-sidebar 适配**：其覆盖式面板（`absolute` + `z-index`）的几何在
  有无本主题时完全一致（A/B 实测）——<768px 窄窗口下插件按自身移动端逻辑
  使用 `width:100vw` 全宽，属插件设计而非主题回归；主题负责表面层次：
  `bg-layer-1` 从与画布同色改为 Kami ivory（浅 `#faf9f5` / 深 `#21221d`），
  面板与对话区有清晰分界 + 发丝线边缘。
- 截图证据：`assets/preview-{light,dark}.png`（README 顶部）、
  `assets/verify/01-boot.png` ~ `09`（设置页、代码块、浅/深 better-sidebar 面板、
  状态层对照图 `08-states-{light,dark}.png`）；量化审计
  `assets/verify/audit-final-{light,dark}.json`、
  `assets/verify/audit-state-layer.json`。

### 状态层复验（2026-09-10，`0.1.5-rc.1`）

同一台真实运行的 `dsh web`，三种互相独立的取证方式：

1. **计算样式探针**：把线上节点克隆进合成作用域，逐态读取 `getComputedStyle`；
   `:hover` 用 CDP `CSS.forcePseudoState` **强制**施加，不依赖命中测试。
   真实生产按钮另外直接在空/有输入两种 composer 下实测（`transform:
   translateY(-2px)` 等原生规则原样保留）。
2. **像素取证**：对每个状态单独裁图，用直方图取主色，确认**画出来的颜色**与
   计算样式一致。浅色实底 `#1b365d` 占 53.7%、图形 `#faf9f5` 26.7%；
   深色实底 `#3a6ea8` 53.7%、图形 `#f5f2e8` 3.0%；disabled 两者都是中空。
3. **静态回归证明**：把 `lib/client.js` 渲染成 CSS 后与上一提交逐 token 对比——
   浅色 132 个 token 变了 31 个、深色 134 个变了 45 个，其中**能着色文字的 token
   没有一个损失对比度**（唯一变值的是深色 `state-success-primary`，
   `#9cb97c → #9cbb7c`，对比度 7.95 → 8.09，是把成功色并入单一来源时的取整），
   其余全部是填充 / 描边 / 分隔面。

- 状态层共 26 项对比度断言 × 2 档外观 = **52 项，0 失败**
  （阈值：文字 4.5:1、大字号与图形对象 3:1、禁用态豁免但必须是最弱的一档）。
- 全页文字扫描：浅色 34 个文本节点 / 深色 34 个，**0 违规**；正文对比度
  `16.72:1`（浅）/ `13.84:1`（深），与上一轮基线**逐位相同**。
- CSS 体积 22,183 → 28,054 字节（状态层 +25 个 `--kami-*` token、50 条声明）；
  渲染后花括号平衡、无未声明引用、无未被引用的 token。
- 实测定位：本站 `dsh web 0.1.5-rc.1`；主题样式表在页内 28,054 字节，
  浅/深切换后逐 token 复查无冷色回漏。

### 选择器作用域核查（每个 `[class*=…]` 片段都查了归属包）

状态层用的是 CSS-module 类名片段，所以逐个片段在所有 DSH bundle 里做了
唯一性 / 归属扫描，确认它只能命中预期组件：

| 片段 | 命中数 | 归属 | 结论 |
| --- | --- | --- | --- |
| `_seat` / `_seatIcon` / `_seatLabel` | 3 | `dsh-client-ui-agent-preset` | 同一组件族，正是预设胶囊 |
| `_cardActive` / `_cardName` | 2 | `dsh-client-ui-agent-preset` | 正是「当前使用」的预设卡片（不是别处的卡片） |
| `_markBusy` / `_markActive` | 2 | `dsh-client-ui-chat` | 会话内的 running 标记 |
| `_glyphProgress` | 1 | `dsh-client-ui-chat` | 运行中字形 |
| `_selectedFill` | **1** | `dsh-web-frontend` | 全前端仅此一处，零歧义 |
| `_chevron` | 4 | `model-selection` / `web-frontend` / 预设胶囊 | 另有 `_chevronOpen` / `_chevronHover`；规则限定在 `[data-composer-seat] button[aria-expanded="true"]` 内，只会命中胶囊自己的 chevron |
| `_pending` | 10 | 仅 1 个是 CSS 类 | 其余 9 个（`_pendingPlan` / `_pendingRow` / `_pendingWrites` …）都是 JS 字段名，不是 DOM 类名；真实匹配只有 composer 的 `_pending` |
| `_primary` | 3 | 另有 `_primaryButton` | `_primaryButton` 属 `settings-models` 设置页，**不可能出现在 `[data-composer-seat]` 内** |

所有规则同时被 `[data-composer-seat]`（composer 作用域）与
`html body[data-dsh-kami]`（主题作用域）双重限定，因此即使类名片段在别处
碰撞，也不会漏到主题作用域之外的组件上。

## 设计来源与许可证

- 视觉来源：[tw93/Kami](https://github.com/tw93/Kami)，MIT License。
  设计 token 的完整读取与引用：`docs/kami-design-token-report.md`。
- DSH 主题生态工程调研（dsh-skin-market 逐条引用）：`docs/dsh-skin-ecosystem-engineering-report.md`。
- 本主题代码：MIT License（见 `LICENSE`）。
- **声明**：本仓库不包含、不重新分发任何字体文件。中文衬线依赖系统字体
  （如 macOS 宋体 / 苹方、Windows 宋体 / 微软雅黑、Linux Noto Serif CJK）；
  不包含 TsangerJinKai02 或其他任何不由 MIT 许可的字体。
- 若引用、改编 Kami 的其他 MIT 代码，均按 MIT 要求保留版权与许可说明。

## 提交 DSH Skin Market

dsh-skin-market 收录采用「一个 PR、一个 YAML」流程（详见
`docs/dsh-skin-ecosystem-engineering-report.md`）：

```yaml
# registry/skins/quaner1234-cmd__DSH-THEME-KAMI.yml
url: https://github.com/quaner1234-cmd/DSH-THEME-KAMI
```

CI 会自动水合 package / commit / loader 行 / 截图并重新生成 catalog。