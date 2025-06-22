<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";

	let { children, ...props }: SvelteHTMLElements["tr"] = $props();
</script>

<tr
	class={cn(
		"even:bg-muted/30 first:*:[td]:border-t-2 m-0 border-t first:border-t-2 p-0 hover:bg-muted/50 transition-colors",
		props.class,
	)}
	{...props}
>
	{@render children?.()}
</tr>
