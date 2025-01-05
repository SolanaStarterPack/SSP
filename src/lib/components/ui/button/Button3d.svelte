<script lang="ts">
	const {
		text,
		onclick,
		color = '#03a9f4cc'
	}: { text: string; onclick?: () => void; color?: string } = $props();
</script>

<button {onclick} class="button">
	<span>{text}</span>
	<span>{text}</span>
	<span>{text}</span>
	<span>{text}</span>
</button>

<style>
	.button {
		position: relative;
		width: 150px;
		height: 50px;
		transition: 4s;
		transform-style: preserve-3d;
		transform: perspective(1000px) rotateX(0deg);
	}
	.button:hover {
		transform: perspective(1000px) rotateX(360deg);
	}
	.button span {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #000;
		background: rgba(255, 255, 255, 0.9);
		font-family: sans-serif;
		text-transform: uppercase;
		font-size: 22px;
		letter-spacing: 2px;
		transition: 0.5s;
		border: 2px solid #000;
		box-sizing: border-box;
		box-shadow: insert 0 20px 50px rgba(0, 0, 0, 0.2);
	}
	.button:hover span {
		color: #fff;
		background: var(--bg-color);
	}
	.button span:nth-child(1) {
		transform: rotateX(360deg) translateZ(25px);
	}
	.button span:nth-child(2) {
		transform: rotateX(270deg) translateZ(25px);
	}
	.button span:nth-child(3) {
		transform: rotateX(180deg) translateZ(25px);
	}
	.button span:nth-child(4) {
		transform: rotateX(90deg) translateZ(25px);
	}
</style>
