<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";

	import Navbar from "$lib/components/Navbar.svelte";
	import LanguageSwitch from "$lib/components/LanguageSwitch.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		DropdownMenu,
		DropdownMenuCheckboxItem,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuLabel,
		DropdownMenuRadioGroup,
		DropdownMenuRadioItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu/index";
	import { Input, type InputEvents } from "$lib/components/ui/input";
	import { categories, searchQuery, writingSystem } from "$lib/state";
	import { debounce, keys } from "$lib/utils";

	import CategoriesIcon from "~icons/lucide/layout-dashboard";
	import WritingSystemIcon from "~icons/lucide/pen-tool";
	import SearchIcon from "~icons/lucide/search";
	import SettingsIcon from "~icons/lucide/settings";

	export let data;
	$: ({
		linku: { data: dictionary, languages },
	} = data);

	const focusSearch = (e: KeyboardEvent) => {
		if (e.key === "/" && document.activeElement?.id !== "search-input") {
			e.preventDefault();
			document.getElementById("search-input")!.focus();
		}
	};

	const updateSearchParam = (e: InputEvents["input"]) => {
		if (browser && window.history) {
			const searchParams = new URLSearchParams(window.location.search);

			if ($searchQuery) searchParams.set("q", $searchQuery);
			else searchParams.delete("q");

			const newUrl =
				window.location.pathname + (searchParams.size > 0 ? "?" + searchParams.toString() : "");
			window.history.replaceState(null, "", newUrl);
		}
	};
</script>

<svelte:window on:keydown={focusSearch} />

<Navbar>
	<form class="ml-auto flex items-center gap-2" role="search" action="/?/search">
		<Input
			class="flex-1"
			placeholder="o lukin e nimi"
			list="word-search-options"
			type="search"
			name="q"
			required
			autocapitalize="off"
			autocomplete="off"
			bind:value={$searchQuery}
			on:input={debounce(updateSearchParam)}
			id="search-input"
		/>
		<datalist id="word-search-options">
			{#each Object.values(dictionary) as word}
				<option value={word.word} />
			{/each}
		</datalist>

		<DropdownMenu preventScroll={false}>
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
						<CategoriesIcon class="inline mr-1 w-4 h-4" />
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
						<WritingSystemIcon class="inline mr-1 w-4 h-4" />
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
