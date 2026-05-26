<script lang="ts">
	import WordsSearch from "$lib/components/WordsSearch.svelte";

	const { children } = $props();
</script>

<WordsSearch />

{@render children()}
