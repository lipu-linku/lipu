<script lang="ts">
	import WordsSearch from "./WordsSearch.svelte";

	const { children } = $props();
</script>

<WordsSearch />

{@render children()}

