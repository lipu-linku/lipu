<script lang="ts">
	import Numbers from "./Numbers.svelte";
	import SitelenIdentifier from "./SitelenIdentifier.svelte";
	import SitelenToUcsur from "./SitelenToUcsur.svelte";
</script>

<svelte:head>
	<title>lipu Linku &middot; Tools</title>
</svelte:head>

<main
	class="grid w-full auto-rows-min grid-cols-1 gap-4 p-4 supports-[grid-template-rows:masonry]:grid-rows-[masonry] md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]"
>
	<Numbers />

	<SitelenToUcsur />

	<SitelenIdentifier />
</main>
