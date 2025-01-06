<script lang="ts">
	import LaunchButton from '$lib/components/ssp/LaunchButton.svelte';
	import { Button } from '$lib/components/ui/button';
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
					<div class="space-x-2">
						<Button
							size="xl"
							variant="ssp"
							href="https://github.com/SolanaStarterPack/SSP"
							target="_blank"
						>
							GitHub
						</Button>
						<LaunchButton />
					</div>
				{/snippet}
			</DropdownMenuTrigger>
		</DropdownMenu>
	{/snippet}
</TwoHeader>
