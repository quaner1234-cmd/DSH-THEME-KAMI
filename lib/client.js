/**
 * dsh-kami-theme — Kami-inspired editorial skin for the DSH web GUI.
 *
 * Visual language distilled from tw93/Kami (MIT) — see docs/kami-design-token-report.md:
 *   - warm parchment canvas #f5f4ed / ivory surfaces #faf9f5 (Kami: --parchment/--ivory)
 *   - a single ink-blue accent #1B365D (Kami: --brand) with #2D5A8A hover (--brand-light)
 *   - serif-led typography — Kami sets `--sans: var(--serif)`, so the whole GUI
 *     is Charter/Songti style (Latin Charter, CJK Songti SC, code JetBrains Mono);
 *     headings use size-first hierarchy with a negative display tracking
 *   - hairline warm borders, whisper shadows, no gradients except the think fade
 *   - warm gray text ladder #141413 → #3d3d3a → #504e49 (Kami near-black/dark-warm/olive)
 *   - Kami warning brown #8b4513 on #f0e0d8 (--breaking-bg/--breaking-fg) for warnings;
 *     error/success are adapted warm tones so DSH states stay legible
 *
 * Kami has no dark mode; the dark palette here is an original "night paper"
 * adaptation (warm near-black canvas + steel-ink accent) in the same editorial rules.
 *
 * Integration: attribute-scoped CSS token overrides. apply() adds a
 * `data-dsh-kami` body attribute (the scope of every rule) and one <style> tag.
 * DSH re-appends its token sheet on every appearance switch, so the cascade is
 * won on specificity, never document order: every block is prefixed `html body`
 * and the two palette blocks are mutually exclusive (light via
 * `:not([data-ds-dark-theme])`), which also stops a light value from leaking
 * into dark. The light/dark/system preference flows through the native
 * `data-ds-dark-theme` attribute (owned by @deepseek-ai/dsh-client-ui-theme).
 * The effect disposer retracts every write — no JS-touched inline styles remain.
 *
 * Presentation-only: no services injected, no cordis events, no model requests.
 * Hand-written in the official __ModuleLoader__ format (no build step).
 */
