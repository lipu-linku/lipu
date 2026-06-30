<script lang="ts">
	import { page } from "$app/state";
	import Navbar from "$lib/components/Navbar.svelte";
	import { Button } from "$lib/components/ui/button";
	import { setLocaleContext, LocaleState } from "$lib/state.svelte";
	import anchorPolyfill from "@oddbird/css-anchor-positioning/fn";
	import { ModeWatcher } from "mode-watcher";
	import { outerHeight, scrollY } from "svelte/reactivity/window";
	import { fly } from "svelte/transition";
	import { pwaAssetsHead } from "virtual:pwa-assets/head";
	import { pwaInfo } from "virtual:pwa-info";

	import "../app.css";
	import { useRegisterSW } from "virtual:pwa-register/svelte";
	import UpArrowIcon from "~icons/lucide/arrow-up";

	const { data, children } = $props();

	// Seed the per-request locale from server-negotiated data so SSR and the
	// initial client render agree, and switching it later stays client-side.
	// svelte-ignore state_referenced_locally
	setLocaleContext(new LocaleState(data.locale));

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

	$effect(() => {
		if (!("anchorName" in document.documentElement.style)) {
			anchorPolyfill();
		}
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
	class="mx-auto flex max-w-[min(2000px,100dvw)] lg:gap-2 md:grid md:grid-cols-[min-content_auto] lg:grid-cols-[min-content_minmax(0,4fr)_minmax(0,1fr)] md:grid-rows-1 md:justify-center"
>
	<Navbar />

	{@render children()}

	{#if !page.params?.word && (scrollY.current ?? 0) > 1.05 * (outerHeight.current ?? 0)}
		<div transition:fly={{ y: 10, duration: 150 }} class="fixed inset-e-4 inset-be-4">
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
