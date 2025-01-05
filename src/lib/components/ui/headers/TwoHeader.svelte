<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	const {
		left,
		right,
		class: className,
		bgClass,
		gradientClass,
		containerClass
	}: {
		containerClass?: string;
		bgClass?: string;
		gradientClass?: string;
		class?: string;
		left: Snippet;
		right: Snippet;
	} = $props();
</script>

<div class={cn(containerClass, 'fixed left-0 top-0 h-32 w-screen overflow-clip')}>
	<div class={cn(className, 'grid h-full w-full grid-cols-2 items-center px-12 py-4')}>
		<div>
			{@render left()}
		</div>
		<div class="text-right">
			{@render right()}
		</div>
	</div>
	<div
		class={cn(gradientClass, 'absolute left-0 top-0 -z-50 h-full w-full')}
		style="backdrop-filter: blur(5px)"
	></div>
</div>

<!-- Spacer -->
<div class="h-32"></div>
