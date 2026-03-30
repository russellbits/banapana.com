# SiteMenu Component — Design Spec

**Date:** 2026-03-21
**Branch:** fix/article-header-and-doomtubers

---

## Overview

A new `SiteMenu` component rendered as the first element in the layout template body on every page (unconditionally). It is a black, 85px-tall horizontal bar that sticks to the top of the viewport as the user scrolls. The right side carries five social icon links. The left side is intentionally empty. The existing `PubDate` component (inside `Cover`) is repositioned to visually protrude up into the menu bar.

---

## Component

**File:** `src/lib/components/SiteMenu.svelte`

- No props — all content (links, icons) is hardcoded site-wide social data.
- Renders a single `<nav>` with one child: `.social-icons` flex container.
- Renders unconditionally on all pages, including the home page.
- Use **Svelte 5 runes syntax** to match `+layout.svelte`. Since the component has no props or reactive state, no `<script>` block is required at all — the component is purely markup and styles.

---

## Layout Position

Added to `src/routes/+layout.svelte` as the first rendered element in the template body (after `<svelte:head>`), before the conditional `<Cover>` block:

```svelte
<SiteMenu />         <!-- new, unconditional -->
{#if title}
  <Cover />
{/if}
{#if author}
  <ArticleHeader />
{/if}
{#if section}
  <SectionTab />
{/if}
<div id="page">
  {@render children()}
</div>
```

No margin or padding should exist between `<SiteMenu>` and `<Cover>` — `body { margin: 0; padding: 0 }` is already set in `app.css` and SiteMenu must not introduce any bottom margin.

On pages without a `title` (no Cover rendered), the SiteMenu bar appears alone at the top with `#page` content scrolling beneath it — this is acceptable and requires no special handling.

---

## Sticky Behavior

```css
nav {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

The bar starts in normal document flow at the very top of the page. Once the user begins scrolling, it locks to the top of the viewport. The Cover and all content beneath scroll under it.

---

## Visual Spec

### Nav bar

| Property    | Value    |
|-------------|----------|
| background  | `#000`   |
| height      | `85px`   |
| width       | `100%`   |

### Social icons container (`.social-icons`)

| Property        | Value                          |
|-----------------|--------------------------------|
| display         | `flex`                         |
| align-items     | `center`                       |
| height          | `100%`                         |
| gap             | `10px`                         |
| padding         | `0 10px`                       |
| margin-left     | `auto`                         |
| total width     | 5×40px icons + 4×10px gaps + 2×10px padding = **260px** |

### Icon images

| Property  | Value                               |
|-----------|-------------------------------------|
| width     | `40px`                              |
| height    | `40px`                              |
| filter    | `brightness(0) invert(1)` (forces white regardless of source PNG color) |
| alt       | `""` — the parent `<a>` carries the accessible label via `aria-label` |

### Social links (left to right)

All five PNG assets already exist in `static/images/social-icons/`.

| Icon file                                  | URL                                                    | aria-label   |
|--------------------------------------------|--------------------------------------------------------|--------------|
| `/images/social-icons/substack-logo.png`   | https://banapana.substack.com                          | `"Substack"` |
| `/images/social-icons/medium-logo.png`     | https://medium.com/minds-on-media                      | `"Medium"`   |
| `/images/social-icons/linkedin-logo.png`   | https://linkedin.com/in/russellbits                    | `"LinkedIn"` |
| `/images/social-icons/quora-logo.png`      | https://www.quora.com/profile/Russell-Warner           | `"Quora"`    |
| `/images/social-icons/reddit-logo.png`     | https://www.reddit.com/user/ruzelmania/                | `"Reddit"`   |

All links: `target="_blank" rel="noopener noreferrer"`. The `<nav>` has `aria-label="Social links"`.

### Mobile / responsive

On viewports ≤ 480px, icon size reduces to `32px × 32px` and gap reduces to `8px`, keeping the row proportional. Bar height remains 85px.

---

## PubDate Overlap

### The overflow problem

`PubDate`'s wrapper (`.pubdate-wrapper`) is currently a direct child of `.cover`, which has `overflow: hidden`. Giving `.pubdate-wrapper` a negative `top` value would cause it to be clipped. **The fix is to move `.pubdate-wrapper` out of `.cover` and make it a direct child of `.cover-wrapper` instead.** `.cover-wrapper` already has `position: relative` and no `overflow` set (defaults to `visible`), so absolutely-positioned children can escape its bounds freely.

### New positioning

`.pubdate-wrapper` moves to `.cover-wrapper` in the Cover template:

```html
<div class="cover-wrapper">
  <div class="pubdate-wrapper">   <!-- moved here, outside .cover -->
    <PubDate />
  </div>
  <div class="cover">...</div>
  ...
</div>
```

CSS for `.pubdate-wrapper`:

| Property    | Value    | Reasoning                                                                 |
|-------------|----------|---------------------------------------------------------------------------|
| position    | absolute | Positioned relative to `.cover-wrapper`                                   |
| top         | `-25px`  | Half of the 50px-tall PubDate circle sits above `.cover-wrapper`'s top edge, centering it on the menu/cover boundary |
| left        | `20px`   | Unchanged from current                                                    |
| z-index     | `200`    | Above the menu's `z-index: 100`                                           |

The PubDate circle is confirmed 50px (`width: 50px; height: 50px` in `PubDate.svelte`). At page load, `.cover-wrapper` starts immediately below the 85px SiteMenu (no margin between them). With `top: -25px`, the circle's center aligns exactly with the menu/cover boundary.

### Cover.svelte syntax note

`Cover.svelte` uses Svelte 4 `export let` prop syntax. The changes to this file are limited to: (1) moving `.pubdate-wrapper` in the HTML template, and (2) updating its CSS. No syntax migration is required.

---

## Files Changed

| File                                      | Change                                                              |
|-------------------------------------------|---------------------------------------------------------------------|
| `src/lib/components/SiteMenu.svelte`      | Create new component (Svelte 5, no script block needed)             |
| `src/routes/+layout.svelte`              | Import and render `<SiteMenu />` as first template body element     |
| `src/lib/components/Cover.svelte`         | Move `.pubdate-wrapper` to `.cover-wrapper` level; update its CSS   |
