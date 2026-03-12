<script>
	import favicon from '$lib/assets/favicon.svg';
	import Cover from '$lib/components/Cover.svelte';
	import { page } from '$app/stores';
	import '../app.css';
	import rootCover from './media/cover.jpg?url';

	let { children } = $props();

	const title = $derived($page.data?.title ?? '');
	const cover = $derived($page.data?.cover ?? rootCover);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if title}
	<Cover {title} cover_img_url={cover} />
{/if}

<div id="page">
	{@render children()}
</div>

<style>
:global(body) {
	margin: 0;
	height: 100vh;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}
</style>