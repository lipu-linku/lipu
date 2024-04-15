<script lang="ts">
	import { entries } from "$lib/utils";
	import type { NavbarLink } from "./Navbar.svelte";

	import logo from "$lib/assets/icon.png";
	import { Button } from "$lib/components/ui/button";

	export let links: Record<string, NavbarLink>;
</script>

<div class="hidden w-full md:flex md:items-center">
	<a href="/" class="flex items-center space-x-2 mr-4">
		<img src={logo} alt="Linku's logo" class="size-6" />
		<span class="hidden font-bold sm:inline-block">lipu Linku</span>
	</a>

	<nav class="flex items-center gap-1 text-sm">
		{#each entries(links) as [id, link] (id)}
			<Button
				variant="ghost"
				href={link.href}
				class="px-2 flex items-center justify-center gap-2 transition-colors text-foreground/60 hover:text-foreground/80"
			>
				<svelte:component this={link.icon} />
				{link.label}
			</Button>
		{/each}
	</nav>

	<div class="flex-1 flex">
		<slot />
	</div>
</div>
