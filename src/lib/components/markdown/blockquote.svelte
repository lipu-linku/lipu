<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";

	let { children, ...props }: SvelteHTMLElements["blockquote"] = $props();
</script>

<blockquote class={cn("border-s-2 ps-6 italic", props.class)} {...props}>
	{@render children?.()}
</blockquote>
