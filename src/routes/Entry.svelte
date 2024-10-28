<script lang="ts">
	import { writingSystem, etymologiesEnabled, favorites } from "$lib/state.svelte";
	import type { Language, LocalizedWord } from "@kulupu-linku/sona";
	import { getTranslatedData, type UsageCategory } from "@kulupu-linku/sona/utils";

	import AudioButton from "$lib/components/AudioButton.svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	
	import MoreIcon from "~icons/lucide/menu"
	import FavoriteIcon from "~icons/material-symbols/favorite-outline";
	import UnfavoriteIcon from "~icons/material-symbols/favorite";

	interface Props {
		word: LocalizedWord;
		language: Language;
	}

	const { word, language }: Props = $props();

	const definition = $derived(getTranslatedData(word, "definition", language.id));
	const etymology = $derived(getTranslatedData(word, "etymology", language.id));
	const usageScore = $derived(Object.values(word.usage).at(-1) ?? 0);

	const categoryColors = {
		core: "oklch(93.29% 0.137 106.54)",
		common: "oklch(61.15% 0.177 30.62)",
		uncommon: "oklch(46.87% 0.159 351.1)",
		obscure: "oklch(32.72% 0.149 311.74)",
		sandbox: "oklch(20.55% 0.052 284.53)",
	} as const satisfies Record<UsageCategory, string>;
</script>

<Card.Root
	id={word.id}
	class="
		relative flex-1 w-auto flex justify-between border-2 transition-colors
		before:absolute before:inset-y-0 before:w-1 before:rounded-s-md before:bg-[--category-color]
		before:transition-[width] has-[a:hover]:border-zinc-400 has-[a:hover]:before:w-2
	"
	style="--category-color: {categoryColors[word.usage_category]}"
>
	<a href="/words/{word.id}" class="flex-1 p-0.5">
		<Card.Header class="space-y-1 p-4 pl-6">
			<Card.Title class="text-2xl leading-8">{word.word}</Card.Title>
			<Card.Description dir={language.direction} class="text-[1rem] text-foreground">
				{definition}
			</Card.Description>
			<Card.Description>
				{#if word.usage_category !== "sandbox"}
					{word.usage_category} · {word.book} ·
					<span title="{usageScore}% of toki pona speakers will recognize this word">
						{usageScore}%
					</span>
				{:else}
					{[
						word.creator.length > 0 ? word.creator.join(", ") : undefined,
						word.coined_year,
						word.book !== "none" ? word.book : undefined,
					]
						.filter(Boolean)
						.join(" · ")}
				{/if}
			</Card.Description>
			{#if etymologiesEnabled.value && word.etymology.length > 0 && etymology.length > 0}
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
			{#if word.see_also.length > 0}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
						<MoreIcon />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="text-center">
						<DropdownMenu.Label>See Also</DropdownMenu.Label>
						<DropdownMenu.Separator />
						{#each word.see_also as see_also}
							<DropdownMenu.Item href="/words/{see_also}">{see_also}</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
			{#if word.audio.length > 0}
				<AudioButton audio={word.audio} />
			{/if}

			<Button
				variant="outline"
				size="icon"
				on:click={() => {
					favorites.value.has(word.id)
						? favorites.value.delete(word.id)
						: favorites.value.add(word.id);
					favorites.value = favorites.value;
				}}
			>
				{#if !favorites.value.has(word.id)}
					<FavoriteIcon />
				{:else}
					<UnfavoriteIcon />
				{/if}
			</Button>
		</div>

		<div>
			{#if writingSystem.value === "sitelen_pona" && word.representations?.ligatures}
				{#each word.representations.ligatures.slice(0, 3) as glyph}
					<span class="text-center font-sitelen-pona">{glyph}</span>
				{/each}
			{:else if writingSystem.value === "sitelen_sitelen" && word.representations?.sitelen_sitelen}
				<img
					src={word.representations.sitelen_sitelen}
					alt="{word.word} in sitelen sitelen format"
					class="size-16 dark:invert"
					loading="lazy"
				/>
			{:else}
				<span class="min-w-14" aria-hidden="true"></span>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
