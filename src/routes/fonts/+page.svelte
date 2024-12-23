<script lang="ts">
	import FontEntry from "./FontEntry.svelte";
	import { fontSentence } from "$lib/state.svelte";

	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Label } from "$lib/components/ui/label";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";

	import logo from "$lib/assets/icon-light.png?url";
	import ResetIcon from "~icons/lucide/rotate-cw";

	const { data } = $props();
	const { fonts } = $derived(data);

	let ucsur = $state(false);
	let ligatures = $state(false);

	const filtered = $derived(
		fonts
			.filter(([, f]) => (ucsur ? f.ucsur : true))
			.filter(([, f]) => (ligatures ? f.ligatures : true)),
	);
</script>

<svelte:head>
	<title>lipu Linku · Fonts</title>
	<meta name="description" content="Browse fonts for Toki Pona" />
	<meta name="og:title" content="lipu Linku · Fonts" />
	<meta name="og:description" content="Browse fonts for Toki Pona" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="w-full my-4">
	<ul class="flex flex-col gap-2">
		{#each filtered as [id, font] (id)}
			<li>
				<FontEntry {font} />
			</li>
		{/each}
	</ul>
</main>

<aside class="sticky min-w-1/5 top-0 end-0 h-dvh px-2 py-4">
	<Card.Root class="h-full">
		<Card.Header class="px-4">
			<Card.Title>Font Display Settings</Card.Title>
		</Card.Header>

		<Card.Content class="px-4 flex flex-col gap-4">
			<div class="flex items-center gap-2">
				<Input bind:value={fontSentence.current} />
				<Button
					class="aspect-square"
					size="icon"
					variant="outline"
					onclick={() => (fontSentence.current = "jan li pana e moku tawa sina")}
				>
					<ResetIcon />
				</Button>
			</div>

			<div class="flex flex-col gap-2">
				<div class="flex items-center space-x-2">
					<Checkbox id="ucsur-input" aria-labelledby="ucsur-label" bind:checked={ucsur} />
					<Label for="ucsur-input" id="ucsur-label">Only Show UCSUR Fonts</Label>
				</div>

				<div class="flex items-center space-x-2">
					<Checkbox
						id="ligatures-input"
						aria-labelledby="ligatures-label"
						bind:checked={ligatures}
					/>
					<Label for="ligatures-input" id="ligatures-label">Only Show Ligature Fonts</Label>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</aside>
