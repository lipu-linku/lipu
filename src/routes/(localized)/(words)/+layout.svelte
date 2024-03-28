<script lang="ts">
	import WordsSearch from "./WordsSearch.svelte";
	import LanguageSwitch from "$lib/components/LanguageSwitch.svelte";
	import Navbar from "$lib/components/Navbar.svelte";

	export let data;
	$: ({ languages, language } = data);
</script>

<Navbar>
	<WordsSearch class="hidden md:flex" />

	<LanguageSwitch selected={language.id} localeList={languages} />
</Navbar>

<WordsSearch
	class="flex sticky z-50 top-0 border-b border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
/>

<slot />
