<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Input } from "$lib/components/ui/input";

	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import {
		categories,
		categoriesSerializer,
		defaultCategories,
		searchQuery,
		writingSystem,
	} from "$lib/state";
	import { cn, keys } from "$lib/utils";

	import { pushState } from "$app/navigation";
	import CheckIcon from "~icons/lucide/check";
	import CategoriesIcon from "~icons/lucide/layout-dashboard";
	import LinkIcon from "~icons/lucide/link";
	import WritingSystemIcon from "~icons/lucide/pen-tool";
	import SearchIcon from "~icons/lucide/search";
	import SettingsIcon from "~icons/lucide/settings";
	import ResetIcon from "~icons/lucide/undo-2";

	let className = "";
	export { className as class };

	const focusSearch = (e: KeyboardEvent) => {
		if (e.key === "/" && document.activeElement?.id !== "search-input") {
			e.preventDefault();
			document.getElementById("search-input")!.focus();
		}
	};

	let hasCopied = false;
	const copyLinkWithParams = () => {
		const url = new URL($page.url);
		url.searchParams.set("categories", JSON.stringify($categories));
		url.searchParams.set("q", $searchQuery);

		navigator.clipboard.writeText(url.toString());
		hasCopied = true;
	};

	$: {
		if (hasCopied) {
			setTimeout(() => (hasCopied = false), 2.5 * 1000);
		}
	}

	$: if ($searchQuery === "" && $page.url.searchParams.has("q")) clearQuery();

	const clearQuery = () => {
		$searchQuery = "";
		$page.url.searchParams.delete("q");
		if (browser) pushState($page.url, {});
	};

	const resetOptions = () => {
		$searchQuery = "";
		$categories = defaultCategories;

		$page.url.searchParams.forEach((v, k, params) => params.delete(k, v));
		if (browser) pushState($page.url, {});
	};
</script>

<svelte:window on:keydown={focusSearch} />

<form class={cn("px-2 md:mx-auto md:justify-center items-center gap-2", className)} role="search">
	<Input
		class="w-auto bg-background flex-1 md:flex-none"
		placeholder="o alasa e nimi"
		type="search"
		name="q"
		required
		autocapitalize="off"
		autocomplete="off"
		bind:value={$searchQuery}
		id="search-input"
	/>

	<div class="flex items-center justify-center gap-2">
		<DropdownMenu.Root closeOnItemClick={false} preventScroll={false}>
			<DropdownMenu.Trigger asChild let:builder>
				<Button
					form=""
					builders={[builder]}
					variant="outline"
					size="icon"
					aria-label="Search Options"
				>
					<SettingsIcon aria-label="Settings icon" />
				</Button>
			</DropdownMenu.Trigger>
			<!-- this is some absolute positioning fuckery to get the dropdown to be centered -->
			<DropdownMenu.Content class="max-md:!inset-x-0 max-md:mx-auto w-[90vw] md:w-auto">
				<DropdownMenu.Label class="text-center">Search Options</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Label>
						<CategoriesIcon aria-label="Categories icon" class="mr-1 inline size-4" />
						<span>Usage Categories</span>
					</DropdownMenu.Label>
					{#each keys($categories) as category}
						<DropdownMenu.CheckboxItem bind:checked={$categories[category]}>
							{category}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Label
						class={$page.route.id === "/(words)/words/[word]"
							? `pointer-events-none opacity-50`
							: ""}
					>
						<WritingSystemIcon aria-label="Fountain pen icon" class="mr-1 inline size-4" />
						<span>Writing System</span>
					</DropdownMenu.Label>
					<DropdownMenu.RadioGroup bind:value={$writingSystem}>
						<DropdownMenu.RadioItem
							disabled={$page.route.id === "/(words)/words/[word]"}
							value="sitelen_pona"
						>
							sitelen pona
						</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem
							disabled={$page.route.id === "/(words)/words/[word]"}
							value="sitelen_sitelen"
						>
							sitelen sitelen
						</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="font-semibold" on:click={copyLinkWithParams}>
					<svelte:component
						this={!hasCopied ? LinkIcon : CheckIcon}
						aria-hidden
						class="mr-2 inline size-4"
					/>
					<span>Copy Permalink</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="font-semibold" on:click={resetOptions}>
					<ResetIcon aria-hidden class="mr-2 inline size-4" />
					<span>Reset Options</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<input type="hidden" name="categories" value={categoriesSerializer.stringify($categories)} />

		<Button aria-label="submit search" class="inline-flex" type="submit" variant="outline" size="icon">
			<SearchIcon />
		</Button>
	</div>
</form>
