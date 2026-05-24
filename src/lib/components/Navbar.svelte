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
	import iconDark from "$lib/assets/icon-dark.png";
	import iconLight from "$lib/assets/icon-light.png";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Select from "$lib/components/ui/select";
	import * as Sheet from "$lib/components/ui/sheet";
	import { getLocales, updateLocale } from "$lib/remote/lang.remote";
	import { lang } from "$lib/state.svelte";
	import { cn, entries } from "$lib/utils";
	import { mode, toggleMode } from "mode-watcher";
	import { SvelteMap } from "svelte/reactivity";
	import DictionaryIcon from "~icons/lucide/book-text";
	import FlaskIcon from "~icons/lucide/flask-conical";
	import InfoIcon from "~icons/lucide/info";
	import LanguagesIcon from "~icons/lucide/languages";
	import MenuIcon from "~icons/lucide/menu";
	import DarkModeIcon from "~icons/lucide/moon";
	import LightModeIcon from "~icons/lucide/sun";
	import FontsIcon from "~icons/mdi/format-font";
	import ToolsIcon from "~icons/mdi/wrench-outline";

	const locales = await getLocales();

	const localeOptions = $derived(
		new SvelteMap(
			Object.entries(locales).map(
				([id, locale]) => [id, locale.name.endonym ?? locale.name.en] as const,
			),
		),
	);

	const links: Record<string, NavbarLink> = {
		home: {
			href: "/",
			label: "Dictionary",
			icon: DictionaryIcon,
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

	const setLocale = async (value: string) => {
		await updateLocale(value);
		lang.current = value;
	};
</script>

<aside class="sticky inset-s-0 inset-bs-0 hidden h-dvh flex-col gap-6 px-4 py-5 md:flex">
	{@render sidebar()}
</aside>

<Sheet.Root>
	<Sheet.Trigger
		class={cn(
			buttonVariants({ size: "icon" }),
			"fixed inset-s-4 inset-be-4 z-20 size-12 shadow-2xl md:hidden",
		)}
	>
		<MenuIcon class="size-6" />
	</Sheet.Trigger>

	<Sheet.Content
		class="bg-background/60 p-4 backdrop-blur-md data-[state=open]:duration-300"
		side="bottom"
	>
		<aside class="flex h-full flex-col gap-6 md:hidden">
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
			<span class="inline-block font-bold">lipu Linku</span>
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

	<div class="mt-auto flex items-center justify-between gap-2 ps-2 md:ps-0">
		<Select.Root type="single" bind:value={() => lang.current, setLocale}>
			<Select.Trigger>
				<LanguagesIcon aria-label="Languages icon" class="text-4" />
				<span class="line-clamp-1 w-16 text-center text-ellipsis whitespace-nowrap">
					{localeOptions.get(lang.current)}
				</span>
			</Select.Trigger>

			<Select.Content class="mx-4 max-h-[80dvh]" side="top">
				{#each localeOptions as [value, label] (value)}
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
