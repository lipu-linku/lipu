<script lang="ts">
	import { page } from "$app/state";
	import AudioButton from "$lib/components/AudioButton.svelte";
	import Collapsible from "$lib/components/Collapsible.svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { getGlyph } from "$lib/remote/glyphs.remote";
	import { getWord } from "$lib/remote/words.remote";
	import { cn } from "$lib/utils";
	import BackIcon from "~icons/lucide/arrow-left";
	import CodeIcon from "~icons/lucide/code-xml";
	import CopyIcon from "~icons/lucide/copy";
	import InfoIcon from "~icons/lucide/info";
	import GraphIcon from "~icons/lucide/line-chart";
	import ShareIcon from "~icons/lucide/share-2";

	import GlyphCard from "./GlyphCard.svelte";
	import UsageGraph from "./UsageGraph.svelte";

	const { params } = $props();
	const locale = $derived(page.data.locale);
	const word = $derived(await getWord({ word: params.word, locale: locale.id }));

	const usageScore = $derived(Object.values(word.usage).at(-1) ?? 0);

	const { definition, commentary, etymology } = $derived(word.translations);

	const hasRepresentations = $derived(
		word.glyph_ids.length ||
			word.representations.sitelen_emosi ||
			word.representations.sitelen_jelo?.length ||
			word.representations.sitelen_sitelen ||
			word.representations.ucsur,
	);

	const pu_verbatim = $derived(
		word.pu_verbatim?.[
			locale.id in word.pu_verbatim
				? (locale as keyof (typeof word)["pu_verbatim"])
				: ("en" as const)
		],
	);

	const listFormat = $derived(
		new Intl.ListFormat(Intl.ListFormat.supportedLocalesOf([locale.id, "en"]), {
			style: "narrow",
		}),
	);

	const usageToIndex = (usage: number) => {
		if (usage > 80) return "⁵";
		if (usage > 60) return "⁴";
		if (usage > 40) return "³";
		if (usage > 20) return "²";
		if (usage > 10) return "¹";
		return "½";
	};

	const copyCodepoint = () => {
		navigator.clipboard.writeText(
			String.fromCodePoint(parseInt(word.representations!.ucsur!.slice(2), 16)),
		);
	};
</script>

<svelte:head>
	<title>lipu Linku · {word.word}</title>
	<meta property="description" content={definition} />
	<meta property="og:title" content="lipu Linku · {word.word}" />
	<meta property="og:description" content={definition} />
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/lipu-linku/ijo/main/sitelenpona/sitelen-seli-kiwen/{word.word}.png"
	/>
</svelte:head>

