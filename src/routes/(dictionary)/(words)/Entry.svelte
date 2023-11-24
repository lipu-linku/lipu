<script lang="ts">
	import { siteLanguage, writingSystem } from "$lib/state";
	import type { Word } from "$lib/types";

	export let word: Word;

	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import AudioButton from "$lib/components/AudioButton.svelte";

	$: sp = word.sitelen_pona?.split(" ")?.[0] ?? "";

	$: definition = word.def[$siteLanguage] ?? "(en) " + word.def["en"];
	$: usageScore = Object.values(word.recognition ?? {}).at(-1) ?? "0";
</script>

<Card class="flex justify-between [&:has(a:hover)]:border-zinc-300 transition-colors">
	<a href="/words/{word.word}" class="flex-1">
		<CardHeader>
			<CardTitle>{word.word}</CardTitle>
			<CardDescription class="text-foreground">
				{definition}
			</CardDescription>
			{#if word.see_also}
				{@const others = word.see_also.split(", ")}
				<CardDescription>
					See also:
					{#each others as other, i}
						<a class="underline" href="/words/{other}">{other}</a
						>{#if i < others.length - 1},&nbsp;{/if}
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

		{#if $writingSystem === "sitelen_pona"}
			<span title={sp} class="font-sitelen-pona">{sp}</span>
		{:else if $writingSystem === "sitelen_sitelen"}
			<img
				src={word.sitelen_sitelen}
				alt="{word.word} in sitelen sitelen format"
				class="dark:invert w-16 h-16"
				loading="lazy"
			/>
		{/if}
	</CardContent>
</Card>
