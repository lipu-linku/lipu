<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";

	let { children, ...props }: SvelteHTMLElements["td"] = $props();
</script>

<td
	class={cn(
		"border first:border-s-2 last:border-e-2 px-4 py-2 text-start [&[align=center]]:text-center [&[align=right]]:text-end whitespace-nowrap align-middle",
		props.class,
	)}
	{...props}
>
	{@render children?.()}
</td>
