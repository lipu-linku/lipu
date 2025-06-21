<script lang="ts">
	import SandboxSearch from "./SandboxSearch.svelte";

	const { children } = $props();
</script>

<SandboxSearch />

{@render children()}
