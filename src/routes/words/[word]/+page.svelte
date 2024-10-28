<script lang="ts">
	import { run } from "svelte/legacy";

	import AudioButton from "$lib/components/AudioButton.svelte";
	import Collapsible from "$lib/components/Collapsible.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
	import WordsSearch from "../../(words)/WordsSearch.svelte";
	import UsageGraph from "./UsageGraph.svelte";

	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Tooltip from "$lib/components/ui/tooltip";

	import { page } from "$app/stores";
	import { getTranslatedData } from "@kulupu-linku/sona/utils";

	import BackIcon from "~icons/lucide/arrow-left";
	import CopyIcon from "~icons/lucide/copy";
	import InfoIcon from "~icons/lucide/info";
	import ShareButton from "~icons/lucide/share-2";
	import { cn } from "$lib/utils";

	const { data } = $props();
	const { word, language, languages } = $derived(data);

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

<Navbar {language} {languages}>
	<WordsSearch class="hidden md:flex" />
</Navbar>

<WordsSearch
	class="flex sticky z-50 top-0 border-b border-border/40 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
/>

<main class="flex-1 max-w-screen-2xl 2xl:mx-auto flex flex-col gap-4 p-4 pb-2">
	<header class="flex-1 flex items-center gap-4">
		<Button href="/" class="justify-self-end" variant="ghost" size="icon">
			<BackIcon />
		</Button>

		<h1 class="font-semibold text-4xl align-middle">{word.word}</h1>

		<div class="ml-auto flex items-center gap-2">
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

					<DropdownMenu.Item on:click={() => navigator.clipboard.writeText($page.url.toString())}>
						<CopyIcon class="inline mr-2 size-4" />
						Copy URL
					</DropdownMenu.Item>

					<DropdownMenu.Item on:click={copyCodepoint}>
						<span class="text-2xl -ml-1 mr-2 font-sitelen-pona">sitelen-pona</span>
						sitelen pona
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>

	<div
		class={cn(
			"flex-1 grid grid-cols-3 max-md:flex max-md:flex-col gap-2 justify-stretch",
			!hasRepresentations && "grid-cols-2",
		)}
	>
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-2xl" tag="h2">Meaning</Card.Title>
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
							<Tooltip.Root>
								<Tooltip.Trigger
									class="grid place-items-center hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
								>
									<InfoIcon class="size-4 " />
								</Tooltip.Trigger>
								<Tooltip.Content class="max-w-[min(55ch,80%)]">
									Each ku definition is assigned a frequency index from ½ to 5, which describes how
									commonly it was translated that way in the toki pona community, according to a
									survey.
								</Tooltip.Content>
							</Tooltip.Root>
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
			</Card.Content>
		</Card.Root>

		{#if hasRepresentations}
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-2xl" tag="h2">Usage</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3">
					{#if word.representations?.ligatures && word.representations?.ligatures?.length > 0}
						<div class="flex flex-col justify-center gap-2">
							<h3 class="font-medium text-xl">sitelen pona</h3>
							<p>
								<span class="text-7xl font-sitelen-pona">
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
								class="dark:invert size-16 m-2"
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
								<Button class="p-1 h-fit" variant="ghost" on:click={copyCodepoint}>
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
				<Card.Title class="text-2xl" tag="h2">More Info</Card.Title>
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
							{word.usage_category}
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
			<Card.Root class="col-span-3">
				<Card.Header>
					<Card.Title class="text-2xl" tag="h2">Usage Trend</Card.Title>
				</Card.Header>
				<Card.Content class="h-[600px] p-4 px-8">
					<UsageGraph data={word.usage} />
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
</main>
