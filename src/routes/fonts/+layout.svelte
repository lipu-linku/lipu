<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";

	export let data;
	$: ({ language, languages } = data);
</script>

<Navbar {languages} {language} />

<slot />
