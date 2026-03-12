import fs from 'fs';
import path from 'path';
import fm from 'front-matter';

const CONTENT_DIR = './content';
const ROUTES_DIR = './src/routes';

function parseFrontmatter(content) {
	return fm(content);
}

function filterArticles(articles) {
	const now = new Date();
	return articles.filter((a) => {
		if (a.folder.startsWith('_')) return false;
		if (!a.frontmatter.Published) return false;
		return new Date(a.frontmatter.Published) <= now;
	});
}

function extractImages(markdown) {
	const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
	const images = [];
	let match;
	while ((match = regex.exec(markdown)) !== null) {
		images.push(match[2]);
	}
	return images;
}

function toSlug(str) {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

async function sync() {
	const contentDir = path.resolve(CONTENT_DIR);
	const routesDir = path.resolve(ROUTES_DIR);
	const folders = fs
		.readdirSync(contentDir)
		.filter((f) => fs.statSync(path.join(contentDir, f)).isDirectory());

	let syncedCount = 0;

	for (const folder of folders) {
		const articlePath = path.join(contentDir, folder, 'article.md');
		if (!fs.existsSync(articlePath)) continue;

		const content = fs.readFileSync(articlePath, 'utf-8');
		let attributes, body;
		try {
			const parsed = parseFrontmatter(content);
			attributes = parsed.attributes;
			body = parsed.body;
		} catch (err) {
			console.error(`Error parsing frontmatter in ${folder}: ${err.message}`);
			continue;
		}

		// Filter check
		if (folder.startsWith('_')) {
			console.log(`Skipping draft: ${folder}`);
			continue;
		}

		// Support both Published: date and Status: published
		const hasPublishedDate = attributes.Published && new Date(attributes.Published) <= new Date();
		const hasPublishedStatus = attributes.Status && attributes.Status.toLowerCase() === 'published';

		if (!hasPublishedDate && !hasPublishedStatus) {
			console.log(`Skipping not published: ${folder}`);
			continue;
		}

		// Get publication date - prefer Published:, fallback to Created:
		const pubDateStr = attributes.Published || attributes.Created;
		if (!pubDateStr) {
			console.log(`Skipping no date: ${folder}`);
			continue;
		}

		// Parse date from Published or Created
		const date = new Date(pubDateStr);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const slug = toSlug(attributes.Title || folder);

		// Create route directory
		const routePath = path.join(routesDir, String(year), month, slug);
		fs.mkdirSync(routePath, { recursive: true });
		fs.mkdirSync(path.join(routePath, 'media'), { recursive: true });

		// Update Modified date (ensure YYYY-MM-DD format)
		const today = new Date().toISOString().split('T')[0];
		attributes.Modified = today;

		// Ensure dates are in YYYY-MM-DD format (front-matter parses dates as Date objects)
		const dateFields = ['Created', 'Published', 'Modified'];
		for (const field of dateFields) {
			if (attributes[field]) {
				if (attributes[field] instanceof Date) {
					attributes[field] = attributes[field].toISOString().split('T')[0];
				} else {
					attributes[field] = String(attributes[field]).split('T')[0];
				}
			}
		}

		// Write +page.svx with updated frontmatter
		// Use raw frontmatter to preserve quotes and special characters
		const rawFrontmatterLines = content.split('---')[1].split('\n');

		// Update Modified date in raw frontmatter
		const modifiedIndex = rawFrontmatterLines.findIndex((line) =>
			line.trim().startsWith('Modified:')
		);
		if (modifiedIndex !== -1) {
			rawFrontmatterLines[modifiedIndex] = `Modified: ${today}`;
		} else {
			rawFrontmatterLines.push(`Modified: ${today}`);
		}

		// Handle Tags - if null, set to empty string or keep original
		// Read the raw frontmatter and extract Tags manually if needed
		const tagsMatch = content.match(/^Tags:\s*(.*)$/m);
		if (tagsMatch && tagsMatch[1]) {
			const tagsIndex = rawFrontmatterLines.findIndex((line) => line.trim().startsWith('Tags:'));
			if (tagsIndex !== -1) {
				rawFrontmatterLines[tagsIndex] = `Tags: ${tagsMatch[1].trim()}`;
			}
		}

		// Fix Cover Image key if present
		const coverImageIndex = rawFrontmatterLines.findIndex((line) =>
			line.trim().startsWith('Cover Image:')
		);
		if (coverImageIndex !== -1) {
			const coverMatch = rawFrontmatterLines[coverImageIndex].match(/Cover Image:\s*(.*)$/);
			if (coverMatch) {
				rawFrontmatterLines[coverImageIndex] = `Cover: ${coverMatch[1].trim()}`;
			}
		}

		const newFrontmatter = rawFrontmatterLines.join('\n');

		// Fix image paths - prepend ./ to make them relative to the page location
		const fixedBody = body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
			// Only fix paths that don't already start with ./ or http
			if (!imgPath.startsWith('./') && !imgPath.startsWith('http')) {
				return `![${alt}](./${imgPath})`;
			}
			return match;
		});

		const newContent = `---\n${newFrontmatter}\n---\n${fixedBody}`;
		fs.writeFileSync(path.join(routePath, '+page.svx'), newContent);

		// Create +page.js with full frontmatter
		const fieldDefs = [
			{ key: 'title', field: 'Title' },
			{ key: 'subtitle', field: 'Subtitle' },
			{ key: 'author', field: 'Author' },
			{ key: 'summary', field: 'Summary' },
			{ key: 'created', field: 'Created' },
			{ key: 'modified', field: 'Modified' },
			{ key: 'published', field: 'Published' },
			{ key: 'status', field: 'Status' }
		];

		const extractField = (fieldName) => {
			const line = rawFrontmatterLines.find((l) => l.trim().startsWith(`${fieldName}:`));
			if (!line) return null;
			return line.split(`${fieldName}:`)[1].trim().replace(/^["']|["']$/g, '') || null;
		};

		const returnFields = [];
		for (const { key, field } of fieldDefs) {
			const value = extractField(field);
			if (value) returnFields.push(`\t\t${key}: ${JSON.stringify(value)}`);
		}

		// Tags (raw extraction to preserve # characters)
		const tagsRaw = content.match(/^Tags:\s*(.*)$/m)?.[1]?.trim();
		if (tagsRaw) returnFields.push(`\t\ttags: ${JSON.stringify(tagsRaw)}`);

		const hasCover = fs.existsSync(path.join(routePath, 'media', 'cover.jpg'));
		if (hasCover) returnFields.push(`\t\tcover: coverUrl`);

		const coverImport = hasCover ? `import coverUrl from './media/cover.jpg?url';\n\n` : '';

		const pageJs = `${coverImport}export function load() {
	return {
${returnFields.join(',\n')}
	};
}
`;
		fs.writeFileSync(path.join(routePath, '+page.js'), pageJs);

		// Copy images
		const images = extractImages(body);
		for (const img of images) {
			const srcPath = path.join(contentDir, folder, img);
			if (fs.existsSync(srcPath)) {
				const destPath = path.join(routePath, 'media', path.basename(img));
				fs.copyFileSync(srcPath, destPath);
				console.log(`Copied image: ${img}`);
			}
		}

		console.log(`Synced: ${year}/${month}/${slug}`);
		syncedCount++;
	}

	console.log(`\nSync complete. ${syncedCount} article(s) synced.`);
}

sync().catch(console.error);
