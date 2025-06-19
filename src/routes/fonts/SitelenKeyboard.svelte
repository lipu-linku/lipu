<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { ucsur_map } from "$lib/ucsur";
	import { slide } from "svelte/transition";

	type Props = {
		value: string;
		input: HTMLInputElement | null;
	};

	let { value = $bindable(""), input = $bindable() }: Props = $props();

	const keys = Object.entries(ucsur_map).filter(([key]) => !["(", ")", "{", "}"].includes(key));
</script>

<div transition:slide class="flex flex-wrap gap-1">
	{#each keys as [word, data] (word)}
		<Button
			title={"title" in data ? data.title : data.label}
			class="font-sitelen-seli-kiwen text-2xl w-min px-2.5"
			variant="outline"
			size="icon"
			onclick={() => {
				value += data.codepoint;
				input?.focus();
			}}
		>
			{data.label}
		</Button>
	{/each}
</div>
