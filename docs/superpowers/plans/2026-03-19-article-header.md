# Article Header Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `Article_Header` component that appears between `Cover` and `SectionTab` on article pages, showing avatar, author name, read time, date, and action icons.

**Architecture:** Three files change — `content.js` gains a `rawPages` glob and exports `countWords` for word-count computation; a new `Article_Header.svelte` renders the two-row UI from three props; `+layout.svelte` derives those props and conditionally renders the component. Logic that needs testing is extracted to a pure exportable helper (`countWords`).

**Tech Stack:** SvelteKit 5, Svelte 5 runes, Vitest (server project for pure-function tests, browser project with vitest-browser-svelte for component tests)

---

## Chunk 1: Word Count — content.js

### Task 1: Export `countWords` helper and wire it into `getPageData()`

**Files:**
- Modify: `src/lib/content.js`
- Create: `src/lib/content.spec.js`

- [ ] **Step 1: Write failing tests for `countWords`**

Create `src/lib/content.spec.js`:

```js
import { describe, expect, it } from 'vitest';
import { countWords } from './content.js';

describe('countWords', () => {
  it('counts words in plain text', () => {
    expect(countWords('one two three')).toBe(3);
  });

  it('strips frontmatter before counting', () => {
    const raw = `---\nTitle: Hello\nAuthor: R. E. Warner\n---\none two three`;
    expect(countWords(raw)).toBe(3);
  });

  it('handles text with extra whitespace and newlines', () => {
    expect(countWords('one  two\nthree\t four')).toBe(4);
  });

  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('returns 0 for frontmatter-only content', () => {
    const raw = `---\nTitle: Hello\n---\n`;
    expect(countWords(raw)).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify tests fail**

```bash
cd /Users/russell/Development/banapana && npx vitest run --project server src/lib/content.spec.js
```

Expected: FAIL — `countWords is not a function` or similar

- [ ] **Step 3: Implement `countWords` and wire `wordCount` into `getPageData()`**

Replace the entire contents of `src/lib/content.js` with:

```js
const pages = import.meta.glob('/src/routes/**/*.svx', { eager: true });

const rawPages = import.meta.glob('/src/routes/**/*.svx', {
  query: '?raw',
  import: 'default',
  eager: true
});

const covers = import.meta.glob('/src/routes/**/media/cover.{jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
});

export function countWords(rawText) {
  const body = rawText.replace(/^---[\s\S]*?---\n/, '');
  return body.split(/\s+/).filter(Boolean).length;
}

export function getPageData(routeId) {
  const routePath = routeId === '/' ? '/src/routes' : `/src/routes${routeId}`;

  const raw = pages[`${routePath}/+page.svx`]?.metadata ?? {};
  const cover = covers[`${routePath}/media/cover.jpg`]
    ?? covers[`${routePath}/media/cover.png`]
    ?? covers[`${routePath}/media/cover.webp`];

  const data = {};
  for (const [key, val] of Object.entries(raw)) {
    data[key.toLowerCase()] = val;
  }
  if (cover) data.cover = cover;

  const rawText = rawPages[`${routePath}/+page.svx`] ?? '';
  data.wordCount = countWords(rawText);

  return data;
}

