# Hamburger Menu & Table of Contents Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hamburger button to the Cover (top-right) that opens a frosted-glass Table of Contents listing all published articles with dates and links.

**Architecture:** Two new Svelte 4-style components (`HamburgerMenu`, `TableOfContents`) mount inside the existing `Cover.svelte`. `Cover` owns the `tocOpen` boolean and wires toggle/close events. Article data flows from `content.js` → `+layout.svelte` → `Cover` → `TableOfContents`. A new `getAllArticles()` export in `content.js` provides the sorted article list.

**Tech Stack:** Svelte 4 component style (`export let`, `createEventDispatcher`), Vitest + vitest-browser-svelte for component tests, CSS `backdrop-filter` for the glass effect.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/content.js` | Modify | Add `getAllArticles()` |
| `src/lib/components/HamburgerMenu.svelte` | Create | Toggle button, top-right of Cover |
| `src/lib/components/HamburgerMenu.spec.js` | Create | Component tests for HamburgerMenu |
| `src/lib/components/TableOfContents.svelte` | Create | Glass overlay sheet with article list |
| `src/lib/components/TableOfContents.spec.js` | Create | Component tests for TableOfContents |
| `src/lib/components/Cover.svelte` | Modify | Wire both new components, own `tocOpen` state |
| `src/routes/+layout.svelte` | Modify | Pass `articles` array to Cover |

---

## Chunk 1: Data + HamburgerMenu

### Task 1: Add `getAllArticles()` to `content.js`

**Files:**
- Modify: `src/lib/content.js`

The `pages` variable is already defined at module scope via `import.meta.glob`. `getAllArticles()` reads it directly — no new imports needed.

- [ ] **Step 1: Add `getAllArticles()` to `src/lib/content.js`**

Append after the existing `getPageData` function:

```js
export function getAllArticles() {
	return Object.entries(pages)
		.filter(([path]) => /\/src\/routes\/\d{4}\/\d{2}\/[^/]+\/\+page\.svx$/.test(path))
		.map(([path, mod]) => {
			const raw = mod?.metadata ?? {};
			const data = {};
			for (const [k, v] of Object.entries(raw)) data[k.toLowerCase()] = v;
			const url = path.replace('/src/routes', '').replace('/+page.svx', '');
			return { title: data.title, published: data.published, path: url };
		})
		.filter((a) => {
			if (!a.published) return false;
			return new Date(a.published) <= new Date();
		})
		.sort((a, b) => new Date(b.published) - new Date(a.published));
}
```

- [ ] **Step 2: Smoke-test in the dev server**

```bash
npm run dev
```

Open `http://localhost:2222` in a browser and open the browser console. Paste:

```js
// In browser console — confirms getAllArticles is exported and returns data
// (This is a manual check; import.meta.glob only works in Vite context)
```

Alternatively, just confirm the build doesn't error:
```bash
npm run build
```
Expected: build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/content.js
git commit -m "feat: add getAllArticles() to content.js"
```

---

### Task 2: Create `HamburgerMenu.svelte`

**Files:**
- Create: `src/lib/components/HamburgerMenu.svelte`
- Create: `src/lib/components/HamburgerMenu.spec.js`

- [ ] **Step 1: Write the failing test**

Create `src/lib/components/HamburgerMenu.spec.js`:

```js
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HamburgerMenu from './HamburgerMenu.svelte';

