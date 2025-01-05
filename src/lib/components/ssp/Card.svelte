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

<Card class="w-[40vw] space-y-2 bg-neutral-900 p-8">
	<h3 class="text-3xl font-semibold">{title}</h3>
	<p class="text-2xl font-light tracking-wide">{description}</p>
</Card>
