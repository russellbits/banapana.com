# Article_Header Component — Design Spec

**Date:** 2026-03-19
**Status:** Approved

---

## Overview

A new `Article_Header.svelte` component that appears on every article page, vertically between the `Cover` component and the article body. It shows article metadata in two rows and is fully responsive.

---

## Layout

### Row 1 — Byline

A flex row with `gap: 2rem` and `align-items: center` containing three items:

1. **Author** — 36×36px circular avatar image (`border-radius: 50%`) + author name in italics at `0.9rem`, grouped as a single flex item with `gap: 0.6rem`
2. **Read time** — `⏱ N min read` at `0.85rem` in `var(--color-muted)`
3. **Date** — formatted as `Mmm DD, YYYY` at `0.85rem` in `var(--color-muted)`

### Row 2 — Actions

A flex row with `padding: 0.5rem 0`, `margin-top: 0.75rem`, `gap: 1.5rem`, `align-items: center`, and `font-size: 1.2rem`. Bordered with `1px solid var(--color-rule)` on both `border-top` and `border-bottom`. Contains three decorative emoji: 👏 🔖 🔗. Left-aligned. No interaction behavior in this iteration.

### Responsive behavior

At `≤600px`, Row 1 switches to `flex-direction: column` with `align-items: flex-start` and `gap: 0.5rem`:
- Avatar + name remain grouped on the first line (as a flex row, unchanged)
- Read time and date move to a sub-row beneath, using `display: flex; gap: 1.2rem; font-size: 0.8rem`

Row 2 is unchanged at all breakpoints.

### Width alignment

The component's outer wrapper uses `max-width: 1000px; margin: 0 auto; padding: 0 80px` to mirror `#page` at desktop widths. At `≤900px`, padding drops to `0 1rem` to match `#page`'s responsive padding. This keeps the component's content edge-aligned with the article text below it.

---

## Data Flow

### Author field in frontmatter

All published articles have an `Author:` field in their frontmatter (e.g. `Author: R.E. Warner`). `getPageData()` in `content.js` already normalizes all frontmatter keys to lowercase, so this arrives as `$page.data.author`. Articles without an `Author:` field (e.g. `notes-on-cognitive-liberty`) will have `$page.data.author` be `undefined`, and the component will not render. No frontmatter changes are required as part of this task.

### Word count

`content.js` adds a second `import.meta.glob` call using **the identical glob pattern** as the existing `pages` glob (`/src/routes/**/*.svx`), but importing as raw text:

```js
const rawPages = import.meta.glob('/src/routes/**/*.svx', {
  query: '?raw',
  import: 'default',
  eager: true
});
```

In `getPageData()`, the raw string is retrieved using the **same key** as `pages`: `${routePath}/+page.svx`. The frontmatter block is stripped by removing the content matched by `/^---[\s\S]*?---\n/`. The remaining body text is split on `/\s+/` and filtered to remove empty strings; the array length is `wordCount`. This is returned in the page data object.

### Date field

The `Published:` frontmatter key (e.g. `Published: 2025-04-12`) is a date string distinct from `Status: published` (the publication status string). `getPageData()` lowercases both to `data.published` (date) and `data.status` (status string). The date displayed in the header is `$page.data.published ?? $page.data.created` — the `Published:` date if set, otherwise the `Created:` date. Both are ISO `YYYY-MM-DD` strings.

### Props

`Article_Header.svelte` receives three props:

| Prop | Type | Source |
|------|------|--------|
| `author` | string | `$page.data.author` |
| `wordCount` | number | `$page.data.wordCount` |
| `date` | string | `$page.data.published ?? $page.data.created` (ISO `YYYY-MM-DD`) |

### Avatar resolution

The author name is slugified using the following operations **in this order**:
1. Lowercase: `"R. E. Warner"` → `"r. e. warner"`
2. Strip all characters that are not `[a-z0-9 -]` (letters, digits, spaces, hyphens): `"r. e. warner"` → `"r e warner"` (dots removed)
3. Replace spaces with hyphens: `"r e warner"` → `"r-e-warner"`
4. Collapse consecutive hyphens (e.g. `--` → `-`): `"r-e-warner"` (unchanged)

The avatar `src` is `/images/authors/{slug}.png`. An `onerror` handler on the `<img>` sets `src` to `/images/default_gravatar.gif`. All author avatars are PNG files stored in `static/images/authors/`.

### Date formatting

The `date` prop is an ISO `YYYY-MM-DD` string. Because this site is fully prerendered (runs in Node.js at build time, not in the browser), the `timeZone: 'UTC'` option is critical to avoid off-by-one day errors from the Node.js local timezone:

```js
const d = new Date(date + 'T00:00:00Z');
const formatted = d.toLocaleDateString('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC'
});
```

This produces e.g. `Mar 19, 2026`.

### Read time

```js
const readTime = Math.ceil(wordCount / 240);
```

Displayed as `⏱ ${readTime} min read`.

---

## Architecture

### Placement in `+layout.svelte`

`Article_Header` is added between `Cover` and `SectionTab` in the root layout. It renders only when `$page.data.author` is present. The existing `style` expression on `#page` must not be changed.

```svelte
{#if title}
  <Cover {title} cover_img_url={cover} {articles} />
{/if}

{#if author}
  <ArticleHeader {author} {wordCount} {date} />
{/if}

{#if section}
  <SectionTab {section} {rotation} />
{/if}

<div id="page" style={sectionData ? `--section-color: ${sectionData.color}` : ''}>
  {@render children()}
</div>
```

Visual order from top: Cover → Article_Header → SectionTab → article body.

The `author`, `wordCount`, and `date` values are derived at the top of the layout script alongside the existing derivations:

```js
const author   = $derived($page.data?.author ?? '');
const wordCount = $derived($page.data?.wordCount ?? 0);
const date     = $derived($page.data?.published ?? $page.data?.created ?? '');
```

The raw key lookup in `getPageData()` uses `${routePath}/+page.svx` — the same key pattern as the existing `pages` lookup — so no additional key logic is needed.

### Files changed

| File | Change |
|------|--------|
| `src/lib/components/Article_Header.svelte` | **New** — the component |
| `src/lib/content.js` | **Modified** — add `rawPages` glob and `wordCount` to `getPageData()` |
| `src/routes/+layout.svelte` | **Modified** — import and render `Article_Header` |

---

## Out of scope

- Applause count tracking (backend/localStorage)
- Bookmark persistence
- Share functionality
- Multiple authors per article
- Adding `Author:` frontmatter to articles that currently lack it
