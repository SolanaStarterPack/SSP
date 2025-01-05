<script lang="ts">
	import LaunchButton from '$lib/components/ssp/LaunchButton.svelte';
	import { cn } from '$lib/utils';

	const { class: className }: { class?: string } = $props();
</script>

<div class={cn(className, 'flex flex-col items-center')}>
	<h1 class="text-center text-7xl font-bold leading-[1.2]">
		Solana Starter Pack<br />Navigate the market with confidence.
	</h1>
	<p class="mt-4 text-center text-xl">
		Trade Smarter with Solana Starter Packet, your all in one agent to guide you through the market.
	</p>
	<LaunchButton class="mt-14" />
</div>
