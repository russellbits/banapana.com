# Layout and Float System Design

**Date:** 2026-03-13
**Status:** Approved

## Overview

This spec covers four areas: (1) a magazine-style CSS layout replacing the current narrow 700px column, (2) an automated float alternation system for sidebars and images, (3) three bug fixes, and (4) section tab rotation.

---

## Section 1: CSS Layout System

`#page` becomes the primary layout container:

- `max-width: 1200px`, centered with `margin: 0 auto`
- Padding: `2rem 80px 4rem` on desktop (replaces existing `2rem 1rem 4rem`)
- `overflow: flow-root` on `#page` to contain floated children (prevents parent collapse)
- Mobile (< 900px): `padding: 2rem 1rem 4rem`, single column, no floats, no negative margins
- The mobile/desktop breakpoint is `900px` throughout — harmonized with `SectionTab.svelte`'s existing `@media (min-width: 900px)` breakpoint

Article prose flows full-width inside `#page` — the current `max-width: 700px` column rule is removed.

**Lead paragraph / drop cap:**
The existing `#page > p:first-of-type` selector targets the lead paragraph with a drop cap. mdsvex renders markdown directly into the `#page` container without a wrapper div, so `> p:first-of-type` should still match. If it does not after implementation, replace with `#page p:first-of-type` (descendant rather than direct child).

**Floated element sizing and positioning:**
With `#page` at `max-width: 1200px` and `80px` side padding, the interior content width is `1200px - 160px = 1040px`. Floated elements (sidebars, images) are `45%` of the full `#page` width (i.e., `45%` on the element itself, which is a percentage of the containing block, `#page`), giving approximately 468px — just under half the interior content width, leaving enough room for text to wrap alongside.

- `counter % 2 === 0` (1st, 3rd, 5th…) → `float: right`, `margin-right: -0.5rem`
- `counter % 2 === 1` (2nd, 4th, 6th…) → `float: left`, `margin-left: -0.5rem`
- Width: `45%`
- Vertical margin: `1rem` top/bottom; `1rem` on the non-float horizontal side
- The `-0.5rem` negative margin nudges the element slightly past the `80px` padding boundary — a subtle visual breakout, not intended to reach the viewport edge
- No `clear` on floated elements — they stack naturally
- The existing drop-cap `::first-letter` float is a pseudo-element and very small; interaction with article floats is cosmetically acceptable

Mobile behavior: `float: none`, `width: 100%`, no negative margins.

---

## Section 2: Float Alternation Preprocessor

The existing `preprocessSidebar` in `src/lib/preprocess-sidebar.js` is extended to handle both sidebars and images in a single pass, maintaining a shared counter so alternation is global across all floatable elements on the page.

**Counter logic:**
- Counter starts at 0 for each file
- `counter % 2 === 0` → `side="right"` (1st, 3rd, 5th element…)
- `counter % 2 === 1` → `side="left"` (2nd, 4th, 6th element…)
- Counter increments after each floatable element is encountered
- No `clear` on floated elements

**Early-return guard:**
Replace the current guard with:
```js
const hasSidebar = content.includes('[SIDEBAR]');
const hasImage = content.includes('![');
if (!hasSidebar && !hasImage) return;
```
The `![` check is intentionally simple — a false positive (e.g., `![` in a code fence) results in unnecessary processing but no incorrect output, because the image regex (see below) excludes code fences.

**Code fence exclusion:**
Before applying image replacement, strip code fences from a working copy of the content used only for matching. Replace the content in fenced blocks with placeholder whitespace of equal length to preserve character offsets, then apply the image regex. Use the original content string for actual replacement (not the stripped copy) so fenced content is never accidentally modified.

**`[SIDEBAR]` blocks:**
Replacement function `parseSidebarBlock(blockContent, side)`:
- `side` parameter added (`'right' | 'left'`)
- Returns `<Sidebar title="..." content="..." side="{side}" />`

Call site in the `.replace()` callback:
```js
content.replace(SIDEBAR_BLOCK_REGEX, (_, blockContent) => {
  const tag = parseSidebarBlock(blockContent, counter % 2 === 0 ? 'right' : 'left');
  counter++;
  return tag;
});
```

**Markdown images:**
Regex: `/!\[([^\]]*)\]\(([^)\s"]+)(?:\s+"[^"]*")?\)/g`
- Group 1: alt text
- Group 2: src (stops before optional title attribute — `[^)\s"]+`)
- Optional title `(?:\s+"[^"]*")?` is matched and discarded
- Does not match reference-style images (`![alt][ref]`)

Replacement in the same pass (or a second `.replace()` after sidebar replacement, sharing the same counter):
```js
content.replace(IMAGE_REGEX, (_, alt, src) => {
  const tag = `<FloatImage src="${src}" alt="${alt}" side="${counter % 2 === 0 ? 'right' : 'left'}" />`;
  counter++;
  return tag;
});
```

Note: converting `![alt](src)` before mdsvex means mdsvex's remark plugins (including `relativeImages`) do not process these images. `FloatImage` receives the raw path as written (e.g., `./media/cover.jpg`). SvelteKit resolves static asset paths at build time correctly for this case.

