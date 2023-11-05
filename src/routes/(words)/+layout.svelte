<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import { Button } from "$lib/components/ui/button";
	import { searchQuery } from "$lib/state.js";
	import UpArrowIcon from "~icons/lucide/arrow-up";

	export let data;
	$: ({
		linku: { data: dictionary },
	} = data);
</script>

<div class="relative my-0 mx-auto p-0 flex flex-col gap-4 min-h-screen">
	<Navbar bind:query={$searchQuery} words={Object.values(dictionary)} />

	<slot />

	<Button
		class="fixed bottom-4 right-4 flex items-center gap-2"
		variant="outline"
		on:click={() => window.scrollTo({ top: 0, behavior: "smooth" })}
	>
		<UpArrowIcon /> Scroll to Top
	</Button>
</div>
