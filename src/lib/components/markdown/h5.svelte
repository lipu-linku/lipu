<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";
	let { children, ...props }: SvelteHTMLElements["h5"] = $props();
</script>

<a
	class="relative hover:before:text-foreground before:transition-colors before:content-['#'] before:absolute before:text-lg before:-start-6 before:text-muted"
	href="#{props.id}"
>
	<h5 class={cn("text-balance text-lg tracking-tight font-medium", props.class)} {...props}>
		{@render children?.()}
	</h5>
</a>
