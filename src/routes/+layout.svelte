<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.postcss";
	import { page } from "$app/stores";
	import { flyAndScale } from "$lib/utils";
	import { Button } from "$lib/components/ui/button";
	import UpArrowIcon from "~icons/lucide/arrow-up";

	let scrollY: number;
	let outerHeight: number;
</script>

<ModeWatcher />

<svelte:window bind:scrollY bind:outerHeight />

<div class="relative my-0 mx-auto p-0 flex flex-col min-h-dvh">
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
				<UpArrowIcon aria-label="Up arrow icon" /> Scroll to Top
			</Button>
		</div>
	{/if}
</div>
