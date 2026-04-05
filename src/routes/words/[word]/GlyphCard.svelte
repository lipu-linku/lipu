<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { cn } from "$lib/utils";
	import type { Glyph } from "@kulupu-linku/sona";
	import StarIcon from "~icons/lucide/star";

	let { glyph, listFormat }: { glyph: Glyph; listFormat: Intl.ListFormat } = $props();
	const id = $props.id();
	const usage = $derived(Object.values(glyph.usage).at(-1));
</script>

<Button
	class={cn(
		buttonVariants({ variant: "outline", size: "icon" }),
		"group relative grid size-18 grid-cols-subgrid gap-6 px-3 has-checked:col-span-4 has-checked:size-auto has-checked:px-6 has-checked:py-2",
		"border-2 border-(--category-color) data-[primary=true]:border-4 dark:border-(--category-color)",
	)}
	--category-color="var(--color-category-{glyph.usage_category})"
	--anchor-name="--{id}"
	popovertarget={glyph.id}
	data-primary={glyph.primary}
>
	<img
		src={glyph.svg}
		alt={glyph.translations.names[0]}
		class="block-14 not-group-has-checked:justify-self-center dark:invert"
		data-primary={glyph.primary}
	/>
</Button>

<Card.Root
	{id}
	popover="auto"
	class="popover-open:flex fixed bottom-[anchor(top)] hidden [justify-self:anchor-center] border-(--category-color) [position-anchor:var(--anchor-name)]"
	--category-color="var(--color-category-{glyph.usage_category})"
	--anchor-name="--{id}"
>
	<p class="flex items-center justify-between text-lg font-medium text-balance">
		{glyph.translations.names.join(", ")}
		{#if glyph.primary}
			<StarIcon class="size-1lh inline align-text-top" />
		{/if}
	</p>
	{#if glyph.author.length > 0}
		<p class="text-wrap">
			<span class="text-muted-foreground">Author:</span>
			{listFormat.format(glyph.author)}
		</p>
	{/if}

	{#if glyph.ligature}
		<p class="text-wrap">
			<span class="text-muted-foreground">Ligature:</span>
			{listFormat.format([glyph.ligature, ...(glyph.alias_ligatures ?? [])])}
		</p>
	{/if}

	<p class="text-wrap">
		<span class="text-muted-foreground">Category:</span>
		<span
			class="text-(--category-color)"
			style:--category-color="var(--color-category-foreground-{glyph.usage_category})"
			>{glyph.usage_category}</span
		>
		({usage}%)
	</p>
</Card.Root>
