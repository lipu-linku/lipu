<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import type { Font } from "$lib/types";
	import { fontSentence } from "$lib/state";
  import IntersectionObserver from "svelte-intersection-observer"l

	import WebIcon from "~icons/lucide/globe";
	import RepoIcon from "~icons/lucide/file-code";
	import DownloadIcon from "~icons/lucide/download";

	export let fontName: string;
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

	const loadFont = async () => {
		const fontFace = new FontFace(
			font.name_short,
			await fetch(font.links.fontfile).then((r) => r.arrayBuffer()),
		);
		await fontFace.load();
		document.fonts.add(fontFace);
	};
</script>

<IntersectionObserver>
	<Card>
		<CardHeader class="relative">
			<CardTitle>{fontName}</CardTitle>
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

		<CardContent class="text-4xl" style="font-family: '{font.name_short}'">
			{#await loadFont() then _}
				{$fontSentence}
			{:catch}
				The font failed to load.
			{/await}
		</CardContent>
	</Card>
</IntersectionObserver>
