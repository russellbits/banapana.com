<script>
	let { children, side = 'right' } = $props();
</script>

<aside
	class="sidebar"
	style="
	float: {side};
	width: 45%;
	margin-top: 1rem;
	margin-bottom: 1rem;
	{side === 'right'
		? 'margin-right: -0.5rem; margin-left: 1rem;'
		: 'margin-left: -0.5rem; margin-right: 1rem;'}
"
>
	<img class="lightbulb" src="/symbols/light-bulb.svg" alt="lightbulb" width="28" height="43" />
	<div class="sidebar-content">{@render children?.()}</div>
</aside>

<style>
	.sidebar {
		position: relative;
		background-color: var(--section-color, #5ec035);
		max-width: 200px;
		border-radius: 8px;
		padding: 1.5rem;
		color: #fff;
		overflow: hidden;
		clear: both;
	}

	.lightbulb {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 28px;
		height: auto;
		opacity: 0.9;
	}

	.sidebar-content {
		font-family: Inter, sans-serif;
		font-size: 0.85rem;
		line-height: 1.5;
		color: rgba(255, 255, 255, 1);
	}

	.sidebar-content :global(h1),
	.sidebar-content :global(h2),
	.sidebar-content :global(h3),
	.sidebar-content :global(h4),
	.sidebar-content :global(h5),
	.sidebar-content :global(h6) {
		font-family: Inter, sans-serif;
		font-size: 0.85rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 0.75rem;
		color: #fff;
		padding-right: 40px;
		line-height: 1.3;
		clear: none;
	}

	.sidebar-content :global(p) {
		color: #fff;
		text-indent: 0;
		margin-bottom: 0.5rem;
	}

	.sidebar-content :global(ul),
	.sidebar-content :global(ol) {
		margin: 0 0 0.5rem;
		padding-left: 1.2rem;
	}

	.sidebar-content :global(li) {
		margin-bottom: 0.25rem;
	}

	.sidebar-content :global(a),
	.sidebar-content :global(a:link),
	.sidebar-content :global(a:visited) {
		color: rgba(255, 255, 255, 1);
		text-decoration-color: #fff;
	}

	@media (max-width: 900px) {
		.sidebar {
			float: none !important;
			width: 100% !important;
			margin: 1rem 0 !important;
			clear: both;
		}
	}
</style>
