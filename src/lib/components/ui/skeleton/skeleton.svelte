<script lang="ts">
	import type { HTMLAt$lib/components/ui/utils from "svelte/elements";
	import { cn } from "$lib/components/ui/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class={cn("animate-pulse rounded-md bg-muted", className)} {...$$restProps} />
