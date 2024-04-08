<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import type { Language, Languages } from "@kulupu-linku/sona";

	export let data;
	$: ({ language, languages } = data);
</script>

<Navbar {languages} {language} />

<main class="my-auto flex flex-col items-center justify-center gap-4 min-h-full">
	<slot />
</main>
