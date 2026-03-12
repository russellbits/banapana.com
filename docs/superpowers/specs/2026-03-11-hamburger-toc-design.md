# Hamburger Menu & Table of Contents — Design Spec

**Date:** 2026-03-11
**Status:** Approved

---

## Goal

Add a hamburger menu button to the Cover component (top-right, mirroring PubDate) that opens a frosted-glass Table of Contents sheet listing all published articles with dates and links.

---

## Components

### `HamburgerMenu.svelte`

A toggle button positioned absolute in the top-right of the Cover.

**Appearance:**
- `54×44px` rounded rectangle (`border-radius: 10px`)
- Background: `#000`
- Three horizontal lines: `26×3px`, `border-radius: 2px`, color `rgba(117, 250, 76, 0.8)` (matches PubDate green)
- Position: `top: 20px; right: 20px; z-index: 10` (mirrors `.pubdate-wrapper` positioning)

**Behavior:**
- No internal state — controlled by parent (Cover)
- Accepts `open` prop (`export let open = false`)
- Dispatches a `toggle` event via `createEventDispatcher` when clicked (Svelte 4 event style, matching Cover.svelte)

---

### `TableOfContents.svelte`

A glass sheet that overlays the Cover from the top when open.

**Appearance:**
- Position: `absolute; top: 0; left: 0; right: 0; z-index: 20`
- Background: `rgba(10, 5, 18, 0.78)`
- Backdrop filter: `blur(28px) saturate(160%)` — frosted glass blurring the editorial cover image beneath
- Bottom border: `1px solid rgba(255,255,255,0.08)` — subtle glass edge
- Slide-in animation: `transform: translateY(-100%)` → `translateY(0)` on open, CSS transition `0.3s ease`

**Content layout (centered column):**
1. "TABLE OF CONTENTS" — `0.68rem`, uppercase, `letter-spacing: 0.22em`, muted white
2. ✕ close button — top-right, `rgba(117, 250, 76, 0.75)`, calls `onclose` callback
3. Article list — newest first, with between each entry:
   - Date line: `Month Day, Year` format (e.g. "February 12, 2026"), `0.68rem`, `rgba(255,255,255,0.38)`
   - Title: `<a>` link to article route, Georgia serif, `0.98rem`, `rgba(255,255,255,0.88)`, green underline on hover
   - Emoji separator row between entries (not after the last one): three emoji, `rgba(255,255,255,0.3)`

**Height:** `fit-content` (grows with article list). No fixed height — the sheet sizes to its content and the cover clips any overflow via `overflow: hidden`.

**Props (Svelte 4 `export let` style):**
- `articles` — array of `{ title, published, path }` passed in from parent
- Dispatches a `close` event via `createEventDispatcher` when ✕ is clicked

---

### Changes to `Cover.svelte`

- Import and render `HamburgerMenu` and `TableOfContents`
- Add local `let open = false` state (intentionally staying Svelte 4 style — do not use `$state()`)
- Pass `articles` array down to `TableOfContents`
- Wire toggle/close callbacks

---

### Changes to `content.js`

Add `getAllArticles()` function:

```js
export function getAllArticles() {
  return Object.entries(pages)
    // Only include dated article routes (year/month/slug structure)
    .filter(([path]) => /\/src\/routes\/\d{4}\/\d{2}\/[^/]+\/\+page\.svx$/.test(path))
    .map(([path, mod]) => {
      const raw = mod?.metadata ?? {};
      const data = {};
      for (const [k, v] of Object.entries(raw)) data[k.toLowerCase()] = v;

      // Derive URL: /src/routes/2026/01/the-contentkeeper/+page.svx → /2026/01/the-contentkeeper
      const url = path
        .replace('/src/routes', '')
        .replace('/+page.svx', '');

      return { title: data.title, published: data.published, path: url };
    })
    .filter(a => {
      if (!a.published) return false;
      return new Date(a.published) <= new Date();
    })
    .sort((a, b) => new Date(b.published) - new Date(a.published));
}
```

Published date filtering mirrors the existing sync-script logic: `Published:` date must be today or in the past.

---

### Changes to `+layout.svelte`

The existing layout uses Svelte 5 runes (`$props()`, `$derived()`). Add `getAllArticles()` inside the existing `<script>` block — do not replace the runes usage:

```svelte
<script>
  // ...existing imports and runes...
  import { getAllArticles } from '$lib/content.js';
  const articles = getAllArticles(); // plain const — not reactive, list is static at build time
</script>

<!-- existing Cover render, add articles prop -->
{#if data.title}
  <Cover title={data.title} cover_img_url={data.cover} {articles} />
{/if}
```

---

## Emoji Separators

A fixed array of emoji triples, cycled by index (so order is stable across renders):

```js
const SEPARATORS = [
  '📧 🚫 ✊',
  '🤖 📝 ✨',
  '🌷 💰 🤖',
  '🧠 🔓 💭',
  '🌊 🎯 🔥',
  '🎲 🌙 ⚡',
];
```

Used as `SEPARATORS[i % SEPARATORS.length]` between article entries.

---

## Date Formatting

```js
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  // → "February 12, 2026"
}
```

---

## File Map

| File | Change |
|------|--------|
| `src/lib/content.js` | Add `getAllArticles()` |
| `src/lib/components/HamburgerMenu.svelte` | Create new |
| `src/lib/components/TableOfContents.svelte` | Create new |
| `src/lib/components/Cover.svelte` | Import + wire both components |
| `src/routes/+layout.svelte` | Pass `articles` to Cover |

---

## Out of Scope

- Keyboard accessibility / focus trapping (future)
- Mobile-specific layout changes
- Closing the sheet by clicking outside it
