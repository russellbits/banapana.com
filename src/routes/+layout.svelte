<script>
	import favicon from '$lib/assets/favicon.svg';
	import ArticleHeader from '$lib/components/Article_Header.svelte';
	import Cover from '$lib/components/Cover.svelte';
	import SectionTab from '$lib/components/SectionTab.svelte';
	import { getAllArticles } from '$lib/content.js';
	import { getSection, slugRotation } from '$lib/sections.js';
	import { page } from '$app/stores';
	import '../app.css';
	const rootCovers = import.meta.glob('./media/cover.{jpg,png,webp}', { eager: true, query: '?url', import: 'default' });
	const rootCover = rootCovers['./media/cover.jpg'] ?? rootCovers['./media/cover.png'] ?? rootCovers['./media/cover.webp'] ?? '/images/cover-generic.jpg';

	let { children } = $props();

	const title = $derived($page.data?.title ?? '');
	const cover = $derived($page.data?.cover ?? rootCover);
	const section = $derived($page.data?.section ?? '');
	const sectionData = $derived(section ? getSection(section) : null);
	const rotation = $derived(slugRotation($page.url.pathname));
	const articles = getAllArticles();
	const author = $derived($page.data?.author ?? '');
	const wordCount = $derived($page.data?.wordcount ?? 0);
	const date = $derived($page.data?.published ?? $page.data?.created ?? '');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if title}
	<Cover {title} cover_img_url={cover} {articles} />
{/if}

{#if author}
	<ArticleHeader {author} {wordCount} {date} />
{/if}

{#if section}
	<SectionTab {section} {rotation} />
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
