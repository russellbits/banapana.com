<script>
	import { createEventDispatcher } from 'svelte';

	export let open = false;

	const dispatch = createEventDispatcher();
</script>

<button
	class="hamburger"
	on:click={() => dispatch('toggle')}
	aria-label="Toggle table of contents"
	aria-expanded={open}
>
	<span class="line"></span>
	<span class="line"></span>
	<span class="line"></span>
</button>

<style>
	.hamburger {
		position: absolute;
		top: 20px;
		right: 20px;
		width: 54px;
		height: 44px;
		background: #000;
		border: none;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
		cursor: pointer;
		z-index: 10;
		padding: 0;
	}

	.line {
		display: block;
		width: 26px;
		height: 3px;
		background: rgba(117, 250, 76, 0.85);
		border-radius: 2px;
	}
</style>
