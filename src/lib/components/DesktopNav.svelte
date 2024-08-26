<script lang="ts">
	import { entries } from "$lib/utils";
	import type { NavbarLink } from "./Navbar.svelte";
	import { m } from "$lib/paraglide";

	import iconLight from "$lib/assets/icon-light.png";
	import iconDark from "$lib/assets/icon-dark.png";
	import { Button } from "$lib/components/ui/button";
	import { mode } from "mode-watcher";

	export let links: Record<string, NavbarLink>;
</script>

<div class="hidden w-full md:flex md:items-center">
	<a href="/" class="flex items-center space-x-2 mr-4">
		<img src={$mode === "dark" ? iconDark : iconLight} alt={m.logo_alt()} class="size-6" />
		<span class="hidden font-bold sm:inline-block">lipu Linku</span>
	</a>

	<nav class="flex items-center gap-1 text-sm">
		{#each entries(links) as [id, link] (id)}
			<Button
				variant="ghost"
				href={link.href}
				class="px-2 flex items-center justify-center gap-2 transition-colors text-foreground/60 hover:text-foreground/80"
			>
				<svelte:component this={link.icon} class="inline-block" />
				{link.label}
			</Button>
		{/each}
	</nav>

	<div class="flex-1 flex">
		<slot />
	</div>
</div>
