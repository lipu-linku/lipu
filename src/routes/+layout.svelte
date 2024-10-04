<script lang="ts">
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import { i18n } from "$lib/i18n";
	import { m } from "$lib/paraglide";

	import { onMount } from "svelte";
	import { ModeWatcher } from "mode-watcher";
	import { page } from "$app/stores";
	import { flyAndScale } from "$lib/utils";
	import { Button } from "$lib/components/ui/button";

	import { pwaInfo } from "virtual:pwa-info";
	import { pwaAssetsHead } from "virtual:pwa-assets/head";

	import "../app.postcss";
	import UpArrowIcon from "~icons/lucide/arrow-up";

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import("virtual:pwa-register");
			registerSW({
				immediate: true,
				onRegistered(r) {
					r &&
						setInterval(() => {
							console.log("Checking for sw update");
							r.update();
						}, 20 * 1000);
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error) {
					console.log("SW registration error", error);
				},
			});
		}
	});

	let scrollY: number;
	let outerHeight: number;
</script>

<svelte:head>
	{@html webManifest}
	{#if pwaAssetsHead && pwaAssetsHead.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}
	{#each pwaAssetsHead.links as link}
		<link {...link} />
	{/each}
</svelte:head>
<ModeWatcher />

<svelte:window bind:scrollY bind:outerHeight />

<ParaglideJS {i18n}>
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
					<UpArrowIcon aria-label="Up arrow icon" />
					{m.scroll_to_top()}
				</Button>
			</div>
		{/if}
	</div>
</ParaglideJS>
