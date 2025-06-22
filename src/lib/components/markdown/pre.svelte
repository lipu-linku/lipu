<script lang="ts">
	import { browser } from "$app/environment";
	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import type { SvelteHTMLElements } from "svelte/elements";
	import CopyIcon from "~icons/lucide/copy";
	import CopyDoneIcon from "~icons/lucide/copy-check";

	let { code, children, ...props }: SvelteHTMLElements["div"] & { code: string } = $props();

	let copied = $state(false);
	const copyCode = async () => {
		if (!browser) return;
		await navigator.clipboard.writeText(code.trim());
		copied = true;
    
    setTimeout(() => (copied = false), 1000)
  };
</script>

<div class={cn("*:[pre]:p-4 border-4 *:rounded-lg rounded-xl relative", props.class)} {...props}>
	{@render children?.()}

	<Button class="absolute top-2 end-2" size="icon" variant="ghost" onclick={() => copyCode()}>
		{#if copied}
			<CopyDoneIcon />
		{:else}
			<CopyIcon />
		{/if}
	</Button>
</div>
