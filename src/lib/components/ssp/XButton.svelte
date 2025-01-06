<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '../ui/button';

	const { class: className } = $props();
</script>

<Button
	variant="ssp"
	class={cn('h-fit !rounded-full !p-2')}
	href="https://x.com/tradewithssp"
	target="_blank"
>
	<img src="/logos/ssp-logo-white.png" alt="SSP" class="h-8 w-auto" />
	<span class="mr-2 text-lg">Follow SSP on X</span>
</Button>
