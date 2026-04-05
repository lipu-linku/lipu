<script lang="ts">
	import AudioButton from "$lib/components/AudioButton.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import {
		dir,
		etymologiesEnabled,
		favorites,
		onlyFavorites,
		writingSystem,
	} from "$lib/state.svelte";
	import type { Word } from "@kulupu-linku/sona";

	import UnfavoriteIcon from "~icons/material-symbols/favorite";
	import FavoriteIcon from "~icons/material-symbols/favorite-outline";

	interface Props {
		word: Word;
	}

	const { word }: Props = $props();

	const { definition, etymology } = $derived(word.translations);
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
	flex-row py-2 h-full relative border-2 transition-colors
		before:absolute before:inset-bs-0 before:size-6 before:rounded-tl-[calc(var(--radius-xl)-2px)] before:rounded-br-3xl before:bg-(--category-color)
		before:transition-transform has-[a:hover]:border-(--category-color)
	"
	style="--category-color: var(--color-category-{word.usage_category});
		--category-color-foreground: var(--color-category-foreground-{word.usage_category});"
	data-category={word.usage_category}
>
	<a href="/words/{word.id}" class="flex-1 p-0.5">
		<Card.Header class="space-y-1 p-4 pl-6">
			<Card.Title class="text-2xl leading-8">{word.word}</Card.Title>
			<Card.Description dir={dir.current} class="text-[1rem] text-foreground">
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
						word.author.length > 0 ? word.author.join(", ") : undefined,
						word.creation_date,
						bookName,
					]
						.filter(Boolean)
						.join(" · ")}
				{/if}
			</Card.Description>
			{#if etymologiesEnabled.current}
				<Card.Description>
					<span dir={dir.current} class="text-start">
						{etymology}
					</span>
				</Card.Description>
			{/if}
		</Card.Header>
	</a>

	<Card.Content class="flex flex-col items-end gap-1 p-4 text-6xl max-md:flex-col-reverse md:gap-4">
		<div class="flex items-center gap-2">
			{#if word.audio.length > 0}
				<AudioButton audio={word.audio} />
			{/if}

			<Button
				onclick={() => {
					const index = favorites.current.findIndex((w) => w === word.id);
					if (index === -1) favorites.current.push(word.id);
					else favorites.current.splice(index, 1);

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
				<span
					class="text-end wrap-anywhere max-w-[10ch] text-wrap font-sitelen-seli-kiwen [text-box:trim-both_cap_alphabetic]"
				>
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
