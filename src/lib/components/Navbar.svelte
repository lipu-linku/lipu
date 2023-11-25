<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";

	import { mode, toggleMode } from "mode-watcher";
	import type { SvelteComponent } from "svelte";
	import type { SvelteHTMLElements } from "svelte/elements";

	import icon from "$lib/assets/icon.png";
	import InfoIcon from "~icons/lucide/info";
	import DarkModeIcon from "~icons/lucide/moon";
	import LightModeIcon from "~icons/lucide/sun";
	import FontsIcon from "~icons/mdi/format-font";
	import { entries } from "$lib/utils";
	import { Separator } from "./ui/separator";

	type NavbarLink = {
		href: string;
		label: string;
		icon: typeof SvelteComponent<SvelteHTMLElements["svg"]>;
	};

	const links: Record<string, NavbarLink> = {
		fonts: {
			href: "/fonts",
			label: "Fonts",
			icon: FontsIcon,
		},
	} as const;
</script>

<nav
	class="z-10 h-16 sticky top-0 flex items-center justify-between gap-2 bg-background p-4 border-b border-b-border"
>
	<header class="max-sm:mx-auto">
		<Button class="px-3 py-3" variant="ghost" href="/">
			<h1 class="flex items-center gap-4 my-0 sm:ml-auto">
				<img src={icon} class="h-8 invert dark:invert-0" alt="lipu Linku" />
				<span class="text-current font-semibold">lipu Linku</span>
			</h1>
		</Button>
	</header>

	<Separator orientation="vertical" />

	<ul>
		{#each entries(links) as [id, link] (id)}
			<li>
				<Button class="flex items-center gap-[1ch]" variant="ghost" href={link.href}>
					<svelte:component this={link.icon} />
					<span>{link.label}</span>
				</Button>
			</li>
		{/each}
	</ul>

	<div class="flex-1 flex items-center gap-2">
		<slot />
	</div>

	<Button variant="outline" size="icon" on:click={toggleMode} aria-label="Toggle theme">
		{#if $mode === "light"}
			<DarkModeIcon />
		{:else}
			<LightModeIcon />
		{/if}
	</Button>

	<Button variant="outline" size="icon" href="/about" aria-label="About Linku">
		<InfoIcon />
	</Button>
</nav>
