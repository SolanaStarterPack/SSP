<script lang="ts">
	import type { CardProps } from '$lib/components/ssp/Card.svelte';
	import Card from '$lib/components/ssp/Card.svelte';

	const cardProps: CardProps[] = [
		{
			title: 'GitHub Repository Analyzer',
			description:
				'Verifies the validity and activity of Github repositories for credibility checks.'
		},
		{
			title: 'Wallet Tracker',
			description: 'Monitors blockchain wallet activity to provide insights and updates.'
		},
		{
			title: 'X Handle Reuse Tracker',
			description:
				'Track the history of X usernames to detect account reskins and potential misuse.'
		}
	];
</script>

<div>
	<h3 class="text-center text-6xl font-bold tracking-wide">How it works</h3>
	<p class="mt-2 text-center">Deploy your AI agent within seconds.</p>
	<div class="mt-16 flex flex-wrap-reverse items-center justify-center gap-4">
		{#each cardProps as card}
			<Card {...card} />
		{/each}
	</div>
</div>
