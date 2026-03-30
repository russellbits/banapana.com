<script>
	import { getSection } from '$lib/sections.js';
	let { author = '', wordCount = 0, date = '', section = '' } = $props();
	const sectionData = $derived(getSection(section));

	function slugify(name) {
		return name
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9 -]/g, '-')
			.replace(/ +/g, '-')
			.replace(/-{2,}/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	const avatarSrc = $derived(`/images/authors/${slugify(author)}.png`);
	const readTime = $derived(Math.ceil(wordCount / 240));
	const formattedDate = $derived(
		date
			? new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
					month: 'short',
					day: '2-digit',
					year: 'numeric',
					timeZone: 'UTC'
				})
			: ''
	);

	function handleAvatarError(e) {
		e.target.style.display = 'none';
	}
</script>

<div class="article-header">
	<div class="byline">
		<span class="author-group">
			<img
				class="avatar"
				src={avatarSrc}
				alt={author}
				width="36"
				height="36"
				onerror={handleAvatarError}
			/>
			<em class="author-name">{author}</em>
		</span>
	</div>
	<div class="read-time">⏱ {readTime} min read</div>
	<div class="pub-date">{formattedDate}</div>
	<div class="section" style="color:{sectionData.color}">Dept. of {section}</div>
</div>

<!-- <div class="actions">
		<span>👏</span>
		<span>🔖</span>
		<span>🔗</span>
	</div> -->

<style>
	.article-header {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		max-width: 1000px;
		margin: 1rem auto 0;
		padding: 0 80px 18px 80px;
		border-bottom: 1px double var(--color-rule);
	}

	.byline {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.author-group {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.avatar {
		border-radius: 50%;
		width: 36px;
		height: 36px;
		object-fit: cover;
	}

	.author-name {
		font-size: 0.9rem;
	}

	.read-time,
	.pub-date {
		font-size: 0.85rem;
		color: var(--color-muted);
	}

	/*.actions {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		font-size: 1.2rem;
		padding: 0.5rem 0;
		margin-top: 0.75rem;
		border-top: 1px solid var(--color-rule);
		border-bottom: 1px solid var(--color-rule);
	}*/

	/*@media (max-width: 900px) {
		.article-header-outer {
			padding: 0 1rem;
		}
	}*/

	@media (max-width: 600px) {
		.byline {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		/*.meta-row {
			gap: 1.2rem;
		}*/

		.read-time,
		.pub-date {
			font-size: 0.8rem;
		}
	}
</style>
