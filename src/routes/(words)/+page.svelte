<script lang="ts">
	import type { PageData } from "./$types";

	import Card from "$lib/components/Card.svelte";
	import Entry from "$lib/components/Entry.svelte";
	import Filter from "$lib/components/Filter.svelte";
	import LukaPonaEntry from "$lib/components/LukaPonaEntry.svelte";
	import Navbar from "$lib/components/Navbar.svelte";

	import { search } from "$lib/components/search";
	import type { BookName, UsageCategory } from "$lib/types";

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

	let query = "";
	let selected_language = "en";

	let selected_view: "basic" | "grid" = "basic";
	let categories: Record<UsageCategory, boolean> = {
		core: true,
		widespread: true,
		common: false,
		uncommon: false,
		rare: false,
		obscure: false,
	};

	let books: Record<BookName, boolean> = {
		pu: true,
		"ku suli": true,
		"ku lili": false,
		none: false,
	};

	$: sorted_filtered_dictionary = Object.entries(search(dictionary, query, categories, books));
</script>

<div class="my-0 mx-auto p-0 flex flex-col gap-6">
	<Navbar bind:query words={Object.values(dictionary).map((w) => w.word)} />

	<Filter bind:categories bind:books {languages} />

	<main class="my-2 {selected_view === 'grid' ? 'view_grid' : 'view_basic'}">
		<ul>
			{#each sorted_filtered_dictionary as [key, word] (key)}
				<li>
					{#if selected_view === "basic"}
						<Entry {word} />
					{:else if selected_view === "grid"}
						<Card {word} />
					{:else}
						<LukaPonaEntry {word} {selected_language} />
					{/if}
				</li>
			{/each}
		</ul>
	</main>
</div>

<style>
	.view_basic ul {
		@apply flex flex-col items-stretch justify-center gap-2 mx-auto max-w-[60%];
	}

	.view_grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}
</style>
