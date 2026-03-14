# Layout and Float System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a magazine-style 1200px layout with alternating float sidebars/images, deterministic section tab rotation, and three bug fixes.

**Architecture:** Three tracks executed sequentially: (1) bug fix + section tab rotation (pure functions + component props, fully testable in isolation), (2) Sidebar float prop + new FloatImage component (TDD), (3) preprocessor extension + CSS layout update + dev tooling.

**Tech Stack:** SvelteKit + Svelte 5 runes, mdsvex markup preprocessor, vitest-browser-svelte, adapter-static, Node.js `fs.watch` + `child_process.spawn`

**Test command (single run):** `npm run test:unit -- --run`
**Test command (specific file):** `npx vitest run src/lib/components/MyComponent.svelte.spec.js`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/routes/2023/12/le-grande-bibliotheque-and-the-future-with-ai/+page.svx` | Modify | Remove blank line after `---` |
| `src/lib/sections.js` | Modify | Add `slugRotation` export |
| `src/lib/components/SectionTab.svelte` | Modify | Add `rotation` prop, CSS custom property |
| `src/lib/components/SectionTab.svelte.spec.js` | Modify | Add rotation tests |
| `src/routes/+layout.svelte` | Modify | Compute rotation, pass to SectionTab |
| `src/lib/components/Sidebar.svelte` | Modify | Add `side` prop, float CSS |
| `src/lib/components/Sidebar.svelte.spec.js` | Modify | Add side prop tests |
| `src/lib/components/FloatImage.svelte` | Create | Float image component |
| `src/lib/components/FloatImage.svelte.spec.js` | Create | FloatImage tests |
| `src/lib/preprocess-sidebar.js` | Modify | Image alternation, side props, code fence exclusion |
| `src/app.css` | Modify | 1200px layout, overflow: flow-root |
| `scripts/watch-content.js` | Create | Content watcher + Vite spawner |
| `package.json` | Modify | Add `dev:full` script |

---

## Chunk 1: Bug Fix, slugRotation, SectionTab Rotation

### Task 1: Fix 2023 article frontmatter

**Files:**
- Modify: `src/routes/2023/12/le-grande-bibliotheque-and-the-future-with-ai/+page.svx`

The file has a blank line between `---` and the first frontmatter key. mdsvex treats this as the end of the frontmatter block, so the YAML is never parsed and the title is empty (no Cover rendered).

- [ ] **Remove the blank line on line 2 of the file**

Verify first: `head -5 "src/routes/2023/12/le-grande-bibliotheque-and-the-future-with-ai/+page.svx"` — line 2 should be blank.

Current state (lines 1-3):
```
---

Title: "On the Grand Library of Montreal..."
```

Should become (delete line 2):
```
---
Title: "On the Grand Library of Montreal..."
```

- [ ] **Commit**
```bash
git add "src/routes/2023/12/le-grande-bibliotheque-and-the-future-with-ai/+page.svx"
git commit -m "fix: remove blank line in frontmatter that broke YAML parsing"
```

---

### Task 2: Add `slugRotation` to sections.js

**Files:**
- Modify: `src/lib/sections.js`

No separate test file exists for sections.js. Add tests inline by creating `src/lib/sections.spec.js`.

- [ ] **Write the failing test** in `src/lib/sections.spec.js`:

```js
import { describe, expect, it } from 'vitest';
import { slugRotation } from './sections.js';

