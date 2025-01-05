<script lang="ts">
	import LaunchButton from '$lib/components/ssp/LaunchButton.svelte';
	import { DropdownMenu, DropdownMenuTrigger } from '$lib/components/ui/dropdown-menu';
	import TwoHeader from '$lib/components/ui/headers/TwoHeader.svelte';
</script>

<TwoHeader gradientClass="overflow-clip bg-gradient-to-t from-white/30 to-black/50 to-10% blur-lg">
	{#snippet left()}
		<img class="w-20" src="/logos/ssp-logo-white.png" alt="SSP" />
	{/snippet}
	{#snippet right()}
		<DropdownMenu>
			<DropdownMenuTrigger>
				{#snippet child()}
					<LaunchButton />
				{/snippet}
			</DropdownMenuTrigger>
		</DropdownMenu>
	{/snippet}
</TwoHeader>
