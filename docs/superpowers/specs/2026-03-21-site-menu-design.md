# SiteMenu Component — Design Spec

**Date:** 2026-03-21
**Branch:** fix/article-header-and-doomtubers

---

## Overview

A new `SiteMenu` component rendered as the first element on every page. It is a black, 85px-tall horizontal bar that sticks to the top of the viewport as the user scrolls. The right side carries five social icon links. The left side is intentionally empty. The existing `PubDate` component (inside `Cover`) is repositioned to visually protrude up into the menu bar.

---

## Component

**File:** `src/lib/components/SiteMenu.svelte`

- No props — all content (links, icons) is hardcoded site-wide social data.
- Renders a single `<nav>` with one child: `.social-icons` flex container.

---

## Layout Position

Added to `src/routes/+layout.svelte` before `<Cover>`:

```
<SiteMenu />
<Cover />
<ArticleHeader />
<SectionTab />
<#page>
```

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
| filter    | `brightness(0) invert(1)` (white)   |

### Social links (left to right)

| Icon file                                  | URL                                                    |
|--------------------------------------------|--------------------------------------------------------|
| `/images/social-icons/substack-logo.png`   | https://banapana.substack.com                          |
| `/images/social-icons/medium-logo.png`     | https://medium.com/minds-on-media                      |
| `/images/social-icons/linkedin-logo.png`   | https://linkedin.com/in/russellbits                    |
| `/images/social-icons/quora-logo.png`      | https://www.quora.com/profile/Russell-Warner           |
| `/images/social-icons/reddit-logo.png`     | https://www.reddit.com/user/ruzelmania/                |

All links: `target="_blank" rel="noopener noreferrer"`.

---

## PubDate Overlap

PubDate lives in `Cover.svelte` as `position: absolute; top: 20px; left: 20px; z-index: 10`.

To make it visually protrude up into the menu bar:

| Property  | Current | New      |
|-----------|---------|----------|
| top       | `20px`  | `-28px`  |
| z-index   | `10`    | `200`    |

The `-28px` offset places roughly half of the 50px circle above the Cover's top edge, overlapping into the 85px menu bar. The `z-index: 200` ensures it renders above the menu (`z-index: 100`).

---

## Files Changed

| File                                      | Change                                      |
|-------------------------------------------|---------------------------------------------|
| `src/lib/components/SiteMenu.svelte`      | Create new component                        |
| `src/routes/+layout.svelte`              | Import and render `<SiteMenu />` first      |
| `src/lib/components/Cover.svelte`         | Adjust `.pubdate-wrapper` top and z-index   |
