<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { identifier = '', title = '', url = '', shortname = 'banapana' } = $props();

	let loaded = $state(false);
	/** @type {HTMLElement | null} */
	let container = null;

	onMount(() => {
		if (!container) return;

		loaded = true;

		// Capture initial values for Disqus config
		// These are intentionally captured once at mount time
		const disqusUrl = url || window.location.href;

		// Disqus expects this function on window
		// @ts-ignore - Disqus adds this to Window
		window.disqus_config = function () {
			// @ts-ignore - Disqus adds page to this
			this.page.url = disqusUrl;
			// @ts-ignore - Disqus adds page to this
			this.page.identifier = identifier;
			// @ts-ignore - Disqus adds page to this
			this.page.title = title;
		};

		const script = document.createElement('script');
		script.id = 'disqus-embed-script';
		script.src = `https://${shortname}.disqus.com/embed.js`;
		script.setAttribute('data-timestamp', String(+new Date()));
		script.async = true;
		document.body.appendChild(script);

		return () => {
			const existingScript = document.getElementById('disqus-embed-script');
			if (existingScript) {
				existingScript.remove();
			}
			// @ts-ignore - Disqus adds this to Window
			delete window.disqus_config;
		};
	});
</script>

{#if loaded && browser}
	<div id="disqus_thread" bind:this={container}></div>
{/if}

<style>
	#disqus_thread {
		margin: 2rem auto;
		max-width: 800px;
		padding: 0 1rem;
	}
</style>
