<script lang="ts">
	import LanguageSwitch from "$lib/components/LanguageSwitch.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
	import SandboxSearch from "./SandboxSearch.svelte";

	export let data;
	$: ({ languages, language } = data);
</script>

<Navbar {language} {languages}>
	<SandboxSearch class="hidden md:flex" />
</Navbar>

<SandboxSearch
	class="flex sticky z-50 top-0 border-b border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
/>

<slot />
