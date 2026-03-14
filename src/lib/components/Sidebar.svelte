<script>
	let { title = '', content = '', side = 'right' } = $props();
</script>

<aside class="sidebar" style="
	float: {side};
	width: 45%;
	margin-top: 1rem;
	margin-bottom: 1rem;
	{side === 'right' ? 'margin-right: -0.5rem; margin-left: 1rem;' : 'margin-left: -0.5rem; margin-right: 1rem;'}
">
	<img
		class="lightbulb"
		src="/symbols/light-bulb.svg"
		alt="lightbulb"
		width="28"
		height="43"
	/>
	<h3 class="sidebar-title">{title}</h3>
	<div class="sidebar-content">{@html content}</div>
</aside>

<style>
	.sidebar {
		position: relative;
		background-color: var(--section-color, #5ec035);
		border-radius: 8px;
		padding: 1.5rem;
		color: #fff;
		overflow: hidden;
	}

	.lightbulb {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 28px;
		height: auto;
		opacity: 0.9;
	}

	.sidebar-title {
		font-family: Inter, sans-serif;
		font-size: 0.85rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 0.75rem;
		color: #fff;
		padding-right: 40px;
		line-height: 1.3;
	}

	.sidebar-content {
		font-family: Inter, sans-serif;
		font-size: 0.85rem;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.9);
	}

	.sidebar-content :global(p) {
		text-indent: 0;
		margin-bottom: 0.5rem;
	}

	.sidebar-content :global(a) {
		color: rgba(255, 255, 255, 0.9);
	}

	@media (max-width: 900px) {
		.sidebar {
			float: none;
			width: 100%;
			margin: 1rem 0;
		}
	}
</style>
