const SIDEBAR_BLOCK_REGEX = /\[SIDEBAR\]([\s\S]*?)\[\/SIDEBAR\]/g;

// Matches fenced code blocks OR markdown images (with optional title stripped).
// In the replacement callback: code fences are returned unchanged, images are transformed.
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
