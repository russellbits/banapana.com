<script>
	export let href = null;
</script>

{#if href}
	<a {href} class="logo">
		<img src="/images/banapana-logo.png" alt="Banapana" />
	</a>
{:else}
	<div class="logo">
		<img src="/images/banapana-logo.png" alt="Banapana" />
	</div>
{/if}

<style>
	.logo img {
		width: clamp(160px, 45vw, 320px);
		height: auto;
		margin: 5rem auto 2rem;
		display: block;
	}

	a.logo {
		text-decoration: none;
	}
</style>
