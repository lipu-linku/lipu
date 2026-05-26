<script lang="ts">
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as RadioGroup from "$lib/components/ui/radio-group";
	import * as Select from "$lib/components/ui/select";
	import * as Sheet from "$lib/components/ui/sheet";
	import {
		categories,
		categoriesCodec,
		defaultCategories,
		displayMethod,
		etymologiesEnabled,
		queryParamsSchema,
		sortingDirection,
		sortingMethod,
		writingSystem,
	} from "$lib/state.svelte";
	import { cn, keys } from "$lib/utils";
	import { useSearchParams } from "runed/kit";
	import type { Component } from "svelte";
	import NumberDescendingIcon from "~icons/lucide/arrow-down-1-0";
	import DescendingIcon from "~icons/lucide/arrow-down-wide-narrow";
	import AlphabetDescendingIcon from "~icons/lucide/arrow-down-z-a";
	import NumberAscendingIcon from "~icons/lucide/arrow-up-1-0";
	import AscendingIcon from "~icons/lucide/arrow-up-narrow-wide";
	import AlphabetAscendingIcon from "~icons/lucide/arrow-up-z-a";
	import CheckIcon from "~icons/lucide/check";
	import GridIcon from "~icons/lucide/layout-grid";
	import LinkIcon from "~icons/lucide/link";
	import ListIcon from "~icons/lucide/list";
	import SearchIcon from "~icons/lucide/search";
	import ResetIcon from "~icons/lucide/undo-2";

	let { sandbox = false } = $props();

	const params = useSearchParams(queryParamsSchema, { debounce: 150 });
	$effect(() => () => params.cleanup());

	const focusSearch = (e: KeyboardEvent) => {
		if (e.key === "/" && document.activeElement?.id !== "search-input") {
			e.preventDefault();
			document.getElementById("search-input")!.focus();
			let input = document.activeElement as HTMLInputElement;
			input?.select();
		}
	};

	let hasCopied = $state(false);
	const copyLinkWithParams = () => {
		const url = new URL(page.url);

		navigator.clipboard.writeText(url.toString());
		hasCopied = true;
		setTimeout(() => (hasCopied = false), 2.5 * 1000);
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

	const displayOptions = {
		grid: { label: "Grid", icon: GridIcon },
		compact: { label: "Compact", icon: ListIcon },
	} as const satisfies Record<typeof displayMethod.current, { label: string; icon: Component }>;
	const currentDisplay = $derived(displayOptions[displayMethod.current]);
</script>

<svelte:window onkeydown={focusSearch} />

<aside class="sticky inset-e-0 inset-bs-0 col-3 row-1 hidden h-dvh px-2 py-4 md:block">
	<form action="/" class="flex h-full flex-col gap-4 px-2" role="search">
		{@render inputField()}

		{@render filters()}
	</form>
</aside>

<Sheet.Root>
	<Sheet.Trigger
		class={cn(
			buttonVariants({ variant: "secondary", size: "icon" }),
			"fixed inset-s-18 inset-be-4 z-20 size-12 shadow-2xl md:hidden",
		)}
	>
		<SearchIcon class="size-6" />
	</Sheet.Trigger>

	<Sheet.Content side="bottom" class="p-4 pt-12">
		<form class="flex h-full flex-col gap-4 px-2" role="search">
			{@render inputField()}

			{@render filters()}
		</form>
	</Sheet.Content>
</Sheet.Root>

{#snippet inputField()}
	<search>
		<Input
			class="bg-background"
			placeholder="o alasa e nimi"
			type="search"
			name="q"
			required
			autocapitalize="off"
			autocomplete="off"
			bind:value={params.q}
			id="search-input"
		/>
	</search>
{/snippet}

{#snippet filters()}
	<Card.Root>
		<Card.Header>
			<Card.Title>Search Options</Card.Title>
		</Card.Header>

		<Card.Content class="flex flex-col gap-4">
			<Select.Root type="single" bind:value={displayMethod.current}>
				<Select.Trigger
					class={[buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-between"]}
				>
					<currentDisplay.icon />
					{currentDisplay.label}
				</Select.Trigger>
				<Select.Content>
					{#each Object.entries(displayOptions) as [method, { label, icon: Icon }] (method)}
						<Select.Item value={method}><Icon /> {label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			{#if !sandbox}
				<fieldset class="flex flex-col gap-1">
					<div class="grid gap-2">
						{#each keys(categories.current) as category}
							<div
								class="flex items-center gap-2"
								style:--category-color="var(--color-category-{category})"
								style:--category-foreground-color="var(--color-category-foreground-{category})"
							>
								<Checkbox
									class="
									data-[state=checked]:border-(--category-color)/30 
									data-[state=checked]:bg-(--category-color)!
									data-[state=checked]:data-[category=core]:text-primary!"
									bind:checked={categories.current[category]}
									id="category-checkbox-{category}"
									aria-labelledby="category-checkbox-{category}-label"
									data-category={category}
								/>
								<Label
									class="text-(--category-foreground-color)"
									id="category-checkbox-{category}-label"
									for="category-checkbox-{category}"
								>
									{category}
								</Label>
							</div>
						{/each}
					</div>
				</fieldset>
			{/if}

			{#if !sandbox}
				<RadioGroup.Root
					class={page.route.id === "/words/[word]" ? "pointer-events-none opacity-50" : undefined}
					bind:value={writingSystem.current}
				>
					<div class="flex items-center gap-2">
						<RadioGroup.Item
							disabled={page.route.id === "/words/[word]"}
							value="sitelen_pona"
							id="sitelen-pona-radio"
						/>
						<Label for="sitelen-pona-radio">sitelen pona</Label>
					</div>
					<div class="flex items-center gap-2">
						<RadioGroup.Item
							disabled={page.route.id === "/words/[word]"}
							value="sitelen_sitelen"
							id="sitelen-sitelen-radio"
						/>
						<Label for="sitelen-sitelen-radio">sitelen sitelen</Label>
					</div>
				</RadioGroup.Root>
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
							{@const Icon =
								sortingDirection.current === "ascending" ? ascending_icon : descending_icon}
							<Select.Item value={method}><Icon /> {label}</Select.Item>
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
							<Select.Item value={direction}><Icon /> {label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex items-center gap-2">
				<Checkbox
					bind:checked={etymologiesEnabled.current}
					id="show-etymologies-checkbox"
					aria-labelledby="show-etymologies-label"
				/>
				<Label id="show-etymologies-label" for="show-etymologies-checkbox">Show Etymologies</Label>
			</div>
		</Card.Content>

		<Card.Footer class="grid grid-rows-2 gap-2">
			<Button class="gap-0" variant="outline" size="sm" onclick={copyLinkWithParams}>
				{#snippet children()}
					{@const Icon = !hasCopied ? LinkIcon : CheckIcon}
					<Icon aria-hidden class="mr-2 inline size-4" />
					<span>Copy Permalink</span>
				{/snippet}
			</Button>
			<Button class="gap-0" variant="outline" size="sm" onclick={resetOptions}>
				<ResetIcon aria-hidden class="mr-2 inline size-4" />
				<span>Reset Options</span>
			</Button>
		</Card.Footer>

		<input type="hidden" name="categories" value={categoriesCodec.encode(categories.current)} />
	</Card.Root>
{/snippet}
