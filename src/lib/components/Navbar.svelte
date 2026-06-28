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
	import { displayMethod, useLocale } from "$lib/state.svelte";
	import { cn, entries } from "$lib/utils";
	import { mode, toggleMode } from "mode-watcher";
	import { SvelteMap } from "svelte/reactivity";
	import DictionaryIcon from "~icons/lucide/book-text";
	import FlaskIcon from "~icons/lucide/flask-conical";
	import InfoIcon from "~icons/lucide/info";
	import LanguagesIcon from "~icons/lucide/languages";
	import GridIcon from "~icons/lucide/layout-grid";
	import ListIcon from "~icons/lucide/list";
	import MenuIcon from "~icons/lucide/menu";
	import DarkModeIcon from "~icons/lucide/moon";
	import LightModeIcon from "~icons/lucide/sun";
	import FontsIcon from "~icons/mdi/format-font";
	import ToolsIcon from "~icons/mdi/wrench-outline";

	const lang = useLocale();

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
		// Update the reactive locale first so the UI and data queries switch
		// immediately, then persist the choice to the cookie for future SSR.
		lang.current = value;
		await updateLocale(value);
	};

	const displayOptions = {
		grid: { label: "Grid", icon: GridIcon },
		compact: { label: "Compact", icon: ListIcon },
	} as const satisfies Record<typeof displayMethod.current, { label: string; icon: Component }>;
	const currentDisplay = $derived(displayOptions[displayMethod.current]);
</script>

<aside class="sticky inset-s-0 inset-bs-0 hidden h-dvh flex-col gap-6 px-4 py-5 md:flex">
	{@render sidebar()}
</aside>

<Button
	command="show-modal"
	commandfor="navbar"
	size="icon"
	class="fixed inset-s-4 inset-be-4 z-20 size-12 shadow-2xl md:hidden"
>
	<MenuIcon class="size-6" />
</Button>

<dialog
	id="navbar"
	closedby="any"
	class="fixed inset-bs-[unset] w-full max-w-full translate-0 flex-col gap-2 border-bs bg-background/80 p-4 backdrop-blur-lg transition-[translate,display,overlay] duration-200 open:flex open:translate-0 open:starting:translate-y-full"
>
	{@render sidebar()}
</dialog>

{#snippet sidebar()}
	<header class="flex items-center gap-2 md:px-0">
		{#if mode.current === "dark"}
			<img src={iconDark} alt="Linku's logo" class="size-6" />
		{:else}
			<img src={iconLight} alt="Linku's logo" class="size-6" />
		{/if}
		<span class="inline-block font-bold">lipu Linku</span>
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

	<div class="mt-auto grid grid-cols-[1fr_auto] items-center gap-2 ps-2 md:ps-0">
		<Select.Root type="single" bind:value={displayMethod.current}>
			<Select.Trigger
				class={[
					buttonVariants({ variant: "outline", size: "sm" }),
					"col-span-2 w-full justify-between",
				]}
			>
				<currentDisplay.icon />
				{currentDisplay.label}
			</Select.Trigger>
			<Select.Content>
				{#each Object.entries(displayOptions) as [method, { label, icon: Icon }] (method)}
					<Select.Item value={method} {label}><Icon /> {label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<Select.Root type="single" bind:value={() => lang.current, setLocale}>
			<Select.Trigger
				class={[buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-between"]}
			>
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
