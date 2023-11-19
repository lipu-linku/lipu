<script lang="ts">
	import type { PageData } from "./$types";

	import Entry from "$lib/components/Entry.svelte";

	import { wordSearch } from "$lib/components/search";
	import { categories, searchQuery } from "$lib/state";

	export let data: PageData;
	$: ({
		linku: { data: dictionary },
	} = data);

	$: sorted_filtered_dictionary = wordSearch($searchQuery, Object.values(dictionary), $categories);
</script>

<svelte:head>
	<title>lipu Linku</title>
</svelte:head>

<main class="flex-1 my-2">
	<ul class="flex-1 flex flex-col items-stretch gap-2 mx-auto max-w-[60%]">
		{#each sorted_filtered_dictionary as word (word.id)}
			<li>
				<Entry {word} />
			</li>
		{/each}
	</ul>
</main>