describe('slugRotation', () => {
	it('returns a value between -4 and 4 inclusive', () => {
		const result = slugRotation('/2026/03/doomtubers');
		expect(result).toBeGreaterThanOrEqual(-4);
		expect(result).toBeLessThanOrEqual(4);
	});

	it('returns an integer', () => {
		const result = slugRotation('/2026/03/doomtubers');
		expect(Number.isInteger(result)).toBe(true);
	});

	it('returns the same value for the same input (deterministic)', () => {
		const a = slugRotation('/2025/05/notes-on-cognitive-liberty');
		const b = slugRotation('/2025/05/notes-on-cognitive-liberty');
		expect(a).toBe(b);
	});

	it('returns different values for different inputs', () => {
		// Pre-verified: these two slugs produce different hash values
		// doomtubers → 2, cognitive-liberty → -1 (computed from the hash function)
		const a = slugRotation('/2026/03/doomtubers');
		const b = slugRotation('/2025/05/notes-on-cognitive-liberty');
		expect(a).not.toBe(b);
	});

	it('handles empty string without throwing', () => {
		expect(() => slugRotation('')).not.toThrow();
	});
});
```

- [ ] **Run test to verify it fails**
```bash
npx vitest run src/lib/sections.spec.js
```
Expected: FAIL — `slugRotation is not a function`

- [ ] **Add `slugRotation` to `src/lib/sections.js`** (append after the existing `getSection` function):

```js
export function slugRotation(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
	}
	return ((Math.abs(hash) % 9) - 4); // integer -4 to +4
}
```

- [ ] **Run test to verify it passes**
```bash
npx vitest run src/lib/sections.spec.js
```
Expected: All 5 tests PASS

- [ ] **Commit**
```bash
git add src/lib/sections.js src/lib/sections.spec.js
git commit -m "feat: add slugRotation deterministic hash to sections.js"
```

---

### Task 3: Add rotation prop to SectionTab

**Files:**
- Modify: `src/lib/components/SectionTab.svelte`
- Modify: `src/lib/components/SectionTab.svelte.spec.js`

The existing `SectionTab.svelte` uses `transform: translateY(-50%)` in desktop CSS. We cannot set `transform` as an inline style without overriding that rule. Solution: use a CSS custom property `--rotation` set via inline style, consumed by both breakpoints.

- [ ] **Add rotation test to `SectionTab.svelte.spec.js`** (append to existing `describe` block):

```js
it('applies rotation via --rotation CSS custom property', async () => {
	const { container } = render(SectionTab, { section: 'Mind Control', rotation: 3 });
	const tab = container.querySelector('.section-tab');
	await expect.element(page.elementLocator(tab)).toHaveStyle('--rotation: 3deg');
});

