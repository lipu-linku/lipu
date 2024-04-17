<script lang="ts">
	import { fontSentence } from "$lib/state";
	import { entries } from "$lib/components/ui/utils";
	import { fly } from "svelte/transition";
	import FontEntry from "./FontEntry.svelte";

	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	import { Checkbox } from "$lib/components/ui/checkbox";
	import CloseIcon from "~icons/lucide/x";

	export let data;
	$: ({ fonts } = data);

	let ucsur = false;

	$: filtered = fonts.filter(([, f]) => (ucsur ? f.ucsur : true));

	let sidebarOpen = true;
</script>

<svelte:head>
	<title>lipu Linku &middot; Fonts</title>
</svelte:head>

<div class="flex-0 flex flex-col items-center gap-2">
	<h2 class="py-2 text-center text-4xl font-medium">Font Search</h2>

	<Input class="max-w-[30%]" bind:value={$fontSentence} />

	<main class="w-full p-4 grid grid-cols-[70%_30%] gap-2">
		<ul class="flex flex-col gap-2">
			{#each filtered as [id, font] (id)}
				<li>
					<FontEntry {font} />
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

					<CardContent class="flex flex-col gap-4">
						<div class="flex flex-col gap-2">
							<div class="flex items-center space-x-2">
								<Checkbox id="ucsur-input" aria-labelledby="ucsur-label" bind:checked={ucsur} />
								<Label for="ucsur-input" id="ucsur-label">Only Show UCSUR Fonts</Label>
							</div>
						</div>
					</CardContent>
				</Card>
			</aside>
		{/if}
	</main>
</div>
