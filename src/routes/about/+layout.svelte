<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";

	export let data;
	$: ({ language, languages } = data);
</script>

<Navbar {languages} {language} />

<main class="my-auto flex min-h-full flex-col items-center justify-center gap-4">
	<slot />
</main>
