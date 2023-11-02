<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Label } from "$lib/components/ui/label";
	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	import { siteLanguage } from "$lib/state";
	import type { BookName, Linku, UsageCategory } from "$lib/types";
	import { keys } from "$lib/utils";
	import InfoIcon from "~icons/lucide/info";
	import LanguagesIcon from "~icons/lucide/languages";
	import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
	import { Button } from "./ui/button";

	export let languages: Linku["languages"];
	export let books: Record<BookName, boolean>;
	export let categories: Record<UsageCategory, boolean>;
</script>

<section class="flex flex-col gap-4 items-center justify-center">
	<h2 class="text-2xl font-semibold">Search options:</h2>

	<Label class="self-stretch flex-1 flex items-center justify-center gap-2 mx-6">
		<LanguagesIcon /> Definitions language:
		<Select positioning={{ placement: "right-end" }}>
			<SelectTrigger class="max-w-[30ch] self-stretch flex-1">
				<SelectValue class="pr-2" placeholder={languages[$siteLanguage].name_endonym} />
			</SelectTrigger>
			<SelectContent class="max-h-64 overflow-y-auto">
				{#each Object.entries(languages) as [key, language] (key)}
					<SelectItem value={key}>{language.name_endonym}</SelectItem>
				{/each}
			</SelectContent>
			<SelectInput bind:value={$siteLanguage} />
		</Select>
	</Label>

	<div class="flex items-center gap-4">
		{#each keys(books) as book}
			<Label class="flex items-center gap-2">
				<Checkbox bind:checked={books[book]} />
				{book}
			</Label>
		{/each}

		{#if books.none}
			<Tooltip positioning={{ placement: "right" }}>
				<TooltipTrigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" size="icon"><InfoIcon /></Button>
				</TooltipTrigger>
				<TooltipContent class="max-w-[55ch]">
					Most words in the "none" book category are obscure or rare, so don't forget to enable the
					filter options for those!
				</TooltipContent>
			</Tooltip>
		{/if}
	</div>

	<div class="flex items-center gap-4">
		{#each keys(categories) as category}
			<Label class="flex items-center gap-2">
				<Checkbox bind:checked={categories[category]} />
				{category}
			</Label>
		{/each}
	</div>
</section>
