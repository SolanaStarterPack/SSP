<script lang="ts" module>
	export type CardProps = {
		title: string;
		description: string;
	};
</script>

<script lang="ts">
	import { Card } from '../ui/card';

	const { title, description }: CardProps = $props();
</script>

<Card class="w-[40vw] space-y-2 bg-neutral-900 p-2 max-md:text-center md:p-8">
	<h3 class="text-xl font-semibold md:text-3xl">{title}</h3>
	<p class="text-lg font-light tracking-wide md:text-2xl">{description}</p>
</Card>
