<script lang="ts">
	import { categories, searchQuery, writingSystem } from "$lib/state";
	import type { Word } from "$lib/types";
	import { debounce, keys } from "$lib/utils";

	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
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
	} from "$lib/components/ui/dropdown-menu";
	import { Input, type InputEvents } from "$lib/components/ui/input";
	import { Skeleton } from "$lib/components/ui/skeleton";

	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { mode, toggleMode } from "mode-watcher";

	import icon from "$lib/assets/icon.png";
	import InfoIcon from "~icons/lucide/info";
	import CategoriesIcon from "~icons/lucide/layout-dashboard";
	import DarkModeIcon from "~icons/lucide/moon";
	import WritingSystemIcon from "~icons/lucide/pen-tool";
	import SearchIcon from "~icons/lucide/search";
	import SettingsIcon from "~icons/lucide/settings";
	import LightModeIcon from "~icons/lucide/sun";

	export let words: Word[];

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

<nav
	class="z-10 sticky top-0 flex items-center justify-between gap-2 bg-background p-4 border-b border-b-border"
>
	<header class="max-sm:mx-auto mr-2">
		<h1 class="flex items-center gap-4 my-0 sm:ml-auto">
			<Avatar class="rounded-none max-sm:hidden">
				<AvatarImage src={icon} class="invert dark:invert-0" alt="lipu Linku" />
				<AvatarFallback><Skeleton class="w-10 h-10 rounded-full" /></AvatarFallback>
			</Avatar>
			<a class="text-current font-semibold" href="/">lipu Linku</a>
		</h1>
	</header>

	<form class="flex-1 flex items-center gap-2" role="search" action="/?/search">
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
			{#each words as word}
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

	<Button variant="outline" size="icon" on:click={toggleMode} aria-label="Toggle theme">
		{#if $mode === "light"}
			<DarkModeIcon />
		{:else}
			<LightModeIcon />
		{/if}
	</Button>

	<Button variant="outline" size="icon" href="/about" aria-label="About Linku">
		<InfoIcon />
	</Button>
</nav>
