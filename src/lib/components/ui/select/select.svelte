<script lang="ts" generics="T">
	import { Select as SelectPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";

	type Props = SelectPrimitive.Props<T> & { children: Snippet };

	let {
		selected = $bindable(undefined),
		open = $bindable(undefined),
		children,
		...rest
	}: Props = $props();
</script>

<SelectPrimitive.Root bind:selected bind:open {...rest}>
	{@render children?.()}
</SelectPrimitive.Root>
