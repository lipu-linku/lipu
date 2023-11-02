<script lang="ts">
	import AudioButton from "$lib/components/AudioButton.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Tooltip, TooltipTrigger } from "$lib/components/ui/tooltip";
	import TooltipContent from "$lib/components/ui/tooltip/tooltip-content.svelte";
	import BackIcon from "~icons/lucide/arrow-left";
	import CopyIcon from "~icons/lucide/copy";
	import InfoIcon from "~icons/lucide/info";

	export let data;

	$: ({ word } = data);

	$: recognitionScore = Object.values(word.recognition ?? {}).at(-1) ?? "0";

	const listFormat = new Intl.ListFormat("en");

	const copyCodepoint = () => {
		navigator.clipboard.writeText(String.fromCodePoint(parseInt(word.ucsur!.slice(2), 16)));
	};
</script>

<div class="flex-1 grid grid-cols-[min-content_1fr] p-4 pb-2 gap-4">
	<Button href="/" class="justify-self-end" variant="ghost" size="icon">
		<BackIcon />
	</Button>

	<main class="flex-1 flex flex-col gap-4">
		<h1 class="font-semibold text-4xl flex items-center gap-4">
			{word.word}
			{#if word.audio}<AudioButton audio={word.audio} /> {/if}
		</h1>

		<div class="flex-1 grid grid-cols-3 gap-2 justify-stretch">
			<Card>
				<CardHeader>
					<CardTitle class="text-2xl" tag="h2">Definitions</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-col gap-3">
					<div class="space-y-2">
						<h3 class="font-medium text-xl">Common Definition</h3>
						<p>{word.def.en}</p>
					</div>

					{#if word.ku_data}
						<div class="space-y-2">
							<h3 class="flex items-center gap-2 font-medium text-xl">
								ku definitions
								<Tooltip>
									<TooltipTrigger asChild let:builder>
										<Button builders={[builder]} variant="ghost" size="icon"><InfoIcon /></Button>
									</TooltipTrigger>
									<TooltipContent class="max-w-[55ch]">
										Each ku definition is assigned a frequency index from ½ to 5, which describes
										how commonly it was translated that way in the toki pona community, according to
										a survey.
									</TooltipContent>
								</Tooltip>
							</h3>
							<p>{word.ku_data}</p>
						</div>
					{/if}

					{#if word.pu_verbatim}
						<div class="space-y-2">
							<h3 class="font-medium text-xl">pu definition</h3>
							<ul>
								{#each word.pu_verbatim.en.split("\n") as line}
									{@const partOfSpeech = line.split(" ")[0]}
									{@const definition = line.slice(partOfSpeech.length + 1)}

									<li>
										<span class="text-muted-foreground">{partOfSpeech}</span>
										{definition}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle class="text-2xl" tag="h2">Alternate Writing Systems</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-col gap-3">
					{#if word.sitelen_pona}
						<div class="space-y-2">
							<h3 class="font-medium text-xl">sitelen pona</h3>
							<p>
								<span class="text-7xl font-sitelen-pona">{word.sitelen_pona}</span>
							</p>
							{#if word.sitelen_pona_etymology}
								<p>
									{word.sitelen_pona_etymology}
								</p>
							{/if}
						</div>
					{/if}

					{#if word.sitelen_sitelen}
						<div class="space-y-2">
							<h3 class="font-medium text-xl">sitelen sitelen</h3>
							<img
								src={word.sitelen_sitelen}
								alt="{word.word} in sitelen sitelen format"
								class="dark:invert w-16 h-16 m-2"
							/>
						</div>
					{/if}

					{#if word.ucsur}
						<div class="space-y-2">
							<h3 class="font-medium text-xl">
								<a href="https://www.kreativekorp.com/ucsur/charts/sitelen.html" target="_blank">
									UCSUR Codepoint
								</a>
							</h3>

							<p class="flex items-center gap-2">
								{word.ucsur}
								<Button class="p-1 h-fit" variant="ghost" on:click={copyCodepoint}>
									<CopyIcon />
								</Button>
							</p>
						</div>
					{/if}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle class="text-2xl" tag="h2">More Info</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-col gap-3">
					{#if word.commentary}
						<h3 class="font-medium text-xl">Commentary</h3>
						<p>{word.commentary}</p>
					{/if}

					<div class="space-y-2">
						<h3 class="font-medium text-xl">Origin</h3>
						<ul class="flex flex-col justify-center gap-2">
							<li>
								<span class="text-muted-foreground">Derived from: </span>
								{listFormat.format(word.etymology_data.langs.split(";"))}
							</li>
							{#if word.etymology}
								<li>
									<span class="text-muted-foreground">Etymology: </span>
									{word.etymology}
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

					<div class="space-y-2">
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

					{#if word.see_also}
						<div class="space-y-2">
							<h3 class="font-medium text-xl">See also</h3>
							<ul class="flex flex-wrap items-center gap-2">
								{#each word.see_also.split(", ") as other}
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
</div>
