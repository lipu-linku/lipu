<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";

	const { data, children } = $props();
	const { language, languages } = $derived(data);
</script>

<Navbar {languages} {language} />

<main class="my-auto flex flex-col items-center justify-center gap-4 min-h-full">
	{@render children()}
</main>
