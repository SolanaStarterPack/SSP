<script lang="ts" module>
	export const githubAnalyzerOpen = writable(false);
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import GitHubAnalyzer from './GitHubAnalyzer.svelte';
</script>

<GitHubAnalyzer bind:open={$githubAnalyzerOpen} />
