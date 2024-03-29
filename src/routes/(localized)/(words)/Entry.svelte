<script lang="ts">
	import { writingSystem } from "$lib/state";
	import type { Language, LocalizedWord } from "@kulupu-linku/sona";
	import { getTranslatedData, type Book, type UsageCategory } from "@kulupu-linku/sona/utils";

	import AudioButton from "$lib/components/AudioButton.svelte";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";

	export let word: LocalizedWord;
	export let language: Language;

	$: definition = getTranslatedData(word, "definition", language.id);
	$: usageScore = Object.values(word.usage).at(-1) ?? 0;

	const categoryColors = {
		core: "oklch(93.29% 0.137 106.54)",
		common: "oklch(61.15% 0.177 30.62)",
		uncommon: "oklch(46.87% 0.159 351.1)",
		sandbox: "oklch(20.55% 0.052 284.53)",
		obscure: "oklch(32.72% 0.149 311.74)",
	} as const satisfies Record<UsageCategory, string>;

	const bookColors = {
		pu: "",
		"ku suli": "",
		"ku lili": "",
		none: "",
	} as const satisfies Record<Book, string>;
</script>

<Card
	id={word.id}
	class="
		relative flex-1 w-auto flex justify-between border-2 transition-colors
		before:absolute before:inset-y-0 before:w-1 before:rounded-s-md before:bg-[--category-color] before:transition-[width] has-[a:hover]:border-zinc-300 has-[a:hover]:before:w-2
	"
	--category-color={categoryColors[word.usage_category]}
>
	<a href="/words/{word.word}" class="flex-1">
		<CardHeader class="space-y-1 p-4 pl-6">
			<CardTitle class="text-2xl">{word.word}</CardTitle>
			<CardDescription dir={language.direction} class="text-foreground">
				{definition}
			</CardDescription>
			{#if word.see_also.length > 0}
				<CardDescription>
					See also:
					{#each word.see_also as other, i}
						<a class="underline" href="/words/{other}">{other}</a>{i < word.see_also.length - 1
							? ", "
							: ""}
					{/each}
				</CardDescription>
			{/if}
			<CardDescription>
				{word.usage_category} · {word.book} ·
				<span title="{usageScore}% of toki pona speakers will recognize this word">
					{usageScore}%
				</span>
			</CardDescription>
		</CardHeader>
	</a>

	<CardContent
		class="my-auto flex items-center justify-center gap-1 py-2 px-4 text-6xl max-md:flex-col-reverse md:gap-4 md:py-0"
	>
		{#if word.audio.length > 0}
			<AudioButton audio={word.audio} />
		{/if}

		{#if $writingSystem === "sitelen_pona" && word.representations?.ligatures}
			{#each word.representations.ligatures.slice(0, 3) as glyph}
				<span class="text-center font-sitelen-pona">{glyph}</span>
			{/each}
		{:else if $writingSystem === "sitelen_sitelen" && word.representations?.sitelen_sitelen}
			<img
				src={word.representations.sitelen_sitelen}
				alt="{word.word} in sitelen sitelen format"
				class="size-16 dark:invert"
				loading="lazy"
			/>
		{:else}
			<span class="min-w-14" aria-hidden="true"></span>
		{/if}
	</CardContent>
</Card>
