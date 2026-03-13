<script>
	import favicon from '$lib/assets/favicon.svg';
	import Cover from '$lib/components/Cover.svelte';
	import SectionTab from '$lib/components/SectionTab.svelte';
	import { getAllArticles } from '$lib/content.js';
	import { getSection } from '$lib/sections.js';
	import { page } from '$app/stores';
	import '../app.css';
	import rootCover from './media/cover.jpg?url';

	let { children } = $props();

	const title = $derived($page.data?.title ?? '');
	const cover = $derived($page.data?.cover ?? rootCover);
	const section = $derived($page.data?.section ?? '');
	const sectionData = $derived(section ? getSection(section) : null);
	const articles = getAllArticles();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if title}
	<Cover {title} cover_img_url={cover} {articles} />
{/if}

{#if section}
	<SectionTab {section} />
{/if}

<div id="page" style={sectionData ? `--section-color: ${sectionData.color}` : ''}>
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
