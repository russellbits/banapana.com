# Layout and Float System Design

**Date:** 2026-03-13
**Status:** Approved

## Overview

This spec covers four areas: (1) a magazine-style CSS layout replacing the current narrow 700px column, (2) an automated float alternation system for sidebars and images, (3) three bug fixes, and (4) section tab rotation.

---

## Section 1: CSS Layout System

`#page` becomes the primary layout container:

- `max-width: 1200px`, centered with `margin: 0 auto`
- Padding: `2rem 80px 4rem` on desktop (keep existing top/bottom, replace `1rem` sides with `80px`)
- Mobile (< 900px): `padding: 2rem 1rem 4rem`, single column, no floats, no negative margins
- The mobile/desktop breakpoint is `900px` throughout — harmonized with `SectionTab.svelte`'s existing `@media (min-width: 900px)` breakpoint

Article prose flows full-width inside `#page` — the current narrow `max-width: 700px` column is removed.

**Lead paragraph / drop cap:**
The existing `#page > p:first-of-type` selector targets the lead paragraph. Since mdsvex renders into `#page` without extra wrapper divs, this selector should continue to work. Verify after implementation. If it breaks, replace with a more specific selector targeting the first `<p>` within the article content area.

**Floated elements** (sidebars, images) use CSS float:

- `counter % 2 === 0` (1st, 3rd, 5th…) → `float: right`, `margin-right: -0.5rem`
- `counter % 2 === 1` (2nd, 4th, 6th…) → `float: left`, `margin-left: -0.5rem`
- Width: 45% of `#page`
- Vertical margin: `1rem` top/bottom, `1rem` on the non-float horizontal side
- The `-0.5rem` negative margin nudges the element slightly past the `80px` padding boundary — a subtle visual breakout, not intended to reach the viewport edge
- No `clear` on floated elements — they stack naturally
- The existing drop-cap uses `float: left` on `::first-letter`. Since the drop-cap float is on a pseudo-element and very small, interaction with article floats is cosmetically acceptable. No special handling needed unless visual inspection reveals a problem.

Mobile behavior: `float: none`, width 100%, no negative margins.

---

## Section 2: Float Alternation Preprocessor

The existing `preprocessSidebar` in `src/lib/preprocess-sidebar.js` is extended to handle both sidebars and images in a single pass, maintaining a shared counter so alternation is global across all floatable elements on the page.

**Counter logic:**
- Counter starts at 0 for each file
- `counter % 2 === 0` → `side="right"` (1st, 3rd, 5th element…)
- `counter % 2 === 1` → `side="left"` (2nd, 4th, 6th element…)
- Counter increments after each floatable element is encountered
- No `clear` is applied on floated elements — they stack naturally

**Early-return guard:**
The current guard `if (!content.includes('[SIDEBAR]')) return;` must be updated to:
```js
if (!content.includes('[SIDEBAR]') && !content.match(/!\[/)) return;
```
This ensures files with images but no sidebars are still processed.

**`[SIDEBAR]` blocks:**
- New behavior: replaced with `<Sidebar title="..." content="..." side="right|left" />`

