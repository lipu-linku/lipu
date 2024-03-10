<script lang="ts">
	import { page } from "$app/stores";
	import { cn, entries } from "$lib/utils";
	import type { NavbarLink } from "./Navbar.svelte";

	import logo from "$lib/assets/icon.png";

	export let links: Record<string, NavbarLink>;
</script>

<div class="hidden w-full md:flex md:items-center md:gap-2">
	<a href="/" class="mr-6 flex items-center space-x-2">
		<img src={logo} alt="Linku's logo" class="size-6" />
		<span class="hidden font-bold sm:inline-block">lipu Linku</span>
	</a>

	<nav class="flex items-center gap-6 text-sm">
		{#each entries(links) as [id, link] (id)}
			<a
				href={link.href}
				class={cn(
					"transition-colors hover:text-foreground/80",
					$page.url.pathname.startsWith(link.href) ? "text-foreground" : "text-foreground/60",
				)}
			>
				<svelte:component this={link.icon} class="inline-block" />
				{link.label}
			</a>
		{/each}
	</nav>

	<div class="flex-1 flex">
		<slot />
	</div>


</div>
