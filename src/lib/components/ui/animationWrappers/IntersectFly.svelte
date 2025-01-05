<script lang="ts" module>
	export type IntersectFlyProps = {
		triggerEl: HTMLElement | undefined;
		xOffset: number;
		children: Snippet<[{ style: string }]>;
	};
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { type Snippet } from 'svelte';
	import { Spring } from 'svelte/motion';

	let { children, xOffset, triggerEl }: IntersectFlyProps = $props();

	let visible = $state(false);

	const positionXSpring = Spring.of(() => (visible ? 0 : xOffset));
	const opacitySpring = Spring.of(() => (visible ? 1 : 0));

	const observer = browser
		? new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
				} else {
					visible = false;
				}
			})
		: undefined;

	$effect(() => {
		if (triggerEl) {
			observer?.disconnect();
			observer?.observe(triggerEl);
		}
	});
</script>

{@render children?.({
	style: `transform: translateX(${positionXSpring.current}px); opacity: ${opacitySpring.current};`
})}
