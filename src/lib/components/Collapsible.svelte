<script lang="ts">
	export let content: string;
	export let separator = ", ";
	export let length: number = 50;

	$: items = content.split(separator);

	let expanded = false;
</script>

<span {...$$restProps}>
	{expanded ? content : items.slice(0, length).join(separator)}

	{#if items.length > length}
		<button class="text-muted-foreground hover:underline" on:click={() => (expanded = !expanded)}>
			{expanded ? "less" : "...more"}
		</button>
	{/if}
</span>
