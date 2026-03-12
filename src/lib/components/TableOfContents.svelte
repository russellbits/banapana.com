<script>
	import { createEventDispatcher } from 'svelte';

	export let articles = [];
	export let open = false;

	const dispatch = createEventDispatcher();

	const SEPARATORS = [
		'📧 🚫 ✊',
		'🤖 📝 ✨',
		'🌷 💰 🤖',
		'🧠 🔓 💭',
		'🌊 🎯 🔥',
		'🎲 🌙 ⚡',
	];

	function formatDate(dateStr) {
		const [year, month, day] = dateStr.split('-').map(Number);
		const d = new Date(year, month - 1, day);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}
</script>

<div class="toc-sheet" class:open>
	<button
		class="close"
		on:click={() => dispatch('close')}
		aria-label="Close table of contents"
	>✕</button>

	<p class="heading">Table of Contents</p>

	<ul>
		{#each articles as article, i}
			<li class="item">
				<p class="date">{formatDate(article.published)}</p>
				<a href={article.path}>{article.title}</a>
			</li>
			{#if i < articles.length - 1}
				<li class="separator" aria-hidden="true">{SEPARATORS[i % SEPARATORS.length]}</li>
			{/if}
		{/each}
	</ul>
</div>

<style>
	.toc-sheet {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: fit-content;
		background: rgba(10, 5, 18, 0.78);
		backdrop-filter: blur(28px) saturate(160%);
		-webkit-backdrop-filter: blur(28px) saturate(160%);
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		z-index: 20;
		padding: 2.5rem 2rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translateY(-100%);
		transition: transform 0.3s ease;
	}

	.toc-sheet.open {
		transform: translateY(0);
	}

	.close {
		position: absolute;
		top: 1.4em;
		right: 1.7em;
		background: none;
		border: none;
		color: rgba(117, 250, 76, 0.75);
		font-size: 1.3rem;
		cursor: pointer;
		line-height: 1;
		padding: 0;
	}

	.heading {
		color: rgba(255, 255, 255, 0.55);
		font-family: Inter, sans-serif;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		margin: 0 0 1.4rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.item {
		text-align: center;
		padding: 0.65rem 1rem;
	}

	.date {
		font-size: 0.68rem;
		font-family: Inter, sans-serif;
		color: rgba(255, 255, 255, 0.38);
		letter-spacing: 0.05em;
		margin: 0 0 0.25rem;
	}

	a {
		color: rgba(255, 255, 255, 0.88);
		text-decoration: none;
		font-family: Georgia, serif;
		font-size: 0.98rem;
		line-height: 1.35;
		border-bottom: 1px solid rgba(117, 250, 76, 0.3);
		padding-bottom: 1px;
		transition: color 0.15s, border-color 0.15s;
	}

	a:hover {
		color: rgba(117, 250, 76, 0.95);
		border-bottom-color: rgba(117, 250, 76, 0.65);
	}

	.separator {
		color: rgba(255, 255, 255, 0.3);
		font-size: 0.95rem;
		padding: 0.4rem 0;
		letter-spacing: 0.2em;
		text-align: center;
	}
</style>
