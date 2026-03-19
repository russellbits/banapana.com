# Storybook Stories Design

**Date:** 2026-03-19
**Status:** Approved

## Goal

Write Storybook stories for all 9 real components in `src/lib/components/`, replacing the boilerplate examples in `src/stories/`.

## Setup Changes

### `.storybook/preview.js`
Add `import '../src/app.css';` at the top so CSS custom properties (`--section-color`, `--color-muted`, `--color-rule`) resolve correctly inside stories.

### `.storybook/main.js`
Add `staticDirs: ['../static']` to the config object so fonts and SVG symbols served from `static/` are available (used by `Cover`, `SectionTab`, `Sidebar`, `Logo`).

### No `$app` mocking needed
None of the 9 components import from `$app/stores` or `$app/navigation`. Standard Svelte event dispatchers (`createEventDispatcher`, `on:toggle`, `on:close`) work fine in Storybook without any mocks.

### Delete boilerplate
Remove all files currently in `src/stories/`:
- `Button.svelte`, `Button.stories.svelte`, `button.css`
- `Header.svelte`, `Header.stories.svelte`, `header.css`
- `Page.svelte`, `Page.stories.svelte`, `page.css`
- `Configure.mdx`
- `assets/` directory

## Story Files

All stories live in `src/stories/`. One `.stories.svelte` file per component using `@storybook/addon-svelte-csf` format (`defineMeta` / `<Story>`).

### Layout rules
- `layout: 'fullscreen'` — `Cover`, `TableOfContents` (full-viewport components)
- `layout: 'centered'` — all other components

### Stories per component

**`Logo.stories.svelte`**
- `Default` — no props needed

**`PubDate.stories.svelte`**
- `Default` — no props; displays today's date

**`HamburgerMenu.stories.svelte`**
- `Closed` — `open={false}`
- `Open` — `open={true}`

**`FloatImage.stories.svelte`**
- `Right` — `side="right"`, sample image URL, alt text
- `Left` — `side="left"`, same image

**`Sidebar.stories.svelte`**
- `Right` — `side="right"`, sample title and content
- `Left` — `side="left"`, same content

**`Article_Header.stories.svelte`** (filename uses underscore to match the component)
Import path: `import ArticleHeader from '$lib/components/Article_Header.svelte'`
- `WithAvatar` — `author="R.E. Warner"`, `wordCount={1200}`, `date="2026-03-19"` (avatar at `/images/authors/re-warner.png`)
- `MissingAvatar` — `author="Unknown Author"` so avatar 404s and fallback GIF renders

**`SectionTab.stories.svelte`**
Seven stories, one per section — the `section` prop value must match the key exactly as it appears in `sections.js`:
- `Fabertising` — `section="Fabertising"`
- `TheyreThinking` — `section="They're Thinking"`
- `MindControl` — `section="Mind Control"`
- `MadeYouLook` — `section="Made You Look"`
- `DesignScience` — `section="Design Science"`
- `SocialButterfly` — `section="Social Butterfly"`
- `GenericBanapana` — `section="Generic Banapana"`

All use `rotation={0}`.

**`TableOfContents.stories.svelte`**
- `Closed` — `open={false}`, sample articles array
- `Open` — `open={true}`, same articles array

Note: article links in `TableOfContents` are plain `<a>` tags — clicking them in Storybook will navigate the browser. This is expected behaviour; no workaround is needed.

**`Cover.stories.svelte`**
- `Default` — `title="Doomtubers"`, `cover_img_url` pointing to a placeholder image, `articles` array with 3 sample entries

## Sample Fixture Data

Articles array used in `TableOfContents` and `Cover`:
```js
[
  { title: 'Doomtubers', published: '2026-03-19', path: '/2026/03/doomtubers' },
  { title: 'The Fluency Illusion', published: '2026-03-17', path: '/2026/03/the-fluency-illusion' },
  { title: 'Notes on Cognitive Liberty', published: '2025-05-25', path: '/2025/05/notes-on-cognitive-liberty' }
]
```

Cover image: use `https://picsum.photos/seed/banapana/1600/900` as a placeholder (no local asset dependency).

## What is NOT in scope

- No argTypes declarations beyond what Storybook auto-generates
- No interaction tests or `play` functions
- No MDX documentation pages
