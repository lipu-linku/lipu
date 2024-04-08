<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";

	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { searchQuery } from "$lib/state";
	import { cn } from "$lib/utils";

	import { pushState } from "$app/navigation";
	import LinkIcon from "~icons/lucide/link";
	import SearchIcon from "~icons/lucide/search";

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
		<Button aria-label="Copy Permalink" variant="outline" size="icon" on:click={copyLinkWithParams}>
			<LinkIcon />
		</Button>

		<Button aria-label="Submit search" class="inline-flex" type="submit" variant="outline" size="icon">
			<SearchIcon />
		</Button>
	</div>
</form>
