<script lang="ts">
	import Entry from "../Entry.svelte";
	import { page } from "$app/stores";
	import { wordSearch } from "$lib/components/search";
	import {
		categories,
		categoriesSerializer,
		favorites,
		onlyFavorites,
		searchQuery,
	} from "$lib/state.svelte";
	import logo from "$lib/assets/icon-light.png?url";

	const { data } = $props();
	const { words, language } = $derived(data);

	const hasDisclaimer = false;

	const categoriesParam = $derived($page.url.searchParams.get("categories"));

	const wordList = $derived($page.url.searchParams.get("list")?.split(","));
	const sorted_filtered_dictionary = $derived(
		wordSearch(
			$page.url.searchParams.get("q") ?? searchQuery.value,
			words,
			{
				sandbox: false,
				...(categoriesParam ? categoriesSerializer.parse(categoriesParam) : categories.current),
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

<main class="flex-1 my-4 space-y-4">
	{#if hasDisclaimer}
		<p class="text-center text-balance">
			The <a href="https://linku.la/wile">2024 Linku usage survey</a> is now open! Please take the survey
			to improve the dictionary!
		</p>
	{/if}
	<ul class="flex flex-col items-stretch gap-2 mx-auto max-w-[min(95vw,1000px)]">
		{#each sorted_filtered_dictionary as word (word.id)}
			<li>
				<Entry {language} {word} />
			</li>
		{/each}
	</ul>
</main>
