<script lang="ts">
	import { resolve } from "$app/paths";
	import * as Card from "$lib/components/ui/card";
	import { displayMethod, etymologiesEnabled, writingSystem } from "$lib/state.svelte";
	import type { Word } from "@kulupu-linku/sona";

	interface Props {
		word: Word;
	}

	const { word }: Props = $props();
	const { definition, etymology } = $derived(word.translations);
	const usageScore = $derived(Object.values(word.usage).at(-1) ?? 0);
</script>

{#if displayMethod.current === "grid"}
	<a
		href="/words/{word.id}"
		data-slot="card"
		id={word.id}
		class="
		relative flex h-full flex-col gap-3 rounded-xl border-2 bg-card py-3 text-card-foreground shadow-sm transition-colors
			before:absolute before:inset-bs-0 before:size-4 before:rounded-tl-[calc(var(--radius-xl)-2px)] before:rounded-br-3xl before:bg-(--category-color)
			before:transition-transform hover:border-(--category-color)
		"
		style="--category-color: var(--color-category-{word.usage_category});
		--category-color-foreground: var(--color-category-foreground-{word.usage_category});"
		data-category={word.usage_category}
	>
		<Card.Header class="flex w-full items-end justify-between pe-4">
			<Card.Title class="text-2xl leading-8">{word.word}</Card.Title>
			{@render glyph()}
		</Card.Header>

		<Card.Content class="flex h-full flex-col justify-end gap-1">
			<Card.Description
				class="h-full text-[1rem] text-balance text-foreground supports-[text-wrap:pretty]:text-pretty"
			>
				{definition}
			</Card.Description>

			<Card.Description class="flex items-center justify-between">
				<span>
					{#if word.usage_category !== "sandbox"}
						<span class="text-(--category-color-foreground)">{word.usage_category}</span> · {word.book}
						·
						<span title="{usageScore}% of toki pona speakers will recognize this word">
							{usageScore}%
						</span>
					{:else}
						{[word.author.length > 0 ? word.author.join(", ") : undefined, word.creation_date]
							.filter(Boolean)
							.join(" · ")}
					{/if}
				</span>
				{#if word.see_also.length > 0}
					<span class="self-end">See: {word.see_also.join(", ")}</span>
				{/if}
			</Card.Description>

			{#if etymologiesEnabled.current}
				<Card.Description>
					<span class="text-start">
						{etymology}
					</span>
				</Card.Description>
			{/if}
		</Card.Content>
	</a>
{:else}
	<div class="col-span-4 grid grid-cols-subgrid place-content-center items-center">
		<a
			href={resolve("/words/[word]", { word: word.id })}
			class="col-1 origin-right text-end text-lg font-semibold transition-transform duration-100 hover:scale-110"
		>
			{word.word}
		</a>

		{@render glyph()}

		<span
			class="col-3 text-(--category-color)"
			style:--category-color="var(--color-category-{word.usage_category})"
		>
			{word.usage_category}
		</span>

		<span class="col-4">{word.translations.definition}</span>
	</div>
{/if}

{#snippet glyph()}
	{#if (writingSystem.current === "sitelen_pona" && word.primary_glyph_id) || (writingSystem.current === "sitelen_sitelen" && word.representations?.sitelen_sitelen)}
		<span
			class={[
				"col-2 text-4xl [text-box:trim-both_cap_alphabetic]",
				writingSystem.current === "sitelen_pona" &&
					word.primary_glyph_id &&
					"font-sitelen-seli-kiwen",
				writingSystem.current === "sitelen_sitelen" &&
					word.representations?.sitelen_sitelen &&
					"font-sitelen-sitelen-open",
			]}
			>{word.word}
		</span>
	{/if}
{/snippet}
