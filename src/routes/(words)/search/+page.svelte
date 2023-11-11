<script lang="ts">
	import Entry from "$lib/components/Entry.svelte";

	export let data;
	$: ({ results, query } = data);
</script>

<svelte:head>
	<title>lipu Linku &middot; Search for {query}</title>
</svelte:head>

<main class="flex-1 flex flex-col items-center justify-center gap-8 my-2">
	<h2 class="font-semibold text-4xl">Results for: {query}</h2>
	<ul class="flex flex-col items-stretch justify-center gap-2 mx-auto max-w-[60%]">
		{#each results as word (word.id)}
			<li>
				<Entry {word} />
			</li>
		{/each}
	</ul>
</main>
