<script>
	let { title = '', content = '' } = $props();
</script>

<aside class="sidebar">
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
		margin: 2rem 0;
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
</style>