it('defaults to 0deg rotation when no rotation prop given', async () => {
	const { container } = render(SectionTab, { section: 'Mind Control' });
	const tab = container.querySelector('.section-tab');
	await expect.element(page.elementLocator(tab)).toHaveStyle('--rotation: 0deg');
});
```

- [ ] **Run to verify new tests fail**
```bash
npx vitest run src/lib/components/SectionTab.svelte.spec.js
```
Expected: The two new tests FAIL; existing tests still PASS

- [ ] **Update `SectionTab.svelte`** — add `rotation` prop and apply CSS custom property:

In the `<script>` block, add `rotation` to `$props()`:
```js
let { section = '', rotation = 0 } = $props();
```

On the `.section-tab` div, add the inline style:
```svelte
<div class="section-tab" style="background-color: {sectionData.color}; --rotation: {rotation}deg">
```

Update the CSS to use `var(--rotation)` in both breakpoints:

In the mobile `.section-tab` block (currently ends at `text-align: center;`), add `transform` as the last property:
```css
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
	transform: rotate(var(--rotation, 0deg));  /* ADD THIS LINE */
}
```

In the desktop `@media (min-width: 900px)` `.section-tab` block, replace `transform: translateY(-50%)` with the composed version:
```css
transform: translateY(-50%) rotate(var(--rotation, 0deg));
```

- [ ] **Run tests to verify all pass**
```bash
npx vitest run src/lib/components/SectionTab.svelte.spec.js
```
Expected: All 7 tests PASS (5 pre-existing: section name, Dept. of label, SVG icon, nothing for unknown section, background color — plus 2 new rotation tests)

- [ ] **Commit**
```bash
git add src/lib/components/SectionTab.svelte src/lib/components/SectionTab.svelte.spec.js
git commit -m "feat: add rotation prop to SectionTab using CSS custom property"
```

---

### Task 4: Wire rotation into layout

**Files:**
- Modify: `src/routes/+layout.svelte`

No separate test for layout — verified visually. This task connects the `slugRotation` function to `SectionTab`.

- [ ] **Update `+layout.svelte`**:

Add import alongside existing imports in the `<script>` block:
```js
import { getSection, slugRotation } from '$lib/sections.js';
```

Add derived value (after existing `$derived` declarations):
```js
const rotation = $derived(slugRotation($page.url.pathname));
```

Update the `SectionTab` call:
```svelte
{#if section}<SectionTab {section} {rotation} />{/if}
```

- [ ] **Verify the dev server starts without errors**
```bash
npm run dev
```
Expected: No compile errors. Open any article page — section tab should appear rotated.

- [ ] **Commit**
```bash
git add src/routes/+layout.svelte
git commit -m "feat: compute and pass rotation from URL slug to SectionTab"
```

---

## Chunk 2: Sidebar Float + FloatImage Component

### Task 5: Add `side` prop to Sidebar

**Files:**
- Modify: `src/lib/components/Sidebar.svelte`
- Modify: `src/lib/components/Sidebar.svelte.spec.js`

The Sidebar currently has no float behavior. We add a `side` prop (`'right' | 'left'`) that controls float direction and the negative margin that nudges it past the container edge.

- [ ] **Add side prop tests to `Sidebar.svelte.spec.js`** (append to existing `describe` block):

```js
it('floats right by default', async () => {
	const { container } = render(Sidebar, { title: 'T', content: 'C' });
	const aside = container.querySelector('.sidebar');
	await expect.element(page.elementLocator(aside)).toHaveStyle('float: right');
});

it('floats left when side="left"', async () => {
	const { container } = render(Sidebar, { title: 'T', content: 'C', side: 'left' });
	const aside = container.querySelector('.sidebar');
	await expect.element(page.elementLocator(aside)).toHaveStyle('float: left');
});

it('applies negative right margin when floating right', async () => {
	const { container } = render(Sidebar, { title: 'T', content: 'C', side: 'right' });
	const aside = container.querySelector('.sidebar');
	await expect.element(page.elementLocator(aside)).toHaveStyle('margin-right: -0.5rem');
});

it('applies negative left margin when floating left', async () => {
	const { container } = render(Sidebar, { title: 'T', content: 'C', side: 'left' });
	const aside = container.querySelector('.sidebar');
	await expect.element(page.elementLocator(aside)).toHaveStyle('margin-left: -0.5rem');
});
```

- [ ] **Run to verify new tests fail**
```bash
npx vitest run src/lib/components/Sidebar.svelte.spec.js
```
Expected: 4 new tests FAIL; existing 5 tests PASS

- [ ] **Update `Sidebar.svelte`**:

Add `side` to props in `<script>`:
```js
let { title = '', content = '', side = 'right' } = $props();
```

Add CSS via a Svelte `class:` directive or a conditional style. Use a `$derived` for the style object — but since Svelte scoped styles can't use prop values, use an inline style on the `<aside>`:

```svelte
<aside class="sidebar" style="
	float: {side};
	width: 45%;
	margin-top: 1rem;
	margin-bottom: 1rem;
	{side === 'right' ? 'margin-right: -0.5rem; margin-left: 1rem;' : 'margin-left: -0.5rem; margin-right: 1rem;'}
">
```

Also **remove** the existing `margin: 2rem 0` from the `.sidebar` scoped CSS block — the inline style now handles all margins, and the scoped rule would be overridden by the inline style anyway (inline styles win on specificity), making the scoped rule misleading dead code.

Add mobile override in `<style>` (scoped — this is fine for static rules):
```css
@media (max-width: 900px) {
	.sidebar {
		float: none;
		width: 100%;
		margin: 1rem 0;
	}
}
```

- [ ] **Run tests to verify all pass**
```bash
npx vitest run src/lib/components/Sidebar.svelte.spec.js
```
Expected: All 9 tests PASS

- [ ] **Commit**
```bash
git add src/lib/components/Sidebar.svelte src/lib/components/Sidebar.svelte.spec.js
git commit -m "feat: add side prop to Sidebar for float layout"
```

---

### Task 6: Create FloatImage component

**Files:**
- Create: `src/lib/components/FloatImage.svelte`
- Create: `src/lib/components/FloatImage.svelte.spec.js`

FloatImage wraps a markdown image in a `<figure>` with the same float/margin behavior as Sidebar.

- [ ] **Write the failing tests** in `src/lib/components/FloatImage.svelte.spec.js`:

```js
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FloatImage from './FloatImage.svelte';

describe('FloatImage', () => {
	it('renders an img with the correct src', async () => {
		render(FloatImage, { src: './media/cover.jpg', alt: 'A cover image', side: 'right' });
		const img = page.getByRole('img');
		await expect.element(img).toHaveAttribute('src', './media/cover.jpg');
	});

	it('renders an img with the correct alt text', async () => {
		render(FloatImage, { src: './media/cover.jpg', alt: 'A cover image', side: 'right' });
		await expect.element(page.getByRole('img')).toHaveAttribute('alt', 'A cover image');
	});

	it('wraps the image in a figure element', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'right' });
		expect(container.querySelector('figure')).not.toBeNull();
		expect(container.querySelector('figure img')).not.toBeNull();
	});

	it('floats right by default', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'right' });
		const figure = container.querySelector('figure');
		await expect.element(page.elementLocator(figure)).toHaveStyle('float: right');
	});

	it('floats left when side="left"', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'left' });
		const figure = container.querySelector('figure');
		await expect.element(page.elementLocator(figure)).toHaveStyle('float: left');
	});

	it('applies negative right margin when floating right', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'right' });
		const figure = container.querySelector('figure');
		await expect.element(page.elementLocator(figure)).toHaveStyle('margin-right: -0.5rem');
	});

	it('applies negative left margin when floating left', async () => {
		const { container } = render(FloatImage, { src: './media/cover.jpg', alt: 'Test', side: 'left' });
		const figure = container.querySelector('figure');
		await expect.element(page.elementLocator(figure)).toHaveStyle('margin-left: -0.5rem');
	});
});
```

- [ ] **Run to verify all tests fail**
```bash
npx vitest run src/lib/components/FloatImage.svelte.spec.js
```
Expected: Error — `FloatImage.svelte` does not exist

- [ ] **Create `src/lib/components/FloatImage.svelte`**:

```svelte
<script>
	let { src = '', alt = '', side = 'right' } = $props();
