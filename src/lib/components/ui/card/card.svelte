<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		thisEl?: HTMLDivElement;
	};

	let { class: className, thisEl = $bindable(), children, ...rest }: $$Props = $props();
</script>

<div
	class={cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)}
	bind:this={thisEl}
	{...rest}
>
	{@render children?.()}
</div>
