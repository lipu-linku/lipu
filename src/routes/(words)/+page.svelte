<script lang="ts">
	import { page } from "$app/state";
	import logo from "$lib/assets/icon-light.png?url";
	import { wordSearch } from "$lib/components/search.svelte";
	import {
		categories,
		categoriesSerializer,
		favorites,
		onlyFavorites,
		queryParams,
	} from "$lib/state.svelte";
	import Entry from "../Entry.svelte";

	const { data } = $props();
	const { words, language } = $derived(data);

	const hasDisclaimer = false;

	const categoriesParam = $derived(page.url.searchParams.get("categories"));

	const wordList = $derived(page.url.searchParams.get("list")?.split(","));
	const sorted_filtered_dictionary = $derived(
		wordSearch(
			queryParams.q ?? "",
			words,
			{
				sandbox: false,
				...(categoriesParam
					? categoriesSerializer.deserialize(categoriesParam)
					: categories.current),
			},
			favorites.current,
			onlyFavorites.current,
			wordList,
			language.id,
		),
	);
</script>

<svelte:head>
	<title>lipu Linku</title>
	<meta name="description" content="An interactive dictionary for Toki Pona." />
	<meta name="og:title" content="lipu Linku" />
	<meta name="og:description" content="An interactive dictionary for Toki Pona" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="flex-1 col-2 md:my-4 space-y-4 md:min-w-6/10 p-2 md:p-0">
	{#if hasDisclaimer}
		<p class="text-center text-balance">
			The <a href="https://linku.la/wile">2024 Linku usage survey</a> is now open! Please take the survey
			to improve the dictionary!
		</p>
	{/if}
	{#if categories.current.obscure}
		<p class="text-center text-balance">
			Most speakers don't use or understand obscure words. If you're a beginner, they will not help
			you learn the language.
		</p>
	{/if}
	<ul class="flex flex-col items-stretch gap-2">
		{#each sorted_filtered_dictionary as word (word.id)}
			<li>
				<Entry {language} {word} />
			</li>
		{/each}
	</ul>
</main>
