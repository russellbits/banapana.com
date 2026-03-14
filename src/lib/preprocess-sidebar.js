const SIDEBAR_BLOCK_REGEX = /\[SIDEBAR\]([\s\S]*?)\[\/SIDEBAR\]/g;
const IMPORT_STATEMENT = `import Sidebar from '$lib/components/Sidebar.svelte';`;

function parseSidebarBlock(blockContent) {
	const titleMatch = blockContent.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
	const contentMatch = blockContent.match(/content:\s*"((?:[^"\\]|\\.)*)"/);
	const title = (titleMatch ? titleMatch[1] : '').replace(/\\"/g, '"').replace(/"/g, '&quot;');
	const content = (contentMatch ? contentMatch[1] : '').replace(/\\"/g, '"').replace(/"/g, '&quot;');
	return `<Sidebar title="${title}" content="${content}" />`;
}

function injectImport(code) {
	if (code.includes(IMPORT_STATEMENT)) return code;

	// Find a regular <script> block (not context="module")
	const regularScriptRegex = /<script(?!\s+context\s*=\s*["']module["'])([^>]*)>/;
	if (regularScriptRegex.test(code)) {
		return code.replace(regularScriptRegex, `<script$1>\n\t${IMPORT_STATEMENT}`);
	}

	// No regular script block — prepend one
	return `<script>\n\t${IMPORT_STATEMENT}\n</script>\n${code}`;
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
