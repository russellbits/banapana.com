import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import relativeImages from 'mdsvex-relative-images';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleUnseenRoutes: 'ignore',
			handleHttpError: 'ignore'
		}
	},
	preprocess: [
		mdsvex({
			extensions: ['.md', '.svx'],
			remarkPlugins: [relativeImages]
		})
	],
	extensions: ['.svelte', '.md', '.svx']
};

export default config;
