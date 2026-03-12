# Banapana Typography Specification

This document describes the typographic system for Banapana article pages. It is intended for use by a coding agent generating CSS. All decisions are described by intent and relationship rather than raw CSS declarations. The agent should produce a complete stylesheet covering every element listed.

---

## Typefaces

**Body text** uses Georgia, a serif typeface. Georgia should be declared with a standard serif fallback stack: `Georgia, 'Times New Roman', Times, serif`.

**All headings** (H1 through H6), the site name, navigation, labels, captions, and metadata use Inter, loaded from Google Fonts. Inter should be declared with a sans-serif fallback stack: `Inter, system-ui, -apple-system, sans-serif`.

**Code** (inline and block) uses Fira Code, which will be provided as a self-hosted web font. Declare it with a monospace fallback stack: `'Fira Code', 'Courier New', Courier, monospace`.

---

## Modular Scale

The type scale follows a **minor third ratio of 1.250**, anchored at 1rem base. Every size in this system derives from this progression. The scale steps and their assigned roles are:

| Step | Size | Role |
|------|------|------|
| H1 | 2.986rem | Primary article headline |
| H2 | 2.441rem | Major section heading |
| H3 | 1.953rem | Subsection heading; also pull quote size |
| H4 | 1.563rem | Tertiary heading |
| H5 | 1.250rem | Minor heading |
| H6 | 1.000rem | Lowest heading (same size as body; differentiated by weight and style) |
| Body | 1.000rem | Main paragraph text |
| Small | 0.833rem | Captions, metadata, footnotes, labels |

---

## Article Container and Measure

The article body should be constrained to a comfortable reading width. The target is approximately 65–70 characters per line for body text at default size. Achieve this with a `max-width` in the range of 680px–720px. The container should be horizontally centered on the page.

On small devices (phones), the article should not touch the edges of the screen. Apply left and right padding of approximately 1rem on small viewports so a small margin is always present. On larger viewports, the centering behavior handles this naturally.

---

## Paragraph Styling

- **Font**: Georgia (body stack)
- **Size**: 1rem
- **Line height**: 1.6rem — apply this to all body paragraphs
- **Spacing**: Paragraphs should have bottom margin that creates clear visual separation without feeling loose. A value in the range of 1.25rem–1.5rem is appropriate.
- **Font weight**: Regular (400)
- **Hyphens**: Enabled. Allow the browser to hyphenate long words for clean line endings.

### Lead Paragraph (First Paragraph)

The first `<p>` element that is a direct child of the article — the opening paragraph — should be visually distinguished:

- **Size**: 1.2rem (120% of body size)
- **Line height**: Scale proportionally from 1.6rem base — approximately 1.75rem–1.8rem
- **Weight**: Same as body (regular, 400) — the size alone carries the distinction

### Drop Cap

The very first letter of the entire article — the `::first-letter` pseudo-element of the lead paragraph — should be styled as a drop cap:

- **Font**: Inter (heading stack), to create contrast with the Georgia body text
- **Size**: Large enough to sit across 3 lines of the lead paragraph text. At 1.2rem line height, this means the drop cap should be approximately 3.6rem–4rem tall
- **Float**: Left, with a small right margin so text wraps cleanly beside it
- **Weight**: Bold (700) or Black (900) — whichever Inter weight creates the strongest contrast
- **Line height**: Set to 1 (no extra leading) so it aligns to the cap height rather than creating extra space above
- **Adjust vertical alignment** so the top of the drop cap aligns with the top of the first line of text. A small positive `padding-top` or `margin-top` adjustment may be needed.

---

## Headings

All headings use Inter. Apply the following principles across all heading levels:

- **Color**: Slightly darker than body text in light mode to create clear hierarchy (see Color section)
- **Weight**: Bold (700) for H1–H3; Semi-bold (600) for H4–H6
- **Margin**: Each heading should have generous space above it (to separate from preceding content) and tighter space below it (to attach it visually to what follows). A ratio of approximately 2:1 top-to-bottom margin is appropriate.
- **Line height**: 1.2 for H1–H3 (large text needs tighter leading); 1.3–1.4 for H4–H6
- **Letter spacing**: H1 and H2 should have very slightly tightened letter spacing (approximately -0.02em) to compensate for the optical looseness of large Inter at display sizes. H3–H6 need no adjustment.

### H6 Special Behavior

H6 is the same size as body text (1rem). It should be distinguished by:
- Semi-bold weight (600)
- Inter typeface (versus Georgia for body)
- Slightly increased letter spacing (0.05em) to give it a label-like quality
- All-caps transformation is optional but acceptable for H6 only

