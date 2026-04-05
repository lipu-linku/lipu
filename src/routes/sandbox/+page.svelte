<script lang="ts">
	import { page } from "$app/state";
	import logo from "$lib/assets/icon-light.png?url";
	import { Spinner } from "$lib/components/ui/spinner";
	import { wordSearch } from "$lib/remote/search.remote";
	import { queryParamsSchema, sortingDirection, sortingMethod } from "$lib/state.svelte";
	import { useSearchParams } from "runed/kit";

	import Entry from "../Entry.svelte";

	const params = useSearchParams(queryParamsSchema);
	const locale = $derived(page.data.locale.id);
</script>

<svelte:head>
	<title>lipu Linku · Sandbox</title>
	<meta name="description" content="Collection of Toki Pona word proposals" />
	<meta name="title" content="lipu Linku · Sandbox" />
	<meta name="og:description" content="Collection of Toki Pona word proposals" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="col-2 space-y-4 p-2 md:my-4 md:min-w-6/10 md:p-0">
	<svelte:boundary>
		{@const sorted_filtered_dictionary = await wordSearch({
			locale,
			query: params.q,
			sandbox: true,
			list: params.list,
			sorting: sortingMethod.current,
			direction: sortingDirection.current,
		})}

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
