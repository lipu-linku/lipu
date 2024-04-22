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
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { entries } from "$lib/utils";
	import { signIn, signOut } from "@auth/sveltekit/client";

	import GithubIcon from "~icons/lucide/github";
	import WordIcon from "~icons/lucide/whole-word";

	export let data;
	$: ({ session } = data);

	const cards = {
		word: {
			href: "/forms/word",
			label: "New Word",
			description: "Submit a new word to the Sandbox for consideration in the next survey.",
			icon: WordIcon,
		},
	} as const satisfies Record<string, FormCard>;
</script>

<h1 class="text-4xl font-medium">Forms</h1>

<div>
	{#if !session}
		<Button on:click={() => signIn("github")}>
			Sign In with <GithubIcon class="ms-[1ch] inline-block" aria-label="GitHub" />
		</Button>
	{:else}
		<p>
			Signed in as {session.user?.name}
		</p>
		<Button on:click={() => signOut()}>Sign Out</Button>
	{/if}
</div>

<ul class="flex flex-wrap items-center justify-center gap-3">
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
