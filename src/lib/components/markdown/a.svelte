<script lang="ts">
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";
	import LinkIcon from "~icons/lucide/external-link";

	let { children, ...props }: SvelteHTMLElements["a"] = $props();
	const external = $derived(!props.href?.startsWith("/"));
</script>

<a
	class={cn("underline underline-offset-4 cursor-pointer", props.class)}
	target={external ? "_blank" : undefined}
	rel={external ? "noopener noreferrer" : undefined}
	{...props}
>
	{@render children?.()}

	{#if external}
		<LinkIcon class="inline" />
	{/if}
</a>
