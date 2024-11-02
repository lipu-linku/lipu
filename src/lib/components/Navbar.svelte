<script lang="ts" module>
	import type { Component } from "svelte";
	import type { SvelteHTMLElements } from "svelte/elements";

	export type NavbarLink = {
		href: string;
		label: string;
		icon: Component<SvelteHTMLElements["svg"]>;
	};
</script>

<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { Language, Languages } from "@kulupu-linku/sona";
	import { mode, toggleMode } from "mode-watcher";
	import DesktopNav from "./DesktopNav.svelte";
	import LanguageSwitch from "./LanguageSwitch.svelte";
	import MobileNav from "./MobileNav.svelte";

	import FlaskIcon from "~icons/lucide/flask-conical";
	import HomeIcon from "~icons/lucide/home";
	import InfoIcon from "~icons/lucide/info";
	import DarkModeIcon from "~icons/lucide/moon";
	import LightModeIcon from "~icons/lucide/sun";
	import FontsIcon from "~icons/mdi/format-font";

	interface Props {
		languages: Languages;
		language: Language;
		children?: import("svelte").Snippet;
	}

	const { languages, language, children }: Props = $props();

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
	<div class="flex h-10 gap-2">
		<DesktopNav {links}>
			{@render children?.()}

			<LanguageSwitch selected={language.id} localeList={languages} />
		</DesktopNav>
		<MobileNav {links}>
			{@render children?.()}
			
			<LanguageSwitch selected={language.id} localeList={languages} />
		</MobileNav>

		<Button
			class="ml-auto"
			variant="ghost"
			size="icon"
			onclick={toggleMode}
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
