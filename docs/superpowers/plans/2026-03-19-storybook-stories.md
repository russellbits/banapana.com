# Storybook Stories Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Storybook boilerplate with stories for all 9 real components in `src/lib/components/`.

**Architecture:** Stories live in `src/stories/` as `.stories.svelte` files using the `@storybook/addon-svelte-csf` `defineMeta`/`<Story>` format. Config changes to `.storybook/` make CSS variables and static assets available. No application code is changed.

**Tech Stack:** Storybook 10, `@storybook/sveltekit`, `@storybook/addon-svelte-csf`, Svelte 5

---

## Chunk 1: Config and cleanup

### Task 1: Storybook config + delete boilerplate

**Files:**
- Modify: `.storybook/preview.js`
- Modify: `.storybook/main.js`
- Delete: everything currently in `src/stories/`

- [ ] **Step 1: Update `.storybook/preview.js`**

Replace the entire file with:

```js
import '../src/app.css';

/** @type { import('@storybook/sveltekit').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;
```

- [ ] **Step 2: Update `.storybook/main.js`**

Replace the entire file with:

```js
/** @type { import('@storybook/sveltekit').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|ts|svelte)'
  ],
  addons: [
    '@storybook/addon-svelte-csf',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs'
  ],
  framework: '@storybook/sveltekit',
  staticDirs: ['../static']
};
export default config;
```

- [ ] **Step 3: Delete all boilerplate files from `src/stories/`**

```bash
rm -rf src/stories/assets
rm -f src/stories/Button.svelte src/stories/Button.stories.svelte src/stories/button.css
rm -f src/stories/Header.svelte src/stories/Header.stories.svelte src/stories/header.css
rm -f src/stories/Page.svelte src/stories/Page.stories.svelte src/stories/page.css
rm -f src/stories/Configure.mdx
```

- [ ] **Step 4: Verify Storybook builds without errors**

```bash
npm run build-storybook 2>&1 | tail -5
```

Expected: `✓ built in` with no errors. Storybook will have zero stories at this point — that's fine.

- [ ] **Step 5: Commit**

```bash
git add .storybook/preview.js .storybook/main.js
git add -u src/stories/
git commit -m "chore: configure Storybook with app.css and staticDirs, remove boilerplate"
```

---

## Chunk 2: Stories

### Task 2: Logo, PubDate, HamburgerMenu

These three components have no external data dependencies.

**Files:**
- Create: `src/stories/Logo.stories.svelte`
- Create: `src/stories/PubDate.stories.svelte`
- Create: `src/stories/HamburgerMenu.stories.svelte`

- [ ] **Step 1: Create `src/stories/Logo.stories.svelte`**

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Logo from '$lib/components/Logo.svelte';

  const { Story } = defineMeta({
    title: 'Components/Logo',
    component: Logo,
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
  });
</script>

<Story name="Default" />
```

- [ ] **Step 2: Create `src/stories/PubDate.stories.svelte`**

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PubDate from '$lib/components/PubDate.svelte';

  const { Story } = defineMeta({
    title: 'Components/PubDate',
    component: PubDate,
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
  });
</script>

<Story name="Default" />
```

- [ ] **Step 3: Create `src/stories/HamburgerMenu.stories.svelte`**

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HamburgerMenu from '$lib/components/HamburgerMenu.svelte';

  const { Story } = defineMeta({
    title: 'Components/HamburgerMenu',
    component: HamburgerMenu,
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
  });
</script>

