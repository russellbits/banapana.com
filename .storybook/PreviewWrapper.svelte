<script>
	let { children } = $props();
</script>

<div class="story-container">
	{@render children()}
</div>

<style>
	.story-container {
		/* This forces the box height you're looking for */
		min-height: 400px;
		min-width: 400px;
		height: 100%;
		width: 100%;
		display: block;
		/* Optional: helps you see the container during debugging
    outline: 1px dashed #ccc; */
	}
</style>
