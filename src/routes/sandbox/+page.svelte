<script lang="ts">
	import Entry from "../Entry.svelte";

	import autoAnimate from "@formkit/auto-animate";
	import { page } from "$app/stores";
	import { wordSearch } from "$lib/components/search";
	import { favorites, onlyFavorites, searchQuery } from "$lib/state";
	import logo from "$lib/assets/icon-light.png?url";
	import { basicMarkdownProcessing, m } from "$lib/paraglide";

	export let data;
	$: ({ words, language } = data);

	$: wordList = $page.url.searchParams.get("list")?.split(",");
	$: sorted_filtered_dictionary = wordSearch(
		$page.url.searchParams.get("q") ?? $searchQuery,
		words,
		{
			sandbox: true,
			core: false,
			common: false,
			uncommon: false,
			obscure: false,
		},
		$favorites,
		$onlyFavorites,
		wordList,
		language.id,
	);
</script>

<svelte:head>
	<title>lipu Linku · Sandbox</title>
	<meta name="description" content="Collection of Toki Pona word proposals" />
	<meta name="title" content="lipu Linku · Sandbox" />
	<meta name="og:description" content="Collection of Toki Pona word proposals" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="flex-1 my-4 space-y-4">
	<p class="text-center text-balance px-2 mx-auto">
		{@html basicMarkdownProcessing(m.sandbox_disclosure_1())}
		<br />
		{@html basicMarkdownProcessing(m.sandbox_disclosure_2())}
		<br />
		{@html basicMarkdownProcessing(m.sandbox_disclosure_3())}
		<br />
		{@html basicMarkdownProcessing(m.sandbox_disclosure_4())}
	</p>
	<ul use:autoAnimate class="flex flex-col items-stretch gap-2 mx-auto max-w-[min(95vw,1000px)]">
		{#each sorted_filtered_dictionary as word (word.id)}
			<li>
				<Entry {language} {word} />
			</li>
		{/each}
	</ul>
</main>
