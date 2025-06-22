<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";

	let { children, ...props }: SvelteHTMLElements["h2"] = $props();
</script>

<a
	class="relative hover:before:text-foreground before:transition-colors before:content-['#'] before:absolute before:text-3xl before:-start-7.5 before:text-muted"
	href="#{props.id}"
>
	<h2
		class={cn("text-balance text-3xl border-b pb-2 tracking-tight font-semibold", props.class)}
		{...props}
	>
		{@render children?.()}
	</h2>
</a>
