import { getPageData } from '$lib/content.js';

export const prerender = true;

export function load({ url }) {
	return getPageData(url.pathname);
}
