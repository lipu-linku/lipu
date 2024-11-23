<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";

	const { data, children } = $props();
	const { language, languages } = $derived(data);
</script>

<Navbar {languages} {language} />

{@render children()}
