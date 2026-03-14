import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import relativeImages from 'mdsvex-relative-images';
import { preprocessSidebar } from './src/lib/preprocess-sidebar.js';

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
		preprocessSidebar(),
		mdsvex({
			extensions: ['.md', '.svx'],
			remarkPlugins: [relativeImages]
		})
	],
	extensions: ['.svelte', '.md', '.svx']
};

export default config;
