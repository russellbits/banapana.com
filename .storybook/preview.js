import PreviewWrapper from './PreviewWrapper.svelte';
import '../src/app.css';

/** @type { import('@storybook/sveltekit').Preview } */
const preview = {
	decorators: [() => PreviewWrapper],
	parameters: {
		layout: 'fullscreen', // Removes default padding that might cause clipping
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	},
	a11y: {
		test: 'todo'
	}
};

export default preview;
