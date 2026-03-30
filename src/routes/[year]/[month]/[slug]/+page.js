export const prerender = true;

const pages = import.meta.glob('/src/routes/*/*/*/+page.svx');

export function entries() {
	return Object.keys(pages)
		.map((path) => {
			const [, , , year, month, slug] = path.split('/');
			return { year, month, slug };
		});
}
