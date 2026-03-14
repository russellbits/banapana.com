# Layout and Float System Design

**Date:** 2026-03-13
**Status:** Approved

## Overview

This spec covers four areas: (1) a magazine-style CSS layout replacing the current narrow 700px column, (2) an automated float alternation system for sidebars and images, (3) three bug fixes, and (4) section tab rotation.

---

## Section 1: CSS Layout System

`#page` becomes the primary layout container:

- `max-width: 1200px`, centered with `margin: 0 auto`
- Side padding: ~80px on desktop, 1rem on mobile
- Article prose flows full-width inside `#page` — the current narrow 700px column is removed
- Mobile (< 768px): single column, no floats, no negative margins

Floated elements (sidebars, images) use CSS `float: right` (odd occurrences) or `float: left` (even occurrences):

- Width: ~45% of the container
- Vertical margin: 1rem top/bottom
- Horizontal margin on the float side: `-0.5rem` (nudges element slightly past the container edge toward the page boundary)
- `clear` is not applied globally — elements wrap naturally around floats

The "4-column" conceptual model maps to: body text occupying the full width, floated elements occupying ~half that width and positioned in the left or right gutter. CSS Grid is not used for the prose layout because CSS Grid does not support text-wrapping around grid items; CSS floats are the correct primitive here.

---

## Section 2: Float Alternation Preprocessor

The existing `preprocessSidebar` in `src/lib/preprocess-sidebar.js` is extended to handle both sidebars and images in a single pass, maintaining a shared counter so alternation is global across all floatable elements on the page.

**Counter logic:**
- Counter starts at 0 for each file
- Odd counter value (0, 2, 4…) → `side="right"`
- Even counter value (1, 3, 5…) → `side="left"`
- Counter increments after each floatable element is encountered

**`[SIDEBAR]` blocks:**
- Current behavior: replaced with `<Sidebar title="..." content="..." />`
- New behavior: replaced with `<Sidebar title="..." content="..." side="right|left" />`

**Markdown images:**
- Pattern: `![alt](src)` (standard markdown image syntax in the markup phase, before mdsvex processes it)
- Preprocessor wraps with `<FloatImage src="..." alt="..." side="right|left" />`
- The preprocessor also injects the `FloatImage` import alongside the existing `Sidebar` import

**Component changes:**

`Sidebar.svelte`:
- Gains a `side` prop (`'right' | 'left'`, default `'right'`)
- Applies `float: right` or `float: left` based on prop
- Applies `-0.5rem` margin on the float side
- Mobile: `float: none`, full width, no negative margin

`FloatImage.svelte` (new):
- Props: `src`, `alt`, `side`
- Renders a `<figure>` containing an `<img>`
- Same float/margin CSS rules as `Sidebar`
- Mobile: `float: none`, full width

---

## Section 3: Bug Fixes

**3a. 2023 article frontmatter**
`src/routes/2023/12/le-grande-bibliotheque-and-the-future-with-ai/+page.svx` has a blank line immediately after the opening `---`. mdsvex interprets this as the end of the frontmatter block, causing YAML to go unparsed and render as raw text. The Cover component never mounts because `title` is empty.

Fix: remove the blank line. One-line edit.

**3b. TOC article count**
`getAllArticles()` filters by date ≤ today. All 6 articles have past dates, so logic is correct. The likely cause is Vite's `import.meta.glob` not hot-reloading the `src/routes/2023/` directory added while the dev server was running. Fix: restart the dev server and verify count. If still wrong, audit the glob pattern and date filter in `src/lib/content.js`.

**3c. Dev server content watcher**
Add a `dev:full` npm script to `package.json`:

```
"dev:full": "node scripts/sync-content.js && vite dev"
```

Additionally, add a file watcher inside `scripts/sync-content.js` (or a companion `scripts/watch-content.js`) using Node's built-in `fs.watch` on the `./content` directory that re-runs sync on any file change. This keeps `npm run dev` unchanged for users who don't need content sync.

---

## Section 4: Section Tab Rotation

Each article's section tab gets a consistent, unique-looking rotation between -4° and +4°, generated deterministically from the page URL so server and client compute the same value (no hydration mismatch).

**Implementation:**

```js
function slugRotation(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return ((Math.abs(hash) % 9) - 4); // integer -4 to +4
}
```

In `+layout.svelte`:
```js
const rotation = $derived(slugRotation($page.url.pathname));
```

`SectionTab.svelte` gains a `rotation` prop (number, default `0`) and applies it as an inline style:
```svelte
style="transform: rotate({rotation}deg)"
```

The rotation is baked into prerendered HTML — no `onMount` or client-side randomness needed.

---

## Files Affected

| File | Change |
|------|--------|
| `src/app.css` | Replace `#page` narrow column with 1200px layout |
| `src/lib/preprocess-sidebar.js` | Extend to handle image alternation + side prop injection |
| `src/lib/components/Sidebar.svelte` | Add `side` prop, float CSS |
| `src/lib/components/FloatImage.svelte` | New component |
| `src/lib/components/SectionTab.svelte` | Add `rotation` prop, inline style |
| `src/routes/+layout.svelte` | Compute `rotation` from slug, pass to SectionTab |
| `src/routes/2023/12/le-grande-bibliotheque.../+page.svx` | Remove blank line in frontmatter |
| `package.json` | Add `dev:full` script |
| `scripts/sync-content.js` or new `scripts/watch-content.js` | Add file watcher |
