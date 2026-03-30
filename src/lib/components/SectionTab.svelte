<script>
	import { getSection } from '$lib/sections.js';

	let { section = '', rotation = 0 } = $props();

	const sectionData = $derived(getSection(section));
</script>

{#if sectionData.svgFile}
	<div class="section-tab" style="background-color: {sectionData.color}; --rotation: {rotation}deg">
		<div class="section-tab-contents">
			<img src="/symbols/{sectionData.svgFile}.svg" alt={section} width="110" height="110" />
			<span class="dept-of">Dept. of</span>
			<span class="section-name">{section}</span>
		</div>
	</div>
{/if}

<style>
	/* Mobile default: inline square centered between the cover and article body */
	.section-tab {
		position: absolute;
		left: -70px;
		top: 80vh;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		border-radius: 8px;
		min-width: 200px;
		padding: 0.5rem;
		margin: 1.5rem auto;
		transform: rotate(var(--rotation, 0deg));
	}

	.section-tab-contents {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 160px;
		gap: 0.3rem;
		padding: 0.2em 0 0.2em 0.2em;
		margin-right: -1em;
	}

	.section-tab img {
		width: 70px;
		height: 70px;
		object-fit: contain;
	}

	.dept-of {
		font-family: Inter, sans-serif;
		font-size: 0.6rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 1);
		text-transform: uppercase;
	}

	.section-name {
		font-family: Inter, sans-serif;
		font-size: 1rem;
		font-weight: 800;
		text-align: center;
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		line-height: 1.2em;
		margin-top: -10px;
	}

	/* Desktop: pull the tab out of the flow and pin it to the left gutter */
	@media (min-width: 900px) {
		.section-tab {
			position: absolute;
			left: -70px;
			top: 80vh;
			transform: translateY(-50%) rotate(-4deg);
			z-index: 5;
			width: 72px;
			height: auto;
			margin: 0;
			padding: 0.75rem 0.5rem;
			gap: 0.4rem;
		}

		.section-tab img {
			width: 110px;
			height: 110px;
		}
	}
</style>
