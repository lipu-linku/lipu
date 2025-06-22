<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";
	let { children, ...props }: SvelteHTMLElements["h4"] = $props();
</script>

<a
	class="relative hover:before:text-foreground before:transition-colors before:content-['#'] before:absolute before:text-xl before:-start-6.5 before:text-muted"
	href="#{props.id}"
>
	<h4 class={cn("text-balance text-xl tracking-tight font-medium", props.class)} {...props}>
		{@render children?.()}
	</h4>
</a>