<Story name="Closed" args={{ open: false }} />
<Story name="Open" args={{ open: true }} />
```

- [ ] **Step 4: Verify build**

```bash
npm run build-storybook 2>&1 | tail -5
```

Expected: `✓ built in` with no errors. You should now see 3 components in the sidebar.

- [ ] **Step 5: Commit**

```bash
git add src/stories/Logo.stories.svelte src/stories/PubDate.stories.svelte src/stories/HamburgerMenu.stories.svelte
git commit -m "feat: add stories for Logo, PubDate, HamburgerMenu"
```

---

### Task 3: FloatImage, Sidebar, ArticleHeader

**Files:**
- Create: `src/stories/FloatImage.stories.svelte`
- Create: `src/stories/Sidebar.stories.svelte`
- Create: `src/stories/Article_Header.stories.svelte`

- [ ] **Step 1: Create `src/stories/FloatImage.stories.svelte`**

FloatImage floats inside a text container. Use `layout: 'padded'` so it has room to float.

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FloatImage from '$lib/components/FloatImage.svelte';

  const { Story } = defineMeta({
    title: 'Components/FloatImage',
    component: FloatImage,
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
  });
</script>

<Story
  name="Right"
  args={{
    src: 'https://picsum.photos/seed/floatright/400/300',
    alt: 'Sample image floating right',
    side: 'right'
  }}
/>
<Story
  name="Left"
  args={{
    src: 'https://picsum.photos/seed/floatleft/400/300',
    alt: 'Sample image floating left',
    side: 'left'
  }}
/>
```

- [ ] **Step 2: Create `src/stories/Sidebar.stories.svelte`**

Sidebar uses `--section-color` CSS variable (set in `app.css` on `:root` or via parent). It falls back to `#5ec035` if unset.

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Sidebar from '$lib/components/Sidebar.svelte';

  const { Story } = defineMeta({
    title: 'Components/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
  });
</script>

<Story
  name="Right"
  args={{
    title: 'What Makes a Real Model?',
    content: 'A model has formal structure—parameters, math, and a mechanism that generates specific predictions you can be wrong about in advance. Visualization without falsifiability is storytelling.',
    side: 'right'
  }}
/>
<Story
  name="Left"
  args={{
    title: 'What Makes a Real Model?',
    content: 'A model has formal structure—parameters, math, and a mechanism that generates specific predictions you can be wrong about in advance. Visualization without falsifiability is storytelling.',
    side: 'left'
  }}
/>
```

- [ ] **Step 3: Create `src/stories/Article_Header.stories.svelte`**

Note the filename uses an underscore to match the component filename. The import path is `$lib/components/Article_Header.svelte`.

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ArticleHeader from '$lib/components/Article_Header.svelte';

  const { Story } = defineMeta({
    title: 'Components/ArticleHeader',
    component: ArticleHeader,
    tags: ['autodocs'],
    parameters: { layout: 'padded' }
  });
</script>

<!-- Avatar image at /images/authors/re-warner.png must exist in static/ for this to show -->
<Story name="WithAvatar" args={{ author: 'R.E. Warner', wordCount: 1200, date: '2026-03-19' }} />
<!-- Unknown author → avatar 404s → onerror fires → falls back to /images/default_gravatar.gif -->
<Story name="MissingAvatar" args={{ author: 'Unknown Author', wordCount: 480, date: '2026-01-15' }} />
```

- [ ] **Step 4: Verify build**

```bash
npm run build-storybook 2>&1 | tail -5
```

Expected: `✓ built in` with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/stories/FloatImage.stories.svelte src/stories/Sidebar.stories.svelte src/stories/Article_Header.stories.svelte
git commit -m "feat: add stories for FloatImage, Sidebar, ArticleHeader"
```

---

### Task 4: SectionTab

Seven variants, one per section. The `section` prop value must exactly match the key in `src/lib/sections.js`.

**Files:**
- Create: `src/stories/SectionTab.stories.svelte`

- [ ] **Step 1: Create `src/stories/SectionTab.stories.svelte`**

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SectionTab from '$lib/components/SectionTab.svelte';

  const { Story } = defineMeta({
    title: 'Components/SectionTab',
    component: SectionTab,
    tags: ['autodocs'],
    parameters: { layout: 'centered' }
  });
</script>

<Story name="Fabertising" args={{ section: 'Fabertising', rotation: 0 }} />
<Story name="TheyreThinking" args={{ section: "They're Thinking", rotation: 0 }} />
<Story name="MindControl" args={{ section: 'Mind Control', rotation: 0 }} />
<Story name="MadeYouLook" args={{ section: 'Made You Look', rotation: 0 }} />
<Story name="DesignScience" args={{ section: 'Design Science', rotation: 0 }} />
<Story name="SocialButterfly" args={{ section: 'Social Butterfly', rotation: 0 }} />
<Story name="GenericBanapana" args={{ section: 'Generic Banapana', rotation: 0 }} />
```

