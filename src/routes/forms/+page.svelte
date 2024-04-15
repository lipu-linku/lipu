<script context="module" lang="ts">
	import type { SvelteComponent } from "svelte";
	import type { SvelteHTMLElements } from "svelte/elements";

	export type FormCard = {
		href: `/forms/${string}`;
		label: string;
		description: string;
		icon: typeof SvelteComponent<SvelteHTMLElements["svg"]>;
	};
</script>

<script lang="ts">
	import * as Card from "$lib/components/ui/card";

	import WordIcon from "~icons/lucide/whole-word";
	import { entries } from "$lib/utils";

	const cards = {
		word: {
			href: "/forms/word",
			label: "New Word",
			description: "Submit a new word for consideration into ",
			icon: WordIcon,
		},
	} as const satisfies Record<string, FormCard>;
</script>

<h1 class="font-medium text-4xl">Forms</h1>
<p class="text-balance"></p>

<ul class="flex justify-center items-center gap-3 flex-wrap">
	{#each entries(cards) as [id, form] (id)}
		<li>
			<Card.Root class="transition-colors has-[a:hover]:border-zinc-400">
				<a href={form.href}>
					<Card.Header>
						<Card.Title tag="h2" class="flex items-center justify-center gap-2">
							<svelte:component this={form.icon} />
							{form.label}
						</Card.Title>
					</Card.Header>
					<Card.Content class="max-w-[35ch] text-balance text-center">
						{form.description}
					</Card.Content>
				</a>
			</Card.Root>
		</li>
	{/each}
</ul>
