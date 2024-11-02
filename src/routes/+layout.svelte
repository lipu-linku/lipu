<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import { ModeWatcher } from "mode-watcher";

	import { pwaAssetsHead } from "virtual:pwa-assets/head";
	import { pwaInfo } from "virtual:pwa-info";

	import { useRegisterSW } from "virtual:pwa-register/svelte";
	import UpArrowIcon from "~icons/lucide/arrow-up";
	import "../app.postcss";
	import { browser } from "$app/environment";
	import { fly } from "svelte/transition";

	const { children } = $props();

	const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");

	useRegisterSW({
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

	let scrollY = $state<number>(0);
	let outerHeight = $state<number>(0);
</script>

{#if browser}
	<ModeWatcher />
{/if}

<svelte:head>
	{@html webManifest}
	{#if pwaAssetsHead && pwaAssetsHead.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}
	{#each pwaAssetsHead.links as link}
		<link {...link} />
	{/each}
</svelte:head>

<svelte:window bind:scrollY bind:outerHeight />

<div class="relative my-0 mx-auto p-0 flex flex-col min-h-dvh">
	{@render children()}

	{#if !$page.params.word && scrollY > 1.05 * outerHeight}
		<div transition:fly={{ y: 10, duration: 150 }} class="fixed bottom-4 right-4">
			<Button
				class="flex items-center gap-2"
				variant="outline"
				onclick={() =>
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
