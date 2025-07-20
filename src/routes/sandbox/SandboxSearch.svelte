<script lang="ts">
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { etymologiesEnabled, favorites, onlyFavorites, queryParams } from "$lib/state.svelte";
	import { cn } from "$lib/utils";
	import * as Sheet from "$lib/components/ui/sheet";

	import CheckIcon from "~icons/lucide/check";
	import LinkIcon from "~icons/lucide/link";
	import SearchIcon from "~icons/lucide/search";
	import ResetIcon from "~icons/lucide/undo-2";

	const focusSearch = (e: KeyboardEvent) => {
		if (e.key === "/" && document.activeElement?.id !== "search-input") {
			e.preventDefault();
			document.getElementById("search-input")!.focus();
		}
	};

	let hasCopied = $state(false);
	const copyLinkWithParams = () => {
		navigator.clipboard.writeText(page.url.toString());
		hasCopied = true;
		setTimeout(() => (hasCopied = false), 2.5 * 1000);
	};

	const clearQuery = () => {
		queryParams.q = null;
	};

	const resetOptions = () => {
		clearQuery();
		onlyFavorites.current = false;

		page.url.searchParams.forEach((v, k, params) => params.delete(k, v));
		pushState(page.url, {});
	};

	$effect(() => {
		if (queryParams.q === "") clearQuery();
	});
</script>

<aside class="col-3 row-1 sticky top-0 end-0 h-dvh px-2 py-4 hidden md:block">
	<form action="/sandbox" class="h-full px-2 gap-4 flex flex-col" role="search">
		{@render inputField()}

		{@render filters()}
	</form>
</aside>

<Sheet.Root>
	<Sheet.Trigger
		class={cn(
			buttonVariants({ variant: "secondary", size: "icon" }),
			"fixed md:hidden size-12 z-20 bottom-4 left-18 shadow-2xl",
		)}
	>
		<SearchIcon class="size-6" />
	</Sheet.Trigger>

	<Sheet.Content side="bottom" class="p-4 pt-12">
		<form class="h-full px-2 gap-4 flex flex-col" role="search">
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
			autofocus
			bind:value={queryParams.q}
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
			<div class="grid gap-2">
				<div class="flex items-center gap-2">
					<Checkbox
						bind:checked={etymologiesEnabled.current}
						id="show-etymologies-checkbox"
						aria-labelledby="show-etymologies-label"
					/>
					<Label id="show-etymologies-label" for="show-etymologies-checkbox">
						Show Etymologies
					</Label>
				</div>
				<div
					class={cn(
						"flex items-center gap-2",
						favorites.current.length === 0 && "cursor-not-allowed",
					)}
				>
					<Checkbox
						bind:checked={onlyFavorites.current}
						disabled={favorites.current.length === 0}
						title={favorites.current.length === 0 ? "Select at least 1 favorite" : undefined}
						id="only-favorites-checkbox"
						aria-labelledby="only-favorites-label"
					/>
					<Label
						title={favorites.current.length === 0 ? "Select at least 1 favorite" : undefined}
						id="only-favorites-label"
						for="only-favorites-checkbox">Only Favorites</Label
					>
				</div>
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
	</Card.Root>
{/snippet}
