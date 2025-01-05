<script lang="ts">
	import { cn } from '$lib/utils';
	import MoveUpRight from 'lucide-svelte/icons/move-up-right';
	import type { Snippet } from 'svelte';
	import { Button } from '../ui/button';
	import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';
	import DropdownMenuContent from '../ui/dropdown-menu/dropdown-menu-content.svelte';
	import AppMenu from './AppMenu.svelte';

	const { class: className, children }: { class?: string; children?: Snippet } = $props();
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		{#snippet child({ props })}
			<Button {...props} variant="ssp" size="xl" class={cn(className, 'group')}>
				{#if children}
					{@render children?.()}
				{:else}
					<span>Launch App</span>
					<MoveUpRight class="mt-1 !size-5 stroke-2 group-hover:animate-bounce" />
				{/if}
			</Button>
		{/snippet}
	</DropdownMenuTrigger>
	<DropdownMenuContent>
		<AppMenu />
	</DropdownMenuContent>
</DropdownMenu>
