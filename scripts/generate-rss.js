import fs from 'fs';
import path from 'path';
import fm from 'front-matter';

const BASE_URL = 'https://banapana.com';

function generateRSS() {
	const routesDir = path.resolve('./src/routes');
	const articles = [];

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
					const { attributes, body } = fm(content);
					const hasPublishedDate =
						attributes.Published && new Date(attributes.Published) <= new Date();
					const hasPublishedStatus =
						attributes.Status && attributes.Status.toLowerCase() === 'published';

					if (hasPublishedDate || hasPublishedStatus) {
						const relPath = path.relative(routesDir, path.dirname(fullPath));
						articles.push({
							title: attributes.Title || 'Untitled',
							link: `${BASE_URL}/${relPath.replace(/\\/g, '/')}`,
							date: attributes.Published || attributes.Created,
							summary: attributes.Summary || body.substring(0, 200).replace(/[#*`]/g, '')
						});
					}
				} catch (err) {
					console.error(`Error parsing ${fullPath}: ${err.message}`);
				}
			}
		}
	}

	walk(routesDir);

	articles.sort((a, b) => new Date(b.date) - new Date(a.date));

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Banapana</title>
  <link>${BASE_URL}</link>
  <description>Thoughts on AI, technology, and culture</description>
  ${articles
		.map(
			(a) => `<item>
    <title><![CDATA[${a.title}]]></title>
    <link>${a.link}</link>
    <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    <description><![CDATA[${a.summary}]]></description>
  </item>`
		)
		.join('\n')}
</channel>
</rss>`;

	fs.writeFileSync('./build/rss.xml', rss);
	console.log('Generated rss.xml');
}

generateRSS();
