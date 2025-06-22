<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";

	let { children, ...props }: SvelteHTMLElements["div"] = $props();
</script>

<div class={cn("*:[pre]:p-4 border-4 *:rounded-lg rounded-xl relative", props.class)} {...props}>
	{@render children?.()}
</div>
