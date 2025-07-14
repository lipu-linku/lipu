<script lang="ts">
	import { page } from "$app/state";
	import logo from "$lib/assets/icon-light.png?url";
	import { wordSearch } from "$lib/components/search.svelte";
	import { favorites, onlyFavorites, queryParams } from "$lib/state.svelte";
	import Entry from "../Entry.svelte";

	const { data } = $props();
	const { words, language } = $derived(data);

	const wordList = $derived(page.url.searchParams.get("list")?.split(","));
	const sorted_filtered_dictionary = $derived(
		wordSearch(
			queryParams.q ?? "",
			words,
			{
				sandbox: true,
				core: false,
				common: false,
				uncommon: false,
				obscure: false,
			},
			favorites.current,
			onlyFavorites.current,
			wordList,
			language.id,
		),
	);
</script>

<svelte:head>
	<title>lipu Linku · Sandbox</title>
	<meta name="description" content="Collection of Toki Pona word proposals" />
	<meta name="title" content="lipu Linku · Sandbox" />
	<meta name="og:description" content="Collection of Toki Pona word proposals" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="col-2 md:my-4 space-y-4 md:min-w-6/10 p-2 md:p-0">
	<p class="text-center not-supports-[text-wrap:pretty]:text-balance text-pretty px-2 mx-auto">
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
	<ul class="flex flex-col items-stretch gap-2">
		{#each sorted_filtered_dictionary as word (word.id)}
			<li>
				<Entry {language} {word} />
			</li>
		{/each}
	</ul>
</main>
