<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { fontSentence } from "$lib/state.svelte";
	import type { Font } from "@kulupu-linku/sona/v1";
	import { useIntersectionObserver } from "runed";
	import { fly } from "svelte/transition";

	import DownloadIcon from "~icons/lucide/download";
	import RepoIcon from "~icons/lucide/file-code";
	import WebIcon from "~icons/lucide/globe";

	interface Props {
		font: Font;
	}

	const { font }: Props = $props();

	let cardElement = $state<HTMLDivElement | null>(null);
	let intersecting = $state(false);
	useIntersectionObserver(
		() => cardElement,
		(entries) => {
			intersecting = entries[0]?.isIntersecting ?? false;
		},
	);

	let malformed = $state(false);

	const lastUpdatedDate = $derived(
		font.last_updated
			? Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
					new Date(font.last_updated),
				)
			: undefined,
	);

	const fontDescription = $derived(
		[
			`Created by ${font.creator.join(", ")}`,
			`Updated on ${lastUpdatedDate}`,
			`Licensed as ${font.license}`,
		]
			.filter((s) => !s.includes("undefined"))
			.join(" · "),
	);

	const loadFont = async () => {
		const fontFace = new FontFace(
			font.name,
			`url("https://raw.githubusercontent.com/lipu-linku/ijo/main/nasinsitelen/${encodeURIComponent(font.filename)}")`,
		);

		try {
			await fontFace.load();
			document.fonts.add(fontFace);
		} catch (e) {
			console.error(e);
			malformed = true;
		}
	};
</script>

<Card.Root bind:ref={cardElement} class={[malformed && "hidden"]}>
	<Card.Header class="relative">
		<Card.Title class="text-2xl max-w-[10ch] md:max-w-full">{font.name}</Card.Title>
		<Card.Description>{fontDescription}</Card.Description>
		<nav class="absolute right-4 flex items-center gap-2">
			{#if font.links.repo}
				<Button
					variant="outline"
					size="icon"
					href={font.links.repo}
					target="_blank"
					rel="noopener noreferrer"
				>
					<RepoIcon />
				</Button>
			{/if}
			{#if font.links.webpage}
				<Button
					variant="outline"
					size="icon"
					href={font.links.webpage}
					target="_blank"
					rel="noopener noreferrer"
				>
					<WebIcon />
				</Button>
			{/if}
			<Button
				variant="outline"
				size="icon"
				href="https://raw.githubusercontent.com/lipu-linku/ijo/main/nasinsitelen/{font.filename}"
				download
			>
				<DownloadIcon />
			</Button>
		</nav>
	</Card.Header>

	<Card.Content class="text-3xl">
		{#if intersecting}
			{#await loadFont()}
				Loading...
			{:then}
				<span transition:fly={{ y: 10, duration: 200 }} style="font-family: '{font.name}'">
					{#if fontSentence.current.match(/[\u{F1900}-\u{F19FF}]/gu)}{/if}
					{fontSentence.current.trim()}
				</span>
			{:catch}
				The font failed to load.
			{/await}
		{:else}
			Loading...
		{/if}
	</Card.Content>
</Card.Root>
