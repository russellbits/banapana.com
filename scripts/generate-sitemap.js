import fs from 'fs';
import path from 'path';
import fm from 'front-matter';

const BASE_URL = 'https://banapana.com';

function generateSitemap() {
	const routesDir = path.resolve('./src/routes');
	const pages = [];

	function walk(dir) {
		if (!fs.existsSync(dir)) return;
		const files = fs.readdirSync(dir);
		for (const file of files) {
			const fullPath = path.join(dir, file);
			if (fs.statSync(fullPath).isDirectory()) {
				walk(fullPath);
			} else if (file === '+page.svx') {
				const content = fs.readFileSync(fullPath, 'utf-8');
				try {
					const { attributes } = fm(content);
					const hasPublishedDate =
						attributes.Published && new Date(attributes.Published) <= new Date();
					const hasPublishedStatus =
						attributes.Status && attributes.Status.toLowerCase() === 'published';

					if (hasPublishedDate || hasPublishedStatus) {
						const relPath = path.relative(routesDir, path.dirname(fullPath));
						const url = `${BASE_URL}/${relPath.replace(/\\/g, '/')}`;
						pages.push({
							url,
							date: attributes.Modified || attributes.Published || attributes.Created
						});
					}
				} catch (err) {
					console.error(`Error parsing ${fullPath}: ${err.message}`);
				}
			}
		}
	}

	walk(routesDir);

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.date}</lastmod>
  </url>`
	)
	.join('\n')}
</urlset>`;

	fs.writeFileSync('./build/sitemap.xml', sitemap);
	console.log('Generated sitemap.xml');
}

generateSitemap();