window.__ModuleLoader__.load({
  id: 'dsh-kami-theme',
  factory: (require) => {
    'use strict'
    var module = { exports: {} }
    var exports = module.exports

    var BODY_ATTR = 'data-dsh-kami'
    var STYLE_ID = 'dsh-kami-theme-style'

    var SERIF = "'Charter','Bitstream Charter','Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,'Times New Roman','Songti SC','STSong','Noto Serif CJK SC','Source Han Serif SC','Noto Serif SC','SimSun',serif"
    var MONO = "'JetBrains Mono','SF Mono','Fira Code','Cascadia Code',Consolas,'Liberation Mono',Menlo,Courier,'Songti SC',monospace"

    /**
     * Warm replacement for DSH's mode-independent static ramps. The base
     * stylesheets build the alias layer on these, and ~60 component rules read
     * them directly (borders, tints, meter fills, tooltip and editor text), so a
     * cold bluish gray leaks through anywhere the alias layer is not used.
     * Values are lightness-matched step for step, so every existing contrast
     * relationship is preserved — only the hue turns warm (Kami: R≈G>B, with
     * the deepseek/blue ramps re-pointed at the ink-blue accent).
     */
    var RAMP_ROWS = [
      '  /* neutral-bluish: the main cold ladder → Kami warm ladder */',
      '  --dsw-static-neutral-bluish-00:#fdfcf8;',
      '  --dsw-static-neutral-bluish-50:#faf9f4;',
      '  --dsw-static-neutral-bluish-60:#f7f6f0;',
      '  --dsw-static-neutral-bluish-75:#f3f2ea;',
      '  --dsw-static-neutral-bluish-100:#efeee5;',
      '  --dsw-static-neutral-bluish-150:#ecebe1;',
      '  --dsw-static-neutral-bluish-200:#e6e4d9;',
      '  --dsw-static-neutral-bluish-300:#d5d3c6;',
      '  --dsw-static-neutral-bluish-400:#b4b1a4;',
      '  --dsw-static-neutral-bluish-500:#9d9a8d;',
      '  --dsw-static-neutral-bluish-600:#87847a;',
      '  --dsw-static-neutral-bluish-700:#6b6a64;',
      '  --dsw-static-neutral-bluish-750:#4d4c47;',
      '  --dsw-static-neutral-bluish-800:#3a3a35;',
      '  --dsw-static-neutral-bluish-850:#30302c;',
      '  --dsw-static-neutral-bluish-875:#262723;',
      '  --dsw-static-neutral-bluish-900:#1e1f1b;',
      '  --dsw-static-neutral-bluish-950:#171814;',
      '  --dsw-static-neutral-bluish-1000:#141413;',
      '  /* plain neutral gray → warm neutral */',
      '  --dsw-static-neutral-00:#fdfcf8;',
      '  --dsw-static-neutral-50:#faf9f4;',
      '  --dsw-static-neutral-100:#f4f3ec;',
      '  --dsw-static-neutral-150:#eeede5;',
      '  --dsw-static-neutral-200:#e7e5db;',
      '  --dsw-static-neutral-250:#dedcd1;',
      '  --dsw-static-neutral-300:#d6d4c9;',
      '  --dsw-static-neutral-400:#a8a69a;',
      '  --dsw-static-neutral-500:#85837a;',
      '  --dsw-static-neutral-550:#6b6a63;',
      '  --dsw-static-neutral-600:#5a5955;',
      '  --dsw-static-neutral-700:#42423f;',
      '  --dsw-static-neutral-800:#2e2e2b;',
      '  --dsw-static-neutral-850:#262623;',
      '  --dsw-static-neutral-900:#141413;',
      '  --dsw-static-neutral-1000:#0f0f0e;',
      '  /* deepseek brand-blue ramp → ink blue (Kami --brand / --brand-light) */',
      '  --dsw-static-deepseek-50:#eff3f8;',
      '  --dsw-static-deepseek-100:#e8eef6;',
      '  --dsw-static-deepseek-200:#d7e0ec;',
      '  --dsw-static-deepseek-300:#b9c8dc;',
      '  --dsw-static-deepseek-400:#2D5A8A;',
      '  --dsw-static-deepseek-450:#2D5A8A;',
      '  --dsw-static-deepseek-500:#1B365D;',
      '  --dsw-static-deepseek-600:#16304f;',
      '  --dsw-static-deepseek-700-delete:#12283f;',
      '  --dsw-static-deepseek-800:#1b2b40;',
      '  --dsw-static-deepseek-900:#16222f;',
      '  /* blue ramp (label-primary-bluish and friends) → ink blue */',
      '  --dsw-static-blue-50:#eff3f8;',
      '  --dsw-static-blue-50p:#eaf0f7;',
      '  --dsw-static-blue-75:#e7ecf3;',
      '  --dsw-static-blue-100:#e3e9f1;',
      '  --dsw-static-blue-300:#a9bdd6;',
      '  --dsw-static-blue-400:#7fa3cf;',
      '  --dsw-static-blue-450:#6d95c4;',
      '  --dsw-static-blue-500:#2D5A8A;',
      '  --dsw-static-blue-600:#1B365D;',
      '  --dsw-static-blue-800:#14294a;',
      '  --dsw-static-blue-900:#101f36;',
      '  --dsw-static-blue-950:#0d1930;',
      '  /* state ramps → warm editorial tones (copper / sage / Kami breaking brown) */',
      '  --dsw-static-red-50:#fbf1ec;',
      '  --dsw-static-red-100:#f7e2d8;',
      '  --dsw-static-red-400:#c9694c;',
      '  --dsw-static-red-500:#b3402e;',
      '  --dsw-static-red-600:#9c3524;',
      '  --dsw-static-red-900:#47201a;',
      '  --dsw-static-green-100:#e9eedf;',
      '  --dsw-static-green-400:#6f8f4e;',
      '  --dsw-static-green-500:#4c6432;',
      '  --dsw-static-green-900:#26301e;',
      '  --dsw-static-amber-100:#f0e0d8;',
      '  --dsw-static-amber-400:#a35b1e;',
      '  --dsw-static-amber-500:#8b4513;',
      '  --dsw-static-amber-600:#7d3e11;',
      '  --dsw-static-amber-900:#2e2018;'
    ].join('\n')

    /* Shared token rows (fonts, applied in both palettes). */
    var FONT_ROWS = [
      /* Kami sets --sans: var(--serif): the whole product is serif-led and only
         code stays monospace. Verified against DSH 0.1.2-alpha.5: flipping this
         one token carries all 2048 text nodes to the serif and changes no
         geometry (no clipping, no overflow, no wrapping regressions), because
         DSH chrome is built on this token rather than on hard-coded stacks. */
      "  --dsw-font-family: " + SERIF + ';',
      "  --dsw-font-serif: " + SERIF + ';',
      "  --dsw-font-code: " + MONO + ';',
      "  --ds-font-family-code: " + MONO + ';',
      /* markdown body: let DSH's content font-size setting flow through */
      "  --dsw-font-markdown-base: var(--dsh-content-font-size,14px)/1.7 " + SERIF + ';',
      "  --dsw-font-markdown-base-strong: 600 var(--dsh-content-font-size,14px)/1.7 " + SERIF + ';',
      "  --dsw-font-markdown-small: 12.5px/1.6 " + SERIF + ';',
      "  --dsw-font-markdown-small-strong: 600 12.5px/1.6 " + SERIF + ';',
      "  --dsw-font-markdown-h1: 500 24px/1.35 " + SERIF + ';',
      "  --dsw-font-markdown-h2: 500 20px/1.4 " + SERIF + ';',
      "  --dsw-font-markdown-h3: 500 17px/1.45 " + SERIF + ';',
      "  --dsw-font-markdown-h4: 600 15px/1.5 " + SERIF + ';',
      "  --dsw-font-markdown-table: var(--dsh-content-font-size,14px)/1.6 " + SERIF + ';',
      "  --dsw-font-markdown-table-head: 600 var(--dsh-content-font-size,14px)/1.6 " + SERIF + ';',
      "  --dsw-font-markdown-code: 13px/1.6 " + MONO + ';',
      "  --dsw-font-markdown-code-block: 13px/1.7 " + MONO + ';',
      "  --dsw-font-markdown-code-block-small: 12px/1.6 " + MONO + ';',
      /* family-only slots in case other components read the sub-tokens */
      "  --dsw-font-markdown-base-font-family: " + SERIF + ';',
      "  --dsw-font-markdown-base-strong-font-family: " + SERIF + ';',
      "  --dsw-font-markdown-h1-font-family: " + SERIF + ';',
      "  --dsw-font-markdown-h2-font-family: " + SERIF + ';',
      "  --dsw-font-markdown-h3-font-family: " + SERIF + ';',
      "  --dsw-font-markdown-h4-font-family: " + SERIF + ';',
      "  --dsw-font-markdown-small-font-family: " + SERIF + ';',
      "  --dsw-font-markdown-table-font-family: " + SERIF + ';',
      "  --dsw-font-markdown-table-head-font-family: " + SERIF + ';',
      "  --dsw-font-markdown-code-font-family: " + MONO + ';',
      "  --dsw-font-markdown-code-block-font-family: " + MONO + ';'
    ].join('\n')

    /* Light palette — Kami paper day (rules apply when data-ds-dark-theme is absent). */
    var LIGHT_ROWS = [
      '  --dsw-alias-bg-base:#f5f4ed;',
      /* layer-1 is the first elevation above the canvas — DSH semantics, and
         better-sidebar's panel paints it. Keeping it equal to bg-base flattened
         every raised surface into the parchment and made the side panel
         invisible against the chat when it overlaps; give it Kami --ivory. */
      '  --dsw-alias-bg-layer-1:#faf9f5;',
      '  --dsw-alias-bg-layer-2:#faf9f5;',
      '  --dsw-alias-bg-layer-3:#faf9f5;',
      '  --dsw-alias-bg-overlay:#faf9f5;',
      '  --dsw-alias-bg-module-platform:#f2f1ea;',
      '  --dsw-alias-bg-multi-select:#f2f1ea;',
      '  --dsw-alias-bg-skeleton:rgba(20,20,19,.08);',
      '  --dsw-alias-bg-mask-1:rgba(20,20,19,.35);',
      '  --dsw-alias-bg-mask-2:rgba(20,20,19,.18);',
      '  --dsw-alias-bg-mask-3:rgba(20,20,19,.5);',
      '  --dsw-alias-bg-mask-photo:rgba(20,20,19,.88);',
      '  --dsw-alias-bg-mask-drop:rgba(245,244,237,.92);',
      '  --dsw-alias-border-inverted:rgba(255,255,255,0);',
      '  --dsw-alias-border-inverted2:rgba(255,255,255,0);',
      '  --dsw-alias-border-l1:#e8e6dc;',
      '  --dsw-alias-border-l2:#e5e3d8;',
      '  --dsw-alias-border-l2-darkmode-thin:#e5e3d8;',
      '  --dsw-alias-border-l3:#d8d5c8;',
      '  --dsw-alias-border-l4:#cfccbd;',
      '  --dsw-alias-brand-primary:#1B365D;',
      '  --dsw-alias-brand-primary-invert:#faf9f5;',
      '  --dsw-alias-brand-primary-new-colorprimary-new-color:#1B365D;',
      '  --dsw-alias-brand-text:#faf9f5;',
      '  --dsw-alias-button-contrast-fill:#3d3d3a;',
      '  --dsw-alias-button-elevated-fill:#faf9f5;',
      '  --dsw-alias-button-floating-fill:#faf9f5;',
      '  --dsw-alias-button-floating-hover:#f0eee6;',
      '  --dsw-alias-button-ghost-active-border:#cfccbd;',
      '  --dsw-alias-button-ghost-active-fill:#EEF2F7;',
      '  --dsw-alias-button-ghost-active-hover:#e4ecf5;',
      '  --dsw-alias-button-info-fill:#2D5A8A;',
      '  --dsw-alias-button-info-hover:#1B365D;',
      '  --dsw-alias-button-primary-dimmed:#E4ECF5;',
      '  --dsw-alias-button-primary-fill:#1B365D;',
      '  --dsw-alias-button-primary-hover:#2D5A8A;',
      '  --dsw-alias-button-tool-bar-fill-invisible:rgba(61,61,58,.36);',
      '  --dsw-alias-button-tool-bar-fill:rgba(61,61,58,.34);',
      '  --dsw-alias-button-tool-bar-hover:rgba(61,61,58,.5);',
      '  --dsw-alias-fill-l2:#eceadf;',
      '  --dsw-alias-fill-tsp-secondary:#e8e6dc;',
      '  --dsw-alias-interactive-bg-active:rgba(27,54,93,.12);',
      '  --dsw-alias-interactive-bg-hover:rgba(27,54,93,.07);',
      '  --dsw-alias-interactive-bg-hover-accent:rgba(27,54,93,.12);',
      '  --dsw-alias-interactive-bg-hover-danger:rgba(139,69,19,.1);',
      '  --dsw-alias-interactive-bg-hover-solid:#e8e6dc;',
      '  --dsw-alias-label-caption:#6b6a64;',
      '  --dsw-alias-label-dimmed:#c7c4b6;',
      '  --dsw-alias-label-error:#b3402e;',
      '  --dsw-alias-label-primary:#141413;',
      '  --dsw-alias-label-primary-bluish:#1B365D;',
      '  --dsw-alias-label-primary-dimmed:rgba(20,20,19,.72);',
      '  --dsw-alias-label-primary-foreground:#faf9f5;',
      '  --dsw-alias-label-primary-inverted:#faf9f5;',
      '  --dsw-alias-label-quaternary:#b7b4a6;',
      '  --dsw-alias-label-secondary:#3d3d3a;',
      /* Kami --olive: the designated sub-text colour, and DSH reads tertiary for
         reasoning/prose-like secondary text (thinking body, gutters, meta) where
         stone #6b6a64 only reached 4.9:1 — olive stays quiet at ~7:1. */
      '  --dsw-alias-label-tertiary:#504e49;',
      '  --dsw-alias-markdown-citation:#EEF2F7;',
      '  --dsw-alias-markdown-code-block:#f0eee6;',
      '  --dsw-alias-markdown-code-block-banner:#eceadf;',
      '  --dsw-alias-markdown-code-segment-selected:#faf9f5;',
      '  --dsw-alias-markdown-code-segment-unselected:#e8e6dc;',
      '  --dsw-alias-markdown-inline-code:#f0eee6;',
      '  --dsw-alias-markdown-placeholder:#f2f1ea;',
      '  --dsw-alias-markdown-tag:#E4ECF5;',
      '  --dsw-alias-scrollbar-bg-l1:#e3e0d4;',
      '  --dsw-alias-scrollbar-bg-l2:#e3e0d4;',
      '  --dsw-alias-scrollbar-hover-l1:#cfccbd;',
      '  --dsw-alias-scrollbar-hover-l2:#cfccbd;',
      '  --dsw-alias-separator-primary:#e5e3d8;',
      '  --dsw-alias-state-business-primary:#1B365D;',
      '  --dsw-alias-state-business-tertiary:#E4ECF5;',
      '  --dsw-alias-state-error-primary:#b3402e;',
      '  --dsw-alias-state-error-secondary:#c96a4e;',
      '  --dsw-alias-state-success-primary:#4c6432;',
      '  --dsw-alias-state-success-secondary:#6f8f4e;',
      '  --dsw-alias-state-success-tertiary:#e9eedf;',
      '  --dsw-alias-state-warn-label:#8b4513;',
      '  --dsw-alias-state-warn-primary:#8b4513;',
      '  --dsw-alias-state-warn-secondary:#a35b1e;',
      '  --dsw-alias-state-warn-tertiary:#f0e0d8;',
      '  --dsw-alias-state-warning-primary:#8b4513;',
      '  --dsw-alias-toast-bg:#3d3d3a;',
      '  --dsw-alias-tooltip-bg:#30302e;',
      '  --dsw-specific-bubble-highlight:#E4ECF5;',
      '  --dsw-specific-bubble:#EEF2F7;',
      '  --dsw-specific-input-major:#faf9f5;',
      '  --dsw-specific-login-input:#f5f4ed;',
      '  --dsw-specific-menu:#faf9f5;',
      '  --dsw-specific-selector:#f5f4ed;',
      '  --dsw-specific-sidebar-fill:#f5f4ed;',
      '  --dsw-specific-sidebar-nav-item-active-accent:#E4ECF5;',
      '  --dsw-specific-sidebar-nav-item-active:#EEF2F7;',
      '  --dsw-specific-sidebar-nav-item-hover:rgba(27,54,93,.05);',
      '  --dsw-specific-tip:#f2f1ea;',
      '  --dsw-linear-gradient-think:linear-gradient(180deg,#f5f4ed 20.19%,rgba(245,244,237,0) 100%);',
      '  --dsw-linear-think-select:linear-gradient(180deg,#eceadf 20.19%,rgba(236,234,223,0) 100%);',
      '  --dsw-elevation-stroke-color:#e5e3d8;',
      '  --dsw-hovercard-bg:#faf9f5;',
      '  --dsw-shadow-lv1:0 2px 8px rgba(20,20,19,.05);',
      '  --dsw-shadow-lv2:0 4px 14px rgba(20,20,19,.07);',
      '  --dsw-shadow-lv3:0 10px 28px rgba(20,20,19,.09);',
      '  --dsw-elevation-prominent:0 10px 28px rgba(20,20,19,.09);',
      '  --dsw-elevation-soft:0 2px 8px rgba(20,20,19,.05);',
      '  --dsw-elevation-panel:0 4px 14px rgba(20,20,19,.07);',
      /* minimal static-token touches used directly by the shell UI */
      '  --dsw-static-neutral-bluish-400:#cfccbd;',
      '  --dsw-static-deepseek-450:#2D5A8A;'
    ].join('\n')

    /* Dark palette — Kami night paper (an editorial adaptation; Kami ships no dark mode). */
    var DARK_ROWS = [
      '  --dsw-alias-bg-base:#1a1b17;',
      '  --dsw-alias-bg-layer-1:#21221d;',
      '  --dsw-alias-bg-layer-2:#21221d;',
      '  --dsw-alias-bg-layer-3:#262722;',
      '  --dsw-alias-bg-overlay:#21221d;',
      '  --dsw-alias-bg-module-platform:#20211c;',
      '  --dsw-alias-bg-multi-select:#20211c;',
      '  --dsw-alias-bg-skeleton:rgba(232,230,220,.06);',
      '  --dsw-alias-bg-mask-1:rgba(10,10,9,.4);',
      '  --dsw-alias-bg-mask-2:rgba(10,10,9,.2);',
      '  --dsw-alias-bg-mask-3:rgba(10,10,9,.55);',
      '  --dsw-alias-bg-mask-photo:rgba(10,10,9,.9);',
      '  --dsw-alias-bg-mask-drop:rgba(26,27,23,.92);',
      '  --dsw-alias-border-inverted:rgba(255,255,255,.06);',
      '  --dsw-alias-border-inverted2:rgba(255,255,255,.08);',
      '  --dsw-alias-border-l1:#292a25;',
      '  --dsw-alias-border-l2:#32332d;',
      '  --dsw-alias-border-l2-darkmode-thin:rgba(232,230,220,.08);',
      '  --dsw-alias-border-l3:#3b3c35;',
      '  --dsw-alias-border-l4:#44453d;',
      '  --dsw-alias-brand-primary:#8fb1e0;',
      '  --dsw-alias-brand-primary-invert:#1a1b17;',
      '  --dsw-alias-brand-primary-new-colorprimary-new-color:#8fb1e0;',
      '  --dsw-alias-brand-text:#1a1b17;',
      '  --dsw-alias-button-contrast-fill:#e8e6dc;',
      '  --dsw-alias-button-elevated-fill:#262722;',
      '  --dsw-alias-button-floating-fill:#262722;',
      '  --dsw-alias-button-floating-hover:#32332d;',
      '  --dsw-alias-button-ghost-active-border:#44453d;',
      '  --dsw-alias-button-ghost-active-fill:#26303f;',
      '  --dsw-alias-button-ghost-active-hover:#2a3a4d;',
      '  --dsw-alias-button-info-fill:#8fb1e0;',
      '  --dsw-alias-button-info-hover:#a7c3e8;',
      '  --dsw-alias-button-primary-dimmed:#2a3a4d;',
      '  --dsw-alias-button-primary-fill:#8fb1e0;',
      '  --dsw-alias-button-primary-hover:#a7c3e8;',
      '  --dsw-alias-button-tool-bar-fill-invisible:rgba(141,138,124,.18);',
      '  --dsw-alias-button-tool-bar-fill:rgba(141,138,124,.2);',
      '  --dsw-alias-button-tool-bar-hover:rgba(141,138,124,.3);',
      '  --dsw-alias-fill-l2:#292a25;',
      '  --dsw-alias-fill-tsp-secondary:#262722;',
      '  --dsw-alias-interactive-bg-active:rgba(143,177,224,.16);',
      '  --dsw-alias-interactive-bg-hover:rgba(143,177,224,.1);',
      '  --dsw-alias-interactive-bg-hover-accent:rgba(143,177,224,.16);',
      '  --dsw-alias-interactive-bg-hover-danger:rgba(225,145,111,.12);',
      '  --dsw-alias-interactive-bg-hover-solid:#32332d;',
      '  --dsw-alias-label-caption:#9c998b;',
      '  --dsw-alias-label-dimmed:#57564f;',
      '  --dsw-alias-label-error:#e1916f;',
      '  --dsw-alias-label-primary:#e8e6dc;',
      '  --dsw-alias-label-primary-bluish:#a7c3e8;',
      '  --dsw-alias-label-primary-dimmed:rgba(232,230,220,.7);',
      '  --dsw-alias-label-primary-foreground:#1a1b17;',
      '  --dsw-alias-label-primary-inverted:#1a1b17;',
      '  --dsw-alias-label-quaternary:#63625a;',
      '  --dsw-alias-label-secondary:#bdb9ab;',
      '  --dsw-alias-label-tertiary:#a5a294;',
      '  --dsw-alias-markdown-citation:#26303f;',
      '  --dsw-alias-markdown-code-block:#20211c;',
      '  --dsw-alias-markdown-code-block-banner:#242520;',
      '  --dsw-alias-markdown-code-segment-selected:#262722;',
      '  --dsw-alias-markdown-code-segment-unselected:#292a25;',
      '  --dsw-alias-markdown-inline-code:#262721;',
      '  --dsw-alias-markdown-placeholder:#20211c;',
      '  --dsw-alias-markdown-tag:#232e42;',
      '  --dsw-alias-scrollbar-bg-l1:#3b3c35;',
      '  --dsw-alias-scrollbar-bg-l2:#3b3c35;',
      '  --dsw-alias-scrollbar-hover-l1:#4a4b43;',
      '  --dsw-alias-scrollbar-hover-l2:#4a4b43;',
      '  --dsw-alias-separator-primary:#32332d;',
      '  --dsw-alias-state-business-primary:#8fb1e0;',
      '  --dsw-alias-state-business-tertiary:#26303f;',
      '  --dsw-alias-state-error-primary:#e1916f;',
      '  --dsw-alias-state-error-secondary:#cf7a58;',
      '  --dsw-alias-state-success-primary:#9cb97c;',
      '  --dsw-alias-state-success-secondary:#aecb8e;',
      '  --dsw-alias-state-success-tertiary:#262e1e;',
      '  --dsw-alias-state-warn-label:#dcab6b;',
      '  --dsw-alias-state-warn-primary:#dcab6b;',
      '  --dsw-alias-state-warn-secondary:#e4ba7d;',
      '  --dsw-alias-state-warn-tertiary:#3a2e20;',
      '  --dsw-alias-state-warning-primary:#dcab6b;',
      '  --dsw-alias-toast-bg:#e8e6dc;',
      '  --dsw-alias-tooltip-bg:#32332d;',
      '  --dsw-specific-bubble-highlight:#26344a;',
      '  --dsw-specific-bubble:#20293a;',
      '  --dsw-specific-input-major:#262722;',
      '  --dsw-specific-login-input:#1a1b17;',
      '  --dsw-specific-menu:#262722;',
      '  --dsw-specific-selector:#21221d;',
      '  --dsw-specific-sidebar-fill:#1a1b17;',
      '  --dsw-specific-sidebar-nav-item-active-accent:#26344a;',
      '  --dsw-specific-sidebar-nav-item-active:#20293a;',
      '  --dsw-specific-sidebar-nav-item-hover:rgba(143,177,224,.08);',
      '  --dsw-specific-tip:#20211c;',
      '  --dsw-linear-gradient-think:linear-gradient(180deg,#1a1b17 20.19%,rgba(26,27,23,0) 100%);',
      '  --dsw-linear-think-select:linear-gradient(180deg,#262722 20.19%,rgba(38,39,34,0) 100%);',
      '  --dsw-elevation-stroke-color:#33342e;',
      '  --dsw-hovercard-bg:#262722;',
      '  --dsw-shadow-lv1:0 2px 8px rgba(0,0,0,.24);',
      '  --dsw-shadow-lv2:0 4px 14px rgba(0,0,0,.3);',
      '  --dsw-shadow-lv3:0 10px 28px rgba(0,0,0,.38);',
      '  --dsw-elevation-prominent:0 10px 28px rgba(0,0,0,.38);',
      '  --dsw-elevation-soft:0 2px 8px rgba(0,0,0,.24);',
      '  --dsw-elevation-panel:0 4px 14px rgba(0,0,0,.3);',
      '  --dsw-static-neutral-bluish-400:#44453d;',
      '  --dsw-static-deepseek-450:#8fb1e0;',
      '  /* The "深度求索中…" shimmer paints its gradient straight from the raw ramp',
      '     (background:linear-gradient(..., var(--dsw-static-deepseek-500) ...))',
      '     instead of from an alias, so the shared ink-blue ramp would leave it at',
      '     ~1.5:1 on the dark canvas. Every alias consumer of these two stops is',
      '     already overridden above, so lifting them here touches nothing else. */',
      '  --dsw-static-deepseek-200:#eef4fc;',
      '  --dsw-static-deepseek-500:#8fb1e0;'
    ].join('\n')

    /* Editorial polish + best-effort component patches.
       Everything here is attribute-scoped and adapted from live inspection of
       the running DSH UI. The `[class*=…]` fragments are DSH CSS-module names
       (`md-code-block`, `_card_`/`_copyable_`): if a future DSH version renames
       them the rule simply stops matching and the token layer still carries the
       theme — no layout or behaviour depends on these. */
    var POLISH = [
      '/* Kami editorial rhythm: display serif takes slightly negative tracking,',
      '   the way a typeset page tightens large text. */',
      'html body[data-dsh-kami] :is(h1,h2,h3,h4,h5,h6){letter-spacing:-.011em;}',
      'html body[data-dsh-kami] ::selection{background:rgba(27,54,93,.16);}',
      'html body[data-dsh-kami][data-ds-dark-theme] ::selection{background:rgba(143,177,224,.22);}',
      '/* links carry a hairline rule so ink blue is never the only affordance',
      '   (WCAG 1.4.1 use of colour); the rule warms on hover. */',
      'html body[data-dsh-kami] [class*="markdown"] a[href]{text-decoration:underline;text-decoration-thickness:.055em;text-underline-offset:.19em;text-decoration-color:rgba(27,54,93,.4);}',
      'html body[data-dsh-kami] [class*="markdown"] a[href]:hover{text-decoration-color:currentColor;}',
      'html body[data-dsh-kami][data-ds-dark-theme] [class*="markdown"] a[href]{text-decoration-color:rgba(143,177,224,.45);}',
      '/* code blocks: Kami prints an ivory plate with a hairline rule — the shell',
      '   paints the fill but no rule, so add one as an inset ring (no layout shift) */',
      'html body[data-dsh-kami] [class*="md-code-block"]{box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l2);}',
      'html body[data-dsh-kami][data-ds-dark-theme] [class*="md-code-block"]{box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l1);}',
      '/* blockquote: Kami indents an olive serif quote behind a hairline, no fill */',
      'html body[data-dsh-kami] [class*="markdown"] blockquote{border-left-color:#cfccbd;color:var(--dsw-alias-label-secondary);}',
      'html body[data-dsh-kami][data-ds-dark-theme] [class*="markdown"] blockquote{border-left-color:#44453d;}',
      '/* the workspace hovercard hard-codes a cold #2C2C2E card in its own rule,',
      '   where a body-level token cannot reach it — warm it to Kami --dark-surface */',
      'html body[data-dsh-kami] [class*="_card_"][class*="_copyable_"]{--dsw-hovercard-bg:#30302c;}'
    ].join('\n')

    var CSS = [
      '/* ===== dsh-kami-theme · Kami-inspired editorial skin =====',
      '   Cascade contract: DSH re-appends its own token sheet every time the user',
      '   switches appearance, so document order is NOT a reliable tiebreak — a',
      '   later DSH sheet silently reverted the warm ramps in dark mode. Each block',
      '   below therefore outranks DSH\'s "body[data-ds-dark-theme]" (0,1,1) on',
      '   specificity alone: "html body[data-dsh-kami]" is (0,1,2) and both palette',
      '   blocks are (0,2,2). The palette blocks are mutually exclusive, so a light',
      '   value can never leak into dark and vice versa.',
      '   @see docs/kami-design-token-report.md */',
      'html body[data-dsh-kami] {',
      FONT_ROWS,
      RAMP_ROWS,
      '}',
      '/* light (paper day) */',
      'html body[data-dsh-kami]:not([data-ds-dark-theme]) {',
      LIGHT_ROWS,
      '}',
      '/* dark (night paper) */',
      'html body[data-dsh-kami][data-ds-dark-theme] {',
      DARK_ROWS,
      '}',
      POLISH
    ].join('\n')

    /**
     * Apply the Kami skin: body attribute + one style tag appended after the
     * framework token stylesheets. The effect disposer retracts every write,
     * restoring the native look exactly.
     * @param ctx - owning context (the effect lifecycle owns retraction).
     */
    function apply(ctx) {
      var body = document.body
      body.setAttribute(BODY_ATTR, '')

      var style = document.createElement('style')
      style.id = STYLE_ID
      style.dataset.skinChrome = 'dsh-kami-theme-style'
      style.textContent = CSS
      document.head.appendChild(style)

      ctx.effect(function () {
        return function () {
          body.removeAttribute(BODY_ATTR)
          var el = document.getElementById(STYLE_ID)
          if (el) el.remove()
        }
      }, 'dsh-kami-theme: Kami chrome')
    }

    exports.apply = apply
    return module.exports
  }
})