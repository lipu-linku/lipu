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
	import { Tooltip, TooltipContent, TooltipTrigger } from "$lib/components/ui/tooltip";
	import { siteLanguage } from "$lib/state";
	import type { BookName, Language, UsageCategory } from "$lib/types";
	import { keys } from "$lib/utils";
	import InfoIcon from "~icons/lucide/info";
	import LanguagesIcon from "~icons/lucide/languages";

	export let languages: Record<string, Language>;
	export let books: Record<BookName, boolean>;
	export let categories: Record<UsageCategory, boolean>;
</script>

<section class="flex flex-col gap-4 items-center justify-center">
	<h2 class="text-2xl font-semibold">Search options:</h2>

	<div class="flex items-center gap-2">
		<Label id="language-selector-label" class="flex items-center gap-[1ch]">
			<LanguagesIcon /> Definitions language:
		</Label>
		<Select positioning={{ placement: "bottom" }}>
			<SelectTrigger class="max-w-[30ch] self-stretch flex-1">
				<SelectValue class="pr-2" placeholder={languages[$siteLanguage].name_endonym} />
			</SelectTrigger>
			<SelectContent class="max-h-64 overflow-y-auto">
				{#each Object.entries(languages) as [key, language] (key)}
					<SelectItem value={key}>{language.name_endonym}</SelectItem>
				{/each}
			</SelectContent>
			<SelectInput bind:value={$siteLanguage} aria-labelledby="language-selector-label" />
		</Select>
	</div>

	<div class="flex items-center gap-4">
		{#each keys(books) as book (book)}
			{@const id = book.replace(/\s/g, "-")}
			<div class="flex items-center gap-2">
				<Checkbox
					bind:checked={books[book]}
					id="book-checkbox-{id}"
					aria-labelledby="book-label-{id}"
				/>
				<Label for="book-checkbox-{id}" id="book-label-{id}">
					{book}
				</Label>

				{#if books.none && book === "none"}
					<Tooltip positioning={{ placement: "right" }}>
						<TooltipTrigger>
							<InfoIcon class="w-4 h-4" />
						</TooltipTrigger>
						<TooltipContent class="max-w-[55ch]">
							Most words in the "none" book category are obscure or rare, so don't forget to enable
							the filter options for those!
						</TooltipContent>
					</Tooltip>
				{/if}
			</div>
		{/each}
	</div>

	<div class="flex items-center gap-4">
		{#each keys(categories) as category (category)}
			<div class="flex items-center gap-2">
				<Checkbox
					bind:checked={categories[category]}
					id="category-checkbox-{category}"
					aria-labelledby="category-label-{category}"
				/>
				<Label for="category-checkbox-{category}" id="category-label-{category}">
					{category}
				</Label>
			</div>
		{/each}
	</div>
</section>