**Import injection:**
Rename `injectImport` to `injectImports(code, imports)` where `imports` is an array of import strings. For each import, check if already present before injecting. Both imports are injected in a single `<script>` tag modification:

```js
const SIDEBAR_IMPORT = `import Sidebar from '$lib/components/Sidebar.svelte';`;
const FLOAT_IMAGE_IMPORT = `import FloatImage from '$lib/components/FloatImage.svelte';`;

function injectImports(code, imports) {
  const missing = imports.filter(imp => !code.includes(imp));
  if (missing.length === 0) return code;
  // inject into existing <script> or prepend new <script> block
}
```

**Component changes:**

`Sidebar.svelte`:
- Gains a `side` prop (`'right' | 'left'`, default `'right'`)
- Width: `45%`
- `float: right` + `margin-right: -0.5rem` when `side === 'right'`
- `float: left` + `margin-left: -0.5rem` when `side === 'left'`
- Mobile (< 900px): `float: none`, `width: 100%`, no negative margin

`FloatImage.svelte` (new):
- Props: `src`, `alt`, `side` (`'right' | 'left'`, default `'right'`)
- Width: `45%`
- Renders `<figure><img src={src} alt={alt} /></figure>`
- Same float/margin CSS rules as Sidebar (see above)
- Mobile (< 900px): `float: none`, `width: 100%`

---

## Section 3: Bug Fixes

**3a. 2023 article frontmatter**
`src/routes/2023/12/le-grande-bibliotheque-and-the-future-with-ai/+page.svx` has a blank line immediately after the opening `---`. mdsvex interprets this as the end of the frontmatter block, causing YAML to go unparsed and render as raw text. The Cover component never mounts because `title` is empty.

Fix: remove the blank line. One-line edit.

**3b. TOC article count**
`getAllArticles()` filters by date ≤ today. All 6 articles have past dates, so logic is correct. The likely cause is Vite's `import.meta.glob` not hot-reloading the `src/routes/2023/` directory added while the dev server was running. This is a diagnostic/operational fix — no code change is planned. Verify count after dev server restart. If still wrong, audit the glob pattern and date filter in `src/lib/content.js` as a follow-up task.

**3c. Dev server content watcher**
`scripts/sync-content.js` already exists. Create `scripts/watch-content.js` which:
1. Runs `sync-content.js` once on startup (via `require`/`import` or `child_process.execSync`)
2. Uses `fs.watch('./content', { recursive: true })` to re-run sync on any file change
3. Spawns `vite dev` as a child process with `child_process.spawn('npx', ['vite', 'dev'], { stdio: 'inherit' })`, so Vite's output goes to the terminal and signals are forwarded

Add to `package.json`:
```json
"dev:full": "node scripts/watch-content.js"
```

`npm run dev` remains unchanged.

---

## Section 4: Section Tab Rotation

Each article's section tab gets a consistent, unique-looking rotation between -4° and +4°, generated deterministically from the page URL. Both server (prerender) and client compute the same value from the same URL — no hydration mismatch.

**Placement:** The `slugRotation` function lives in `src/lib/sections.js` alongside the existing section config, making it importable and testable.

```js
export function slugRotation(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return ((Math.abs(hash) % 9) - 4); // integer -4 to +4
}
```

**In `+layout.svelte`:**
`page` is imported from `'$app/stores'` and auto-subscribed as `$page`. The rotation is derived reactively using the existing store subscription pattern:
```js
import { slugRotation } from '$lib/sections.js';
const rotation = $derived(slugRotation($page.url.pathname));
```

Updated call site:
```svelte
{#if section}<SectionTab {section} {rotation} />{/if}
```

**In `SectionTab.svelte`:**
- Gains a `rotation` prop (number, default `0`)
- Set `style="--rotation: {rotation}deg"` on the root element
- CSS uses the custom property to compose transforms per breakpoint:
  - Mobile default: `.section-tab { transform: rotate(var(--rotation, 0deg)); }`
  - Desktop `@media (min-width: 900px)`: `.section-tab { transform: translateY(-50%) rotate(var(--rotation, 0deg)); }`

The rotation value is baked into prerendered HTML — no `onMount` or client-side randomness needed.

---

## Files Affected

| File | Change |
|------|--------|
| `src/app.css` | Update `#page`: 1200px max-width, 80px side padding, `overflow: flow-root` |
| `src/lib/sections.js` | Add `slugRotation` export |
| `src/lib/preprocess-sidebar.js` | Extend: image alternation, side prop, updated guard, code fence exclusion, multi-import injection |
| `src/lib/components/Sidebar.svelte` | Add `side` prop, float CSS, width |
| `src/lib/components/FloatImage.svelte` | New component |
| `src/lib/components/SectionTab.svelte` | Add `rotation` prop, CSS custom property |
| `src/routes/+layout.svelte` | Import `slugRotation`, compute `rotation`, pass to `SectionTab` |
| `src/routes/2023/12/le-grande-bibliotheque.../+page.svx` | Remove blank line in frontmatter |
| `package.json` | Add `dev:full` script |
| `scripts/watch-content.js` (new) | File watcher that re-runs sync and spawns Vite |
