<script lang="ts">
	import { fontSentence } from "$lib/state";
	import { fly } from "svelte/transition";
	import * as m from "$paraglide/messages";

	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import FontEntry from "./FontEntry.svelte";

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
	<h2 class="py-2 text-center text-4xl font-medium">{m.fonts_title()}</h2>

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
				<Card.Root>
					<Card.Header class="relative">
						<Card.Title>{m.fonts_settings_title()}</Card.Title>
						<Button
							class="absolute top-2 right-4"
							variant="ghost"
							size="icon"
							on:click={() => (sidebarOpen = !sidebarOpen)}
						>
							<CloseIcon />
						</Button>
					</Card.Header>

					<Card.Content class="flex flex-col gap-4">
						<div class="flex flex-col gap-2">
							<div class="flex items-center space-x-2">
								<Checkbox id="ucsur-input" aria-labelledby="ucsur-label" bind:checked={ucsur} />
								<Label for="ucsur-input" id="ucsur-label"
									>{m.fonts_settings_only_show_ucsur()}</Label
								>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</aside>
		{/if}
	</main>
</div>
