<script lang="ts">
	import SandboxSearch from "./SandboxSearch.svelte";

	const { children } = $props();
</script>

{@render children?.()}

<SandboxSearch />
