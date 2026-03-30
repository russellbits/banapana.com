<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Footer from '$lib/components/Footer.svelte';

	const { Story } = defineMeta({
		title: 'Components/Footer',
		component: Footer,
		tags: ['autodocs'],
		parameters: { layout: 'fullscreen' }
	});
</script>

<Story name="Default" />
