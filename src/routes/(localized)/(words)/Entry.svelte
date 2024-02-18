<script lang="ts">
	import { writingSystem } from "$lib/state";
	import type { Languages, Words } from "@kulupu-linku/sona";
	import type { UsageCategory } from "@kulupu-linku/sona/utils";

	import AudioButton from "$lib/components/AudioButton.svelte";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { getTranslatedData } from "$lib/utils";

	export let id: string;
	export let word: Words[string];
	export let language: keyof Languages;

	$: sp = word.representations.sitelen_pona.at(0) ?? "";
	$: definition = getTranslatedData(word, "definitions", language);
	$: usageScore = Object.values(word.usage).at(-1) ?? 0;

	const categoryColors = {
		core: "oklch(93.29% 0.137 106.54)",
		widespread: "oklch(76.59% 0.169 65.75)",
		common: "oklch(61.15% 0.177 30.62)",
		uncommon: "oklch(46.87% 0.159 351.1)",
		rare: "oklch(32.72% 0.149 311.74)",
		obscure: "oklch(20.55% 0.052 284.53)",
	} as const satisfies Record<UsageCategory, string>;
</script>

<Card
	{id}
	class="
		flex justify-between border-2 has-[a:hover]:border-zinc-300 transition-colors
		relative before:absolute before:w-1 before:transition-[width] has-[a:hover]:before:w-2 before:rounded-s-md before:inset-y-0 before:bg-[--category-color]
	"
	--category-color={categoryColors[word.usage_category]}
>
	<a href="/words/{word.word}" class="flex-1">
		<CardHeader>
			<CardTitle>{word.word}</CardTitle>
			<CardDescription class="text-foreground">
				{definition}
			</CardDescription>
			{#if word.see_also}
				<CardDescription>
					See also:
					{#each word.see_also as other, i}
						<a class="underline" href="/words/{other}">{other}</a>
						{#if i < word.see_also.length - 1}
							,&nbsp;
						{/if}
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

	<CardContent class="flex items-center justify-center gap-4 py-0 text-6xl my-auto">
		{#if word.audio}
			<AudioButton audio={word.audio} />
		{/if}

		{#if $writingSystem === "sitelen_pona" && word.representations.sitelen_pona.length > 0}
			<span title={sp} class="text-center min-w-14 font-sitelen-pona">{sp}</span>
		{:else if $writingSystem === "sitelen_sitelen" && word.representations.sitelen_sitelen}
			<img
				src={word.representations.sitelen_sitelen}
				alt="{word.word} in sitelen sitelen format"
				class="dark:invert size-16"
				loading="lazy"
			/>
		{:else}
			<span class="min-w-14" aria-hidden="true"></span>
		{/if}
	</CardContent>
</Card>
