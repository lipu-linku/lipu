<script lang="ts">
	import { page } from "$app/stores";
	import AudioButton from "$lib/components/AudioButton.svelte";
	import Collapsible from "$lib/components/Collapsible.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from "$lib/components/ui/dropdown-menu";
	import { Tooltip, TooltipContent, TooltipTrigger } from "$lib/components/ui/tooltip";
	import { getTranslatedData } from "$lib/utils.js";
	import BackIcon from "~icons/lucide/arrow-left";
	import CopyIcon from "~icons/lucide/copy";
	import InfoIcon from "~icons/lucide/info";
	import ShareButton from "~icons/lucide/share-2";

	export let data;
	$: ({ word, language } = data);

	$: recognitionScore = Object.values(word.usage).at(-1) ?? 0;
	$: definition = getTranslatedData(word, "definitions", language);
	$: commentary = getTranslatedData(word, "commentary", language);
	$: etymology = getTranslatedData(word, "etymology", language);
	$: sitelenPonaEtymology = getTranslatedData(word, "sp_etymology", language);

	$: pu_verbatim =
		word.pu_verbatim?.[
			language in word.pu_verbatim
				? (language as keyof NonNullable<typeof word.pu_verbatim>)
				: ("en" as const)
		];

	$: etym_string = etymology.map((it, i) => {
		const constant = word.etymology[i];

		return `${constant.word ?? ""} ${constant.alt ? `(${constant.alt})` : ""}`.trim();
	});

	const listFormat = new Intl.ListFormat("en");

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
			String.fromCodePoint(parseInt(word.representations.ucsur!.slice(2), 16)),
		);
	};
</script>

<svelte:head>
	<title>lipu Linku &middot; {word.word}</title>
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/lipu-linku/ijo/main/sitelenpona/sitelen-seli-kiwen/{word.word}.png"
	/>
</svelte:head>

<main class="flex-1 flex flex-col gap-4 p-4 pb-2">
	<header class="flex-1 flex items-center gap-4">
		<Button href="/" class="justify-self-end" variant="ghost" size="icon">
			<BackIcon />
		</Button>

		<h1 class="font-semibold text-4xl align-middle">{word.word}</h1>

		<div class="ml-auto flex items-center gap-2">
			{#if word.audio}
				<AudioButton audio={word.audio} />
			{/if}
			<DropdownMenu>
				<DropdownMenuTrigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="icon">
						<ShareButton />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Share word</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<DropdownMenuItem on:click={() => navigator.clipboard.writeText($page.url.toString())}>
						<CopyIcon class="inline mr-2 size-4" />
						Copy URL
					</DropdownMenuItem>

					<DropdownMenuItem on:click={copyCodepoint}>
						<span class="text-2xl -ml-1 mr-2 font-sitelen-pona">sitelen-pona</span>
						sitelen pona
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</header>

	<div class="flex-1 grid sm:grid-cols-3 max-sm:flex max-sm:flex-col gap-2 justify-stretch">
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl" tag="h2">Meaning</CardTitle>
			</CardHeader>
			<CardContent class="flex flex-col gap-3">
				<div class="flex flex-col justify-center gap-2">
					<h3 class="font-medium text-xl">Common Definition</h3>
					<p>{definition}</p>
				</div>

				{#if word.ku_data}
					{@const kuString = Object.entries(word.ku_data).map(
						([def, usage]) => def + usageToIndex(usage),
					)}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="flex items-center gap-2 font-medium text-xl">
							ku definitions
							<Tooltip>
								<TooltipTrigger
									class="grid place-items-center hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors"
								>
									<InfoIcon class="size-4 " />
								</TooltipTrigger>
								<TooltipContent class="max-w-[min(55ch,80%)]">
									Each ku definition is assigned a frequency index from ½ to 5, which describes how
									commonly it was translated that way in the toki pona community, according to a
									survey.
								</TooltipContent>
							</Tooltip>
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
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="text-2xl" tag="h2">Usage</CardTitle>
			</CardHeader>
			<CardContent class="flex flex-col gap-3">
				{#if word.representations.sitelen_pona.length > 0}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="font-medium text-xl">sitelen pona</h3>
						<p>
							<span class="text-7xl font-sitelen-pona">
								{word.representations.sitelen_pona.join(" ")}
							</span>
						</p>
						{#if sitelenPonaEtymology}
							<p>{sitelenPonaEtymology}</p>
						{/if}
					</div>
				{/if}

				{#if word.representations.sitelen_sitelen}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="font-medium text-xl">sitelen sitelen</h3>
						<img
							src={word.representations.sitelen_sitelen}
							alt="{word.word} in sitelen sitelen format"
							class="dark:invert size-16 m-2"
						/>
					</div>
				{/if}

				{#if word.representations.ucsur}
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
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="text-2xl" tag="h2">More Info</CardTitle>
			</CardHeader>
			<CardContent class="flex flex-col gap-3">
				{#if commentary}
					<h3 class="font-medium text-xl">Commentary</h3>
					<p>{commentary}</p>
				{/if}

				{#if etymology.length > 0 || word.creator || word.coined_year || word.coined_era}
					<div class="flex flex-col justify-center gap-2">
						<h3 class="font-medium text-xl">Origin</h3>
						<ul class="flex flex-col justify-center gap-2">
							{#if etymology.length > 0}
								<li>
									<span class="text-muted-foreground">Derived from: </span>
									{listFormat.format(etymology.map((e) => e.language))}
								</li>
							{/if}
							{#if word.etymology.length > 0}
								<li>
									<span class="text-muted-foreground">Etymology: </span>
									{#each word.etymology as data, i}
										{@const localized_data = etymology[i]}
										{data.word ?? ""}
										<span class="font-semibold">{data.alt ? `(${data.alt})` : ""}</span>
										<span class="italic">{localized_data?.definition ?? ""}</span>
									{/each}
								</li>
							{/if}
							{#if word.creator}
								<li>
									<span class="text-muted-foreground">Created by: </span>
									{word.creator}
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
							<span class="text-muted-foreground">Recognition Score:</span>
							{recognitionScore}%
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
			</CardContent>
		</Card>
	</div>
</main>
