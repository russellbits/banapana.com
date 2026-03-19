const pages = import.meta.glob('/src/routes/**/*.svx', { eager: true });

const rawPages = import.meta.glob('/src/routes/**/*.svx', {
	query: '?raw',
	import: 'default',
	eager: true
});

const covers = import.meta.glob('/src/routes/**/media/cover.{jpg,png,webp}', {
	eager: true,
	query: '?url',
	import: 'default'
});

export function countWords(rawText) {
	const body = rawText.replace(/^---[\s\S]*?---\n/, '');
	return body.split(/\s+/).filter(Boolean).length;
}

export function getPageData(pathname) {
	const routePath = pathname === '/' ? '/src/routes' : `/src/routes${pathname}`;

	const raw = pages[`${routePath}/+page.svx`]?.metadata ?? {};
	const cover = covers[`${routePath}/media/cover.jpg`]
		?? covers[`${routePath}/media/cover.png`]
		?? covers[`${routePath}/media/cover.webp`];

	const data = {};
	for (const [key, val] of Object.entries(raw)) {
		data[key.toLowerCase()] = val instanceof Date ? val.toISOString().slice(0, 10) : val;
	}
	if (cover) data.cover = cover;

	const rawText = rawPages[`${routePath}/+page.svx`] ?? '';
	data.wordcount = countWords(rawText);

	return data;
}

export function getAllArticles() {
	return Object.entries(pages)
		.filter(([path]) => /\/src\/routes\/\d{4}\/\d{2}\/[^/]+\/\+page\.svx$/.test(path))
		.map(([path, mod]) => {
			const raw = mod?.metadata ?? {};
			const data = {};
			for (const [k, v] of Object.entries(raw)) data[k.toLowerCase()] = v;
			const url = path.replace('/src/routes', '').replace('/+page.svx', '');
			const effectiveDate = data.published || data.created;
			return { title: data.title, published: effectiveDate, path: url };
		})
		.filter((a) => {
			if (!a.published) return false;
			const isPastDate = new Date(a.published) <= new Date();
			return isPastDate;
		})
		.sort((a, b) => new Date(b.published) - new Date(a.published));
}
