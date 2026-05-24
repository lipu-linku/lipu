<script lang="ts">
	import { page } from "$app/state";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Select from "$lib/components/ui/select";
	import * as Sheet from "$lib/components/ui/sheet";
	import {
		displayMethod,
		etymologiesEnabled,
		queryParamsSchema,
		sortingDirection,
		sortingMethod,
	} from "$lib/state.svelte";
	import { cn } from "$lib/utils";
	import { useDebounce } from "runed";
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

	const params = useSearchParams(queryParamsSchema);

	const displayOptions = {
		grid: { label: "Grid", icon: GridIcon },
		compact: { label: "Compact", icon: ListIcon },
	} as const satisfies Record<typeof displayMethod.current, { label: string; icon: Component }>;
	const currentDisplay = $derived(displayOptions[displayMethod.current]);

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
		navigator.clipboard.writeText(page.url.toString());
		hasCopied = true;
		setTimeout(() => (hasCopied = false), 2.5 * 1000);
	};

	// every time searchBuffer is changed, debounce is rerun.
	// only updates query after timer is able to complete.
	const debounce = useDebounce((search: string) => {
		params.q = search;
	}, 350);
</script>

<aside class="sticky inset-e-0 inset-bs-0 col-3 row-1 hidden h-dvh px-2 py-4 md:block">
	<form action="/sandbox" class="flex h-full flex-col gap-4 px-2" role="search">
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

<svelte:window onkeydown={focusSearch} />

{#snippet inputField()}
	<div class="flex items-center justify-stretch gap-2">
		<Input
			class="bg-background"
			placeholder="o alasa e nimi"
			type="search"
			name="q"
			required
			autocapitalize="off"
			autocomplete="off"
			bind:value={() => params.q ?? "", debounce}
			id="search-input"
		/>
		<Button
			aria-label="submit search"
			class="inline-flex"
			type="submit"
			variant="outline"
			size="icon"
		>
			<SearchIcon />
		</Button>
	</div>
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
			<Button class="gap-0" variant="outline" size="sm" onclick={() => params.reset()}>
				<ResetIcon aria-hidden class="mr-2 inline size-4" />
				<span>Reset Options</span>
			</Button>
		</Card.Footer>
	</Card.Root>
{/snippet}
