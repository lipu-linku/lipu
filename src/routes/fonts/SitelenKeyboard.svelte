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

<div
	transition:slide
	class="md:p-1 grid grid-rows-[repeat(auto-fit,minmax(2.25rem,1fr))] grid-cols-[repeat(auto-fit,minmax(2.25rem,1fr))] gap-1.5"
>
	{#each keys as [word, data] (word)}
		<Button
			title={"title" in data ? data.title : data.label}
			class="font-sitelen-seli-kiwen text-2xl"
			variant="secondary"
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
