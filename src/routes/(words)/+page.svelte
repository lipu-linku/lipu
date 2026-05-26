<script lang="ts">
	import logo from "$lib/assets/icon-light.png?url";
	import { WordSearch } from "$lib/remote/search.svelte";
	import { getWords } from "$lib/remote/words.remote";
	import { categories, displayMethod, lang, queryParamsSchema } from "$lib/state.svelte";
	import { useSearchParams } from "runed/kit";

	import Entry from "../Entry.svelte";

	const hasDisclaimer = new Date() < new Date("2025-09-12");

	const params = useSearchParams(queryParamsSchema);
	const words = $derived(await getWords(lang.current));
	const search = new WordSearch(
		() => words,
		() => params.q,
	);
</script>

<svelte:head>
	<title>lipu Linku</title>
	<meta name="description" content="An interactive dictionary for Toki Pona." />
	<meta name="og:title" content="lipu Linku" />
	<meta name="og:description" content="An interactive dictionary for Toki Pona" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="col-2 flex-1 space-y-4 p-2 md:my-4 md:min-w-6/10 md:p-0">
	{#if hasDisclaimer}
		<p class="text-center text-balance **:[a]:underline">
			The <a href="https://linku.la/wile">2025 Linku usage survey</a> and
			<a href="https://linku.la/wile-glyphs">glyphs survey</a> are now open! Please take the surveys to
			help improve the dictionary and keep it up to date!
		</p>
	{/if}
	{#if categories.current.obscure}
		<p class="text-center text-balance">
			Most speakers don't use or understand obscure words. If you're a beginner, they will not help
			you learn the language.
		</p>
	{/if}

	<ul
		class="group grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4 data-[display=compact]:grid-cols-[min-content_1lh_min-content_1fr]"
		data-display={displayMethod.current}
	>
		{#each search.results as word (word.id)}
			<li class="grid grid-cols-subgrid group-data-[display=compact]:col-span-4">
				<Entry {word} />
			</li>
		{/each}
	</ul>
</main>
