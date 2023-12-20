<script lang="ts">
	import { fontSentence } from "$lib/state";
	import type { Font } from "$lib/types";
	import { entries } from "$lib/utils";
	import { fly } from "svelte/transition";
	import FontEntry from "./FontEntry.svelte";

	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from "$lib/components/ui/select";
	import CloseIcon from "~icons/lucide/x";

	export let data;
	$: ({
		linku: { fonts },
	} = data);

	type SortingMethod = {
		label: string;
		method: (a: Font, b: Font) => number;
	};

	const sortingMethods = {
		last_updated: {
			label: "Last Updated",
			method: (a, b) =>
				(b.last_updated ? new Date(b.last_updated).getTime() : 0) -
				(a.last_updated ? new Date(a.last_updated).getTime() : 0),
		},
		alphabetical: {
			label: "Alphabetically",
			method: (a, b) => a.name_short.localeCompare(b.name_short),
		},
	} as const satisfies Record<string, SortingMethod>;
	let sortingMethod: keyof typeof sortingMethods = "last_updated";

	$: sortedFonts = entries(fonts).sort(([_, a], [_1, b]) =>
		sortingMethods[sortingMethod].method(a, b),
	);

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
			{#each sortedFonts as [name, font] (name)}
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

					<CardContent class="flex flex-col gap-4">
						<div class="flex flex-col gap-2">
							<Label for="sort-by-input" id="sort-by-label">Sort By</Label>
							<Select>
								<SelectTrigger><SelectValue /></SelectTrigger>
								<SelectContent>
									{#each entries(sortingMethods) as [id, { label }] (id)}
										<SelectItem value={id}>{label}</SelectItem>
									{/each}
								</SelectContent>
								<SelectInput
									id="sort-by-input"
									aria-labelledby="sort-by-label"
									bind:value={sortingMethod}
								/>
							</Select>
						</div>
					</CardContent>
				</Card>
			</aside>
		{/if}
	</main>
</div>
