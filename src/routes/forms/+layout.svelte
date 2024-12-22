<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";

	const { data, children } = $props();
</script>

{@render children()}
