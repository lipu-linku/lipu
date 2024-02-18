<script lang="ts">
	import Entry from "./Entry.svelte";

	import { page } from "$app/stores";
	import { wordSearch } from "$lib/components/search";
	import { categories, searchQuery } from "$lib/state";
	import { entries } from "$lib/utils";

	export let data;
	$: ({ words, language } = data);

	$: categoriesParam = $page.url.searchParams.get("categories");

	$: wordList = $page.url.searchParams.get("list")?.split(",");
	$: sorted_filtered_dictionary = wordSearch(
		$page.url.searchParams.get("q") ?? $searchQuery,
		words,
		categoriesParam ? JSON.parse(categoriesParam) : $categories,
		wordList,
		language,
	);
</script>

<svelte:head>
	<title>lipu Linku</title>
</svelte:head>

<main class="flex-1 my-4">
	<ul
		class="flex-1 flex flex-col items-stretch gap-2 mx-auto max-w-[min(1000px,clamp(60%,400px,100%_-_3rem))]"
	>
		{#each entries(sorted_filtered_dictionary) as [id, word] (id)}
			<li>
				<Entry {language} {id} {word} />
			</li>
		{/each}
	</ul>
</main>
