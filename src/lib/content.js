const pages = import.meta.glob('/src/routes/**/*.svx', { eager: true });

const covers = import.meta.glob('/src/routes/**/media/cover.{jpg,png,webp}', {
	eager: true,
	query: '?url',
	import: 'default'
});

export function getPageData(routeId) {
	const routePath = routeId === '/' ? '/src/routes' : `/src/routes${routeId}`;

	const raw = pages[`${routePath}/+page.svx`]?.metadata ?? {};
	const cover = covers[`${routePath}/media/cover.jpg`]
		?? covers[`${routePath}/media/cover.png`]
		?? covers[`${routePath}/media/cover.webp`];

	const data = {};
	for (const [key, val] of Object.entries(raw)) {
		data[key.toLowerCase()] = val;
	}
	if (cover) data.cover = cover;

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
			return { title: data.title, published: data.published, path: url };
		})
		.filter((a) => {
			if (!a.published) return false;
			return new Date(a.published) <= new Date();
		})
		.sort((a, b) => new Date(b.published) - new Date(a.published));
}
