<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";

	let { children, ...props }: SvelteHTMLElements["h1"] = $props();
</script>

<a
	class="relative hover:before:text-foreground before:transition-colors before:content-['#'] before:absolute before:text-4xl before:-start-8 before:text-muted"
	href="#{props.id}"
>
	<h1
		class={cn("text-balance text-4xl border-b pb-2 tracking-tight font-semibold", props.class)}
		{...props}
	>
		{@render children?.()}
	</h1>
</a>
