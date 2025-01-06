<script lang="ts">
	import { githubAnalyzerOpen } from '$lib/blocks/ssp/Dialogs.svelte';
	import { cn } from '$lib/utils';
	import { DropdownMenuItem } from '../ui/dropdown-menu';

	type Item = {
		name: string;
		onclick?: () => void;
		enabled?: boolean;
	};

	const items: Item[] = [
		{
			name: 'GitHub Repository Analyzer',
			enabled: true,
			onclick: () => {
				$githubAnalyzerOpen = true;
			}
		},
		{ name: 'X Handle Reuse Tracker', enabled: false },
		{ name: 'Wallet Tracker', enabled: false }
	];
</script>

{#each items as item (item.name)}
	<DropdownMenuItem class={cn(!item.enabled && 'pointer-events-none text-primary/40')}>
		<button class="flex flex-col" on:click={item.onclick}>
			<span>{item.name}</span>
			{#if !item.enabled}
				<span class="text-primary/40s text-xs">Coming soon</span>
			{/if}
		</button>
	</DropdownMenuItem>
{/each}
