<script lang="ts">
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Select from "$lib/components/ui/select";
	import Switch from "$lib/components/ui/switch/switch.svelte";
	import {
		categories,
		defaultCategories,
		etymologiesEnabled,
		queryParamsSchema,
		sortingDirection,
		sortingMethod,
		writingSystem,
	} from "$lib/state.svelte";
	import { cn, keys } from "$lib/utils";
	import { useSearchParams } from "runed/kit";
	import { onDestroy, type Component } from "svelte";
	import NumberDescendingIcon from "~icons/lucide/arrow-down-1-0";
	import DescendingIcon from "~icons/lucide/arrow-down-wide-narrow";
	import AlphabetDescendingIcon from "~icons/lucide/arrow-down-z-a";
	import NumberAscendingIcon from "~icons/lucide/arrow-up-1-0";
	import AscendingIcon from "~icons/lucide/arrow-up-narrow-wide";
	import AlphabetAscendingIcon from "~icons/lucide/arrow-up-z-a";
	import SettingsIcon from "~icons/lucide/settings-2";
	import ResetIcon from "~icons/lucide/undo-2";
	import CloseIcon from "~icons/lucide/x";

	import { Toggle } from "./ui/toggle";

	let { sandbox = false } = $props();

	const params = useSearchParams(queryParamsSchema, { debounce: 150 });
	onDestroy(() => params.cleanup());

	const focusSearch = (e: KeyboardEvent) => {
		if (e.key === "/" && document.activeElement?.id !== "search-input") {
			e.preventDefault();
			document.getElementById("search-input")!.focus();
			let input = document.activeElement as HTMLInputElement;
			input?.select();
		}
	};
	const resetOptions = () => {
		params.reset();
		categories.current = defaultCategories;

		pushState(page.url, {});
	};

	const sortingOptions = {
		alphabetical: {
			label: "Alphabetical",
			ascending_icon: AlphabetAscendingIcon,
			descending_icon: AlphabetDescendingIcon,
		},
		usage: {
			label: "Usage",
			ascending_icon: NumberAscendingIcon,
			descending_icon: NumberDescendingIcon,
		},
	} as const satisfies Record<
		typeof sortingMethod.current,
		{ label: string; descending_icon: Component; ascending_icon: Component }
	>;

	const CurrentSortIcon = $derived(
		sortingOptions[sortingMethod.current][
			sortingDirection.current === "ascending" ? "ascending_icon" : "descending_icon"
		],
	);

	const sortDirectionOptions = {
		ascending: { label: "Ascending", icon: AscendingIcon },
		descending: { label: "Descending", icon: DescendingIcon },
	} as const satisfies Record<typeof sortingDirection.current, { label: string; icon: Component }>;
	const currentSortDir = $derived(sortDirectionOptions[sortingDirection.current]);
</script>

<svelte:window onkeydown={focusSearch} />

<search class="sticky inset-e-0 inset-bs-0 col-3 row-1 hidden h-dvh px-2 py-4 md:block">
	<form action="/" class="flex h-full flex-col gap-4 px-2" role="search">
		{@render inputField()}

		<Card.Root>
			<Card.Header>
				<Card.Title>Search Options</Card.Title>
			</Card.Header>

			<Card.Content class="flex flex-col gap-4">
				{@render filters()}

				{@render actionButtons()}
			</Card.Content>
		</Card.Root>
	</form>
</search>

<search class="fixed inset-s-18 inset-be-4 z-20 flex items-center gap-2 md:hidden">
	{@render inputField("h-12 dark:bg-secondary")}

	<Button
		command="show-modal"
		commandfor="words-search-options"
		variant="secondary"
		size="icon"
		class="size-12 shadow-2xl"
	>
		<SettingsIcon class="size-6" />
	</Button>

	<dialog
		id="words-search-options"
		closedby="any"
		class="fixed inset-bs-[unset] w-full max-w-full translate-0 flex-col gap-2 border-bs bg-background/80 p-4 backdrop-blur-lg transition-[translate,display,overlay] duration-200 open:flex open:translate-0 open:starting:translate-y-full"
	>
		<header class="flex items-center justify-between">
			<h1 class="text-xl">Search Options</h1>
			<Button command="close" commandfor="words-search-options" variant="ghost" size="icon"
				><CloseIcon /></Button
			>
		</header>
		<form class="flex h-full flex-col gap-4 pbs-0" role="search">
			{@render filters()}
			{@render actionButtons()}
		</form>
	</dialog>
</search>

{#snippet inputField(className?: string)}
	<Input
		class={cn("bg-background", className)}
		placeholder="o alasa e nimi"
		type="search"
		name="q"
		required
		autocapitalize="off"
		autocomplete="off"
		bind:value={params.q}
		id="search-input"
	/>
{/snippet}

{#snippet filters()}
	{#if !sandbox}
		<fieldset class="grid grid-cols-2 gap-2">
			{#each keys(categories.current) as category}
				<div
					class="flex items-center gap-2"
					style:--category-color="var(--color-category-{category})"
					style:--category-foreground-color="var(--color-category-foreground-{category})"
				>
					<Toggle
						class="
							w-full
							data-[state=on]:border-(--category-color)/30
							data-[state=on]:bg-(--category-color)!
							data-[state=on]:data-[category=core]:text-primary!"
						variant="outline"
						bind:pressed={categories.current[category]}
						data-category={category}
					>
						{category}
					</Toggle>
				</div>
			{/each}
		</fieldset>
	{/if}

	{#if !sandbox}
		<div class="flex flex-wrap items-center justify-center gap-4">
			<Label for="writing-system-switch" class="font-sitelen-seli-kiwen text-3xl"
				>sitelen+pona</Label
			>
			<Switch
				id="writing-system-switch"
				bind:checked={
					() => writingSystem.current === "sitelen_sitelen",
					(val) => (writingSystem.current = val ? "sitelen_sitelen" : "sitelen_pona")
				}
			/>
			<Label for="writing-system-switch" class="font-sitelen-sitelen-open text-3xl"
				>sitelen suwi</Label
			>
		</div>
	{/if}

	<div class="grid gap-2">
		<Select.Root type="single" bind:value={sortingMethod.current}>
			<Select.Trigger
				class={[buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-between"]}
			>
				<CurrentSortIcon />
				{sortingOptions[sortingMethod.current].label}
			</Select.Trigger>
			<Select.Content>
				{#each Object.entries(sortingOptions) as [method, { label, ascending_icon, descending_icon }] (method)}
					{const Icon = $derived(
						sortingDirection.current === "ascending" ? ascending_icon : descending_icon,
					)}
					<Select.Item value={method} {label}><Icon /> {label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Select.Root type="single" bind:value={sortingDirection.current}>
			<Select.Trigger
				class={[buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-between"]}
			>
				<currentSortDir.icon />
				{currentSortDir.label}
			</Select.Trigger>
			<Select.Content>
				{#each Object.entries(sortDirectionOptions) as [direction, { label, icon: Icon }] (direction)}
					<Select.Item value={direction} {label}><Icon /> {label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex items-center justify-center gap-2">
		<Switch
			bind:checked={etymologiesEnabled.current}
			id="show-etymologies-checkbox"
			aria-labelledby="show-etymologies-label"
		/>
		<Label id="show-etymologies-label" for="show-etymologies-checkbox">Etymologies</Label>
	</div>
{/snippet}

{#snippet actionButtons()}
	<Button class="gap-0" variant="outline" size="sm" onclick={resetOptions}>
		<ResetIcon aria-hidden class="mr-2 inline size-4" />
		<span>Reset</span>
	</Button>
{/snippet}
