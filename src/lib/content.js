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
