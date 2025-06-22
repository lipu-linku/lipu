<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";
	let { children, ...props }: SvelteHTMLElements["h6"] = $props();
</script>

<a
	class="relative hover:before:text-foreground before:transition-colors before:content-['#'] before:absolute before:text-base before:-start-5.5 before:text-muted"
	href="#{props.id}"
>
	<h6 class={cn("text-balance text-base tracking-tight font-medium", props.class)} {...props}>
		{@render children?.()}
	</h6>
</a>
