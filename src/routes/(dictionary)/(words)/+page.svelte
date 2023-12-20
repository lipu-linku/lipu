<script lang="ts">
	import type { PageData } from "./$types";

	import Entry from "./Entry.svelte";

	import { wordSearch } from "$lib/components/search";
	import { categories, searchQuery } from "$lib/state";
	import { page } from "$app/stores";

	export let data: PageData;
	$: ({
		linku: { data: dictionary },
	} = data);

	$: wordList = $page.url.searchParams.get("list")?.split(",");
	$: sorted_filtered_dictionary = wordSearch(
		$searchQuery,
		Object.values(dictionary),
		$categories,
		wordList,
	);
</script>

<svelte:head>
	<title>lipu Linku</title>
</svelte:head>

<main class="flex-1 my-2">
	<ul
		class="flex-1 flex flex-col items-stretch gap-2 mx-auto max-w-[min(1000px,clamp(60%,400px,100%_-_3rem))]"
	>
		{#each sorted_filtered_dictionary as word (word.id)}
			<li>
				<Entry {word} />
			</li>
		{/each}
	</ul>
</main>
