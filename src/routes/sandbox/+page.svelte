<script lang="ts">
	import logo from "$lib/assets/icon-light.png?url";
	import { getSandbox } from "$lib/remote/words.remote";
	import { WordSearch } from "$lib/search.svelte";
	import { displayMethod, queryParamsSchema, useLocale } from "$lib/state.svelte";
	import { useSearchParams } from "runed/kit";

	import Entry from "../Entry.svelte";

	const lang = useLocale();
	const params = useSearchParams(queryParamsSchema);
	const words = $derived(await getSandbox(lang.current));
	const search = new WordSearch(
		() => words,
		() => params.q,
	);
</script>

<svelte:head>
	<title>lipu Linku · Sandbox</title>
	<meta name="description" content="Collection of Toki Pona word proposals" />
	<meta name="title" content="lipu Linku · Sandbox" />
	<meta name="og:description" content="Collection of Toki Pona word proposals" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="col-2 space-y-4 p-2 md:my-4 md:min-w-6/10 md:p-0">
	<p class="mx-auto px-2 text-center text-pretty not-supports-[text-wrap:pretty]:text-balance">
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
