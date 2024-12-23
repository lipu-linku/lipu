<script lang="ts">
	import Numbers from "./Numbers.svelte";
	import SitelenIdentifier from "./SitelenIdentifier.svelte";
	import SitelenToUcsur from "./SitelenToUcsur.svelte";
</script>

<svelte:head>
	<title>lipu Linku &middot; Tools</title>
</svelte:head>

<main class="w-full my-4 grid grid-cols-3 auto-rows-min gap-4">
	<Numbers />

	<SitelenToUcsur />

	<SitelenIdentifier />
</main>
