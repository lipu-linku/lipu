<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	export let data;
	$: ({ language, languages } = data);
</script>

<Navbar {language} {languages}></Navbar>

<main class="flex min-h-full flex-1 flex-col items-center justify-center gap-4">
	<slot />
</main>
