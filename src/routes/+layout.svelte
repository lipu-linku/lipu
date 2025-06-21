<script lang="ts">
	import { page } from "$app/state";
	import Navbar from "$lib/components/Navbar.svelte";
	import { Button } from "$lib/components/ui/button";
	import { pwaAssetsHead } from "virtual:pwa-assets/head";
	import { pwaInfo } from "virtual:pwa-info";
	import { useRegisterSW } from "virtual:pwa-register/svelte";
	import { ModeWatcher } from "mode-watcher";
	import { outerHeight, scrollY } from "svelte/reactivity/window";
	import { fly } from "svelte/transition";

	import UpArrowIcon from "~icons/lucide/arrow-up";
	import "../app.css";

	const { children, data } = $props();

	const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");

	useRegisterSW({
		immediate: true,
		onRegistered(r) {
			if (r)
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
</script>

<ModeWatcher lightClassNames={["light"]} />

<svelte:head>
	<!-- eslint-disable svelte/no-at-html-tags -->
	{@html webManifest}
	{#if pwaAssetsHead && pwaAssetsHead.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}
	{#each pwaAssetsHead.links as link}
		<link {...link} />
	{/each}
</svelte:head>

<div
	class="max-w-[min(2000px,100dvw)] grid sm:grid-cols-[min-content_1fr_fit-content(100%)] sm:justify-center gap-2"
>
	<Navbar {...data} />

	{@render children()}

	{#if !page.params?.word && (scrollY.current ?? 0) > 1.05 * (outerHeight.current ?? 0)}
		<div transition:fly={{ y: 10, duration: 150 }} class="fixed bottom-4 right-4">
			<Button
				class="flex items-center gap-2"
				variant="secondary"
				size="lg"
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
