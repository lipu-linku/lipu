<script lang="ts">
	import { cn, type WithoutChild } from "$lib/utils";
	import { Select as SelectPrimitive } from "bits-ui";
	import CheckIcon from "~icons/lucide/check";

	import { useSelectContext } from "./select-context.svelte";

	let {
		ref = $bindable(null),
		class: className,
		value,
		label,
		children: childrenProp,
		...restProps
	}: WithoutChild<SelectPrimitive.ItemProps> = $props();

	const ctx = useSelectContext();
</script>

{#if ctx.mode === "native"}
	<!-- Text only: the native popup renders text, and non-`option` markup (e.g.
	     icon SVGs) inside `<select>` is dropped by the HTML parser, which would
	     break hydration. -->
	<option {value} {label}>{label ?? value}</option>
{:else}
	<SelectPrimitive.Item
		bind:ref
		{value}
		data-slot="select-item"
		class={cn(
			"relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
			className,
		)}
		{...restProps}
	>
		{#snippet children({ selected, highlighted })}
			<span class="absolute inset-e-2 flex size-3.5 items-center justify-center">
				{#if selected}
					<CheckIcon class="size-4" />
				{/if}
			</span>
			{#if childrenProp}
				{@render childrenProp({ selected, highlighted })}
			{:else}
				{label || value}
			{/if}
		{/snippet}
	</SelectPrimitive.Item>
{/if}
