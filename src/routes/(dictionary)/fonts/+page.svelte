<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { fontSentence } from "$lib/state";
	import { fly } from "svelte/transition";
	import FontEntry from "./FontEntry.svelte";
	import { Card, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";

	import CloseIcon from "~icons/lucide/x";
	import { entries } from "$lib/utils";

	export let data;
	$: ({
		linku: { fonts },
	} = data);

	let sidebarOpen = true;
</script>

<div class="flex-0 flex flex-col items-center gap-2">
	<h2 class="py-2 text-center text-4xl font-medium">Font Search</h2>

	<Input class="max-w-[30%]" bind:value={$fontSentence} />

	<main class="w-full p-4 grid grid-cols-[70%_30%] gap-2">
		<ul class="flex flex-col gap-2">
			{#each entries(fonts) as [name, font] (name)}
				<li>
					<FontEntry fontName={name} {font} />
				</li>
			{/each}
		</ul>

		{#if sidebarOpen}
			<aside transition:fly={{ x: 100 }}>
				<Card>
					<CardHeader class="relative">
						<CardTitle>Font Display Settings</CardTitle>
						<Button
							class="absolute top-2 right-4"
							variant="ghost"
							size="icon"
							on:click={() => (sidebarOpen = !sidebarOpen)}
						>
							<CloseIcon />
						</Button>
					</CardHeader>
				</Card>
			</aside>
		{/if}
	</main>
</div>
