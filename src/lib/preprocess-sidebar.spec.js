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
			expect(output).not.toContain('[SIDEBAR]');
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

		it('injects the import into an existing <script> block', () => {
			const input = `<script>\nlet x = 1;\n</script>\n[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]`;
			const output = transform(input);
			expect(output).toContain("import Sidebar from '$lib/components/Sidebar.svelte'");
			expect(output.split('<script>').length).toBe(2);
		});

		it('does not inject import twice when already present', () => {
			const imp = `import Sidebar from '$lib/components/Sidebar.svelte';`;
			const input = `<script>\n${imp}\nlet x = 1;\n</script>\n[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]`;
			const output = transform(input);
			expect(output.split(imp).length).toBe(2);
		});

		it('does not inject import into <script context="module"> block', () => {
			const input = `<script context="module">\nexport const prerender = true;\n</script>\n[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]`;
			const output = transform(input);
			expect(output).toContain("import Sidebar from '$lib/components/Sidebar.svelte'");
			const moduleContent = output.match(/<script context="module">([\s\S]*?)<\/script>/)?.[1] ?? '';
			expect(moduleContent).not.toContain('import Sidebar');
		});

		it('handles multiple [SIDEBAR] blocks in one file', () => {
			const input = `Para 1.\n[SIDEBAR]\ntitle: "A"\ncontent: "Content A."\n[/SIDEBAR]\nPara 2.\n[SIDEBAR]\ntitle: "B"\ncontent: "Content B."\n[/SIDEBAR]`;
			const output = transform(input);
			expect(output).toContain('title="A"');
			expect(output).toContain('title="B"');
		});

		it('escapes double quotes in title and content values', () => {
			const input = `[SIDEBAR]\ntitle: "He said \\"hello\\""\ncontent: "C"\n[/SIDEBAR]`;
			const output = transform(input);
			expect(output).toContain('title="He said &quot;hello&quot;"');
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

		it('ignores non-.svx / non-.md files', () => {
			const preprocessor = preprocessSidebar();
			const input = '[SIDEBAR]\ntitle: "T"\ncontent: "C"\n[/SIDEBAR]';
			const result = preprocessor.markup({ content: input, filename: 'foo.svelte' });
			expect(result).toBeUndefined();
		});
	});
});
