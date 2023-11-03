<script lang="ts">
	import { siteLanguage } from "$lib/state";
	import type { Word } from "$lib/types";

	export let word: Word;

	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import AudioButton from "./AudioButton.svelte";

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
		<span title={sp} class="font-sitelen-pona">{sp}</span>
	</CardContent>
</Card>
