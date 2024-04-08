<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import { Button } from "$lib/components/ui/button";
	import { ParaglideJS } from "@inlang/paraglide-js-adapter-sveltekit";
	import { flyAndScale } from "$lib/utils";
	import { i18n } from "$lib/i18n";
	import { page } from "$app/stores";

	import UpArrowIcon from "~icons/lucide/arrow-up";
	import "../app.postcss";
	import { browser } from "$app/environment";

	let scrollY: number;
	let outerHeight: number;
</script>

<ModeWatcher />

<svelte:window bind:scrollY bind:outerHeight />

<ParaglideJS {i18n}>
	<div class="relative my-0 mx-auto p-0 flex flex-col min-h-dvh">
		<slot />

		{#if browser && !$page.params.word && scrollY > 1.05 * outerHeight}
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
</ParaglideJS>
