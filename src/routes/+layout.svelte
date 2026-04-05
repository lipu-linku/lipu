<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import Navbar from "$lib/components/Navbar.svelte";
	import { Button } from "$lib/components/ui/button";
	import { languages } from "$lib/remote/lang.remote";
	import { dir, language } from "$lib/state.svelte";
	import { detect, fromNavigator, fromStorage, fromUrl } from "@lingui/detect-locale";
	import { ModeWatcher } from "mode-watcher";
	import { outerHeight, scrollY } from "svelte/reactivity/window";
	import { fly } from "svelte/transition";
	import { pwaAssetsHead } from "virtual:pwa-assets/head";
	import { pwaInfo } from "virtual:pwa-info";
	import { useRegisterSW } from "virtual:pwa-register/svelte";

	import { onMount } from "svelte";
	import UpArrowIcon from "~icons/lucide/arrow-up";
	import "../app.css";

	const { children, data } = $props();

	const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");

	const langs = await languages();

	// Set language from cookie during SSR so child pages use the correct value
	if (!browser) {
		language.current = data.lang;
	}

	onMount(() => {
		const currentLang = detect(fromUrl("lang"), fromStorage("lang"), fromNavigator) ?? "en";
		language.current = langs[currentLang].id;
		dir.current = langs[currentLang].direction;
	});

	// Sync language changes to a cookie so the server can use it on the next request
	$effect(() => {
		if (browser) {
			document.cookie = `lang=${language.current};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
		}
	});

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
	class="mx-auto max-w-[min(2000px,100dvw)] flex md:grid md:grid-rows-1 md:grid-cols-[min-content_1fr_min-content] md:justify-center gap-2"
>
	<Navbar />

	{@render children()}

	{#if !page.params?.word && (scrollY.current ?? 0) > 1.05 * (outerHeight.current ?? 0)}
		<div transition:fly={{ y: 10, duration: 150 }} class="fixed inset-be-4 inset-e-4">
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
