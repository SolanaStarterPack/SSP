<script lang="ts">
	import '@fontsource-variable/commissioner';
	import '../app.css';

	import Solid from '$lib/components/ui/backgrounds/Solid.svelte';
	let { children } = $props();
</script>

<Solid class="bg-black" />
{@render children()}
