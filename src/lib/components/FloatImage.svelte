<script>
	let { src = '', alt = '', side = 'right' } = $props();
</script>

<figure style="
	float: {side};
	width: 45%;
	margin-top: 1rem;
	margin-bottom: 1rem;
	{side === 'right' ? 'margin-right: -0.5rem; margin-left: 1rem;' : 'margin-left: -0.5rem; margin-right: 1rem;'}
">
	<img {src} {alt} />
</figure>

<style>
	@media (max-width: 900px) {
		figure {
			float: none;
			width: 100%;
			margin: 1rem 0;
		}
	}

	img {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
		display: block;
	}
</style>
