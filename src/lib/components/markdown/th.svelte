<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";

	let { children, ...props }: SvelteHTMLElements["th"] = $props();
</script>

<th
	class={cn(
		"border first:border-s-2 last:border-e-2 px-4 py-2 text-start font-bold [&[align=center]]:text-center [&[align=right]]:text-end whitespace-nowrap align-middle",
		props.class,
	)}
	{...props}
>
	{@render children?.()}
</th>
