<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Input } from "$lib/components/ui/input";

	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { etymologiesEnabled, favorites, onlyFavorites, searchQuery } from "$lib/state";
	import { cn } from "$lib/utils";

	import { pushState } from "$app/navigation";
	import CheckIcon from "~icons/lucide/check";
	import LinkIcon from "~icons/lucide/link";
	import SearchIcon from "~icons/lucide/search";
	import SettingsIcon from "~icons/lucide/settings";
	import ResetIcon from "~icons/lucide/undo-2";
	import { m } from "$lib/paraglide";

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
		onlyFavorites.reset();

		$page.url.searchParams.forEach((v, k, params) => params.delete(k, v));
		if (browser) pushState($page.url, {});
	};
</script>

<svelte:window on:keydown={focusSearch} />

<form class={cn("px-2 md:mx-auto md:justify-center items-center gap-2", className)} role="search">
	<Input
		class="w-auto bg-background flex-1 md:flex-none"
		placeholder={m.search_placeholder()}
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
					aria-label={m.search_options()}
				>
					<SettingsIcon aria-label={m.settings_icon()} />
				</Button>
			</DropdownMenu.Trigger>
			<!-- this is some absolute positioning fuckery to get the dropdown to be centered -->
			<DropdownMenu.Content class="max-md:!inset-x-0 max-md:mx-auto w-[90vw] md:w-auto">
				<DropdownMenu.Label class="text-center">{m.search_options()}</DropdownMenu.Label>
				<DropdownMenu.Group>
					<DropdownMenu.CheckboxItem bind:checked={$etymologiesEnabled}>
						{m.show_etymologies()}
					</DropdownMenu.CheckboxItem>

					<DropdownMenu.CheckboxItem bind:checked={$onlyFavorites} disabled={$favorites.size === 0}>
						{m.only_show_favorites()}
					</DropdownMenu.CheckboxItem>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="font-semibold" on:click={copyLinkWithParams}>
					<svelte:component
						this={!hasCopied ? LinkIcon : CheckIcon}
						aria-hidden
						class="mr-2 inline size-4"
					/>
					<span>{m.copy_permalink()}</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="font-semibold" on:click={resetOptions}>
					<ResetIcon aria-hidden class="mr-2 inline size-4" />
					<span>{m.reset_options()}</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<Button
			aria-label="{m.submit_search()}"
			class="inline-flex"
			type="submit"
			variant="outline"
			size="icon"
		>
			<SearchIcon />
		</Button>
	</div>
</form>
