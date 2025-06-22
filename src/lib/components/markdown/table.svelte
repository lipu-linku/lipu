<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";

	let { children, ...props }: SvelteHTMLElements["table"] = $props();
</script>

<table class={cn("w-full overflow-x-scroll", props.class)} {...props}>
	{@render children?.()}
</table>
