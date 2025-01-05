<script lang="ts">
	import { cn } from '$lib/utils';

	const { class: className } = $props();
</script>

<div class={cn(className, 'absolute bottom-0 left-0 right-0 top-0 -z-50')}></div>
