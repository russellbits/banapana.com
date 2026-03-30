# Section Tabs and Sidebar Component Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-section color-coded navigation tabs visible beside every article, and an inline `[SIDEBAR]` shorthand that renders styled callout boxes using the section's color.

**Architecture:** A shared `sections.js` module maps section names to colors and SVG icon filenames. A Svelte markup preprocessor (runs before mdsvex) replaces `[SIDEBAR]...[/SIDEBAR]` blocks with `<Sidebar>` component calls and injects the necessary import, so sidebars render fully during prerendering. The `SectionTab` component is placed in `+layout.svelte` alongside the article, positioned fixed in the left gutter on wide screens.

**Tech Stack:** SvelteKit, Svelte 5 (runes), mdsvex, vitest-browser-svelte, adapter-static (fully prerendered)

---

## Chunk 1: Foundation — Shared Section Data

### Task 1: Section Data Module

**Files:**
- Create: `src/lib/sections.js`
- Create: `src/lib/sections.spec.js`

The `sections.js` module is the single source of truth for section colors, CSS class names, and SVG icon file slugs. Both `SectionTab` and `Sidebar` derive their color from the value returned by `getSection()`.

SVG files in `/static/symbols/` use hyphens (e.g. `they-re-thinking.svg`). The `svgFile` field in sections.js stores the filename stem without extension.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/sections.spec.js`:

```js
import { describe, it, expect } from 'vitest';
import { getSection, SECTIONS, DEFAULT_SECTION } from './sections.js';

