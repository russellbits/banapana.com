import { getPageData } from '$lib/content.js';

export const prerender = true;

export function load({ route }) {
	return getPageData(route.id);
}
