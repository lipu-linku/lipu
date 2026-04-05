<script lang="ts">
	import { browser } from "$app/environment";
	import logo from "$lib/assets/icon-light.png?url";
	import { wordSearch } from "$lib/remote/search.remote";
	import {
		categories,
		favorites,
		language,
		onlyFavorites,
		queryParamsSchema,
	} from "$lib/state.svelte";
	import { useSearchParams } from "runed/kit";
	import Entry from "../Entry.svelte";
	import { Spinner } from "$lib/components/ui/spinner";

	const hasDisclaimer = new Date() < new Date("2025-09-12");

	const params = useSearchParams(queryParamsSchema);
</script>

<svelte:head>
	<title>lipu Linku</title>
	<meta name="description" content="An interactive dictionary for Toki Pona." />
	<meta name="og:title" content="lipu Linku" />
	<meta name="og:description" content="An interactive dictionary for Toki Pona" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="flex-1 col-2 md:my-4 space-y-4 md:min-w-6/10 p-2 md:p-0">
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
	<svelte:boundary>
		{@const sorted_filtered_dictionary = await wordSearch({
			query: params.q,
			lang: language.current,
			categories: categories.current,
			favorites: favorites.current,
			list: params.list,
			onlyFavorites: onlyFavorites.current,
		})}

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
