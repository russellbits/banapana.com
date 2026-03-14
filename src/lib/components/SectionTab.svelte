<script>
	import { getSection } from '$lib/sections.js';

	let { section = '', rotation = 0 } = $props();

	const sectionData = $derived(getSection(section));
</script>

{#if sectionData.svgFile}
	<div class="section-tab" style="background-color: {sectionData.color}; --rotation: {rotation}deg">
		<div class="icon-circle">
			<img
				src="/symbols/{sectionData.svgFile}.svg"
				alt={section}
				width="36"
				height="36"
			/>
		</div>
		<span class="dept-of">Dept. of</span>
		<span class="section-name">{section}</span>
	</div>
{/if}

<style>
	/* Mobile default: inline square centered between the cover and article body */
	.section-tab {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 90px;
		height: 90px;
		border-radius: 8px;
		padding: 0.5rem;
		margin: 1.5rem auto;
		gap: 0.3rem;
		text-align: center;
		transform: rotate(var(--rotation, 0deg));
	}

	.icon-circle {
		width: 44px;
		height: 44px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.icon-circle img {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}

	.dept-of {
		font-family: Inter, sans-serif;
		font-size: 0.45rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 0.75);
		text-transform: uppercase;
	}

	.section-name {
		font-family: Inter, sans-serif;
		font-size: 0.55rem;
		font-weight: 800;
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		line-height: 1.2;
	}

	/* Desktop: pull the tab out of the flow and pin it to the left gutter */
	@media (min-width: 900px) {
		.section-tab {
			position: fixed;
			left: max(0.5rem, calc(50vw - 420px));
			top: 50%;
			transform: translateY(-50%) rotate(var(--rotation, 0deg));
			z-index: 5;
			width: 72px;
			height: auto;
			margin: 0;
			padding: 0.75rem 0.5rem;
			gap: 0.4rem;
		}

		.icon-circle {
			width: 48px;
			height: 48px;
		}

		.icon-circle img {
			width: 36px;
			height: 36px;
		}

		.dept-of {
			font-size: 0.5rem;
		}

		.section-name {
			font-size: 0.6rem;
		}
	}
</style>
