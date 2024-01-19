<script lang="ts">
	import { page } from "$app/stores";

	import LanguageSwitch from "$lib/components/LanguageSwitch.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		DropdownMenu,
		DropdownMenuCheckboxItem,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuRadioGroup,
		DropdownMenuRadioItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu";
	import { Input } from "$lib/components/ui/input";
	import { categories, defaultCategories, searchQuery, writingSystem } from "$lib/state";
	import { keys } from "$lib/utils";

	import CheckIcon from "~icons/lucide/check";
	import CategoriesIcon from "~icons/lucide/layout-dashboard";
	import LinkIcon from "~icons/lucide/link";
	import WritingSystemIcon from "~icons/lucide/pen-tool";
	import SearchIcon from "~icons/lucide/search";
	import SettingsIcon from "~icons/lucide/settings";
	import ResetIcon from "~icons/lucide/undo-2";

	export let data;
	$: ({
		linku: { languages },
	} = data);

	const focusSearch = (e: KeyboardEvent) => {
		if (e.key === "/" && document.activeElement?.id !== "search-input") {
			e.preventDefault();
			document.getElementById("search-input")!.focus();
		}
	};

	let hasCopied = false;
	const copyLinkWithParams = () => {
		const url = $page.url;
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

	const resetOptions = () => {
		$searchQuery = "";
		$categories = defaultCategories;
	};
</script>

<svelte:window on:keydown={focusSearch} />

<Navbar>
	<form class="ml-auto flex items-center gap-2 flex-1" role="search" action="/?/search">
		<Input
			class="w-auto mx-auto"
			placeholder="o lukin e nimi"
			type="search"
			name="q"
			required
			autocapitalize="off"
			autocomplete="off"
			bind:value={$searchQuery}
			id="search-input"
		/>

		<DropdownMenu closeOnItemClick={false} preventScroll={false}>
			<DropdownMenuTrigger asChild let:builder>
				<Button
					form=""
					builders={[builder]}
					variant="outline"
					size="icon"
					aria-label="Search Options"
				>
					<SettingsIcon />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuLabel class="text-center">Search Options</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<CategoriesIcon class="inline mr-1 size-4" />
						<span>Usage Categories</span>
					</DropdownMenuLabel>

					{#each keys($categories) as category}
						<DropdownMenuCheckboxItem bind:checked={$categories[category]}>
							{category}
						</DropdownMenuCheckboxItem>
					{/each}
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuLabel
						class={$page.route.id === "/(words)/words/[word]"
							? `opacity-50 pointer-events-none`
							: ""}
					>
						<WritingSystemIcon class="inline mr-1 size-4" />
						<span>Writing System</span>
					</DropdownMenuLabel>

					<DropdownMenuRadioGroup bind:value={$writingSystem}>
						<DropdownMenuRadioItem
							disabled={$page.route.id === "/(words)/words/[word]"}
							value="sitelen_pona"
						>
							sitelen pona
						</DropdownMenuRadioItem>
						<DropdownMenuRadioItem
							disabled={$page.route.id === "/(words)/words/[word]"}
							value="sitelen_sitelen"
						>
							sitelen sitelen
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem class="font-semibold" on:click={copyLinkWithParams}>
					<svelte:component this={!hasCopied ? LinkIcon : CheckIcon} class="inline mr-2 size-4" />
					<span>Copy Permalink</span>
				</DropdownMenuItem>

				<DropdownMenuItem class="font-semibold" on:click={resetOptions}>
					<ResetIcon class="inline mr-2 size-4" />
					<span>Reset Options</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>

		<input type="hidden" name="categories" value={JSON.stringify($categories)} />

		<Button type="submit" variant="outline" size="icon">
			<SearchIcon />
		</Button>
	</form>

	<LanguageSwitch localeList={languages} />
</Navbar>

<slot />
