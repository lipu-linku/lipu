<script lang="ts">
	import Entry from "../Entry.svelte";

	import { page } from "$app/stores";
	import { wordSearch } from "$lib/components/search";
	import { favorites, onlyFavorites, searchQuery } from "$lib/state";
	import logo from "$lib/assets/icon-light.png?url";

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
		The <i>sandbox</i> is a collection of proposed words which are
		<strong class="md:whitespace-nowrap">not actively in use</strong>.
		<br />
		If you are a learner,
		<strong class="md:whitespace-nowrap">please stick to the main dictionary</strong>
		- these words will not help you speak the language.
		<br />
		Some of these words are of value to the <strong>community</strong> as a piece of culture -
		essentially memes.
		<br />
		Some reflect early drafts of
		<span class="md:whitespace-nowrap">Toki Pona</span>. A lot are one-off jokes, created and
		abandoned immediately.
	</p>
	<ul class="flex flex-col items-stretch gap-2 mx-auto max-w-[min(95vw,1000px)]">
		{#each sorted_filtered_dictionary as word (word.id)}
			<li>
				<Entry {language} {word} />
			</li>
		{/each}
	</ul>
</main>