---

## Pull Quotes

In Markdown, blockquotes (`>`) render as pull quotes, not as conventional indented quotations. Style them as follows:

- **Font**: Georgia (body stack) — not Inter
- **Size**: 1.953rem — same as H3, to make them feel substantial and interruptive
- **Line height**: 1.3–1.35 — tighter than body paragraphs, appropriate for display-sized Georgia
- **Weight**: Regular (400) — Georgia at this size carries enough visual weight without bolding
- **Style**: Italic — Georgia italic at this scale is elegant and clearly distinguishes the pull quote from narrative text
- **Alignment**: Centered or left-aligned with generous left and right padding. If left-aligned, use a left border approximately 3px–4px wide as a visual accent. If centered, no border needed.
- **Margin**: Top and bottom margin of approximately 2rem to give the pull quote breathing room from surrounding paragraphs
- **Attribution line**: If the blockquote contains a nested `<cite>` or a paragraph beginning with `—`, style it at 0.833rem, non-italic, Inter, as a caption beneath the pull quote
- **No quotation marks** should be added via CSS pseudo-elements. The editorial convention for Banapana pull quotes does not use decorative quote marks.

---

## Horizontal Rules

Horizontal rules (`---` in Markdown) serve as section breaks. Style them as a thin, centered ornamental divider:

- **Width**: 30%–40% of the article column, centered
- **Height**: 1px
- **Color**: A mid-tone gray in light mode; subtle in dark mode (see Color section)
- **Margin**: Generous vertical space above and below — approximately 2.5rem–3rem each side — to give the break room to breathe

---

## Lists

### Unordered Lists (`-` or `*`)

- **Marker**: Default disc or a custom small square; either is acceptable
- **Font**: Georgia (body stack), 1rem
- **Line height**: 1.6rem — same as paragraphs
- **Item spacing**: Small gap between items (approximately 0.4rem bottom margin per item) so the list feels like distinct points rather than a block of text
- **Indentation**: Standard left indent, approximately 1.5rem–2rem

### Ordered Lists (`1.`)

- Same as unordered lists, but with numeric markers
- **Counter style**: Decimal by default; the agent may optionally use `decimal-leading-zero` for a cleaner look

### Nested Lists

- Each level of nesting reduces font size by one step down the scale — nested items under an unordered list would be 0.833rem
- Indent an additional 1.25rem per nesting level

---

## Inline Text Styles

- **Bold** (`**text**`): `font-weight: 700`. Georgia bold at body size.
- **Italic** (`*text*`): `font-style: italic`. Georgia italic.
- **Bold italic** (`***text***`): Both weight 700 and italic.
- **Inline code** (`` `code` ``): Fira Code, 0.9rem (slightly smaller than body so it sits optically even), with a lightly tinted background (see Color section), small horizontal padding (0.2em), and slightly rounded corners (2px–3px).
- **Links** (`[text](url)`): Use the accent color (see Color section). Underline should be present but subtle — a text-decoration with reduced opacity or a border-bottom approach rather than the browser default thick underline. On hover, the underline becomes solid/full opacity.
- **Strikethrough** (`~~text~~`): Standard strikethrough, no color change needed.
- **Superscript / Subscript**: If used (footnote markers, etc.), scale to 0.75em and shift vertically as normal.

---

## Code Blocks

Fenced code blocks (triple backtick) should be styled as distinct content regions:

- **Font**: Fira Code, 0.9rem
- **Line height**: 1.6 (same ratio as body, appropriate for code readability)
- **Background**: A clearly different background color from the article body — in light mode, a near-white with a warm or cool tint (not pure white, not gray enough to feel disabled). In dark mode, a slightly lighter surface than the article background. See Color section.
- **Padding**: Generous — approximately 1rem–1.25rem on all sides
- **Border radius**: Subtle rounding, approximately 4px–6px
- **Overflow**: `overflow-x: auto` — code blocks scroll horizontally on narrow viewports rather than breaking layout
- **Border**: Optional — a 1px border in a slightly darker tone than the background adds definition without heaviness
- **No line numbers** unless explicitly added by a syntax highlighting library

---

## Images

Standard Markdown images (`![alt](src)`) within articles:

- **Width**: 100% of the article column (full measure)
- **Height**: Auto (preserve aspect ratio)
- **Border radius**: Optional subtle rounding (4px) consistent with code block rounding
- **Caption** (`<figcaption>` if wrapped in a figure): 0.833rem, Inter, color slightly muted from body text, top margin approximately 0.5rem

