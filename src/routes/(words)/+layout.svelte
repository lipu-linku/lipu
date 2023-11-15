<script lang="ts">
	import { page } from "$app/stores";
	import Navbar from "$lib/components/Navbar.svelte";
	import { Button } from "$lib/components/ui/button";
	import { flyAndScale } from "$lib/utils";
	import UpArrowIcon from "~icons/lucide/arrow-up";

	export let data;
	$: ({
		linku: { data: dictionary },
	} = data);

	let scrollY: number;
	let outerHeight: number;
</script>

<svelte:window bind:scrollY bind:outerHeight />

<div class="relative my-0 mx-auto p-0 flex flex-col gap-4 min-h-screen">
	<Navbar words={Object.values(dictionary)} />

	<slot />

	{#if !$page.params.word && scrollY > 1.05 * outerHeight}
		<div transition:flyAndScale={{ y: 10 }} class="fixed bottom-4 right-4">
			<Button
				class="flex items-center gap-2"
				variant="outline"
				on:click={() =>
					window.scrollTo({
						top: 0,
						behavior: window.matchMedia("(prefers-reduced-motion: no-preference)").matches
							? "smooth"
							: "auto",
					})}
			>
				<UpArrowIcon /> Scroll to Top
			</Button>
		</div>
	{/if}
</div>
