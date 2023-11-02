<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import { Button } from "$lib/components/ui/button";
	import { searchQuery } from "$lib/state.js";
	import RefreshIcon from "~icons/lucide/refresh-cw";

	export let data;
	$: ({
		linku: { data: dictionary },
	} = data);

	$: loadingSuccessful = !!dictionary;
</script>

<div class="my-0 mx-auto p-0 flex flex-col gap-4 min-h-screen">
	<Navbar bind:query={$searchQuery} words={Object.values(dictionary).map((w) => w.word)} />

	{#if loadingSuccessful}
		<slot />
	{:else}
		<main class="flex-1 flex flex-col items-center justify-center gap-4 my-2">
			<h2 class="font-semibold text-2xl">
				Couldn't load the dictionary data, please refresh the page.
			</h2>
			<Button
				class="flex items-center gap-[1ch]"
				variant="outline"
				on:click={() => window.location.reload()}
			>
				<RefreshIcon /> Refresh
			</Button>
		</main>
	{/if}
</div>