describe('getSection', () => {
  it('returns correct color for Fabertising', () => {
    const s = getSection('Fabertising');
    expect(s.color).toBe('#E042E0');
    expect(s.svgFile).toBe('fabertising');
    expect(s.cssName).toBe('fabertising');
  });

  it("returns correct color for They're Thinking", () => {
    const s = getSection("They're Thinking");
    expect(s.color).toBe('#5EC035');
    expect(s.svgFile).toBe('they-re-thinking');
  });

  it('returns correct color for Mind Control', () => {
    expect(getSection('Mind Control').color).toBe('#3AB7F4');
    expect(getSection('Mind Control').svgFile).toBe('mind-control');
  });

  it('returns correct color for Made You Look', () => {
    expect(getSection('Made You Look').color).toBe('#3AB7F4');
    expect(getSection('Made You Look').svgFile).toBe('made-you-look');
  });

  it('returns correct color for Design Science', () => {
    expect(getSection('Design Science').color).toBe('#EBAF00');
    expect(getSection('Design Science').svgFile).toBe('design-science');
  });

  it('returns correct color for Social Butterfly', () => {
    expect(getSection('Social Butterfly').color).toBe('#66CCA0');
    expect(getSection('Social Butterfly').svgFile).toBe('social-butterfly');
  });

  it('returns DEFAULT_SECTION for unknown section names', () => {
    const s = getSection('Unknown Section');
    expect(s).toEqual(DEFAULT_SECTION);
    expect(s.color).toBe('#5EC035');
    expect(s.svgFile).toBeNull();
  });

  it('returns DEFAULT_SECTION for empty string', () => {
    expect(getSection('')).toEqual(DEFAULT_SECTION);
  });

  it('returns correct data for Generic Banapana', () => {
    const s = getSection('Generic Banapana');
    expect(s.color).toBe('#5EC035');
    expect(s.svgFile).toBe('banapana');
    expect(s.cssName).toBe('banapana_green');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --run src/lib/sections.spec.js
```

Expected: FAIL — `Cannot find module './sections.js'`

- [ ] **Step 3: Write the implementation**

Create `src/lib/sections.js`:

```js
export const SECTIONS = {
  'Fabertising': {
    cssName: 'fabertising',
    color: '#E042E0',
    svgFile: 'fabertising'
  },
  "They're Thinking": {
    cssName: 'they_re_thinking',
    color: '#5EC035',
    svgFile: 'they-re-thinking'
  },
  'Mind Control': {
    cssName: 'mind_control',
    color: '#3AB7F4',
    svgFile: 'mind-control'
  },
  'Made You Look': {
    cssName: 'made_you_look',
    color: '#3AB7F4',
    svgFile: 'made-you-look'
  },
  'Design Science': {
    cssName: 'design_science',
    color: '#EBAF00',
    svgFile: 'design-science'
  },
  'Social Butterfly': {
    cssName: 'social_butterfly',
    color: '#66CCA0',
    svgFile: 'social-butterfly'
  },
  'Generic Banapana': {
    cssName: 'banapana_green',
    color: '#5EC035',
    svgFile: 'banapana'
  }
};

export const DEFAULT_SECTION = {
  cssName: 'banapana_green',
  color: '#5EC035',
  svgFile: null
};

export function getSection(name) {
  return SECTIONS[name] ?? DEFAULT_SECTION;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --run src/lib/sections.spec.js
```

Expected: all 8 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/sections.js src/lib/sections.spec.js
git commit -m "feat: add section color/icon data module"
```

---

## Chunk 2: Section Tab Component

### Task 2: SectionTab Svelte Component

**Files:**
- Create: `src/lib/components/SectionTab.svelte`
- Create: `src/lib/components/SectionTab.svelte.spec.js`

`SectionTab` is a `position: fixed` element anchored to the left gutter on screens wider than 900px. It shows the section's SVG icon in a circular frame, "Dept. of" as micro-label, and the section name in bold. Hidden on mobile.

The component uses Svelte 5 runes (`$props()`, `$derived()`). Props: `section` (string — the raw section title from frontmatter, e.g. `"Mind Control"`).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/components/SectionTab.svelte.spec.js`:

```js
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SectionTab from './SectionTab.svelte';

describe('SectionTab', () => {
  it('renders the section name', async () => {
    render(SectionTab, { section: 'Mind Control' });
    await expect.element(page.getByText('Mind Control')).toBeInTheDocument();
  });

  it('renders "Dept. of" label', async () => {
    render(SectionTab, { section: 'Fabertising' });
    await expect.element(page.getByText('Dept. of')).toBeInTheDocument();
  });

  it('renders the section SVG icon', async () => {
    render(SectionTab, { section: 'Design Science' });
    const img = page.getByRole('img', { hidden: true });
    await expect.element(img).toHaveAttribute('src', '/symbols/design-science.svg');
  });

  it('renders nothing when section has no svgFile (unknown section)', () => {
    const { container } = render(SectionTab, { section: 'Unknown' });
    // querySelector returns null → no .section-tab element was rendered
    expect(container.querySelector('.section-tab')).toBeNull();
  });

  it('applies the section background color via inline style', async () => {
    const { container } = render(SectionTab, { section: 'Fabertising' });
    const tab = container.querySelector('.section-tab');
    await expect.element(page.elementLocator(tab)).toHaveStyle('background-color: rgb(224, 66, 224)');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --run src/lib/components/SectionTab.svelte.spec.js
```

Expected: FAIL — `Cannot find module './SectionTab.svelte'`

- [ ] **Step 3: Write the implementation**

Create `src/lib/components/SectionTab.svelte`:

```svelte
<script>
  import { getSection } from '$lib/sections.js';

  let { section = '' } = $props();

  const sectionData = $derived(getSection(section));
</script>

{#if sectionData.svgFile}
  <div class="section-tab" style="background-color: {sectionData.color}">
    <div class="icon-circle">
      <img
        src="/symbols/{sectionData.svgFile}.svg"
        alt=""
        aria-hidden="true"
        width="36"
        height="36"
      />
    </div>
    <span class="dept-of">Dept. of</span>
    <span class="section-name">{section}</span>
  </div>
{/if}

<style>
  /* Mobile default: inline square centered between the cover and article body */
  .section-tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90px;
    height: 90px;
    border-radius: 8px;
    padding: 0.5rem;
    margin: 1.5rem auto;
    gap: 0.3rem;
    text-align: center;
  }

  .icon-circle {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .icon-circle img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .dept-of {
    font-family: Inter, sans-serif;
    font-size: 0.45rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.75);
    text-transform: uppercase;
  }

  .section-name {
    font-family: Inter, sans-serif;
    font-size: 0.55rem;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.2;
  }

  /* Desktop: pull the tab out of the flow and pin it to the left gutter */
  @media (min-width: 900px) {
    .section-tab {
      position: fixed;
      left: max(0.5rem, calc(50vw - 420px));
      top: 50%;
      transform: translateY(-50%);
      z-index: 5;
      width: 72px;
      height: auto;
      margin: 0;
      padding: 0.75rem 0.5rem;
      gap: 0.4rem;
    }

    .icon-circle {
      width: 48px;
      height: 48px;
    }

    .icon-circle img {
      width: 36px;
      height: 36px;
    }

    .dept-of {
      font-size: 0.5rem;
    }

    .section-name {
      font-size: 0.6rem;
    }
  }
</style>
```

**Positioning note:** On mobile (<900px) the tab is `position: static` and rendered in document flow between the Cover and `#page` — a 90×90px square centered with `margin: auto`. On desktop (≥900px) it switches to `position: fixed` in the left gutter: `calc(50vw - 420px)` places it left of the centered 700px `#page` (whose left edge is at `50vw - 350px`). At exactly 900px viewport, `50vw - 420px = 30px`. `max(0.5rem, …)` prevents it clipping off-screen on narrow desktops.

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --run src/lib/components/SectionTab.svelte.spec.js
```

Expected: all 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/SectionTab.svelte src/lib/components/SectionTab.svelte.spec.js
git commit -m "feat: add SectionTab component"
```

---

### Task 3: Integrate SectionTab into Layout

**Files:**
- Modify: `src/routes/+layout.svelte`

The layout already reads `$page.data` from `+layout.js → getPageData()`. `getPageData()` already lowercases all frontmatter keys, so `Section: Mind Control` in an article's frontmatter becomes `$page.data.section === 'Mind Control'` automatically.

Changes:
1. Import `SectionTab` and `getSection`
2. Derive `section` and `sectionData` from `$page.data`
3. Render `<SectionTab>` when `section` is set
4. Set `--section-color` CSS custom property on `#page` so `Sidebar.svelte` can inherit it

- [ ] **Step 1: Read the current layout**

Read `src/routes/+layout.svelte` before editing (already done during planning — it's 27 lines).

- [ ] **Step 2: Update the layout**

Replace the entire content of `src/routes/+layout.svelte` with (use tabs for indentation, matching the existing file):

```svelte
<script>
	import favicon from '$lib/assets/favicon.svg';
	import Cover from '$lib/components/Cover.svelte';
	import SectionTab from '$lib/components/SectionTab.svelte';
	import { getAllArticles } from '$lib/content.js';
	import { getSection } from '$lib/sections.js';
	import { page } from '$app/stores';
	import '../app.css';
	import rootCover from './media/cover.jpg?url';

	let { children } = $props();

	const title = $derived($page.data?.title ?? '');
	const cover = $derived($page.data?.cover ?? rootCover);
	const section = $derived($page.data?.section ?? '');
	const sectionData = $derived(section ? getSection(section) : null);
	const articles = getAllArticles();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if title}
	<Cover {title} cover_img_url={cover} {articles} />
{/if}

{#if section}
	<SectionTab {section} />
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

- [ ] **Step 3: Verify the dev server builds without errors**

```bash
npm run dev
```

Expected: Server starts on port 2222, no TypeScript/Svelte errors in terminal. Visit `http://localhost:2222/2026/03/doomtubers` — should see the Mind Control tab on the left (blue, `#3AB7F4`) on a wide screen.

- [ ] **Step 4: Run the full test suite**

```bash
npm test -- --run
```

Expected: all existing tests continue to PASS

- [ ] **Step 5: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat: render SectionTab in layout, expose --section-color CSS variable"
```

---

## Chunk 3: Sidebar Component and [SIDEBAR] Preprocessing

### Task 4: Sidebar Svelte Component

**Files:**
- Create: `src/lib/components/Sidebar.svelte`
- Create: `src/lib/components/Sidebar.svelte.spec.js`

`Sidebar` renders as a full-width colored box within the article flow. It uses `var(--section-color, #5EC035)` for its background — this variable is set on `#page` by the layout (Task 3). The light-bulb icon (`/symbols/light-bulb.svg`) sits in the top-right corner. The `content` prop is rendered via `{@html}` — this is safe here because content is always author-supplied at build time via preprocessed markdown files, never from user input.

Props: `title` (string), `content` (string, may contain basic HTML).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/components/Sidebar.svelte.spec.js`:

```js
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Sidebar from './Sidebar.svelte';

describe('Sidebar', () => {
  it('renders the title', async () => {
    render(Sidebar, { title: 'Key Concept', content: 'Some text.' });
    await expect.element(page.getByText('Key Concept')).toBeInTheDocument();
  });

  it('renders the content', async () => {
    render(Sidebar, { title: 'My Box', content: 'Here is the content.' });
    await expect.element(page.getByText('Here is the content.')).toBeInTheDocument();
  });

  it('renders the lightbulb icon', async () => {
    render(Sidebar, { title: 'T', content: 'C' });
    const img = page.getByRole('img', { hidden: true });
    await expect.element(img).toHaveAttribute('src', '/symbols/light-bulb.svg');
  });

  it('renders HTML content safely', async () => {
    render(Sidebar, { title: 'T', content: '<strong>Bold</strong> text.' });
    await expect.element(page.getByText('Bold text.')).toBeInTheDocument();
  });

  it('has the sidebar CSS class', async () => {
    const { container } = render(Sidebar, { title: 'T', content: 'C' });
    await expect.element(page.elementLocator(container.querySelector('.sidebar'))).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --run src/lib/components/Sidebar.svelte.spec.js
```

Expected: FAIL — `Cannot find module './Sidebar.svelte'`

- [ ] **Step 3: Write the implementation**

Create `src/lib/components/Sidebar.svelte`:

```svelte
<script>
  let { title = '', content = '' } = $props();
</script>

<aside class="sidebar">
  <img
    class="lightbulb"
    src="/symbols/light-bulb.svg"
    alt=""
    aria-hidden="true"
    width="28"
    height="43"
  />
  <h3 class="sidebar-title">{title}</h3>
  <div class="sidebar-content">{@html content}</div>
</aside>

<style>
  .sidebar {
    position: relative;
    background-color: var(--section-color, #5ec035);
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
    color: #fff;
    overflow: hidden;
  }

  .lightbulb {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 28px;
    height: auto;
    opacity: 0.9;
  }

  .sidebar-title {
    font-family: Inter, sans-serif;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0 0 0.75rem;
    color: #fff;
    padding-right: 40px;
    line-height: 1.3;
  }

  .sidebar-content {
    font-family: Inter, sans-serif;
    font-size: 0.85rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.9);
  }

  .sidebar-content :global(p) {
    text-indent: 0;
    margin-bottom: 0.5rem;
  }

  .sidebar-content :global(a) {
    color: rgba(255, 255, 255, 0.9);
  }
</style>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --run src/lib/components/Sidebar.svelte.spec.js
```

Expected: all 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/Sidebar.svelte src/lib/components/Sidebar.svelte.spec.js
git commit -m "feat: add Sidebar component"
```

---

### Task 5: Sidebar Markup Preprocessor

**Files:**
- Create: `src/lib/preprocess-sidebar.js`
- Create: `src/lib/preprocess-sidebar.spec.js`
- Modify: `svelte.config.js`

**Why a Svelte markup preprocessor instead of a remark plugin:**
A Svelte markup preprocessor runs on the raw `.svx` file text *before* mdsvex processes it. This means we can (1) transform `[SIDEBAR]...[/SIDEBAR]` into `<Sidebar title="..." content="..." />` and (2) inject the `import Sidebar` statement into the file's `<script>` block. The result is a fully rendered sidebar during prerendering with no client-side mounting required.

**Syntax supported:**
```
[SIDEBAR]
title: "My Sidebar Title"
content: "The sidebar body text. HTML tags like <strong>bold</strong> are supported."
[/SIDEBAR]
```

Both `title` and `content` values must be double-quoted strings on a single line each. No nested quotes in values.

> **Authoring limitation:** HTML attributes inside `content` values that use double quotes will break the parser — e.g. `content: "See <a href="https://example.com">link</a>."` fails because the parser stops at the first inner `"`. Use single-quoted HTML attributes inside content: `<a href='https://example.com'>link</a>`. This is a known v1 constraint.

**Import injection rules:**
1. If a regular `<script>` block exists (no `context="module"` attribute), prepend the import inside it.
2. If no regular `<script>` block exists, prepend one before the file content.
3. If the import is already present, do nothing.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/preprocess-sidebar.spec.js`:

```js
import { describe, it, expect } from 'vitest';
import { preprocessSidebar } from './preprocess-sidebar.js';

const IMPORT_LINE = `import Sidebar from '$lib/components/Sidebar.svelte';`;

function transform(content, filename = 'test.svx') {
  const preprocessor = preprocessSidebar();
  const result = preprocessor.markup({ content, filename });
  return result ? result.code : content;
}

describe('preprocessSidebar', () => {
  it('returns unchanged content when no [SIDEBAR] block is present', () => {
    const input = 'Just regular markdown.';
    expect(transform(input)).toBe(input);
  });

  it('ignores non-.svx / non-.md files', () => {
    const input = '[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]';
    expect(transform(input, 'foo.svelte')).toBe(input);
  });

  it('transforms a [SIDEBAR] block into a <Sidebar> component call', () => {
    const input = '[SIDEBAR]\ntitle: "Key Concept"\ncontent: "This is the body."\n[/SIDEBAR]';
    const output = transform(input);
    expect(output).toContain('<Sidebar title="Key Concept" content="This is the body." />');
    expect(output).not.toContain('[SIDEBAR]');
  });

  it('injects the import when no script block exists', () => {
    const input = '[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]';
    const output = transform(input);
    expect(output).toContain(IMPORT_LINE);
    expect(output).toContain('<script>');
  });

  it('injects the import into an existing <script> block', () => {
    const input = `<script>\nlet x = 1;\n</script>\n[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]`;
    const output = transform(input);
    expect(output).toContain(IMPORT_LINE);
    // Only one script block
    expect(output.split('<script>').length).toBe(2);
  });

  it('does not inject import twice when already present', () => {
    const input = `<script>\n${IMPORT_LINE}\nlet x = 1;\n</script>\n[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]`;
    const output = transform(input);
    expect(output.split(IMPORT_LINE).length).toBe(2); // exactly one occurrence
  });

  it('does not inject import into <script context="module"> block', () => {
    const input = `<script context="module">\nexport const prerender = true;\n</script>\n[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]`;
    const output = transform(input);
    expect(output).toContain(IMPORT_LINE);
    // import is in its own new <script> block, not inside the module script
    const moduleScriptContent = output.match(/<script context="module">([\s\S]*?)<\/script>/)?.[1] ?? '';
    expect(moduleScriptContent).not.toContain(IMPORT_LINE);
  });

  it('handles multiple [SIDEBAR] blocks in one file', () => {
    const input = `Para 1.\n[SIDEBAR]\ntitle: "A"\ncontent: "Content A."\n[/SIDEBAR]\nPara 2.\n[SIDEBAR]\ntitle: "B"\ncontent: "Content B."\n[/SIDEBAR]`;
    const output = transform(input);
    expect(output).toContain('<Sidebar title="A" content="Content A." />');
    expect(output).toContain('<Sidebar title="B" content="Content B." />');
    // Import injected only once
    expect(output.split(IMPORT_LINE).length).toBe(2);
  });

  it('escapes double quotes in title and content values', () => {
    const input = `[SIDEBAR]\ntitle: "He said \\"hello\\""\ncontent: "C"\n[/SIDEBAR]`;
    const output = transform(input);
    expect(output).toContain('title="He said &quot;hello&quot;"');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --run src/lib/preprocess-sidebar.spec.js
```

Expected: FAIL — `Cannot find module './preprocess-sidebar.js'`

- [ ] **Step 3: Write the implementation**

Create `src/lib/preprocess-sidebar.js`:

```js
const SIDEBAR_BLOCK_REGEX = /\[SIDEBAR\]([\s\S]*?)\[\/SIDEBAR\]/g;
const IMPORT_STATEMENT = `import Sidebar from '$lib/components/Sidebar.svelte';`;

function parseSidebarBlock(blockContent) {
  const titleMatch = blockContent.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
  const contentMatch = blockContent.match(/content:\s*"((?:[^"\\]|\\.)*)"/);
  const title = (titleMatch ? titleMatch[1] : '').replace(/"/g, '&quot;');
  const content = (contentMatch ? contentMatch[1] : '').replace(/"/g, '&quot;');
  return `<Sidebar title="${title}" content="${content}" />`;
}

function injectImport(code) {
  if (code.includes(IMPORT_STATEMENT)) return code;

  // Find a regular <script> block (not context="module")
  const regularScriptRegex = /<script(?!\s+context\s*=\s*["']module["'])([^>]*)>/;
  if (regularScriptRegex.test(code)) {
    return code.replace(regularScriptRegex, `<script$1>\n  ${IMPORT_STATEMENT}`);
  }

  // No regular script block — prepend one
  return `<script>\n  ${IMPORT_STATEMENT}\n</script>\n${code}`;
}

export function preprocessSidebar() {
  return {
    markup({ content, filename }) {
      if (!filename?.endsWith('.svx') && !filename?.endsWith('.md')) return;
      if (!content.includes('[SIDEBAR]')) return;

      const transformed = content.replace(SIDEBAR_BLOCK_REGEX, (_, blockContent) =>
        parseSidebarBlock(blockContent)
      );

      return { code: injectImport(transformed) };
    }
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --run src/lib/preprocess-sidebar.spec.js
```

Expected: all 9 tests PASS

- [ ] **Step 5: Register the preprocessor in svelte.config.js**

Read `svelte.config.js` first (already done during planning). Replace its content with:

```js
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import relativeImages from 'mdsvex-relative-images';
import { preprocessSidebar } from './src/lib/preprocess-sidebar.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      handleUnseenRoutes: 'ignore',
      handleHttpError: 'ignore'
    }
  },
  preprocess: [
    preprocessSidebar(),
    mdsvex({
      extensions: ['.md', '.svx'],
      remarkPlugins: [relativeImages]
    })
  ],
  extensions: ['.svelte', '.md', '.svx']
};

export default config;
```

**Order matters:** `preprocessSidebar()` must come before `mdsvex()` so the `[SIDEBAR]` blocks are converted to `<Sidebar>` calls before mdsvex processes the markdown.

- [ ] **Step 6: Verify the build works**

```bash
npm run dev
```

Expected: Server starts without errors.

- [ ] **Step 7: Run full test suite**

```bash
npm test -- --run
```

Expected: all tests PASS

- [ ] **Step 8: Commit**

```bash
git add src/lib/preprocess-sidebar.js src/lib/preprocess-sidebar.spec.js svelte.config.js
git commit -m "feat: add [SIDEBAR] preprocessor and register in svelte.config.js"
```

---

### Task 6: Add a Test Sidebar to an Article

Verify end-to-end: add a `[SIDEBAR]` block to the doomtubers article, confirm it renders correctly in the browser.

**Files:**
- Modify: `src/routes/2026/03/doomtubers/+page.svx`

- [ ] **Step 1: Add a sidebar block to the article**

Open `src/routes/2026/03/doomtubers/+page.svx`. Find the section heading `# The Model That Isn't` (line 30). Add a sidebar block immediately after it (after the heading, before the first paragraph of that section):

```
# The Model That Isn't

[SIDEBAR]
title: "What Makes a Real Model?"
content: "A model has formal structure—parameters, math, and a mechanism that generates specific predictions you can be <em>wrong about in advance</em>. Visualization without falsifiability is storytelling."
[/SIDEBAR]

When Jiang refers to his charts as "models,"...
```

- [ ] **Step 2: Check the dev server**

```bash
npm run dev
```

Navigate to `http://localhost:2222/2026/03/doomtubers`.

Expected:
- The sidebar box appears after "The Model That Isn't" heading
- Background color is `#3AB7F4` (Mind Control blue — the article's section)
- Light bulb icon appears in the top-right corner
- Title "What Makes a Real Model?" is in white uppercase
- `<em>` renders as italic

- [ ] **Step 3: Run a production build to verify prerendering**

```bash
npm run build
```

Expected: Build completes without errors. The sidebar content is present in the prerendered HTML (view `.svelte-kit/output/prerendered/pages/2026/03/doomtubers/index.html` and search for "What Makes a Real Model").

- [ ] **Step 4: Commit**

```bash
git add src/routes/2026/03/doomtubers/+page.svx
git commit -m "feat: add test [SIDEBAR] to doomtubers article"
```

---

## Verification Checklist

Before considering this plan complete, confirm all of the following:

- [ ] `npm test -- --run` passes with zero failures
- [ ] `npm run build` completes without errors
- [ ] On an article page (e.g. `/2026/03/doomtubers`) at viewport ≥ 900px wide: section tab is visible on the left in the correct section color (`#3AB7F4`)
- [ ] Section tab is hidden at viewport < 900px
- [ ] A `[SIDEBAR]` block in a `.svx` file renders as a colored box using the article's section color
- [ ] The light-bulb icon appears in the top-right of every sidebar
- [ ] The prerendered HTML (from `npm run build`) contains sidebar content (not empty placeholders)
- [ ] No regressions in existing tests (HamburgerMenu, TableOfContents)