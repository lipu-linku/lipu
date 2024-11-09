<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Input } from "$lib/components/ui/input";

	import { page } from "$app/stores";
	import {
		categories,
		categoriesSerializer,
		etymologiesEnabled,
		favorites,
		onlyFavorites,
		searchQuery,
		writingSystem
	} from "$lib/state.svelte";
	import { cn, keys } from "$lib/utils";

	import { pushState } from "$app/navigation";
	import CheckIcon from "~icons/lucide/check";
	import CategoriesIcon from "~icons/lucide/layout-dashboard";
	import LinkIcon from "~icons/lucide/link";
	import WritingSystemIcon from "~icons/lucide/pen-tool";
	import SearchIcon from "~icons/lucide/search";
	import SettingsIcon from "~icons/lucide/settings";
	import ResetIcon from "~icons/lucide/undo-2";

	interface Props {
		class?: string;
	}

	const { class: className = "" }: Props = $props();

	const focusSearch = (e: KeyboardEvent) => {
		if (e.key === "/" && document.activeElement?.id !== "search-input") {
			e.preventDefault();
			document.getElementById("search-input")!.focus();
		}
	};

	let hasCopied = $state(false);
	const copyLinkWithParams = () => {
		const url = new URL($page.url);
		url.searchParams.set("categories", JSON.stringify(categories.current));
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
		categories.reset();
		onlyFavorites.reset();

		$page.url.searchParams.forEach((v, k, params) => params.delete(k, v));
		pushState($page.url, {});
	};

	$effect(() => {
		if (searchQuery.value === "" && $page.url.searchParams.has("q")) clearQuery();
	});
</script>

<svelte:window onkeydown={focusSearch} />

<form class={cn("px-2 md:mx-auto md:justify-center items-center gap-2", className)} role="search">
	<Input
		class="w-auto bg-background flex-1 md:flex-none"
		placeholder="o alasa e nimi"
		type="search"
		name="q"
		required
		autocapitalize="off"
		autocomplete="off"
		bind:value={searchQuery.value}
		id="search-input"
	/>

	<div class="flex items-center justify-center gap-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class={buttonVariants({ variant: "outline", size: "icon" })}
				aria-label="Search Options"
			>
				<SettingsIcon aria-label="Settings icon" />
			</DropdownMenu.Trigger>
			<!-- this is some absolute positioning fuckery to get the dropdown to be centered -->
			<DropdownMenu.Content class="max-md:!inset-x-0 max-md:mx-auto w-[90vw] md:w-auto">
				<DropdownMenu.Label class="text-center">Search Options</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading>
						<CategoriesIcon aria-label="Categories icon" class="mr-1 inline size-4" />
						<span>Usage Categories</span>
					</DropdownMenu.GroupHeading>
					{#each keys(categories.current) as category}
						<DropdownMenu.CheckboxItem
							closeOnSelect={false}
							bind:checked={categories.current[category]}
						>
							{category}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading
						class={cn($page.route.id === "/words/[word]" && "pointer-events-none opacity-50")}
					>
						<WritingSystemIcon aria-label="Fountain pen icon" class="mr-1 inline size-4" />
						<span>Display Settings</span>
					</DropdownMenu.GroupHeading>
					<DropdownMenu.RadioGroup bind:value={writingSystem.current}>
						<DropdownMenu.RadioItem
							closeOnSelect={false}
							disabled={$page.route.id === "/words/[word]"}
							value="sitelen_pona"
						>
							sitelen pona
						</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem
							closeOnSelect={false}
							disabled={$page.route.id === "/words/[word]"}
							value="sitelen_sitelen"
						>
							sitelen sitelen
						</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>

					<DropdownMenu.Separator />

					<DropdownMenu.CheckboxItem
						closeOnSelect={false}
						bind:checked={etymologiesEnabled.current}
					>
						Show Etymologies
					</DropdownMenu.CheckboxItem>

					<DropdownMenu.CheckboxItem
						closeOnSelect={false}
						bind:checked={onlyFavorites.current}
						disabled={favorites.current.size === 0}
					>
						Only Show Favorites
					</DropdownMenu.CheckboxItem>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="font-semibold" onclick={copyLinkWithParams}>
					{@const SvelteComponent = !hasCopied ? LinkIcon : CheckIcon}
					<SvelteComponent aria-hidden class="mr-2 inline size-4" />
					<span>Copy Permalink</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item closeOnSelect={false} class="font-semibold" onclick={resetOptions}>
					<ResetIcon aria-hidden class="mr-2 inline size-4" />
					<span>Reset Options</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<input
			type="hidden"
			name="categories"
			value={categoriesSerializer.stringify(categories.current)}
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
</form>
