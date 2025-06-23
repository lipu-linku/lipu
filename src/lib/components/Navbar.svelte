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
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Select from "$lib/components/ui/select";
	import type { Language, Languages } from "@kulupu-linku/sona";
	import { mode, toggleMode } from "mode-watcher";

	import iconDark from "$lib/assets/icon-dark.png";
	import iconLight from "$lib/assets/icon-light.png";
	import { cn, entries } from "$lib/utils";
	import MenuIcon from "~icons/lucide/menu";
	import FlaskIcon from "~icons/lucide/flask-conical";
	import HomeIcon from "~icons/lucide/house";
	import InfoIcon from "~icons/lucide/info";
	import LanguagesIcon from "~icons/lucide/languages";
	import DarkModeIcon from "~icons/lucide/moon";
	import LightModeIcon from "~icons/lucide/sun";
	import FontsIcon from "~icons/mdi/format-font";
	import ToolsIcon from "~icons/mdi/wrench-outline";

	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import * as Sheet from "$lib/components/ui/sheet";

	interface Props {
		languages: Languages;
		language: Language;
	}

	const { languages, language }: Props = $props();

	const languageOptions = $derived(
		new Map(
			Object.entries(languages).map(
				([id, lang]) => [id, lang.name.endonym ?? lang.name.en] as const,
			),
		),
	);
	let selectedLang = $state(language.id);

	const links: Record<string, NavbarLink> = {
		home: {
			href: "/",
			label: "Home",
			icon: HomeIcon,
		},
		sandbox: {
			href: "/sandbox",
			label: "Sandbox",
			icon: FlaskIcon,
		},
		fonts: {
			href: "/fonts",
			label: "Fonts",
			icon: FontsIcon,
		},
		tools: {
			href: "/tools",
			label: "Tools",
			icon: ToolsIcon,
		},
		about: {
			href: "/about",
			label: "About",
			icon: InfoIcon,
		},
	} as const;
</script>

<aside class="sticky top-0 start-0 h-dvh px-4 py-5 flex-col gap-6 hidden md:flex">
	{@render sidebar()}
</aside>

<Sheet.Root>
	<Sheet.Trigger
		class={cn(
			buttonVariants({ size: "icon" }),
			"fixed z-20 bottom-4 left-4 size-12 shadow-2xl md:hidden",
		)}
	>
		<MenuIcon class="size-6" />
	</Sheet.Trigger>

	<Sheet.Content class="bg-background/60 backdrop-blur-md p-4" side="bottom">
		<aside class="h-full flex-col gap-6 flex md:hidden">
			{@render sidebar()}
		</aside>
	</Sheet.Content>
</Sheet.Root>

{#snippet sidebar()}
	<header>
		<a href="/" class="flex items-center gap-2 px-2 md:px-0">
			{#if mode.current === "dark"}
				<img src={iconDark} alt="Linku's logo" class="size-6" />
			{:else}
				<img src={iconLight} alt="Linku's logo" class="size-6" />
			{/if}
			<span class="font-bold inline-block">lipu Linku</span>
		</a>
	</header>

	<nav>
		<ul>
			{#each entries(links) as [id, link] (id)}
				<li>
					<Button
						variant="link"
						class="w-full justify-start p-0 md:has-[>svg]:px-0"
						href={link.href}
					>
						<link.icon />
						{link.label}
					</Button>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="mt-auto flex items-center justify-between ps-2 md:ps-0 gap-2">
		<Select.Root
			type="single"
			bind:value={selectedLang}
			onValueChange={(item) => {
				if (item) {
					localStorage.setItem("lang", item);
					const url = new URL(page.url);
					url.searchParams.set("lang", item);
					goto(url);
				}
			}}
		>
			<Select.Trigger>
				<LanguagesIcon aria-label="Languages icon" class="text-4" />
				<span class="w-16 text-center line-clamp-1 overflow-ellipsis whitespace-nowrap">
					{languageOptions.get(selectedLang)}
				</span>
			</Select.Trigger>

			<Select.Content class="max-h-[80dvh] mx-4" side="top">
				{#each languageOptions as [value, label] (value)}
					<Select.Item {label} {value}>{label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<Button variant="default" size="icon" aria-label="Open theme menu" onclick={toggleMode}>
			{#if mode.current === "light"}
				<LightModeIcon />
			{:else}
				<DarkModeIcon />
			{/if}
		</Button>
	</div>
{/snippet}
