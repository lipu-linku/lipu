<script lang="ts">
	import type { PageData } from "./$types";

	import Entry from "$lib/components/Entry.svelte";
	
	import { wordSearch } from "$lib/components/search";
	import { books, categories, searchQuery } from "$lib/state";

	export let data: PageData;
	$: ({
		linku: { data: dictionary, languages },
	} = data);

	let lightmode = false; // TODO
	// $: if (lightmode) {
	// 	document.documentElement.classList.add('lightmode');
	// } else {
	// 	document.documentElement.classList.remove('lightmode');
	// }

	let selected_language = "en";

	let selected_view: "basic" | "grid" = "basic";

	$: sorted_filtered_dictionary = wordSearch(
		$searchQuery,
		Object.values(dictionary),
		$books,
		$categories
	);
</script>

<main class="flex-1 my-2 {selected_view === 'grid' ? 'view_grid' : 'view_basic'}">
	<ul>
		{#each sorted_filtered_dictionary as word (word.id)}
			<li>
				<Entry {word} />
			</li>
		{/each}
	</ul>
</main>

<style>
	.view_basic ul {
		@apply flex-1 flex flex-col items-stretch gap-2 mx-auto max-w-[60%];
	}

	.view_grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}
</style>
