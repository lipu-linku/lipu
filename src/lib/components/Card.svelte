<script lang="ts">
	import AudioButton from "./AudioButton.svelte";
	import { Card, CardHeader, CardTitle } from "$lib/components/ui/card";
	import type { Word } from "$lib/types";
	import { siteLanguage } from "$lib/state";
	import CardDescription from "$lib/components/ui/card/card-description.svelte";

	export let word: Word;

	$: sitelenPona = word.sitelen_pona?.split(" ")?.[0] ?? "";
	$: audio = word.audio;

	$: definition_available = word.def[$siteLanguage];
	$: definition = word.def[$siteLanguage] ?? "(en) " + word.def["en"];
</script>

<Card>
	<CardHeader>
		<CardTitle>{word.word}</CardTitle>
		<!-- temporary hack: reduce definitions by chopping off "| ALT"s -->
		<CardDescription>{definition.split("|")[0].trim()}</CardDescription>
	</CardHeader>
</Card>
