<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as RadioGroup from "$lib/components/ui/radio-group";
	import { Separator } from "$lib/components/ui/separator";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";

	import { page } from "$app/stores";
	import {
		categories,
		categoriesSerializer,
		etymologiesEnabled,
		favorites,
		onlyFavorites,
		searchQuery,
		writingSystem,
	} from "$lib/state.svelte";
	import { cn, keys } from "$lib/utils";
	import { pushState } from "$app/navigation";

	import CheckIcon from "~icons/lucide/check";
	import CategoriesIcon from "~icons/lucide/layout-dashboard";
	import LinkIcon from "~icons/lucide/link";
	import WritingSystemIcon from "~icons/lucide/pen-tool";
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
		const url = new URL($page.url);
		url.searchParams.set("q", searchQuery.value);

		navigator.clipboard.writeText(url.toString());
		hasCopied = true;
		setTimeout(() => (hasCopied = false), 2.5 * 1000);
	};

	const clearQuery = () => {
		$page.url.searchParams.delete("q");
		pushState($page.url, {});
	};

	const resetOptions = () => {
		searchQuery.value = "";
		onlyFavorites.reset();

		$page.url.searchParams.forEach((v, k, params) => params.delete(k, v));
		pushState($page.url, {});
	};

	$effect(() => {
		if (searchQuery.value === "" && $page.url.searchParams.has("q")) clearQuery();
	});

	$effect(() => {
		if (favorites.value.size === 0) onlyFavorites.value = false;
	});
</script>

<svelte:window onkeydown={focusSearch} />

<aside class="sticky top-0 end-0 h-dvh px-2 py-4">
	<form class="h-full px-2 gap-2 flex flex-col" role="search">
		<div class="flex items-center justify-stretch gap-2">
			<Input
				class="bg-background"
				placeholder="o alasa e nimi"
				type="search"
				name="q"
				required
				autocapitalize="off"
				autocomplete="off"
				bind:value={searchQuery.value}
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

		<Card.Root>
			<Card.Header>
				<Card.Title>Search Options</Card.Title>
			</Card.Header>

			<Card.Content class="flex flex-col gap-4">
				<div class="grid gap-2">
					<div class="flex items-center gap-2">
						<Checkbox
							bind:checked={etymologiesEnabled.value}
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
							favorites.value.size === 0 && "cursor-not-allowed",
						)}
					>
						<Checkbox
							bind:checked={onlyFavorites.value}
							disabled={favorites.value.size === 0}
							title={favorites.value.size === 0 ? "Select at least 1 favorite" : undefined}
							id="only-favorites-checkbox"
							aria-labelledby="only-favorites-label"
						/>
						<Label
							title={favorites.value.size === 0 ? "Select at least 1 favorite" : undefined}
							id="only-favorites-label"
							for="only-favorites-checkbox">Only Show Favorites</Label
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
	</form>
</aside>
