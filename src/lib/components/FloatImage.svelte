<script>
	let { src = '', alt = '', side = 'left' } = $props();
</script>

<figure
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
	<img {src} {alt} />
</figure>

<style>
	figure:first-child {
		width: 100% !important;
	}

	@media (max-width: 900px) {
		figure {
			float: none !important;
			width: 100% !important;
			margin: 1rem 0 !important;
		}
	}

	img {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
		display: block;
	}
</style>
