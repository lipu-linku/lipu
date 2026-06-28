<script lang="ts">
	import { cn } from "$lib/utils";
	import { Select as SelectPrimitive } from "bits-ui";

	import { selectTriggerBaseClass, SelectContext, setSelectContext } from "./select-context.svelte";

	let {
		value = $bindable(),
		disabled = false,
		children,
		...restProps
	}: Extract<SelectPrimitive.RootProps, { type: "single" }> = $props();

	const ctx = setSelectContext(new SelectContext());
</script>

{#if ctx.mode === "bits"}
	<SelectPrimitive.Root bind:value {disabled} {...restProps}>
		{@render children?.()}
	</SelectPrimitive.Root>
{:else}
	<!-- Mobile / no-JS baseline: a real `<select>` styled as the control, using
	     the platform-native popup. Also the SSR baseline before the desktop
	     swap to bits-ui. -->
	<select
		data-slot="select-native"
		{disabled}
		{value}
		onchange={(e) => (value = e.currentTarget.value)}
		class={cn(selectTriggerBaseClass, ctx.triggerClass)}
	>
		{@render children?.()}
	</select>
{/if}
