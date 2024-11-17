<script lang="ts">
	import { page } from "$app/stores";
	import { cn, entries } from "$lib/utils";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Sheet from "$lib/components/ui/sheet";
	import Separator from "./ui/separator/separator.svelte";
	import type { NavbarLink } from "./Navbar.svelte";

	import iconLight from "$lib/assets/icon-light.png";
	import iconDark from "$lib/assets/icon-dark.png";
	import MenuIcon from "~icons/lucide/menu";
	import { mode } from "mode-watcher";
	import type { Snippet } from "svelte";

	interface Props {
		links: Record<string, NavbarLink>;
		children: Snippet;
	}

	const { links, children }: Props = $props();

	let open = $state(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger
		class={cn(
			buttonVariants({ variant: "ghost", size: "icon" }),
			"mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden",
		)}
	>
		<MenuIcon class="size-5 inline-block" />
		<span class="sr-only">Toggle Menu</span>
	</Sheet.Trigger>

	<Sheet.Content side="bottom">
		<nav class="flex flex-col justify-center gap-4">
			<a
				href="/"
				class="flex gap-[1ch] items-center text-foreground/60"
				onclick={() => (open = false)}
			>
				{#if $mode === "dark"}
					<img src={iconDark} alt="Linku's logo" class="size-6" />
				{:else}
					<img src={iconLight} alt="Linku's logo" class="size-6" />
				{/if}
				<span class="font-bold">lipu Linku</span>
			</a>

			<Separator orientation="horizontal" />

			<ul class="flex flex-col gap-4">
				{#each entries(links) as [id, link] (id)}
					<a
						href={link.href}
						class={cn(
							$page.url.pathname.startsWith(link.href) ? "text-foreground" : "text-foreground/60",
							"flex items-center",
						)}
						onclick={() => (open = false)}
					>
						<link.icon class="inline-block mr-2" />
						{link.label}
					</a>
				{/each}
			</ul>

			{@render children()}
		</nav>
	</Sheet.Content>
</Sheet.Root>
