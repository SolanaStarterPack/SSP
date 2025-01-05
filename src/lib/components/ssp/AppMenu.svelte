<script lang="ts">
	import { DropdownMenuItem } from '../ui/dropdown-menu';

	type Item = {
		name: string;
		href: string;
	};

	const items: Item[] = [
		{ name: 'X Handle Reuse Tracker', href: '' },
		{ name: 'GitHub Repository Analyzer', href: '' },
		{ name: 'Wallet Tracker', href: '' }
	];
</script>

{#each items as item (item.name)}
	<DropdownMenuItem>
		<a href={item.href}>
			{item.name}
		</a>
	</DropdownMenuItem>
{/each}
