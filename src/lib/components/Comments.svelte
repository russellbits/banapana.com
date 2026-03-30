<script>
	import { browser } from '$app/environment';
	import { PUBLIC_DISQUS_SHORTNAME } from '$env/static/public';
	import { onMount } from 'svelte';

	let { identifier = '', title = '', url = '' } = $props();

	let loaded = $state(false);
	/** @type {HTMLElement | null} */
	let container = null;

	onMount(() => {
		if (!container) return;

		const disqusUrl = url || window.location.href;

		// @ts-ignore - Disqus adds this to Window
		window.disqus_config = function () {
			// @ts-ignore
			this.page.url = disqusUrl;
			// @ts-ignore
			this.page.identifier = identifier;
			// @ts-ignore
			this.page.title = title;
		};

		const script = document.createElement('script');
		script.id = 'disqus-embed-script';
		script.src = `https://${PUBLIC_DISQUS_SHORTNAME}.disqus.com/embed.js`;
		script.setAttribute('data-timestamp', String(+new Date()));
		script.async = true;
		container.appendChild(script);

		loaded = true;

		return () => {
			const existingScript = document.getElementById('disqus-embed-script');
			if (existingScript) {
				existingScript.remove();
			}
			// @ts-ignore
			delete window.disqus_config;
		};
	});
</script>

<div id="disqus_thread" bind:this={container}></div>

<style>
	#disqus_thread {
		margin: 2rem auto;
		max-width: 1000px;
		padding: 1rem 0;
	}
</style>