---

## Tables

Standard Markdown tables:

- **Width**: 100% of article column
- **Font**: Georgia, 0.9rem (slightly smaller than body so dense tables don't overwhelm)
- **Header row**: Inter, semi-bold (600), 0.833rem, slightly different background from table body
- **Cell padding**: Approximately 0.5rem horizontal, 0.4rem vertical
- **Borders**: Thin horizontal rules only (no grid/full border) for a clean editorial look — border between header and body rows, and between body rows
- **Overflow**: Wrap in a scrollable container on narrow viewports

---

## Small Text, Captions, and Metadata

- **Size**: 0.833rem
- **Font**: Inter
- **Color**: Muted relative to body text — approximately 60%–70% of body text opacity/lightness
- **Use cases**: Article dateline, byline, image captions, footnotes, tag labels

---

## Color System

The agent should define a CSS custom property system (CSS variables) for all colors, with a light mode default and a dark mode variant applied via `@media (prefers-color-scheme: dark)`.

### Light Mode

| Variable | Intent | Suggested value |
|----------|--------|-----------------|
| `--color-bg` | Page background | `#fafaf8` — off-white with a very faint warm tint |
| `--color-surface` | Article surface (if different from page bg) | `#ffffff` or same as bg |
| `--color-text` | Body text | `#1a1a18` — near-black with warm undertone |
| `--color-heading` | Heading text | `#0f0f0e` — slightly darker than body |
| `--color-muted` | Captions, metadata, muted labels | `#6b6b63` — mid gray-warm |
| `--color-rule` | Horizontal rules, table borders | `#d4d4cc` — light warm gray |
| `--color-accent` | Links, drop cap, pull quote border | `#2a5caa` — a readable blue |
| `--color-accent-hover` | Link hover state | Slightly darker or more saturated than accent |
| `--color-code-bg` | Inline and block code background | `#f0f0eb` — warm light gray, clearly distinct from `#ffffff` |
| `--color-code-border` | Code block border | `#ddddd6` |

### Dark Mode

Dark mode should feel like a natural companion to the light mode palette — not just inverted, but considered. The background should not be pure black; a very dark warm-neutral reads better for long-form text.

| Variable | Intent | Suggested value |
|----------|--------|-----------------|
| `--color-bg` | Page background | `#18181a` — very dark, near-black with slight cool undertone |
| `--color-surface` | Article surface | Same as bg, or `#1e1e21` for slight layering |
| `--color-text` | Body text | `#e2e2dc` — warm off-white, not pure white |
| `--color-heading` | Heading text | `#f0f0ea` — slightly brighter than body text |
| `--color-muted` | Captions, metadata | `#8a8a82` — mid gray |
| `--color-rule` | Horizontal rules | `#2e2e32` — barely visible dark rule |
| `--color-accent` | Links | `#7aaff0` — lighter blue readable on dark bg |
| `--color-accent-hover` | Link hover | Slightly lighter or brighter than dark mode accent |
| `--color-code-bg` | Code background | `#242428` — distinct from article bg but not jarring |
| `--color-code-border` | Code block border | `#38383e` |

All color values in the stylesheet should reference these CSS variables. The agent should not hard-code any color values outside of the variable definitions.

---

## Responsive Behavior Summary

- **Baseline font size**: Set `font-size: 18px` on the `<html>` element. This makes 1rem = 18px throughout the entire system. All rem values in this spec are calculated from this baseline.
- **Body font size**: 1rem throughout. Do not scale the base font size up on large viewports — the measure constraint handles comfortable reading width.
- **Article container**: Max-width ~700px, centered, with `padding: 0 1rem` on small viewports.
- **Headings**: H1 and H2 may scale down slightly on very small screens (below 400px) — reducing H1 to approximately 2.441rem and H2 to 1.953rem is acceptable.
- **Pull quotes**: On small screens, reduce pull quote size from 1.953rem to approximately 1.563rem to prevent them from dominating the viewport.
- **Code blocks**: Always `overflow-x: auto` — never break layout on narrow screens.
- **Drop cap**: Retain on all screen sizes; it is a defining feature of the article page.

---

## Summary of Font Loading Requirements

The agent should include the following in the `<head>` or at the top of the stylesheet:

1. **Inter** from Google Fonts — request weights 400, 600, 700, 900. Use the `display=swap` parameter.
2. **Fira Code** — self-hosted via `@font-face`. The font files will be provided separately. Declare for weights 400 and 500.
3. **Georgia** — system font, no loading required.