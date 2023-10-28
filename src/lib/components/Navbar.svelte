<script lang="ts">
	import icon from "$lib/assets/icon.png";
	import InfoIcon from "~icons/lucide/info";

	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { Input } from "$lib/components/ui/input";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import type { Linku } from "$lib/types";

	export let words: Linku["data"][string]["word"][];
	export let query: string;
</script>

<nav class="flex items-center justify-between gap-4 p-4">
	<header class="max-sm:mx-auto">
		<h1 class="flex items-center gap-4 my-0 sm:ml-auto">
			<Avatar class="rounded-none max-sm:hidden">
				<AvatarImage src={icon} alt="lipu Linku" />
				<AvatarFallback><Skeleton class="w-10 h-10 rounded-full" /></AvatarFallback>
			</Avatar>
			<a class="text-current font-semibold" href="/">lipu Linku</a>
		</h1>
	</header>

	<Input
		class="w-auto flex-1"
		placeholder="o lukin e nimi"
		list="word-search-options"
		type="search"
		bind:value={query}
	/>
	<datalist id="word-search-options">
		{#each words as word}
			<option value={word} />
		{/each}
	</datalist>

	<a href="about" title="About Linku">
		<InfoIcon class="w-8 h-8"/>
	</a>
</nav>
