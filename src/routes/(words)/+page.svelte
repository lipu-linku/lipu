<script lang="ts">
	import Entry from "../Entry.svelte";

	import { page } from "$app/stores";
	import { wordSearch } from "$lib/components/search";
	import { categories, categoriesSerializer, searchQuery } from "$lib/state";
	import logo from "$lib/assets/icon.png?url";

	export let data;
	$: ({ words, language } = data);

	$: categoriesParam = $page.url.searchParams.get("categories");

	$: wordList = $page.url.searchParams.get("list")?.split(",");
	$: sorted_filtered_dictionary = wordSearch(
		$page.url.searchParams.get("q") ?? $searchQuery,
		words,
		{
			sandbox: false,
			...(categoriesParam ? categoriesSerializer.parse(categoriesParam) : $categories),
		},
		wordList,
		language.id,
	);
</script>

<svelte:head>
	<title>lipu Linku</title>
	<meta name="description" content="An interactive dictionary for Toki Pona." />
	<meta name="og:title" content="lipu Linku" />
	<meta name="og:description" content="An interactive dictionary for Toki Pona" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="my-4 flex-1 space-y-4">
	<p class="text-balance text-center">
		The site is currently in beta!
		<br />
		If you have feedback, please contact kala Asi or jan Telesi on Discord!
	</p>
	<ul class="mx-auto flex max-w-[min(95vw,1000px)] flex-col items-stretch gap-2">
		{#each sorted_filtered_dictionary as word (word.id)}
			<li>
				<Entry {language} {word} />
			</li>
		{/each}
	</ul>
</main>
