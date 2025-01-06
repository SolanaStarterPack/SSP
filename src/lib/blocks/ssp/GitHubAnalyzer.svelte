<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Dialog } from '$lib/components/ui/dialog';
	import DialogContent from '$lib/components/ui/dialog/dialog-content.svelte';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { sspGitHubAnalysis } from '$lib/db/schema';
	import { cn, expr } from '$lib/utils';
	import { type InferSelectModel } from 'drizzle-orm';
	import { RotateCw } from 'lucide-svelte';
	import { Spring } from 'svelte/motion';

	let { open = $bindable() }: { open: boolean } = $props();

	const height = new Spring(0);
	const opacity = new Spring(0);
	let repo = $state('');
	let submitting = $state(false);
	let analysis = $state('');
	let analysisContainer: HTMLDivElement | undefined = $state();
	let existingAnalysis = $state<InferSelectModel<typeof sspGitHubAnalysis>[]>([]);
	const loadingStatuses = [
		'Analyzing repository...',
		'Fetching repository data...',
		'Parsing repository data...',
		'Analyzing repository data...',
		'Generating analysis...',
		'Finalizing analysis...'
	];
	let loadingStatus = $state(loadingStatuses[0]);

	// Change loading status
	$effect(() => {
		if (!submitting) {
			loadingStatus = loadingStatuses[0];
		}

		const interval = expr(() => {
			if (submitting) {
				return setInterval(() => {
					const index = loadingStatuses.indexOf(loadingStatus);
					loadingStatus = loadingStatuses[(index + 1) % loadingStatuses.length];
				}, 3000);
			}

			return null;
		});

		return () => interval && clearInterval(interval);
	});

	// Load existing analysis
	$effect(() => {
		new Promise<void>(async (resolve) => {
			const response = await fetch('/api/analyze-repo/list');
			const json = await response.json();
			existingAnalysis = json.results;
			resolve();
		});
	});

	// Animate analysis container
	$effect(() => {
		if (submitting || analysis) {
			height.target = 384;
			opacity.target = 1;
		} else {
			height.target = 0;
			opacity.target = 0;
		}
	});

	async function handleSubmit() {
		if (!analysisContainer) return;

		submitting = true;
		analysis = '';

		// Validate GitHub URL
		const url = new URL(repo);
		if (url.hostname !== 'github.com') {
			analysis = 'Invalid GitHub URL';
			submitting = false;
			return;
		}

		const response = await fetch('/api/analyze-repo', {
			method: 'POST',
			body: JSON.stringify({
				repo
			})
		}).catch((err) => {
			console.error('Error analyzing repository', err);
			return err instanceof Error ? err.message : 'An error occurred';
		});

		const responseJson = typeof response !== 'string' ? await response.json() : null;
		const text = responseJson.analysis ?? responseJson.error ?? response;

		let i = 0;
		const speed = 30;

		const typeWriter = async () => {
			for (i = 0; i < text.length; i++) {
				analysis += text.charAt(i);

				// Ensure container scrolls down
				analysisContainer!.parentElement!.parentElement!.scrollTop =
					analysisContainer!.parentElement!.parentElement!.scrollHeight;

				// Await a delay for smooth typewriting
				await new Promise((resolve) => setTimeout(resolve, speed * (Math.random() + 0.2)));
			}
		};

		await typeWriter();
		submitting = false;
	}

	function scoreToColor(score: number) {
		if (score > 50) return 'text-green-500';
		if (score > 30) return 'text-yellow-500';
		return 'text-red-500';
	}
</script>

<Dialog bind:open>
	<DialogContent class="flex max-w-2xl">
		<form onsubmit={handleSubmit} class="top-0 flex-1">
			<h2 class="mb-2 text-2xl font-semibold">GitHub Repository Analyzer</h2>
			<Input
				bind:value={repo}
				placeholder="https://github.com/username/repo"
				required
				class="mb-2"
				type="url"
			/>
			<ScrollArea
				class={cn(
					analysis || submitting ? 'mb-2 p-2' : '',
					'h-96 scroll-smooth rounded-md border border-primary'
				)}
				style="max-height: {height.current}px; opacity: {opacity.current};"
			>
				<div bind:this={analysisContainer} class="h-full">
					{#if submitting && !analysis}
						<div class="flex h-full flex-col items-center justify-center">
							<RotateCw class="animate-spin" />
							<span class="mt-1 text-xs">{loadingStatus}</span>
						</div>
					{:else}
						<pre class="text-wrap">{analysis}</pre>
					{/if}
				</div>
			</ScrollArea>
			<Button type="submit" variant="ssp" size="xl" disabled={submitting} class="w-full"
				>Submit</Button
			>
		</form>
		{#if existingAnalysis.length > 0}
			<ScrollArea class="max-h-[40vh] w-2/5">
				<div class="space-y-1 py-1 pr-4">
					<h2 class="ml-2 text-lg font-bold">History</h2>
					<div>
						{#each existingAnalysis as analysis}
							<Card class="p-2">
								<div class="mb-2 flex items-center justify-between">
									<h3 class="font-semibold">{analysis.repo}</h3>
									<Badge class={cn(scoreToColor(analysis.score), 'bg-secondary px-1 text-xs')}>
										{analysis.score}
									</Badge>
								</div>
								<p
									class="max-h-28 overflow-hidden overflow-ellipsis text-xs font-light tracking-wide"
								>
									{analysis.analysis}
								</p>
							</Card>
						{/each}
					</div>
				</div>
			</ScrollArea>
		{/if}
	</DialogContent>
</Dialog>