</script>

<figure style="
	float: {side};
	width: 45%;
	margin-top: 1rem;
	margin-bottom: 1rem;
	{side === 'right' ? 'margin-right: -0.5rem; margin-left: 1rem;' : 'margin-left: -0.5rem; margin-right: 1rem;'}
">
	<img {src} {alt} />
</figure>

<style>
	@media (max-width: 900px) {
		figure {
			float: none;
			width: 100%;
			margin: 1rem 0;
		}
	}

	img {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
		display: block;
	}
</style>
```

- [ ] **Run tests to verify all pass**
```bash
npx vitest run src/lib/components/FloatImage.svelte.spec.js
```
Expected: All 7 tests PASS

- [ ] **Commit**
```bash
git add src/lib/components/FloatImage.svelte src/lib/components/FloatImage.svelte.spec.js
git commit -m "feat: add FloatImage component for alternating float layout"
```

---

## Chunk 3: Preprocessor, CSS Layout, Dev Tooling

### Task 7: Extend preprocessor for images and side props

**Files:**
- Modify: `src/lib/preprocess-sidebar.js`

The preprocessor needs to:
1. Update guard to handle files with images but no sidebars
2. Add image regex that excludes code fences (using combined matcher)
3. Pass `side` to `parseSidebarBlock`
4. Update `injectImport` to handle multiple imports

The code fence exclusion strategy: use a single regex that matches EITHER a fenced code block OR a markdown image. In the replacement callback, return fenced code unchanged and transform images.

- [ ] **Replace `src/lib/preprocess-sidebar.spec.js`** entirely with the following (the existing file has exact-string assertions like `'<Sidebar title="..." />'` without `side=` that will fail once we add the `side` prop — the new test file supersedes it and covers all the old behavior plus new):

```js
import { describe, expect, it } from 'vitest';
import { preprocessSidebar } from './preprocess-sidebar.js';

function transform(content) {
	const preprocessor = preprocessSidebar();
	const result = preprocessor.markup({ content, filename: 'test.svx' });
	return result?.code ?? content;
}