describe('HamburgerMenu', () => {
	it('renders a button with aria-label', async () => {
		render(HamburgerMenu, { open: false });
		const btn = page.getByRole('button', { name: 'Toggle table of contents' });
		await expect.element(btn).toBeInTheDocument();
	});

	it('renders three line spans inside the button', async () => {
		render(HamburgerMenu, { open: false });
		const lines = page.getByRole('button').locator('.line');
		await expect.element(lines.nth(0)).toBeInTheDocument();
		await expect.element(lines.nth(1)).toBeInTheDocument();
		await expect.element(lines.nth(2)).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/components/HamburgerMenu.spec.js
```

Expected: FAIL — `HamburgerMenu.svelte` does not exist yet.

- [ ] **Step 3: Create `src/lib/components/HamburgerMenu.svelte`**

```svelte
<script>
	import { createEventDispatcher } from 'svelte';

	export let open = false;

	const dispatch = createEventDispatcher();
</script>

<button
	class="hamburger"
	on:click={() => dispatch('toggle')}
	aria-label="Toggle table of contents"
	aria-expanded={open}
>
	<span class="line"></span>
	<span class="line"></span>
	<span class="line"></span>
</button>

<style>
	.hamburger {
		position: absolute;
		top: 20px;
		right: 20px;
		width: 54px;
		height: 44px;
		background: #000;
		border: none;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
		cursor: pointer;
		z-index: 10;
		padding: 0;
	}

	.line {
		display: block;
		width: 26px;
		height: 3px;
		background: rgba(117, 250, 76, 0.85);
		border-radius: 2px;
	}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/components/HamburgerMenu.spec.js
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/HamburgerMenu.svelte src/lib/components/HamburgerMenu.spec.js
git commit -m "feat: add HamburgerMenu component"
```

---

## Chunk 2: TableOfContents + Wiring

### Task 3: Create `TableOfContents.svelte`

**Files:**
- Create: `src/lib/components/TableOfContents.svelte`
- Create: `src/lib/components/TableOfContents.spec.js`

- [ ] **Step 1: Write the failing test**

Create `src/lib/components/TableOfContents.spec.js`:

```js
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TableOfContents from './TableOfContents.svelte';

const ARTICLES = [
	{ title: 'Second Article', published: '2026-02-12', path: '/2026/02/second-article' },
	{ title: 'First Article', published: '2025-10-01', path: '/2025/10/first-article' },
];

describe('TableOfContents', () => {
	it('renders article titles as links', async () => {
		render(TableOfContents, { articles: ARTICLES, open: true });
		await expect.element(page.getByRole('link', { name: 'Second Article' })).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'First Article' })).toBeInTheDocument();
	});

	it('links point to correct article paths', async () => {
		render(TableOfContents, { articles: ARTICLES, open: true });
		const link = page.getByRole('link', { name: 'Second Article' });
		await expect.element(link).toHaveAttribute('href', '/2026/02/second-article');
	});

	it('renders formatted dates', async () => {
		render(TableOfContents, { articles: ARTICLES, open: true });
		await expect.element(page.getByText('February 12, 2026')).toBeInTheDocument();
		await expect.element(page.getByText('October 1, 2025')).toBeInTheDocument();
	});

	it('renders a close button', async () => {
		render(TableOfContents, { articles: ARTICLES, open: true });
		await expect.element(page.getByRole('button', { name: 'Close table of contents' })).toBeInTheDocument();
	});

	it('does not have the open class when closed', async () => {
		render(TableOfContents, { articles: ARTICLES, open: false });
		const sheet = page.locator('.toc-sheet');
		await expect.element(sheet).not.toHaveClass('open');
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/components/TableOfContents.spec.js
```

Expected: FAIL — `TableOfContents.svelte` does not exist yet.

- [ ] **Step 3: Create `src/lib/components/TableOfContents.svelte`**

```svelte
<script>
	import { createEventDispatcher } from 'svelte';

	export let articles = [];
	export let open = false;

	const dispatch = createEventDispatcher();

	const SEPARATORS = [
		'📧 🚫 ✊',
		'🤖 📝 ✨',
		'🌷 💰 🤖',
		'🧠 🔓 💭',
		'🌊 🎯 🔥',
		'🎲 🌙 ⚡',
	];

	function formatDate(dateStr) {
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<div class="toc-sheet" class:open>
	<button
		class="close"
		on:click={() => dispatch('close')}
		aria-label="Close table of contents"
	>✕</button>

	<p class="heading">Table of Contents</p>

	<ul>
		{#each articles as article, i}
			<li class="item">
				<p class="date">{formatDate(article.published)}</p>
				<a href={article.path}>{article.title}</a>
			</li>
			{#if i < articles.length - 1}
				<li class="separator" aria-hidden="true">{SEPARATORS[i % SEPARATORS.length]}</li>
			{/if}
		{/each}
	</ul>
</div>

<style>
	.toc-sheet {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(10, 5, 18, 0.78);
		backdrop-filter: blur(28px) saturate(160%);
		-webkit-backdrop-filter: blur(28px) saturate(160%);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		z-index: 20;
		padding: 2.5rem 2rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: fit-content;
		transform: translateY(-100%);
		transition: transform 0.3s ease;
	}

	.toc-sheet.open {
		transform: translateY(0);
	}

	.close {
		position: absolute;
		top: 1.4em;
		right: 1.7em;
		background: none;
		border: none;
		color: rgba(117, 250, 76, 0.75);
		font-size: 1.3rem;
		cursor: pointer;
		line-height: 1;
		padding: 0;
	}

	.heading {
		color: rgba(255, 255, 255, 0.55);
		font-family: Inter, sans-serif;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		margin: 0 0 1.4rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.item {
		text-align: center;
		padding: 0.65rem 1rem;
	}

	.date {
		font-size: 0.68rem;
		font-family: Inter, sans-serif;
		color: rgba(255, 255, 255, 0.38);
		letter-spacing: 0.05em;
		margin: 0 0 0.25rem;
	}

	a {
		color: rgba(255, 255, 255, 0.88);
		text-decoration: none;
		font-family: Georgia, serif;
		font-size: 0.98rem;
		line-height: 1.35;
		border-bottom: 1px solid rgba(117, 250, 76, 0.3);
		padding-bottom: 1px;
		transition: color 0.15s, border-color 0.15s;
	}

	a:hover {
		color: rgba(117, 250, 76, 0.95);
		border-bottom-color: rgba(117, 250, 76, 0.65);
	}

	.separator {
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.95rem;
		padding: 0.4rem 0;
		letter-spacing: 0.2em;
		text-align: center;
	}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/components/TableOfContents.spec.js
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/TableOfContents.svelte src/lib/components/TableOfContents.spec.js
git commit -m "feat: add TableOfContents component"
```

---

### Task 4: Wire into `Cover.svelte`

**Files:**
- Modify: `src/lib/components/Cover.svelte`

The current `Cover.svelte` `<script>` block is:
```svelte
<script>
	import PubDate from './PubDate.svelte';
	import Logo from './Logo.svelte';

	export let title = '';
	export let cover_img_url ='media/cover.jpg'
</script>
```

And the template starts with:
```svelte
<div class="cover">
	<div class="bg-layer" ...></div>
	<div class="gradient-overlay"></div>
	<div class="particles">...</div>
	<div class="pubdate-wrapper">
		<PubDate />
	</div>
	<div class="content">
		<Logo />
		<h1 class="title">{title}</h1>
	</div>
</div>
```

- [ ] **Step 1: Update the `<script>` block in `Cover.svelte`**

Replace the script block with:

```svelte
<script>
	import PubDate from './PubDate.svelte';
	import Logo from './Logo.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';
	import TableOfContents from './TableOfContents.svelte';

	export let title = '';
	export let cover_img_url = 'media/cover.jpg';
	export let articles = [];

	let tocOpen = false;
</script>
```

- [ ] **Step 2: Insert the two new components into the template in `Cover.svelte`**

Find the closing `</div>` of `.pubdate-wrapper` and insert the two new lines immediately after it, before `<div class="content">`:

```svelte
	</div>
	<HamburgerMenu open={tocOpen} on:toggle={() => (tocOpen = !tocOpen)} />
	<TableOfContents {articles} open={tocOpen} on:close={() => (tocOpen = false)} />
	<div class="content">
```

Do not touch anything else in the template. The particles, bg-layer, gradient-overlay, and content div are unchanged.

- [ ] **Step 3: Verify in the browser**

```bash
npm run dev
```

Open `http://localhost:2222`. The hamburger button should appear top-right. Clicking it should open the glass TOC sheet. Clicking ✕ should close it.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/Cover.svelte
git commit -m "feat: wire HamburgerMenu and TableOfContents into Cover"
```

---

### Task 5: Pass articles from `+layout.svelte` to Cover

**Files:**
- Modify: `src/routes/+layout.svelte`

The current layout is:

```svelte
<script>
	import favicon from '$lib/assets/favicon.svg';
	import Cover from '$lib/components/Cover.svelte';
	import { page } from '$app/stores';
	import '../app.css';
	import rootCover from './media/cover.jpg?url';

	let { children } = $props();

	const title = $derived($page.data?.title ?? '');
	const cover = $derived($page.data?.cover ?? rootCover);
</script>
```

- [ ] **Step 1: Add `getAllArticles` import and call inside the existing `<script>` block**

```svelte
<script>
	import favicon from '$lib/assets/favicon.svg';
	import Cover from '$lib/components/Cover.svelte';
	import { getAllArticles } from '$lib/content.js';
	import { page } from '$app/stores';
	import '../app.css';
	import rootCover from './media/cover.jpg?url';

	let { children } = $props();

	const title = $derived($page.data?.title ?? '');
	const cover = $derived($page.data?.cover ?? rootCover);
	const articles = getAllArticles();
</script>
```

- [ ] **Step 2: Pass `articles` to Cover in the template**

```svelte
{#if title}
	<Cover {title} cover_img_url={cover} {articles} />
{/if}
```

- [ ] **Step 3: Final smoke test**

```bash
npm run dev
```

Open `http://localhost:2222`. The hamburger button shows top-right. Click it — the frosted-glass TOC slides down listing all published articles with dates. Each title is a clickable link. Clicking ✕ slides the TOC back up.

Then verify the build passes:

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat: pass articles to Cover for table of contents"
```

---

## Done

All five tasks complete. Run the full test suite one final time:

```bash
npx vitest run
```

Expected: all tests pass including the two new spec files.