<main class="my-4 grid flex-1 grid-cols-2 gap-4 pb-2">
	<header class="col-span-2 flex items-center gap-4">
		<Button
			href={word.usage_category === "sandbox" ? "/sandbox" : "/"}
			class="justify-self-end"
			variant="ghost"
			size="icon"
		>
			<BackIcon />
		</Button>

		<h1 class="align-middle text-4xl font-semibold">{word.word}</h1>

		<div class="ml-auto flex items-center gap-2">
			<Button
				href="https://github.com/lipu-linku/sona/blob/main/words/metadata/{word.id}.toml"
				variant="outline"
				size="icon"
				target="_blank"
				rel="noopener noreferrer"
			>
				<CodeIcon />
			</Button>
			{#if word.audio}
				<AudioButton audio={word.audio} />
			{/if}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
					<ShareIcon />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Label>Share word</DropdownMenu.Label>
					<DropdownMenu.Separator />

					<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(page.url.toString())}>
						<CopyIcon class="mr-2 inline size-4" />
						Copy URL
					</DropdownMenu.Item>

					<DropdownMenu.Item onclick={copyCodepoint}>
						<span class="mr-2 -ml-1 font-sitelen-seli-kiwen text-2xl">sitelen-pona</span>
						sitelen pona
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>

	<Card.Root class={cn("col-span-2", !hasRepresentations && "col-span-1")}>
		<Card.Header>
			<Card.Title class="text-2xl"><h2>Meaning</h2></Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-3">
			<div class="flex flex-col justify-center gap-2">
				<h3 class="text-xl font-medium">Common Definition</h3>
				<p>{definition}</p>
			</div>

			{#if word.ku_data}
				{@const kuString = Object.entries(word.ku_data).map(
					([def, usage]) => def + usageToIndex(usage),
				)}
				<div class="flex flex-col justify-center gap-2">
					<h3 class="flex items-center gap-2 text-xl font-medium">
						ku definitions
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
									<InfoIcon class="size-4" />
								</Tooltip.Trigger>
								<Tooltip.Content class="max-inline-10ch text-center">
									Each ku definition is assigned a frequency index from ½ to 5, which describes how
									commonly it was translated that way in the toki pona community, according to a
									survey.
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					</h3>

					<Collapsible content={listFormat.format(kuString)} />
				</div>
			{/if}

			{#if pu_verbatim}
				<div class="flex flex-col justify-center gap-2">
					<h3 class="text-xl font-medium">pu definition</h3>
					<ul>
						{#each pu_verbatim.split("\n") as line}
							{@const [partOfSpeech, ...definition] = line.split(" ")}

							<li>
								<span class="text-muted-foreground">{partOfSpeech}</span>
								{definition.join(" ")}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if word.resources?.lipamanka_semantic}
				{@const [url, id] = word.resources.lipamanka_semantic.split("#")}
				{#await fetch(url)
					.then((r) => r.text())
					.then((text) => {
						const doc = document.createElement("html");
						doc.innerHTML = text;
						const el = doc.querySelectorAll(`details > summary#${id} ~ p`);
						if (el.length > 0) return [...el]
								.reduce((acc, it) => acc + "\n\n" + it.textContent, "")
								.trim();
						else throw new Error(`Could not find a semantic space definition for ${id}`);
					}) then semantic}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="flex items-center gap-2 text-xl font-medium">
							Semantic space by lipamanka
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
										<InfoIcon class="size-4" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										This information is sourced from <a
											class="underline"
											href={word.resources.lipamanka_semantic}
											target="_blank"
											rel="noopener noreferrer"
										>
											lipamanka's semantic space dictionary
										</a>. If you think something is wrong, please contact it!
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</h3>

						<Collapsible class="whitespace-pre-line" separator=" " content={semantic} />
					</div>
				{/await}
			{/if}
		</Card.Content>
	</Card.Root>

	{#if hasRepresentations}
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-2xl"><h2>Usage</h2></Card.Title>
			</Card.Header>
			<Card.Content class="grid grid-cols-3 place-items-start gap-x-3">
				{#if word.glyph_ids.length > 0}
					{@const glyphs = (
						await Promise.all(word.glyph_ids.map(async (glyph) => await getGlyph(glyph)))
					).sort((a, b) => {
						if (a.primary) return -1;
						if (b.primary) return 1;
						return a.id.localeCompare(b.id);
					})}

					<div class="grid">
						<h3 class="text-xl font-medium">sitelen pona</h3>
						<ul class="my-2 grid grid-cols-[repeat(auto-fill,minmax(--spacing(16),1fr))] gap-4">
							{#each glyphs as glyph (glyph.id)}
								<GlyphCard {glyph} {listFormat} />
							{/each}
						</ul>
					</div>
				{/if}

				{#if word.representations?.sitelen_sitelen}
					<div class="grid">
						<h3 class="text-xl font-medium">sitelen sitelen</h3>
						<img
							src={word.representations.sitelen_sitelen}
							alt="{word.word} in sitelen sitelen format"
							class="m-2 size-16 grayscale dark:invert"
						/>
					</div>
				{/if}

				{#if word.representations?.ucsur}
					<div class="grid">
						<h3 class="flex items-center gap-2 text-xl font-medium">
							<span>UCSUR Codepoint</span>
							<a
								class="transition-colorsx grid place-items-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
								href="https://www.kreativekorp.com/ucsur/charts/sitelen.html"
								target="_blank"
							>
								<InfoIcon class="size-4 align-middle" />
							</a>
						</h3>

						<p class="flex items-center gap-2">
							{word.representations.ucsur}
							<Button class="h-fit p-1" variant="ghost" onclick={copyCodepoint}>
								<CopyIcon />
							</Button>
						</p>
					</div>
				{/if}

				<!-- TODO: find a good way to lazy load the word's luka pona sign by name -->
				<!-- {#if word.luka_pona}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="font-medium text-xl">luka pona</h3>
						<video class="rounded-md" controls muted playsinline preload="metadata">
							<source src={word.luka_pona.mp4} type="video/mp4" />
							<source src={word.luka_pona.gif} type="video/gif" />
						</video>
					</div>
				{/if} -->
			</Card.Content>
		</Card.Root>
	{/if}

	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl"><h2>More Info</h2></Card.Title>
		</Card.Header>
		<Card.Content class="grid grid-cols-4 grid-rows-[min-content_1fr] gap-x-6 gap-y-2">
			{#if commentary}
				<div class="row-span-2 grid grid-rows-subgrid place-items-start">
					<h3 class="text-xl font-medium">Commentary</h3>
					<p>{commentary}</p>
				</div>
			{/if}

			{#if etymology || word.author || word.creation_date || word.coined_era}
				<div class="row-span-2 grid grid-rows-subgrid place-items-start">
					<h3 class="text-xl font-medium">Origin</h3>
					<ul class="flex flex-col justify-center gap-2">
						{#if etymology}
							<li class="text-start">
								{etymology}
							</li>
						{/if}
						{#if word.author}
							<li>
								<span class="text-muted-foreground">Created by: </span>
								{listFormat.format(word.author)}
							</li>
						{/if}
						{#if word.creation_date || word.coined_era}
							<li>
								<span class="text-muted-foreground">Coined in:</span>
								{[word.creation_date, word.coined_era].filter(Boolean).join(", ")}
							</li>
						{/if}
					</ul>
				</div>
			{/if}

			<div class="row-span-2 grid grid-rows-subgrid place-items-start">
				<h3 class="text-xl font-medium">Usage Data</h3>
				<ul class="flex flex-col justify-center gap-2">
					<li>
						<span class="text-muted-foreground">Category:</span>
						<span
							class="text-(--category-foreground-color)"
							style:--category-foreground-color="var(--color-category-foreground-{word.usage_category})"
							>{word.usage_category}</span
						>
					</li>
					<li>
						<span class="text-muted-foreground">Usage:</span>
						{usageScore}%
					</li>
					{#if word.book !== "none"}
						<li>
							<span class="text-muted-foreground">Book:</span>
							{word.book}
						</li>
					{/if}
				</ul>
			</div>

			{#if word.see_also.length > 0}
				<div class="row-span-2 grid grid-rows-subgrid place-items-start">
					<h3 class="text-xl font-medium">See also</h3>
					<ul class="flex flex-wrap items-center gap-2">
						{#each word.see_also as other}
							<li>
								<Button href="/words/{other}" variant="outline" size="sm">{other}</Button>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>

	{#if Object.keys(word.usage).length > 1}
		{@render graphCard()}
	{/if}
</main>

{#snippet graphCard()}
	<Card.Root class="col-span-2">
		<Card.Header class="flex flex-row justify-between">
			<Card.Title class="text-2xl"><h2>Usage Trend</h2></Card.Title>

			<Button
				variant="outline"
				size="icon"
				href="https://ilo.muni.la/?query={word.word}"
				target="_blank"
				rel="noopener noreferrer"
			>
				<GraphIcon />
			</Button>
		</Card.Header>
		<Card.Content class="min-h-100 p-4 px-8">
			<UsageGraph data={word.usage} />
		</Card.Content>
		{#if Object.keys(word.usage).some((date) => new Date(date) < new Date("2022-01-01"))}
			<Card.Footer>
				<p class="text-sm text-pretty text-muted-foreground">
					Before 2022, the survey asked "Do you consider this word real?"; After 2022, the question
					was changed to "Do you use this word?". Therefore, results before and after 2022, marked
					by the red line, are not comparable.
				</p>
			</Card.Footer>
		{/if}
	</Card.Root>
{/snippet}
