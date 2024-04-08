<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import WordsSearch from "./WordsSearch.svelte";

	export let data;
	$: ({ languages, language } = data);
</script>

<Navbar {languages} {language}>
	<WordsSearch class="hidden md:flex" />
</Navbar>

<WordsSearch
	class="flex sticky z-50 top-0 border-b border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
/>

<slot />
