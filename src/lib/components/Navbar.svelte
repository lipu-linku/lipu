<script lang="ts">
	import icon from "$lib/assets/icon.png";
	import InfoIcon from "~icons/lucide/info";

	import { goto } from "$app/navigation";
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import type { Linku } from "$lib/types";
	import SearchIcon from "~icons/lucide/search";

	export let words: Linku["data"][string]["word"][];
	export let query = "";
</script>

<nav class="flex items-center justify-between gap-4 p-4 border-b border-b-border">
	<header class="max-sm:mx-auto">
		<h1 class="flex items-center gap-4 my-0 sm:ml-auto">
			<Avatar class="rounded-none max-sm:hidden">
				<AvatarImage src={icon} alt="lipu Linku" />
				<AvatarFallback><Skeleton class="w-10 h-10 rounded-full" /></AvatarFallback>
			</Avatar>
			<a class="text-current font-semibold" href="/">lipu Linku</a>
		</h1>
	</header>

	<form
		on:submit|preventDefault={() => goto(`/search?q=${encodeURIComponent(query)}`)}
		class="flex-1 flex items-center gap-2"
		role="search"
	>
		<Input
			class="flex-1"
			placeholder="o lukin e nimi"
			list="word-search-options"
			type="search"
			required
			bind:value={query}
		/>
		<datalist id="word-search-options">
			{#each words as word}
				<option value={word} />
			{/each}
		</datalist>

		<Button type="submit" variant="outline" size="icon">
			<SearchIcon />
		</Button>
	</form>

	<a href="/about" title="About Linku">
		<InfoIcon class="w-8 h-8" />
	</a>
</nav>
