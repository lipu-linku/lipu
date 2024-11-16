<script lang="ts">
	import { entries } from "$lib/utils";
	import type { NavbarLink } from "./Navbar.svelte";

	import iconLight from "$lib/assets/icon-light.png";
	import iconDark from "$lib/assets/icon-dark.png";
	import { Button } from "$lib/components/ui/button";
	import { mode } from "mode-watcher";

	interface Props {
		links: Record<string, NavbarLink>;
		children?: import("svelte").Snippet;
	}

	const { links, children }: Props = $props();
</script>

<div class="hidden w-full md:flex md:items-center">
	<a href="/" class="flex items-center space-x-2 mr-4">
		{#if $mode === "dark"}
			<img src={iconDark} alt="Linku's logo" class="size-6" />
		{:else}
			<img src={iconLight} alt="Linku's logo" class="size-6" />
		{/if}
		<span class="hidden font-bold sm:inline-block">lipu Linku</span>
	</a>

	<nav class="flex items-center gap-1 text-sm">
		{#each entries(links) as [id, link] (id)}
			<Button
				variant="ghost"
				href={link.href}
				class="px-2 flex items-center justify-center gap-2 transition-colors text-foreground/60 hover:text-foreground/80"
			>
				<link.icon class="inline-block" />
				{link.label}
			</Button>
		{/each}
	</nav>

	<div class="flex-1 flex justify-end">
		{@render children?.()}
	</div>
</div>
