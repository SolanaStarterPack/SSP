<script lang="ts">
	import Contact from '$lib/blocks/ssp/Contact.svelte';
	import Cta from '$lib/blocks/ssp/Cta.svelte';
	import Dialogs from '$lib/blocks/ssp/Dialogs.svelte';
	import Footer from '$lib/blocks/ssp/Footer.svelte';
	import Header from '$lib/blocks/ssp/Header.svelte';
	import Hero from '$lib/blocks/ssp/Hero.svelte';
	import HowItWorks from '$lib/blocks/ssp/HowItWorks.svelte';
</script>

<Header />
<div class="px-2 pt-32">
	<Hero />
	<div class="mb-16 flex w-screen items-center justify-center">
		<video src="/display/metalic-blob.mp4" autoplay loop muted class="object-cover"></video>
	</div>
	<div class="space-y-32">
		<Cta />
		<HowItWorks />
		<Contact />
		<Footer />
	</div>
</div>

<Dialogs />
