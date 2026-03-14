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
