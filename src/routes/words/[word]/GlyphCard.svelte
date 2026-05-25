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
		"size-18 gap-6 border-2 border-(--category-color) px-3 data-[primary=true]:border-4 dark:border-(--category-color)",
	)}
	style="anchor-name: --{id}; --category-color: var(--color-category-{glyph.usage_category})"
	popovertarget={id}
	data-primary={glyph.primary}
>
	<img
		src={glyph.svg}
		alt={glyph.translations.names[0]}
		class="aspect-square size-14 dark:invert"
		data-primary={glyph.primary}
	/>
</Button>

<Card.Root
	{id}
	popover="auto"
	class="absolute mbe-4 hidden translate-y-10 gap-2 border-2
		border-(--category-color) opacity-0 transition-[translate,opacity] duration-100
		[position-area:block-start] [position-try:flip-block]
		max-inline-80
		[&:popover-open]:flex
		[&:popover-open]:translate-y-0
		[&:popover-open]:opacity-100
		starting:[&:popover-open]:translate-y-10
		starting:[&:popover-open]:opacity-0"
	style="position-anchor: --{id}; --category-color: var(--color-category-{glyph.usage_category})"
>
	<Card.Header>
		<Card.Title class="flex items-center justify-between text-lg font-medium text-balance">
			{listFormat.format(glyph.translations.names)}
			{#if glyph.primary}
				<StarIcon class="size-1lh inline align-text-top" />
			{/if}
		</Card.Title>
	</Card.Header>

	<Card.Content class="text-wrap">
		{#if glyph.author.length > 0}
			<p>
				<span class="text-muted-foreground">Author:</span>
				{listFormat.format(glyph.author)}
			</p>
		{/if}

		{#if glyph.ligature}
			<p>
				<span class="text-muted-foreground">Ligature:</span>
				{listFormat.format([glyph.ligature, ...(glyph.alias_ligatures ?? [])])}
			</p>
		{/if}

		<p>
			<span class="text-muted-foreground">Category:</span>
			<span
				class="text-(--category-color)"
				style:--category-color="var(--color-category-foreground-{glyph.usage_category})"
				>{glyph.usage_category}</span
			>
			({usage}%)
		</p>
	</Card.Content>
</Card.Root>
