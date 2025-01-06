<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Dialog } from '$lib/components/ui/dialog';
	import DialogContent from '$lib/components/ui/dialog/dialog-content.svelte';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils';
	import { RotateCw } from 'lucide-svelte';
	import { Spring } from 'svelte/motion';

	let { open = $bindable() }: { open: boolean } = $props();

	const height = new Spring(0);
	const opacity = new Spring(0);
	let repo = $state('');
	let submitting = $state(false);
	let analysis = $state('');

	$effect(() => {
		if (submitting || analysis) {
			height.target = 200;
			opacity.target = 1;
		} else {
			height.target = 0;
			opacity.target = 0;
		}
	});

	async function handleSubmit() {
		submitting = true;
		analysis = '';

		const response = await fetch('/api/analyze-repo');
		const json = await response.json();

		// Load the text in letter by letter
		const text = json.analysis;
		let i = 0;
		const speed = 30;

		const promises: Promise<void>[] = [];

		const typeWriter = () => {
			if (i < text.length) {
				analysis += text.charAt(i);
				i++;
				const promise = new Promise<void>((resolve) =>
					setTimeout(
						async () => {
							await typeWriter();
							resolve();
						},
						speed * (Math.random() + 0.2)
					)
				);
				promises.push(promise);
				return promise;
			}
		};

		await typeWriter();
		await Promise.all(promises);
		submitting = false;
	}
</script>

<Dialog bind:open>
	<DialogContent class="max-w-2xl">
		<form onsubmit={handleSubmit}>
			<h2 class="mb-2 text-2xl font-semibold">GitHub Repository Analyzer</h2>
			<Input
				bind:value={repo}
				placeholder="https://github.com/username/repo"
				required
				class="mb-2"
			/>
			<div
				class={cn(
					analysis || submitting ? 'mb-2 p-2' : '',
					'h-44 rounded-md border border-primary'
				)}
				style="max-height: {height.current}px; opacity: {opacity.current};"
			>
				{#if submitting && !analysis}
					<div class="flex h-full items-center justify-center">
						<RotateCw class="animate-spin" />
					</div>
				{:else}
					{analysis}
				{/if}
			</div>
			<Button type="submit" variant="ssp" size="xl" disabled={submitting} class="w-full"
				>Submit</Button
			>
		</form>
	</DialogContent>
</Dialog>
