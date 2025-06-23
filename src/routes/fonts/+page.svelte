<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { fontSentence } from "$lib/state.svelte";
	import FontEntry from "./FontEntry.svelte";
	import SitelenKeyboard from "./SitelenKeyboard.svelte";
	
	import logo from "$lib/assets/icon-light.png?url";
	import KeyboardIcon from "~icons/lucide/keyboard";
	import KeyboardOffIcon from "~icons/lucide/keyboard-off";
	import ResetIcon from "~icons/lucide/rotate-cw";
	
	const { data } = $props();
	const { fonts } = $derived(data);

	let ucsur = $state(false);
	let ligatures = $state(false);
	let search = $state("");
	let keyboardOpen = $state(false);
	let fontSentenceInput = $state<HTMLInputElement | null>(null);

	const filtered = $derived(
		fonts
			.filter(([, f]) =>
				search
					? f.name.includes(search) ||
						f.filename.includes(search) ||
						f.creator.join(" ").includes(search)
					: true,
			)
			.filter(([, f]) => (ucsur ? f.ucsur : true))
			.filter(([, f]) => (ligatures ? f.ligatures : true)),
	);

	$effect(() => {
		if (window.matchMedia("(width >= 48rem)").matches) keyboardOpen = true;
	})
</script>

<svelte:head>
	<title>lipu Linku · Fonts</title>
	<meta name="description" content="Browse fonts for Toki Pona" />
	<meta name="og:title" content="lipu Linku · Fonts" />
	<meta name="og:description" content="Browse fonts for Toki Pona" />
	<meta name="og:image" content={logo} />
</svelte:head>

<main class="w-full p-4 space-y-2">
	<div class="flex items-center gap-2">
		<Input
			class="font-sitelen-seli-juniko md:text-2xl"
			bind:value={fontSentence.current}
			bind:ref={fontSentenceInput}
		/>
		<Button
			class="aspect-square"
			size="icon"
			variant="outline"
			onclick={() => (keyboardOpen = !keyboardOpen)}
		>
			{#if !keyboardOpen}
				<KeyboardIcon />
			{:else}
				<KeyboardOffIcon />
			{/if}
		</Button>
		<Button
			class="aspect-square"
			size="icon"
			variant="outline"
			onclick={() => (fontSentence.current = "jan li pana e moku tawa sina")}
		>
			<ResetIcon />
		</Button>
	</div>

	{#if keyboardOpen}
		<SitelenKeyboard bind:value={fontSentence.current} bind:input={fontSentenceInput} />
	{/if}

	<ul class="flex flex-col gap-2">
		{#each filtered as [id, font] (id)}
			<li>
				<FontEntry {font} />
			</li>
		{/each}
	</ul>
</main>
<!-- TODO: Work on the fonts search more, it needs attention -->
<!-- 
<aside class="sticky min-w-1/5 top-0 end-0 h-dvh px-2 py-4">
	<Card.Root class="h-full">
		<Card.Header>
			<Card.Title class="text-xl">Font Display Settings</Card.Title>
		</Card.Header>

		<Card.Content class="px-4 flex flex-col gap-4">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2 mb-2">
					<Input id="search-input" aria-label="Search for fonts" bind:value={search} />
				</div>

				<div class="flex items-center gap-2">
					<Checkbox id="ucsur-input" aria-labelledby="ucsur-label" bind:checked={ucsur} />
					<Label for="ucsur-input" id="ucsur-label">Only Show UCSUR Fonts</Label>
				</div>

				<div class="flex items-center gap-2">
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
</aside> -->