describe('preprocessSidebar', () => {
	describe('sidebar blocks', () => {
		it('replaces [SIDEBAR] block with Sidebar component', () => {
			const input = '[SIDEBAR]\ntitle: "Hello"\ncontent: "World"\n[/SIDEBAR]';
			const output = transform(input);
			expect(output).toContain('<Sidebar');
			expect(output).toContain('title="Hello"');
			expect(output).toContain('content="World"');
		});

		it('first sidebar gets side="right"', () => {
			const input = '[SIDEBAR]\ntitle: "A"\ncontent: "B"\n[/SIDEBAR]';
			const output = transform(input);
			expect(output).toContain('side="right"');
		});

		it('second sidebar gets side="left"', () => {
			const input = `[SIDEBAR]\ntitle: "A"\ncontent: "B"\n[/SIDEBAR]\n[SIDEBAR]\ntitle: "C"\ncontent: "D"\n[/SIDEBAR]`;
			const output = transform(input);
			const firstIdx = output.indexOf('side="right"');
			const secondIdx = output.indexOf('side="left"');
			expect(firstIdx).toBeGreaterThanOrEqual(0);
			expect(secondIdx).toBeGreaterThan(firstIdx);
		});

		it('injects Sidebar import', () => {
			const input = '[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]';
			const output = transform(input);
			expect(output).toContain("import Sidebar from '$lib/components/Sidebar.svelte'");
		});
	});

	describe('image wrapping', () => {
		it('wraps markdown images in FloatImage component', () => {
			const input = '![A cat](./media/cat.jpg)';
			const output = transform(input);
			expect(output).toContain('<FloatImage');
			expect(output).toContain('src="./media/cat.jpg"');
			expect(output).toContain('alt="A cat"');
		});

		it('first image gets side="right"', () => {
			const input = '![Cat](./cat.jpg)';
			const output = transform(input);
			expect(output).toContain('side="right"');
		});

		it('second image gets side="left"', () => {
			const input = '![Cat](./cat.jpg)\n\n![Dog](./dog.jpg)';
			const output = transform(input);
			const sides = [...output.matchAll(/side="(right|left)"/g)].map((m) => m[1]);
			expect(sides).toEqual(['right', 'left']);
		});

		it('images inside code fences are NOT wrapped', () => {
			const input = '```\n![Cat](./cat.jpg)\n```';
			const output = transform(input);
			expect(output).not.toContain('<FloatImage');
			expect(output).toContain('![Cat](./cat.jpg)');
		});

		it('injects FloatImage import', () => {
			const input = '![Cat](./cat.jpg)';
			const output = transform(input);
			expect(output).toContain("import FloatImage from '$lib/components/FloatImage.svelte'");
		});

		it('strips optional image title from src attribute', () => {
			const input = '![Cat](./cat.jpg "A nice cat")';
			const output = transform(input);
			expect(output).toContain('src="./cat.jpg"');
			expect(output).not.toContain('"A nice cat"');
		});
	});

	describe('alternation across mixed elements', () => {
		it('sidebar and image share the same counter', () => {
			const input = `[SIDEBAR]\ntitle: "A"\ncontent: "B"\n[/SIDEBAR]\n\n![Cat](./cat.jpg)`;
			const output = transform(input);
			// sidebar is first → right; image is second → left
			const sidebarSide = output.match(/<Sidebar[^>]*side="([^"]+)"/)?.[1];
			const imageSide = output.match(/<FloatImage[^>]*side="([^"]+)"/)?.[1];
			expect(sidebarSide).toBe('right');
			expect(imageSide).toBe('left');
		});
	});

	describe('guard', () => {
		it('returns undefined (no-op) for files with no sidebars or images', () => {
			const preprocessor = preprocessSidebar();
			const result = preprocessor.markup({ content: 'No sidebars here.', filename: 'test.svx' });
			expect(result).toBeUndefined();
		});

		it('processes files with images but no sidebars', () => {
			const input = '![Cat](./cat.jpg)';
			const output = transform(input);
			expect(output).toContain('<FloatImage');
		});
	});
});
```

- [ ] **Run to verify tests fail**
```bash
npx vitest run src/lib/preprocess-sidebar.spec.js
```
Expected: Multiple FAILs — no `side` prop, no image handling

- [ ] **Rewrite `src/lib/preprocess-sidebar.js`**:

```js
const SIDEBAR_BLOCK_REGEX = /\[SIDEBAR\]([\s\S]*?)\[\/SIDEBAR\]/g;

