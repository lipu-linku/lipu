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

	<WordsSearch class="flex sticky z-50 top-[4.5rem] md:hidden" slot="second-line" />
</Navbar>

<slot />
