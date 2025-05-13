<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		content: string;
		separator?: string;
		length?: number;
	}

	const { content, separator = ", ", length = 50, ...rest }: Props = $props();

	const items = $derived(content.split(separator));

	let expanded = $state(false);
</script>

<span {...rest}>
	{expanded ? content : items.slice(0, length).join(separator)}

	{#if items.length > length}
		<button class="text-muted-foreground hover:underline" onclick={() => (expanded = !expanded)}>
			{expanded ? "less" : "...more"}
		</button>
	{/if}
</span>
