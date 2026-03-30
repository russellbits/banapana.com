# Disqus Comments Integration Fix

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the 500 error by creating a Svelte 5 compatible Disqus component that only renders on article pages and works with SSR.

**Architecture:** Replace the incompatible `disqus-svelte` package with a custom Svelte 5 component that dynamically loads the Disqus embed script client-side only, and only displays on article pages (when title data exists).

**Tech Stack:** Svelte 5, SvelteKit, Disqus embed API

---

## Context

The `disqus-svelte` package (v1.0.9) is incompatible with Svelte 5:

- Built for Svelte 3 (`"svelte": "^3.0.0"`)
- Uses old `export let` syntax instead of `$props()`
- Uses `window` at module level causing SSR failures
- Missing Svelte 5 export conditions in package.json

The current implementation in `+layout.svelte`:

- Renders Comments on ALL pages (home, about, articles)
- Uses `identifier={$page.url.pathname}` which isn't specific enough
- Fails during SSR because Disqus requires browser APIs

---

## Task 1: Create Svelte 5 Compatible Comments Component

**Files:**

- Create: `src/lib/components/Comments.svelte`

**Step 1: Create the Comments component**

```svelte
<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { identifier = '', title = '', url = '', shortname = 'banapana' } = $props();

	let loaded = $state(false);
	let container;

	const disqusConfig = {
		url: url || (browser ? window.location.href : ''),
		identifier: identifier,
		title: title
	};

	onMount(() => {
		if (!container) return;

		loaded = true;

		window.disqus_config = function () {
			this.page.url = disqusConfig.url;
			this.page.identifier = disqusConfig.identifier;
			this.page.title = disqusConfig.title;
		};

		const script = document.createElement('script');
		script.id = 'disqus-embed-script';
		script.src = `https://${shortname}.disqus.com/embed.js`;
		script.setAttribute('data-timestamp', String(+new Date()));
		script.async = true;
		document.body.appendChild(script);

		return () => {
			const existingScript = document.getElementById('disqus-embed-script');
			if (existingScript) {
				existingScript.remove();
			}
			delete window.disqus_config;
		};
	});
</script>

{#if loaded && browser}
	<div id="disqus_thread" bind:this={container}></div>
{/if}

<style>
	#disqus_thread {
		margin: 2rem auto;
		max-width: 800px;
		padding: 0 1rem;
	}
</style>
```

**Step 2: Run autofixer to validate**

Run: `npx svelte-check --threshold warning 2>&1 | head -50`
Expected: No errors related to this file

**Step 3: Commit**

```bash
git add src/lib/components/Comments.svelte
git commit -m "feat: create Svelte 5 Disqus comments component"
```

---

## Task 2: Update Layout to Use New Component and Conditionally Render

**Files:**

- Modify: `src/routes/+layout.svelte`

**Step 1: Update the layout import and usage**

Replace line 7:

```javascript
// Before
import Comments from 'disqus-svelte';

// After
import Comments from '$lib/components/Comments.svelte';
```

Replace lines 60-61:

```svelte
<!-- Before -->
<Comments identifier={$page.url.pathname} />

<!-- After -->
{#if title}
	<Comments identifier={$page.url.pathname} {title} url={$page.url.origin + $page.url.pathname} />
{/if}
```

**Step 2: Verify build**

Run: `npm run build 2>&1 | tail -30`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "fix: use Svelte 5 Comments component, only render on article pages"
```

---

## Task 3: Add Disqus Configuration

**Files:**

- Modify: `.env`

**Step 1: Document required env vars**

Add to `.env` (create if needed):

```
PUBLIC_DISQUS_SHORTNAME=banapana
```

**Step 2: Update the Comments component to use env var**

```svelte
<script>
	import { browser } from '$app/environment';
	import { PUBLIC_DISQUS_SHORTNAME } from '$env/static/public';
	import { onMount } from 'svelte';

	let { identifier = '', title = '', url = '' } = $props();

	let loaded = $state(false);
	let container;

	const disqusConfig = {
		url: url || (browser ? window.location.href : ''),
		identifier: identifier,
		title: title
	};

	onMount(() => {
		if (!container) return;

		loaded = true;

		window.disqus_config = function () {
			this.page.url = disqusConfig.url;
			this.page.identifier = disqusConfig.identifier;
			this.page.title = disqusConfig.title;
		};

		const script = document.createElement('script');
		script.id = 'disqus-embed-script';
		script.src = `https://${PUBLIC_DISQUS_SHORTNAME}.disqus.com/embed.js`;
		script.setAttribute('data-timestamp', String(+new Date()));
		script.async = true;
		document.body.appendChild(script);

		return () => {
			const existingScript = document.getElementById('disqus-embed-script');
			if (existingScript) {
				existingScript.remove();
			}
			delete window.disqus_config;
		};
	});
</script>

{#if loaded && browser}
	<div id="disqus_thread" bind:this={container}></div>
{/if}

<style>
	#disqus_thread {
		margin: 2rem auto;
		max-width: 800px;
		padding: 0 1rem;
	}
</style>
```

**Step 3: Commit**

```bash
git add src/lib/components/Comments.svelte .env
git commit -m "feat: add Disqus shortname from env var"
```

---

## Task 4: Test the Integration

**Step 1: Start dev server**

Run: `npm run dev`
Expected: Dev server starts without errors

**Step 2: Visit an article page**

Navigate to: `http://localhost:2222/2026/03/the-contentkeeper` (or any published article)
Expected: Comments section appears below article content

**Step 3: Visit home page**

Navigate to: `http://localhost:2222`
Expected: No comments section (no 500 error)

**Step 4: Kill dev server**

```bash
pkill -f "vite" 2>/dev/null || true
```

**Step 5: Commit final state**

```bash
git add -A
git commit -m "chore: complete Disqus integration fix"
```

---

## Verification Checklist

- [ ] `npm run build` completes without errors
- [ ] Dev server starts without 500 errors
- [ ] Comments appear on article pages only
- [ ] No comments on home page
- [ ] Build output generates static HTML correctly
