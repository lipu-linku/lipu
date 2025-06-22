<script lang="ts">
	import AudioButton from "$lib/components/AudioButton.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { etymologiesEnabled, favorites, onlyFavorites, writingSystem } from "$lib/state.svelte";
	import type { Language, LocalizedWord } from "@kulupu-linku/sona";
	import { getTranslatedData } from "@kulupu-linku/sona/utils";

	import UnfavoriteIcon from "~icons/material-symbols/favorite";
	import FavoriteIcon from "~icons/material-symbols/favorite-outline";

	interface Props {
		word: LocalizedWord;
		language: Language;
	}

	const { word, language }: Props = $props();

	const definition = $derived(getTranslatedData(word, "definition", language.id));
	const etymology = $derived(getTranslatedData(word, "etymology", language.id));
	const usageScore = $derived(Object.values(word.usage).at(-1) ?? 0);

	const bookName = $derived.by(() => {
		switch (word.book) {
			case "pu":
				return "nimi pu";
			case "ku suli":
				return "nimi ku suli";
			case "ku lili":
				return "nimi ku pi suli ala";
			case "none":
				return undefined;
		}
	});
</script>

<Card.Root
	id={word.id}
	class="
	flex-row py-2 relative border-2 transition-colors
		before:absolute before:inset-y-0 before:w-1 before:rounded-s-xl before:bg-(--category-color)
		before:transition-[width] has-[a:hover]:border-(--category-color) has-[a:hover]:before:w-2
	"
	style="--category-color: var(--color-category-{word.usage_category});
		--category-color-foreground: var(--color-category-foreground-{word.usage_category});"
	data-category={word.usage_category}
>
	<a href="/words/{word.id}" class="flex-1 p-0.5">
		<Card.Header class="space-y-1 p-4 pl-6">
			<Card.Title class="text-2xl leading-8">{word.word}</Card.Title>
			<Card.Description dir={language.direction} class="text-[1rem] text-foreground">
				{definition}
			</Card.Description>
			{#if word.see_also.length > 0}
				<Card.Description>
					See also: {word.see_also.join(", ")}
				</Card.Description>
			{/if}
			<Card.Description>
				{#if word.usage_category !== "sandbox"}
					<span class="text-(--category-color-foreground)">{word.usage_category}</span> · {word.book}
					·
					<span title="{usageScore}% of toki pona speakers will recognize this word">
						{usageScore}%
					</span>
				{:else}
					{[
						word.creator.length > 0 ? word.creator.join(", ") : undefined,
						word.coined_year,
						bookName,
					]
						.filter(Boolean)
						.join(" · ")}
				{/if}
			</Card.Description>
			{#if etymologiesEnabled.current && word.etymology.length > 0 && etymology.length > 0}
				<Card.Description>
					{@const etymString = word.etymology
						.map((etym, i) => {
							const local_etym = etymology[i];
							return (
								local_etym.language +
								(etym.word ? `: ${etym.word}` : "") +
								(etym.alt ? ` (${etym.alt})` : "") +
								(local_etym.definition ? ` - ${local_etym.definition}` : "")
							);
						})
						.join("; ")}
					<span dir={language.direction} class="text-start">
						{etymString}
					</span>
				</Card.Description>
			{/if}
		</Card.Header>
	</a>

	<Card.Content
		class="flex flex-col items-end justify-between gap-1 p-4 text-6xl max-md:flex-col-reverse md:gap-4"
	>
		<div class="flex items-center gap-2">
			{#if word.audio.length > 0}
				<AudioButton audio={word.audio} />
			{/if}

			<Button
				onclick={() => {
					const index = favorites.current.findIndex((w) => w === word.id);
					if (index === -1) favorites.current.push(word.id);
					else favorites.current.splice(index);

					if (onlyFavorites.current && favorites.current.length === 0)
						onlyFavorites.current = false;
				}}
				variant="outline"
				size="icon"
			>
				{#if !favorites.current.includes(word.id)}
					<FavoriteIcon />
				{:else}
					<UnfavoriteIcon />
				{/if}
			</Button>
		</div>

		<div class="flex items-center justify-end flex-wrap">
			{#if writingSystem.current === "sitelen_pona" && word.representations?.ligatures}
				<span class="text-end wrap-anywhere max-w-[10ch] text-wrap font-sitelen-seli-kiwen">
					{#each word.representations.ligatures.slice(0, 3) as glyph}
						{glyph}
					{/each}
				</span>
			{:else if writingSystem.current === "sitelen_sitelen" && word.representations?.sitelen_sitelen}
				<img
					src={word.representations.sitelen_sitelen}
					alt="{word.word} in sitelen sitelen format"
					class="size-16 grayscale dark:invert"
					loading="lazy"
				/>
			{:else}
				<span class="min-w-14" aria-hidden="true"></span>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
