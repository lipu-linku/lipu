<script lang="ts" context="module">
export type NavbarLink = {
	href: string;
	label: string;
	icon: typeof SvelteComponent<SvelteHTMLElements["svg"]>;
};
</script>

<script lang="ts">
import type { SvelteComponent } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

import DesktopNav from "./DesktopNav.svelte";
import MobileNav from "./MobileNav.svelte";
import { Button } from "$lib/components/ui/button";
import { mode, toggleMode } from "mode-watcher";

import InfoIcon from "~icons/lucide/info";
import DarkModeIcon from "~icons/lucide/moon";
import LightModeIcon from "~icons/lucide/sun";
import FontsIcon from "~icons/mdi/format-font";

const links: Record<string, NavbarLink> = {
	// TODO: fix the fonts page
	fonts: {
		href: "/fonts",
		label: "Fonts",
		icon: FontsIcon,
	},
} as const;
</script>

<header
	class="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-0 flex h-10 max-w-screen-2xl items-center gap-2 px-2">
		<DesktopNav links={links}>
			<slot />
		</DesktopNav>
		<MobileNav links={links}>
			<slot />
		</MobileNav>

		<Button
			class="ml-auto"
			variant="outline"
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

		<Button variant="outline" size="icon" href="/about" aria-label="About Linku">
			<InfoIcon aria-label="Information icon" />
		</Button>
	</div>
</header>
