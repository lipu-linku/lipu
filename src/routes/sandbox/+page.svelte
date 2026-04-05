<script lang="ts">
	import logo from "$lib/assets/icon-light.png?url";
	import { Spinner } from "$lib/components/ui/spinner";
	import { wordSearch } from "$lib/remote/search.remote";
	import {
		favorites,
		language,
		onlyFavorites,
		queryParamsSchema
	} from "$lib/state.svelte";
	import { useSearchParams } from "runed/kit";
	import Entry from "../Entry.svelte";

	const params = useSearchParams(queryParamsSchema);
</script>

<svelte:head>
	<title>lipu Linku · Sandbox</title>
	<meta name="description" content="Collection of Toki Pona word proposals" />
	<meta name="title" content="lipu Linku · Sandbox" />
	<meta name="og:description" content="Collection of Toki Pona word proposals" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="col-2 md:my-4 space-y-4 md:min-w-6/10 p-2 md:p-0">
	<svelte:boundary>
		{@const sorted_filtered_dictionary = await wordSearch({
			query: params.q,
			sandbox: true,
			favorites: favorites.current,
			onlyFavorites: onlyFavorites.current,
			list: params.list,
			lang: language.current,
		})}

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

		<ul class="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
			{#each sorted_filtered_dictionary as word (word.id)}
				<li>
					<Entry {word} />
				</li>
			{/each}
		</ul>

		{#snippet pending()}
			<div class="grid h-full place-content-center">
				<Spinner class="size-40" />
			</div>
		{/snippet}
	</svelte:boundary>
</main>