// Matches fenced code blocks OR markdown images (without title, or with title stripped)
// When the match is a code fence, we return it unchanged.
// When it's an image, we transform it.
const FLOAT_ELEMENT_REGEX = /```[\s\S]*?```|!\[([^\]]*)\]\(([^)\s"]+)(?:\s+"[^"]*")?\)/g;

const SIDEBAR_IMPORT = `import Sidebar from '$lib/components/Sidebar.svelte';`;
const FLOAT_IMAGE_IMPORT = `import FloatImage from '$lib/components/FloatImage.svelte';`;

function parseSidebarBlock(blockContent, side) {
	const titleMatch = blockContent.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
	const contentMatch = blockContent.match(/content:\s*"((?:[^"\\]|\\.)*)"/);
	const title = (titleMatch ? titleMatch[1] : '').replace(/\\"/g, '"').replace(/"/g, '&quot;');
	const content = (contentMatch ? contentMatch[1] : '').replace(/\\"/g, '"').replace(/"/g, '&quot;');
	return `<Sidebar title="${title}" content="${content}" side="${side}" />`;
}

function injectImports(code, imports) {
	const missing = imports.filter((imp) => !code.includes(imp));
	if (missing.length === 0) return code;

	const toInject = missing.join('\n\t');
	const regularScriptRegex = /<script(?!\s+context\s*=\s*["']module["'])([^>]*)>/;
	if (regularScriptRegex.test(code)) {
		return code.replace(regularScriptRegex, `<script$1>\n\t${toInject}`);
	}
	return `<script>\n\t${toInject}\n</script>\n${code}`;
}

export function preprocessSidebar() {
	return {
		markup({ content, filename }) {
			if (!filename?.endsWith('.svx') && !filename?.endsWith('.md')) return;

			const hasSidebar = content.includes('[SIDEBAR]');
			const hasImage = content.includes('![');
			if (!hasSidebar && !hasImage) return;

			let counter = 0;
			const importsNeeded = [];

			// First pass: replace [SIDEBAR] blocks
			let transformed = content;
			if (hasSidebar) {
				transformed = transformed.replace(SIDEBAR_BLOCK_REGEX, (_, blockContent) => {
					const side = counter % 2 === 0 ? 'right' : 'left';
					counter++;
					return parseSidebarBlock(blockContent, side);
				});
				importsNeeded.push(SIDEBAR_IMPORT);
			}

			// Second pass: replace markdown images (skipping code fences)
			if (hasImage) {
				let imageFound = false;
				transformed = transformed.replace(FLOAT_ELEMENT_REGEX, (match, alt, src) => {
					// If this match is a code fence (starts with ```), leave it unchanged
					if (match.startsWith('```')) return match;
					// Otherwise it's a markdown image
					imageFound = true;
					const side = counter % 2 === 0 ? 'right' : 'left';
					counter++;
					return `<FloatImage src="${src}" alt="${alt}" side="${side}" />`;
				});
				if (imageFound) importsNeeded.push(FLOAT_IMAGE_IMPORT);
			}

			return { code: injectImports(transformed, importsNeeded) };
		}
	};
}
```

- [ ] **Run tests to verify all pass**
```bash
npx vitest run src/lib/preprocess-sidebar.spec.js
```
Expected: All tests PASS

- [ ] **Commit**
```bash
git add src/lib/preprocess-sidebar.js src/lib/preprocess-sidebar.spec.js
git commit -m "feat: extend preprocessor for image float alternation with side props"
```

---

### Task 8: Update CSS layout

**Files:**
- Modify: `src/app.css`

Replace the `#page` block (currently lines 68-73) and update lead paragraph selectors if needed.

- [ ] **Replace the `#page` rule in `src/app.css`**:

Find:
```css
#page {
	max-width: 700px;
	margin: 0 auto;
	padding: 2rem 1rem 4rem;
	min-height: 100vh;
}
```

Replace with:
```css
#page {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem 80px 4rem;
	min-height: 100vh;
	display: flow-root;
}

@media (max-width: 900px) {
	#page {
		padding: 2rem 1rem 4rem;
	}
}
```

- [ ] **Verify lead paragraph selector still works**

The selectors `#page > p:first-of-type` and `#page > p:first-of-type::first-letter` target direct children of `#page`. mdsvex renders `<p>` elements directly into `#page` (no wrapper div), so these selectors should still match. Confirm visually after starting dev server. If the drop cap does not appear, change `>` to a space (descendant combinator): `#page p:first-of-type`.

- [ ] **Start dev server and verify visually**
```bash
npm run dev
```
Open `http://localhost:2222` and an article page. Check:
- Article text is wider (1200px container, 80px side padding)
- Drop cap appears on first paragraph
- Section tab still positioned correctly in left gutter on desktop

- [ ] **Commit**
```bash
git add src/app.css
git commit -m "feat: update #page to 1200px magazine layout with display:flow-root"
```

---

### Task 9: Create dev content watcher

**Files:**
- Create: `scripts/watch-content.js`
- Modify: `package.json`

The watcher runs sync once on startup, then watches the `./content` directory for changes and re-runs sync. It spawns `vite dev` as a child process with inherited stdio.

- [ ] **Create `scripts/watch-content.js`**:

```js
import { spawn, execSync } from 'child_process';
import { watch, existsSync } from 'fs';
import { resolve } from 'path';

const contentDir = resolve('./content');

// Run sync once on startup
console.log('[watch-content] Running initial sync...');
try {
	execSync('node scripts/sync-content.js', { stdio: 'inherit' });
	console.log('[watch-content] Initial sync complete.');
} catch (err) {
	console.error('[watch-content] Sync failed:', err.message);
}

// Watch for changes (only if ./content directory exists)
if (existsSync(contentDir)) {
	watch(contentDir, { recursive: true }, (eventType, filename) => {
		console.log(`[watch-content] Change detected (${eventType}): ${filename}`);
		try {
			execSync('node scripts/sync-content.js', { stdio: 'inherit' });
			console.log('[watch-content] Sync complete.');
		} catch (err) {
			console.error('[watch-content] Sync failed:', err.message);
		}
	});
	console.log(`[watch-content] Watching ${contentDir} for changes...`);
} else {
	console.warn(`[watch-content] Warning: ${contentDir} does not exist — skipping file watcher.`);
}

console.log(`[watch-content] Watching ${contentDir} for changes...`);

// Spawn vite dev
const vite = spawn('npx', ['vite', 'dev', '--host', '--port', '2222'], {
	stdio: 'inherit',
	shell: true
});

vite.on('close', (code) => {
	process.exit(code ?? 0);
});

process.on('SIGINT', () => {
	vite.kill('SIGINT');
	process.exit(0);
});
```

- [ ] **Add `dev:full` to `package.json`** scripts:

Find the `"scripts"` block and add after `"dev"`:
```json
"dev:full": "node scripts/watch-content.js",
```

- [ ] **Test the watcher starts without errors**
```bash
npm run dev:full
```
Expected: Sync runs, then Vite starts on port 2222. Ctrl+C exits cleanly.

- [ ] **Commit**
```bash
git add scripts/watch-content.js package.json
git commit -m "feat: add dev:full script with content watcher and vite dev"
```

---

### Task 10: Verify doomtubers SIDEBAR in browser

The doomtubers article already has a `[SIDEBAR]` block (added in a previous session). With the preprocessor now injecting `side="right"`, verify it renders correctly.

- [ ] **Start dev server**
```bash
npm run dev
```

- [ ] **Open `http://localhost:2222/2026/03/doomtubers`**

Check:
- The "What Makes a Real Model?" sidebar appears floated to the right
- Text wraps around it to the left
- On mobile (resize browser < 900px), sidebar becomes full-width inline
- Section tab is rotated (not perfectly upright)

- [ ] **Check TOC article count** — after the dev server restart, the `src/routes/2023/` directory should be picked up by Vite's `import.meta.glob`. Navigate to the home page or TOC. Confirm 6 articles appear.

---

### Task 11: Run full test suite

- [ ] **Run all tests**
```bash
npm run test
```
Expected: All tests in `sections.spec.js`, `SectionTab.svelte.spec.js`, `Sidebar.svelte.spec.js`, `FloatImage.svelte.spec.js`, and `preprocess-sidebar.spec.js` PASS.

Note: `TableOfContents.svelte.spec.js` and `page.svelte.spec.js` have pre-existing failures unrelated to this work — those are expected.

- [ ] **Final commit if any loose ends**
```bash
git status
# Stage and commit anything unstaged
```
