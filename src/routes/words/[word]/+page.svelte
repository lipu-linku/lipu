<script lang="ts">
	import { page } from "$app/state";
	import AudioButton from "$lib/components/AudioButton.svelte";
	import Collapsible from "$lib/components/Collapsible.svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { getTranslatedData } from "@kulupu-linku/sona/utils";
	import BackIcon from "~icons/lucide/arrow-left";
	import CodeIcon from "~icons/lucide/code-xml";
	import CopyIcon from "~icons/lucide/copy";
	import InfoIcon from "~icons/lucide/info";
	import GraphIcon from "~icons/lucide/line-chart";
	import ShareButton from "~icons/lucide/share-2";
	import WordsSearch from "../../(words)/WordsSearch.svelte";
	import UsageGraph from "./UsageGraph.svelte";

	const { data } = $props();
	const { word, language } = $derived(data);

	const usageScore = $derived(Object.values(word.usage).at(-1) ?? 0);
	const definition = $derived(getTranslatedData(word, "definition", language.id));
	const commentary = $derived(getTranslatedData(word, "commentary", language.id));
	const etymology = $derived(getTranslatedData(word, "etymology", language.id));
	const sitelenPonaEtymology = $derived(getTranslatedData(word, "sp_etymology", language.id));

	const hasRepresentations = $derived(
		word.representations &&
			(word.representations.ligatures?.length ||
				word.representations.sitelen_emosi ||
				word.representations.sitelen_jelo?.length ||
				word.representations.sitelen_sitelen ||
				word.representations.ucsur),
	);

	const pu_verbatim = $derived(
		word.pu_verbatim?.[
			language.id in word.pu_verbatim
				? (language.id as keyof (typeof word)["pu_verbatim"])
				: ("en" as const)
		],
	);

	const listFormat = $derived(
		new Intl.ListFormat(Intl.ListFormat.supportedLocalesOf([language.locale, "en"]), {
			style: "short",
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

<main class="flex-1 my-4 flex flex-col gap-4 pb-2">
	<header class="flex-1 flex items-center gap-4">
		<Button
			href={word.usage_category === "sandbox" ? "/sandbox" : "/"}
			class="justify-self-end"
			variant="ghost"
			size="icon"
		>
			<BackIcon />
		</Button>

		<h1 class="font-semibold text-4xl align-middle">{word.word}</h1>

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
					<ShareButton />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Label>Share word</DropdownMenu.Label>
					<DropdownMenu.Separator />

					<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(page.url.toString())}>
						<CopyIcon class="inline mr-2 size-4" />
						Copy URL
					</DropdownMenu.Item>

					<DropdownMenu.Item onclick={copyCodepoint}>
						<span class="text-2xl -ml-1 mr-2 font-sitelen-seli-kiwen">sitelen-pona</span>
						sitelen pona
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>

	<div class="flex-1 grid grid-cols-2 auto-rows-min gap-2">
		<Card.Root class="col-span-2">
			<Card.Header>
				<Card.Title class="text-2xl"><h2>Meaning</h2></Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-3">
				<div class="flex flex-col justify-center gap-2">
					<h3 class="font-medium text-xl">Common Definition</h3>
					<p dir={language.direction}>{definition}</p>
				</div>

				{#if word.ku_data}
					{@const kuString = Object.entries(word.ku_data).map(
						([def, usage]) => def + usageToIndex(usage),
					)}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="flex items-center gap-2 font-medium text-xl">
							ku definitions
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger
										class="grid place-items-center hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
									>
										<InfoIcon class="size-4 " />
									</Tooltip.Trigger>
									<Tooltip.Content class="max-w-[min(55ch,80%)]">
										Each ku definition is assigned a frequency index from ½ to 5, which describes
										how commonly it was translated that way in the toki pona community, according to
										a survey.
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</h3>

						<Collapsible content={listFormat.format(kuString)} />
					</div>
				{/if}

				{#if pu_verbatim}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="font-medium text-xl">pu definition</h3>
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
							<h3 class="flex items-center gap-2 font-medium text-xl">
								Semantic space by lipamanka
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger
											class="grid place-items-center hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
										>
											<InfoIcon class="size-4 " />
										</Tooltip.Trigger>
										<Tooltip.Content class="max-w-[min(55ch,80%)]">
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
				<Card.Content class="flex flex-col gap-3">
					{#if word.representations?.ligatures && word.representations?.ligatures?.length > 0}
						<div class="flex flex-col justify-center gap-2">
							<h3 class="font-medium text-xl">sitelen pona</h3>
							<p>
								<span class="text-7xl font-sitelen-seli-kiwen">
									{word.representations?.ligatures?.join(" ")}
								</span>
							</p>
							{#if sitelenPonaEtymology}
								<p dir={language.direction}>{sitelenPonaEtymology}</p>
							{/if}
						</div>
					{/if}

					{#if word.representations?.sitelen_sitelen}
						<div class="flex flex-col justify-center gap-2">
							<h3 class="font-medium text-xl">sitelen sitelen</h3>
							<img
								src={word.representations.sitelen_sitelen}
								alt="{word.word} in sitelen sitelen format"
								class="grayscale dark:invert size-16 m-2"
							/>
						</div>
					{/if}

					{#if word.representations?.ucsur}
						<div class="flex flex-col justify-center gap-2">
							<h3 class="flex items-center gap-2 first-letter:font-medium text-xl">
								<span>UCSUR Codepoint</span>
								<a
									class="grid place-items-center hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colorsx"
									href="https://www.kreativekorp.com/ucsur/charts/sitelen.html"
									target="_blank"
								>
									<InfoIcon class="align-middle size-4" />
								</a>
							</h3>

							<p class="flex items-center gap-2">
								{word.representations.ucsur}
								<Button class="p-1 h-fit" variant="ghost" onclick={copyCodepoint}>
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
			<Card.Content class="flex flex-col gap-3">
				{#if commentary}
					<h3 class="font-medium text-xl">Commentary</h3>
					<p dir={language.direction}>{commentary}</p>
				{/if}

				{#if etymology.length > 0 || word.creator || word.coined_year || word.coined_era}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="font-medium text-xl">Origin</h3>
						<ul class="flex flex-col justify-center gap-2">
							{#if word.etymology.length > 0 && etymology.length > 0}
								{#each word.etymology as etym, i}
									{@const local_etym = etymology[i]}
									<li dir={language.direction} class="text-start">
										{local_etym.language}{etym.word ? `: ${etym.word}` : ""}{etym.alt
											? ` (${etym.alt})`
											: ""}{local_etym.definition ? `; ${local_etym.definition}` : ""}
									</li>
								{/each}
							{/if}
							{#if word.creator}
								<li>
									<span class="text-muted-foreground">Created by: </span>
									{listFormat.format(word.creator)}
								</li>
							{/if}
							{#if word.coined_year || word.coined_era}
								<li>
									<span class="text-muted-foreground">Coined in:</span>
									{[word.coined_year, word.coined_era].filter(Boolean).join(", ")}
								</li>
							{/if}
						</ul>
					</div>
				{/if}

				<div class="flex flex-col justify-center gap-2">
					<h3 class="font-medium text-xl">Usage Data</h3>
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
						<li>
							<span class="text-muted-foreground">Book:</span>
							{word.book}
						</li>
					</ul>
				</div>

				{#if word.see_also.length > 0}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="font-medium text-xl">See also</h3>
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
				<Card.Content class="max-h-[600px] p-4 px-8">
					<UsageGraph data={word.usage} />
				</Card.Content>
				<Card.Footer>
					<p class="text-pretty text-sm text-muted-foreground">
						Before 2022, the survey asked "Do you consider this word real?"; After 2022, the
						question was changed to "Do you use this word?". Therefore, results before and after
						2022, marked by the red line, are not comparable.
					</p>
				</Card.Footer>
			</Card.Root>
		{/if}
	</div>
</main>

<WordsSearch />
