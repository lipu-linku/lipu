<script lang="ts">
	import { siteLanguage } from "$lib/state";
	import type { Word } from "$lib/types";

	export let word: Word;

	import AudioButton from "./AudioButton.svelte";
	import {
		Card,
		CardDescription,
		CardHeader,
		CardTitle,
		CardContent,
	} from "$lib/components/ui/card";
	import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

	$: sp = word.sitelen_pona?.split(" ")?.[0] ?? "";

	$: definition = word.def[$siteLanguage] ?? "(en) " + word.def["en"];
	$: usageScore = Object.values(word.recognition ?? {}).at(-1) ?? "0";
</script>

<Card class="flex justify-between">
	<CardHeader>
		<CardTitle>{word.word}</CardTitle>
		<CardDescription>{definition}</CardDescription>
		<CardDescription>
			{word.usage_category} · {word.book} ·
			<abbr
				class="no-underline"
				title="{usageScore}% of toki pona speakers will recognize this word"
			>
				{usageScore}%
			</abbr>
		</CardDescription>
	</CardHeader>
	<CardContent
		class="flex items-center justify-center gap-4 py-0 font-sitelen-pona text-6xl my-auto"
	>
		{#if word.audio}
			<AudioButton audio={word.audio} />
		{/if}
		{sp}
	</CardContent>
</Card>
