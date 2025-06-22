<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";
	let { children, ...props }: SvelteHTMLElements["h3"] = $props();
</script>

<a
	class="relative hover:before:text-foreground before:transition-colors before:content-['#'] before:absolute before:text-2xl before:-start-7 before:text-muted"
	href="#{props.id}"
>
	<h3 class={cn("text-balance text-2xl tracking-tight font-medium", props.class)} {...props}>
		{@render children?.()}
	</h3></a
>