**Markdown images:**
- The custom preprocessor runs before mdsvex (order in `svelte.config.js`: `[preprocessSidebar(), mdsvex(...)]`), so it sees raw markdown `![alt](src)` syntax
- All markdown images in `.svx` files are converted to `<FloatImage>` — this is intentional. There is no opt-out mechanism in this iteration.
- Images inside code fences must be excluded. The preprocessor should strip code fences before matching images, or use a regex that refuses to match inside `` ``` `` blocks.
- Regex for images (handles optional title, excludes reference-style):
  ```
  /!\[([^\]]*)\]\(([^)]+)\)/g
  ```
  (Does not match `![alt][ref]` reference-style — those are uncommon and can be addressed if needed)
- Preprocessor wraps with `<FloatImage src="..." alt="..." side="right|left" />`
- Note: by converting `![alt](src)` before mdsvex runs, mdsvex's default image rendering (including any remark plugins like `relativeImages`) will NOT apply to these images. `FloatImage.svelte` must handle relative image paths itself. Since `relativeImages` is a remark plugin that transforms paths at the remark AST level, and our preprocessor runs first, `FloatImage` will receive the raw relative path as written in the markdown (e.g., `./media/cover.jpg`). SvelteKit's asset handling should resolve this correctly at build time for static assets.

**Import injection:**
The existing `injectImport` function handles a single import string. Extend it to accept an array of imports and inject all missing ones. Deduplication checks each import string individually before injecting.

```js
const SIDEBAR_IMPORT = `import Sidebar from '$lib/components/Sidebar.svelte';`;
const FLOAT_IMAGE_IMPORT = `import FloatImage from '$lib/components/FloatImage.svelte';`;
```

**Component changes:**

`Sidebar.svelte`:
- Gains a `side` prop (`'right' | 'left'`, default `'right'`)
- Applies `float: right` or `float: left` based on prop
- `float: right` → `margin-right: -0.5rem`; `float: left` → `margin-left: -0.5rem`
- Mobile (< 900px): `float: none`, width 100%, no negative margin

`FloatImage.svelte` (new):
- Props: `src`, `alt`, `side` (`'right' | 'left'`, default `'right'`)
- Renders `<figure><img src={src} alt={alt} /></figure>`
- Same float/margin CSS rules as Sidebar
- Mobile (< 900px): `float: none`, width 100%

---

## Section 3: Bug Fixes

**3a. 2023 article frontmatter**
`src/routes/2023/12/le-grande-bibliotheque-and-the-future-with-ai/+page.svx` has a blank line immediately after the opening `---`. mdsvex interprets this as the end of the frontmatter block, causing YAML to go unparsed and render as raw text. The Cover component never mounts because `title` is empty.

Fix: remove the blank line. One-line edit.

**3b. TOC article count**
`getAllArticles()` filters by date ≤ today. All 6 articles have past dates, so logic is correct. The likely cause is Vite's `import.meta.glob` not hot-reloading the `src/routes/2023/` directory added while the dev server was running. This is a diagnostic/operational fix — no code change is planned. Verify count after dev server restart. If still wrong, audit the glob pattern and date filter in `src/lib/content.js` as a follow-up task.

**3c. Dev server content watcher**
`scripts/sync-content.js` already exists. Create `scripts/watch-content.js` which:
1. Runs `sync-content.js` once on startup
2. Watches the `./content` directory with `fs.watch` for file changes, re-running sync on each change
3. Spawns `vite dev` as a child process with `child_process.spawn`, forwarding stdio and signals

Add to `package.json`:
```
"dev:full": "node scripts/watch-content.js"
```

`npm run dev` remains unchanged.

---

## Section 4: Section Tab Rotation

Each article's section tab gets a consistent, unique-looking rotation between -4° and +4°, generated deterministically from the page URL. Both server (prerender) and client compute the same value from the same URL — no hydration mismatch.

**Hash function** (in `+layout.svelte` or a utility):
```js
function slugRotation(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return ((Math.abs(hash) % 9) - 4); // integer -4 to +4
}
```

**In `+layout.svelte`** (`$page` is already imported from `'$app/stores'` and used with `$derived` — this follows the same existing pattern):
```js
const rotation = $derived(slugRotation($page.url.pathname));
```

Pass to `SectionTab`:
```svelte
{#if section}<SectionTab {section} {rotation} />{/if}
```

**In `SectionTab.svelte`:**
- Gains a `rotation` prop (number, default `0`)
- Set `style="--rotation: {rotation}deg"` on the root element
- CSS handles transform composition per breakpoint:
  - Desktop: `.section-tab { transform: translateY(-50%) rotate(var(--rotation)); }`
  - Mobile: `.section-tab { transform: rotate(var(--rotation)); }`
- This avoids inline `transform` overriding the CSS `translateY` rule

The rotation value is baked into prerendered HTML — no `onMount` or client-side randomness needed.

---

## Files Affected

| File | Change |
|------|--------|
| `src/app.css` | Replace `#page` narrow column with 1200px layout, update padding |
| `src/lib/preprocess-sidebar.js` | Extend to handle image alternation, side prop injection, updated guard, multi-import injection |
| `src/lib/components/Sidebar.svelte` | Add `side` prop, float CSS |
| `src/lib/components/FloatImage.svelte` | New component |
| `src/lib/components/SectionTab.svelte` | Add `rotation` prop, CSS custom property for rotation |
| `src/routes/+layout.svelte` | Compute `rotation` from slug, pass to `SectionTab` |
| `src/routes/2023/12/le-grande-bibliotheque.../+page.svx` | Remove blank line in frontmatter |
| `package.json` | Add `dev:full` script |
| `scripts/watch-content.js` (new) | File watcher that re-runs sync and spawns Vite |
