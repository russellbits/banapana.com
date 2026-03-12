<script>
	import PubDate from './PubDate.svelte';
	import Logo from './Logo.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';
	import TableOfContents from './TableOfContents.svelte';

	export let title = '';
	export let cover_img_url = 'media/cover.jpg';
	export let articles = [];

	let tocOpen = false;
</script>

<div class="cover">
	<div class="bg-layer" style="--cover-url: url('{cover_img_url}')"></div>
	<div class="gradient-overlay"></div>
	<div class="particles">
		<span></span><span></span><span></span><span></span><span></span>
		<span></span><span></span><span></span><span></span><span></span>
	</div>
	<div class="pubdate-wrapper">
		<PubDate />
	</div>
	<HamburgerMenu open={tocOpen} on:toggle={() => (tocOpen = !tocOpen)} />
	<TableOfContents {articles} open={tocOpen} on:close={() => (tocOpen = false)} />
	<div class="content">
		<Logo />
		<h1 class="title">{title}</h1>
	</div>
</div>

<style>
/*
	@keyframes gradientShift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
			opacity: 0.6;
		}
		50% {
			transform: translateY(-20px) rotate(180deg);
			opacity: 1;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	@keyframes slideIn {
		0% {
			transform: translateY(30px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes glow {
		0%,
		100% {
			text-shadow:
				0 0 20px rgba(255, 200, 0, 0.8),
				0 0 40px rgba(255, 100, 0, 0.6),
				4px 4px 8px rgba(0, 0, 0, 0.8);
		}
		50% {
			text-shadow:
				0 0 40px rgba(255, 200, 0, 1),
				0 0 80px rgba(255, 100, 0, 0.8),
				4px 4px 8px rgba(0, 0, 0, 0.8);
		}
	}
*/
	@font-face {
		font-family: 'Roboto Slab';
		src: url('/fonts/RobotoSlab-VariableFont.woff2') format('woff2');
		font-weight: 100 900;
		font-display: swap;
	}

	.cover {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.bg-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: var(--cover-url);
		background-size: cover;
		background-position: center;
		animation: pulse 8s ease-in-out infinite;
		transform: scale(1.1);
	}

	.gradient-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			135deg,
			rgba(20, 0, 60, 0.7) 0%,
			rgba(80, 0, 40, 0.6) 25%,
			rgba(120, 20, 60, 0.5) 50%,
			rgba(80, 0, 40, 0.6) 75%,
			rgba(20, 0, 60, 0.7) 100%
		);
		background-size: 400% 400%;
		animation: gradientShift 10s ease infinite;
	}

	.particles {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
	}

	.particles span {
		position: absolute;
		width: 4px;
		height: 4px;
		background: radial-gradient(circle, #fff 0%, transparent 70%);
		border-radius: 50%;
		animation: float 6s ease-in-out infinite;
	}

	.particles span:nth-child(1) {
		left: 10%;
		top: 20%;
		animation-delay: 0s;
	}
	.particles span:nth-child(2) {
		left: 20%;
		top: 80%;
		animation-delay: 1s;
	}
	.particles span:nth-child(3) {
		left: 30%;
		top: 40%;
		animation-delay: 2s;
	}
	.particles span:nth-child(4) {
		left: 40%;
		top: 60%;
		animation-delay: 0.5s;
	}
	.particles span:nth-child(5) {
		left: 50%;
		top: 30%;
		animation-delay: 1.5s;
	}
	.particles span:nth-child(6) {
		left: 60%;
		top: 70%;
		animation-delay: 2.5s;
	}
	.particles span:nth-child(7) {
		left: 70%;
		top: 50%;
		animation-delay: 0.8s;
	}
	.particles span:nth-child(8) {
		left: 80%;
		top: 20%;
		animation-delay: 1.8s;
	}
	.particles span:nth-child(9) {
		left: 90%;
		top: 90%;
		animation-delay: 0.3s;
	}
	.particles span:nth-child(10) {
		left: 5%;
		top: 50%;
		animation-delay: 2.2s;
	}

	.pubdate-wrapper {
		position: absolute;
		top: 20px;
		left: 20px;
		z-index: 10;
	}

	.content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		height: 100%;
	}

	.title {
		font-family: 'Roboto Slab', serif;
		font-size: clamp(48px, 10vw, 120px);
		font-weight: 900;
		color: #fff;
		text-transform: uppercase;
		letter-spacing: 4px;
		animation:
			glow 3s ease-in-out infinite,
			slideIn 1s ease-out 0.3s both;
		text-align: center;
		line-height: 1;
		padding: 0 24px;
		margin: 0;
	}

	@media (max-width: 768px) {
		.title {
			font-size: 48px;
			letter-spacing: 2px;
			padding: 0 1em;
		}
		.particles {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.title {
			font-size: 32px;
			padding: 0 1em;
		}
	}
</style>
