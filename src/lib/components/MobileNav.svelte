<script lang="ts">
	import { page } from "$app/stores";
	import { cn } from "$lib/components/ui/utils";
	import { Button } from "$lib/components/ui/button";
	import * as Sheet from "$lib/components/ui/sheet";
	import Separator from "./ui/separator/separator.svelte";
	import type { NavbarLink } from "./Navbar.svelte";

	import logo from "$lib/assets/icon.png";
	import MenuIcon from "~icons/lucide/menu";
	import { entries } from "$lib/utils";

	export let links: Record<string, NavbarLink>;

	let open = false;
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="ghost"
			size="icon"
			class="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
		>
			<MenuIcon class="inline-block size-5" />
			<span class="sr-only">Toggle Menu</span>
		</Button>
	</Sheet.Trigger>

	<Sheet.Content side="bottom">
		<nav class="flex flex-col justify-center gap-4">
			<a href="/" class="flex items-center text-foreground/60" on:click={() => (open = false)}>
				<img src={logo} alt="Linku's logo" class="mr-2 size-6" />
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
						on:click={() => (open = false)}
					>
						<svelte:component this={link.icon} class="mr-2 inline-block" />
						{link.label}
					</a>
				{/each}
			</ul>

			<slot />
		</nav>
	</Sheet.Content>
</Sheet.Root>
