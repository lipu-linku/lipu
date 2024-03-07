<script lang="ts">
	import { writingSystem } from "$lib/state";
	import type { Language, LocalizedWord } from "@kulupu-linku/sona";
	import { getTranslatedData, type UsageCategory } from "@kulupu-linku/sona/utils";

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
		obscure: "oklch(32.72% 0.149 311.74)",
		sandbox: "oklch(20.55% 0.052 284.53)",
	} as const satisfies Record<UsageCategory, string>;
</script>

<Card
	id={word.id}
	class="
		flex justify-between border-2 has-[a:hover]:border-zinc-300 transition-colors
		relative before:absolute before:w-1 before:transition-[width] has-[a:hover]:before:w-2 before:rounded-s-md before:inset-y-0 before:bg-[--category-color]
	"
	--category-color={categoryColors[word.usage_category]}
>
	<a href="/words/{word.word}" class="flex-1">
		<CardHeader>
			<CardTitle>{word.word}</CardTitle>
			<CardDescription dir={language.direction} class="text-foreground">
				{definition}
			</CardDescription>
			{#if word.see_also.length > 0}
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
		{#if word.audio.length > 0}
			<AudioButton audio={word.audio} />
		{/if}

		{#if $writingSystem === "sitelen_pona" && word.representations?.ligatures}
			<span class="text-center min-w-14 font-sitelen-pona">
				{word.representations?.ligatures.slice(0, 3).join(" ")}
			</span>
		{:else if $writingSystem === "sitelen_sitelen" && word.representations?.sitelen_sitelen}
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
