<script>
	import favicon from '$lib/assets/favicon.svg';
	import ArticleHeader from '$lib/components/ArticleHeader.svelte';
	import Cover from '$lib/components/Cover.svelte';
	import SectionTab from '$lib/components/SectionTab.svelte';
	import SiteMenu from '$lib/components/SiteMenu.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import { getAllArticles } from '$lib/content.js';
	import { getSection, slugRotation } from '$lib/sections.js';
	import { page } from '$app/state';
	import '../app.css';
	const rootCovers = import.meta.glob('./media/cover.{jpg,png,webp}', {
		eager: true,
		query: '?url',
		import: 'default'
	});
	const rootCover =
		rootCovers['./media/cover.jpg'] ??
		rootCovers['./media/cover.png'] ??
		rootCovers['./media/cover.webp'] ??
		'/images/cover-generic.jpg';

	let { children } = $props();

	const title = $derived(page.data?.title ?? '');
	const cover = $derived(page.data?.cover ?? rootCover);
	const section = $derived(page.data?.section ?? '');
	const sectionData = $derived(section ? getSection(section) : null);
	const rotation = $derived(slugRotation(page.url.pathname));
	const articles = getAllArticles();
	const author = $derived(page.data?.author ?? '');
	const wordCount = $derived(page.data?.wordcount ?? 0);
	const date = $derived(page.data?.published ?? page.data?.created ?? '');
	const column = $derived(page.data?.column ?? '');
	const isHome = $derived(page.url.pathname === '/');

	// Open Graph derived variables
	const ogTitle = $derived(title || 'Banapana');
	const ogDescription = $derived(page.data?.summary ?? 'Thoughts on AI, technology, and culture');
	const ogImage = $derived(
		cover
			? cover.startsWith('http')
				? cover
				: page.url.origin + (cover.startsWith('/') ? cover : '/' + cover)
			: page.url.origin + '/images/generic-preview.jpg'
	);
	const ogUrl = $derived(page.url.origin + page.url.pathname);
	const ogType = $derived(title ? 'article' : 'website');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={ogUrl} />
	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:site_name" content="Banapana" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={ogUrl} />
	<meta property="twitter:title" content={ogTitle} />
	<meta property="twitter:description" content={ogDescription} />
	<meta property="twitter:image" content={ogImage} />
</svelte:head>

<SiteMenu />

{#if title}
	<Cover {title} cover_img_url={cover} {articles} {column} {isHome} />
{/if}

{#if author}
	<ArticleHeader {author} {wordCount} {date} {section} />
{/if}

{#if section}
	<SectionTab {section} {rotation} />
{/if}

<div id="page" style={sectionData ? `--section-color: ${sectionData.color}` : ''}>
	{@render children()}
</div>

{#if title}
	<Comments identifier={page.url.pathname} {title} url={page.url.origin + page.url.pathname} />
{/if}

<style>
	:global(body) {
		margin: 0;
		height: 100vh;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
</style>