export function getAllArticles() {
  return Object.entries(pages)
    .filter(([path]) => /\/src\/routes\/\d{4}\/\d{2}\/[^/]+\/\+page\.svx$/.test(path))
    .map(([path, mod]) => {
      const raw = mod?.metadata ?? {};
      const data = {};
      for (const [k, v] of Object.entries(raw)) data[k.toLowerCase()] = v;
      const url = path.replace('/src/routes', '').replace('/+page.svx', '');
      const effectiveDate = data.published || data.created;
      return { title: data.title, published: effectiveDate, path: url };
    })
    .filter((a) => {
      if (!a.published) return false;
      const isPastDate = new Date(a.published) <= new Date();
      return isPastDate;
    })
    .sort((a, b) => new Date(b.published) - new Date(a.published));
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd /Users/russell/Development/banapana && npx vitest run --project server src/lib/content.spec.js
```

Expected: 5 passing

- [ ] **Step 5: Commit**

```bash
cd /Users/russell/Development/banapana && git add src/lib/content.js src/lib/content.spec.js
git commit -m "feat: add countWords helper and wordCount to getPageData"
```

---

## Chunk 2: Article_Header Component

### Task 2: Build and test `Article_Header.svelte`

**Files:**
- Create: `src/lib/components/Article_Header.svelte`
- Create: `src/lib/components/Article_Header.svelte.spec.js`

- [ ] **Step 1: Write failing component tests**

Create `src/lib/components/Article_Header.svelte.spec.js`:

```js
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ArticleHeader from './Article_Header.svelte';

const defaults = {
  author: 'R. E. Warner',
  wordCount: 480,
  date: '2026-03-19'
};

describe('Article_Header', () => {
  it('renders the author name', async () => {
    render(ArticleHeader, defaults);
    await expect.element(page.getByText('R. E. Warner')).toBeInTheDocument();
  });

  it('renders the author avatar with slugified src', async () => {
    const { container } = render(ArticleHeader, defaults);
    const img = container.querySelector('img.avatar');
    await expect.element(page.elementLocator(img)).toHaveAttribute(
      'src',
      '/images/authors/r-e-warner.png'
    );
  });

  it('renders the read time based on wordCount', async () => {
    render(ArticleHeader, defaults);
    // 480 words / 240 wpm = 2 min read
    await expect.element(page.getByText('⏱ 2 min read')).toBeInTheDocument();
  });

  it('rounds read time up (Math.ceil)', async () => {
    render(ArticleHeader, { ...defaults, wordCount: 241 });
    // 241/240 = 1.004 → ceil → 2
    await expect.element(page.getByText('⏱ 2 min read')).toBeInTheDocument();
  });

  it('renders the formatted date', async () => {
    render(ArticleHeader, defaults);
    // 2026-03-19 → Mar 19, 2026
    await expect.element(page.getByText('Mar 19, 2026')).toBeInTheDocument();
  });

  it('renders the action emoji row', async () => {
    const { container } = render(ArticleHeader, defaults);
    const row2 = container.querySelector('.actions');
    await expect.element(page.elementLocator(row2)).toBeInTheDocument();
    await expect.element(page.elementLocator(row2)).toHaveTextContent('👏');
    await expect.element(page.elementLocator(row2)).toHaveTextContent('🔖');
    await expect.element(page.elementLocator(row2)).toHaveTextContent('🔗');
  });

  it('falls back to default gravatar on avatar error', async () => {
    const { container } = render(ArticleHeader, defaults);
    const img = container.querySelector('img.avatar');
    img.dispatchEvent(new Event('error'));
    await expect.element(page.elementLocator(img)).toHaveAttribute(
      'src',
      '/images/default_gravatar.gif'
    );
  });
});
```

- [ ] **Step 2: Run to verify tests fail**

```bash
cd /Users/russell/Development/banapana && npx vitest run --project client src/lib/components/Article_Header.svelte.spec.js
```

Expected: FAIL — component file does not exist

- [ ] **Step 3: Implement `Article_Header.svelte`**

Create `src/lib/components/Article_Header.svelte`:

```svelte
<script>
  let { author, wordCount, date } = $props();

  function slugify(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/ +/g, '-')
      .replace(/-{2,}/g, '-');
  }

  const avatarSrc = $derived(`/images/authors/${slugify(author)}.png`);
  const readTime = $derived(Math.ceil(wordCount / 240));
  const formattedDate = $derived(
    date
      ? new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          timeZone: 'UTC'
        })
      : ''
  );

  function handleAvatarError(e) {
    e.target.src = '/images/default_gravatar.gif';
  }
</script>

<div class="article-header-outer">
  <div class="article-header">
    <div class="byline">
      <span class="author-group">
        <img
          class="avatar"
          src={avatarSrc}
          alt={author}
          width="36"
          height="36"
          onerror={handleAvatarError}
        />
        <em class="author-name">{author}</em>
      </span>
      <span class="meta-row">
        <span class="read-time">⏱ {readTime} min read</span>
        <span class="pub-date">{formattedDate}</span>
      </span>
    </div>
    <div class="actions">
      <span>👏</span>
      <span>🔖</span>
      <span>🔗</span>
    </div>
  </div>
