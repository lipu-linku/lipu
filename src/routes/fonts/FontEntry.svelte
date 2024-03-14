<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { fontSentence } from "$lib/state";
	import type { Font } from "@kulupu-linku/sona";
	import { flyAndScale } from "$lib/utils";
	import IntersectionObserver from "svelte-intersection-observer";

	import DownloadIcon from "~icons/lucide/download";
	import RepoIcon from "~icons/lucide/file-code";
	import WebIcon from "~icons/lucide/globe";

	export let font: Font;

	$: lastUpdatedDate = font.last_updated
		? Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
				new Date(font.last_updated),
			)
		: undefined;

	$: fontDescription = [
		`Created by ${font.creator}`,
		`Updated on ${lastUpdatedDate}`,
		`Licensed as ${font.license}`,
	]
		.filter((s) => !s.includes("undefined"))
		.join(" · ");

	let cardElement: HTMLDivElement;

	const loadFont = async () => {
		const fontFace = new FontFace(
			font.name,
			`url(https://raw.githubusercontent.com/lipu-linku/ijo/main/nasinsitelen/${font.filename})`,
		);
		await fontFace.load();
		document.fonts.add(fontFace);
	};
</script>

<IntersectionObserver once element={cardElement} let:intersecting>
	<Card bind:thisEl={cardElement}>
		<CardHeader class="relative">
			<CardTitle>{font.name}</CardTitle>
			<CardDescription>{fontDescription}</CardDescription>
			<nav class="absolute top-2 right-4 flex items-center gap-2">
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
				<Button variant="outline" size="icon" href={font.links.fontfile} download>
					<DownloadIcon />
				</Button>
			</nav>
		</CardHeader>

		<CardContent class="text-3xl">
			{#if intersecting}
				{#await loadFont()}
					Loading...
				{:then}
					<span transition:flyAndScale={{ y: 10 }} style="font-family: '{font.name}'">
						{#if $fontSentence.match(/[\u{F1900}-\u{F19FF}]/gu)}{/if}
						{$fontSentence.trim()}
					</span>
				{:catch}
					The font failed to load.
				{/await}
			{:else}
				Loading...
			{/if}
		</CardContent>
	</Card>
</IntersectionObserver>
