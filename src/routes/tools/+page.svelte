<script lang="ts">
	import Numbers from "./Numbers.svelte";
	import SitelenIdentifier from "./SitelenIdentifier.svelte";
	import SitelenToUcsur from "./SitelenToUcsur.svelte";
</script>

<svelte:head>
	<title>lipu Linku &middot; Tools</title>
</svelte:head>

<main
	class="w-full p-4 grid md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] grid-cols-1 auto-rows-min supports-[grid-template-rows:masonry]:grid-rows-[masonry] gap-4"
>
	<Numbers />

	<SitelenToUcsur />

	<SitelenIdentifier />
</main>