</div>

<style>
  .article-header-outer {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 80px;
  }

  .byline {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .author-group {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .avatar {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    object-fit: cover;
  }

  .author-name {
    font-size: 0.9rem;
  }

  .meta-row {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .read-time,
  .pub-date {
    font-size: 0.85rem;
    color: var(--color-muted);
  }

  .actions {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    font-size: 1.2rem;
    padding: 0.5rem 0;
    margin-top: 0.75rem;
    border-top: 1px solid var(--color-rule);
    border-bottom: 1px solid var(--color-rule);
  }

  @media (max-width: 900px) {
    .article-header-outer {
      padding: 0 1rem;
    }
  }

  @media (max-width: 600px) {
    .byline {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .meta-row {
      gap: 1.2rem;
    }

    .read-time,
    .pub-date {
      font-size: 0.8rem;
    }
  }
</style>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd /Users/russell/Development/banapana && npx vitest run --project client src/lib/components/Article_Header.svelte.spec.js
```

Expected: 7 passing

- [ ] **Step 5: Commit**

```bash
cd /Users/russell/Development/banapana && git add src/lib/components/Article_Header.svelte src/lib/components/Article_Header.svelte.spec.js
git commit -m "feat: add Article_Header component with byline and action row"
```

---

## Chunk 3: Wire Layout

### Task 3: Add `Article_Header` to `+layout.svelte`

**Files:**
- Modify: `src/routes/+layout.svelte`

No automated tests for this task — the layout integration is verified visually via the dev server.

- [ ] **Step 1: Add derived values and render `Article_Header` in the layout**

Replace the entire contents of `src/routes/+layout.svelte` with:

```svelte
<script>
  import favicon from '$lib/assets/favicon.svg';
  import Cover from '$lib/components/Cover.svelte';
  import SectionTab from '$lib/components/SectionTab.svelte';
  import ArticleHeader from '$lib/components/Article_Header.svelte';
  import { getAllArticles } from '$lib/content.js';
  import { getSection, slugRotation } from '$lib/sections.js';
  import { page } from '$app/stores';
  import '../app.css';
  import rootCover from './media/cover.jpg?url';

  let { children } = $props();

  const title       = $derived($page.data?.title ?? '');
  const cover       = $derived($page.data?.cover ?? rootCover);
  const section     = $derived($page.data?.section ?? '');
  const sectionData = $derived(section ? getSection(section) : null);
  const rotation    = $derived(slugRotation($page.url.pathname));
  const articles    = getAllArticles();

  const author    = $derived($page.data?.author ?? '');
  const wordCount = $derived($page.data?.wordCount ?? 0);
  const date      = $derived($page.data?.published ?? $page.data?.created ?? '');
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

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

<style>
:global(body) {
  margin: 0;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
```

- [ ] **Step 2: Run the full test suite to confirm nothing is broken**

```bash
cd /Users/russell/Development/banapana && npm test
```

Expected: all tests pass

- [ ] **Step 3: Start the dev server and visually verify on an article page**

```bash
cd /Users/russell/Development/banapana && npm run dev
```

Open an article page (e.g. `http://localhost:2222/2026/03/doomtubers`). Verify:
- Article header appears between Cover and SectionTab
- Author avatar (circle, 36×36px), name in italics, read time, and date are visible in Row 1
- Read time and date share a flex sub-row on desktop; on mobile they remain together below the author group
- Action row (👏 🔖 🔗) is present with top/bottom borders
- Layout content is aligned with article text (same left edge at desktop and mobile)
- A page without `Author:` frontmatter (e.g. `http://localhost:2222/2025/05/notes-on-cognitive-liberty`) shows no header

- [ ] **Step 4: Commit**

```bash
cd /Users/russell/Development/banapana && git add src/routes/+layout.svelte
git commit -m "feat: render Article_Header in layout between Cover and SectionTab"
```