Note: `SectionTab` uses `position: fixed` on desktop (`min-width: 900px`), so in a `centered` layout it will pin to the left gutter of the Storybook canvas. This is the correct behaviour — it mirrors how the component appears in the real app.

- [ ] **Step 2: Verify build**

```bash
npm run build-storybook 2>&1 | tail -5
```

Expected: `✓ built in` with no errors. Storybook sidebar should show 7 SectionTab variants.

- [ ] **Step 3: Commit**

```bash
git add src/stories/SectionTab.stories.svelte
git commit -m "feat: add stories for SectionTab (all 7 sections)"
```

---

### Task 5: TableOfContents and Cover

Both use `layout: 'fullscreen'` — they are full-viewport components.

**Files:**
- Create: `src/stories/TableOfContents.stories.svelte`
- Create: `src/stories/Cover.stories.svelte`

- [ ] **Step 1: Create `src/stories/TableOfContents.stories.svelte`**

Note: `TableOfContents` uses `on:close` event dispatch (Svelte 4 style). The event fires but has no listener in Storybook — that's fine for visual testing. Clicking article links will navigate the browser away from Storybook; this is expected.

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TableOfContents from '$lib/components/TableOfContents.svelte';

  const ARTICLES = [
    { title: 'Doomtubers', published: '2026-03-19', path: '/2026/03/doomtubers' },
    { title: 'The Fluency Illusion', published: '2026-03-17', path: '/2026/03/the-fluency-illusion' },
    { title: 'Notes on Cognitive Liberty', published: '2025-05-25', path: '/2025/05/notes-on-cognitive-liberty' }
  ];

  const { Story } = defineMeta({
    title: 'Components/TableOfContents',
    component: TableOfContents,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' }
  });
</script>

<Story name="Closed" args={{ articles: ARTICLES, open: false }} />
<Story name="Open" args={{ articles: ARTICLES, open: true }} />
```

- [ ] **Step 2: Create `src/stories/Cover.stories.svelte`**

`Cover` embeds `Logo`, `PubDate`, `HamburgerMenu`, and `TableOfContents` internally. The cover image uses a placeholder URL since there is no local asset dependency in the stories.

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Cover from '$lib/components/Cover.svelte';

  const ARTICLES = [
    { title: 'Doomtubers', published: '2026-03-19', path: '/2026/03/doomtubers' },
    { title: 'The Fluency Illusion', published: '2026-03-17', path: '/2026/03/the-fluency-illusion' },
    { title: 'Notes on Cognitive Liberty', published: '2025-05-25', path: '/2025/05/notes-on-cognitive-liberty' }
  ];

  const { Story } = defineMeta({
    title: 'Components/Cover',
    component: Cover,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' }
  });
</script>

<Story
  name="Default"
  args={{
    title: 'Doomtubers',
    cover_img_url: 'https://picsum.photos/seed/banapana/1600/900',
    articles: ARTICLES
  }}
/>
```

- [ ] **Step 3: Final build verification**

```bash
npm run build-storybook 2>&1 | tail -10
```

Expected: `✓ built in` with no errors. All 9 components should be listed in the Storybook sidebar.

- [ ] **Step 4: Commit**

```bash
git add src/stories/TableOfContents.stories.svelte src/stories/Cover.stories.svelte
git commit -m "feat: add stories for TableOfContents and Cover"
```
