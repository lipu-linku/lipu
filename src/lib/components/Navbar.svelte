<script lang="ts" context="module">
	import type { SvelteComponent } from "svelte";
	import type { SvelteHTMLElements } from "svelte/elements";

	export type NavbarLink = {
		href: string;
		label: string;
		icon: typeof SvelteComponent<SvelteHTMLElements["svg"]>;
	};
</script>

<script lang="ts">
	import LanguageSwitch from "./LanguageSwitch.svelte";
	import DesktopNav from "./DesktopNav.svelte";
	import MobileNav from "./MobileNav.svelte";
	import { Button } from "$lib/components/ui/button";
	import { mode, toggleMode } from "mode-watcher";
	import type { Language, Languages } from "@kulupu-linku/sona";

	import HomeIcon from "~icons/lucide/home";
	import FontsIcon from "~icons/mdi/format-font";
	import FlaskIcon from "~icons/lucide/flask-conical";
	import InfoIcon from "~icons/lucide/info";
	import DarkModeIcon from "~icons/lucide/moon";
	import LightModeIcon from "~icons/lucide/sun";

	export let languages: Languages;
	export let language: Language;

	const links: Record<string, NavbarLink> = {
		home: {
			href: "/",
			label: "Home",
			icon: HomeIcon,
		},
		fonts: {
			href: "/fonts",
			label: "Fonts",
			icon: FontsIcon,
		},
		sandbox: {
			href: "/sandbox",
			label: "Sandbox",
			icon: FlaskIcon,
		},
		about: {
			href: "/about",
			label: "About",
			icon: InfoIcon,
		},
	} as const;
</script>

<header
	class="md:sticky top-0 z-50 md:border-b border-border/40 bg-background/95 p-4 pb-0 md:pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto flex h-10 items-center gap-2 px-0 md:px-2">
		<DesktopNav {links}>
			<slot />

			<LanguageSwitch triggerClass="ml-auto" selected={language.id} localeList={languages} />
		</DesktopNav>
		<MobileNav {links}>
			<slot />

			<LanguageSwitch selected={language.id} localeList={languages} />
		</MobileNav>

		<Button
			class="ml-auto"
			variant="ghost"
			size="icon"
			on:click={toggleMode}
			aria-label="Toggle theme"
		>
			{#if $mode === "light"}
				<DarkModeIcon aria-label="Moon icon" />
			{:else}
				<LightModeIcon aria-label="Sun icon" />
			{/if}
		</Button>
	</div>
</header>
