<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import SandboxSearch from "./SandboxSearch.svelte";

	const { data, children } = $props();
	const { languages, language } = $derived(data);
</script>

{@render children?.()}

<SandboxSearch
	class="flex sticky z-50 top-0 border-b border-border/40 bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:hidden"
/>
