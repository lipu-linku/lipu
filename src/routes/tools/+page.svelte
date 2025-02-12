<script lang="ts">
	import Numbers from "./Numbers.svelte";
	import SitelenIdentifier from "./SitelenIdentifier.svelte";
	import SitelenToUcsur from "./SitelenToUcsur.svelte";

	const { data } = $props();
</script>

<svelte:head>
	<title>lipu Linku &middot; Tools</title>
</svelte:head>

<main
	class="w-full my-4 grid grid-cols-3 auto-rows-min supports-[grid-template-rows:masonry]:grid-rows-[masonry] gap-4"
>
	<Numbers />

	<SitelenToUcsur />

	<SitelenIdentifier />
</main>
