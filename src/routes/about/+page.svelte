<script lang="ts">
	import { browser } from "$app/environment";
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger,
	} from "$lib/components/ui/accordion";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import TableIcon from "~icons/lucide/table-2";
	import WebIcon from "~icons/lucide/globe";
	import LanguagesIcon from "~icons/lucide/languages";
	import RobotIcon from "~icons/mdi/robot-excited";
	import DiscordIcon from "~icons/simple-icons/discord";
	import SurveyIcon from "~icons/lucide/list-checks";

	let openAccordion: "dataset" | "bot" | "translations" | "website" | "survey" | undefined;

	const switchTo = (item: NonNullable<typeof openAccordion>) => () => (openAccordion = item);

	$: {
		if (openAccordion && browser)
			window.scrollTo({
				top: 0,
				behavior: window.matchMedia("(prefers-reduced-motion: no-preference)").matches
					? "smooth"
					: "auto",
			});
	}
</script>

<svelte:head>
	<title>lipu Linku &middot; About Linku</title>
</svelte:head>

<h1 class="font-medium text-4xl">About Linku</h1>

<p class="[&>button]:underline w-[65%] text-center text-balance">
	Linku is a <button on:click={switchTo("dataset")}>dataset</button> with many
	<button on:click={switchTo("translations")}>translations</button>, a
	<button on:click={switchTo("bot")}>Discord bot</button>, a
	<button on:click={switchTo("website")}>website</button>, and an
	<button on:click={switchTo("survey")}>annual survey</button> created by kala Asi and contributed to
	by jan Ke Tami, jan Telesi, jan Kekan San, and many others for the purpose of collecting and displaying
	toki pona dictionary information accurate to current use.
</p>

<p>
	ku data is provided by
	<a
		class="underline"
		href="http://tokipona.org/nimi_pu.txt"
		target="_blank"
		rel="noopenner noreferrer">tokipona.org</a
	>.
</p>

<Accordion
	bind:value={openAccordion}
	class="w-[65%] [&_:is(a,_button):not([data-bits-button-root],_[data-bits-accordion-trigger])]:underline [&_[data-bits-accordion-content]>div]:flex [&_[data-bits-accordion-content]>div]:flex-col [&_[data-bits-accordion-content]>div]:gap-3"
>
	<AccordionItem value="dataset">
		<!-- these class names disable the rotation on the first icon,  -->
		<AccordionTrigger>
			<span class="flex items-center gap-3">
				<TableIcon /> sona Linku (the dataset)
			</span>
		</AccordionTrigger>
		<AccordionContent>
			<p>
				The dataset is a github repository which has all data we track, and is where you go to add
				new data. Everyone may view the data, but direct contributions are only available to
				maintainers or via pull requests.
			</p>
			<p>
				Changes to the source language data are automatically synced to
				<button on:click={switchTo("translations")}>Crowdin</button>, and changes to Crowdin
				translations are automatically synced to the dataset. Subsequently, all data in the dataset
				is made available via the API hosted alongside
				<button on:click={switchTo("website")}>the website</button>.
			</p>
			<p>
				The Linku github organization is owned by kala Asi and jan Kekan San, and changes are
				discussed in
				<a href="https://discord.gg/A3ZPqnHHsy" target="_blank" rel="noopener noreferrer"
					>kulupu Linku</a
				>.
			</p>
			<p>
				If you are looking for the old dataset called jasima, the data can be found
				<a href="https://linku.la/jasima/data.json" target="_blank" rel="noopener noreferrer"
					>here</a
				>
				and the repo can be found
				<a href="https://github.com/lipu-linku/jasima" target="_blank" rel="noopener noreferrer"
					>here</a
				>. Also see
				<button on:click={switchTo("translations")}>nimi Linku</button> for information about the previous
				Google sheet.
			</p>
		</AccordionContent>
	</AccordionItem>
	<AccordionItem value="bot">
		<AccordionTrigger>
			<span class="flex items-center gap-3">
				<RobotIcon /> ilo Linku (the bot)
			</span>
		</AccordionTrigger>
		<AccordionContent
			class="[&_code]:border [&_code]:border-border [&_code]:px-1 [&_code]:rounded-sm"
		>
			<p>
				The bot is for requesting and receiving Linku data without leaving discord, with a couple
				quality of life features.
			</p>
			<Button
				variant="secondary"
				href="https://discord.com/oauth2/authorize?client_id=901910020701163522&permissions=277025441792&scope=applications.commands%20bot"
			>
				Add it to your server!
			</Button>

			<Separator />

			<h2>
				<code>/nimi</code> (<code>/n</code>) command
			</h2>
			<p>Returns a dictionary entry on the word you requested.</p>
			<p>
				You can customise the language used for the definitions using
				<code>/preferences language</code> (the default is English).
			</p>

			<Separator />

			<h2><code>/ss</code> command</h2>
			<p>Returns the sitelen sitelen (sitelen suwi) glyph for the word you requested.</p>

			<Separator />

			<h2><code>/lp</code> command</h2>
			<p>Returns a luka pona sign gif for the word you requested.</p>

			<Separator />

			<h2><code>/sp</code> command</h2>
			<p>
				Converts your text to the linja sike font for sitelen pona, and displays it as an image.
			</p>
			<p>
				You can customise the size of the font using
				<code>/preferences fontsize</code> (the default is 72).
			</p>

			<Separator />

			<h2><code>/acro</code> command</h2>
			<p>Finds toki pona words beginning with each letter in your request.</p>
			<p>
				You can customise the set of words (only pu -- pu and ku suli -- pu and ku -- all available
				words) will be used using
				<code>/preferences acro</code> (the default is pu and ku suli).
			</p>

			<Separator />

			<h2><code>/prompt</code> command</h2>
			<p>
				Provides a random conversation prompt in Toki Pona, with a translation in your set language
				or English under a spoiler.
			</p>

			<Separator />

			<h2><code>/preferences</code> command</h2>
			<p>Its uses are listed above.</p>
			<p>
				Additionally, you can reset all preferences using
				<code>/preferences reset</code>.
			</p>
		</AccordionContent>
	</AccordionItem>
	<AccordionItem value="translations">
		<AccordionTrigger>
			<span class="flex items-center gap-3">
				<LanguagesIcon /> nimi Linku (the translations)
			</span>
		</AccordionTrigger>
		<AccordionContent>
			<p>
				kulupu Linku has an <a
					href="https://nimi.linku.la/"
					target="_blank"
					rel="noopener noreferrer">instance</a
				>
				on
				<a href="https://crowdin.com">Crowdin, a localization platform</a>, where anyone can help
				translate data in our dataset. We support translating definitions, etymology of words,
				etymology of sitelen pona, and commentary.
			</p>
			<p>
				If there are any changes on Crowdin, such as approved translations or newly available
				languages, they are automatically mirrored to
				<button on:click={switchTo("dataset")}>the dataset</button>. This also works in reverse;
				changes to the dataset are mirrored to Crowdin, including changes to source data.
			</p>
			<p>
				Our Crowdin instance is managed by jan Kekan San, kala Asi, and jan Tepo, with specific
				languages managed by many others.
			</p>

			<p>
				Contributions to existing languages are open to anyone; corrections, new languages, and
				other work are discussed in
				<a href="https://discord.gg/A3ZPqnHHsy">kulupu Linku</a>.
			</p>
			<p>
				If you're looking for the Google sheet previously named nimi Linku, it can be found
				<a
					href="https://docs.google.com/spreadsheets/d/1xwgTAxwgn4ZAc4DBnHte0cqta1aaxe112Wh1rv9w5Yk"
					>here</a
				>. Note that it has been archived and cannot be contributed to any longer.
			</p>
		</AccordionContent>
	</AccordionItem>
	<AccordionItem value="website">
		<AccordionTrigger>
			<span class="flex items-center gap-3">
				<WebIcon /> lipu Linku (the website)
			</span>
		</AccordionTrigger>
		<AccordionContent>
			<p>
				The <a href="/">website</a> is for browsing the dictionary in a nicely presented/filtered way.
			</p>
			<p>
				The data is loaded from the
				<button on:click={switchTo("dataset")}>sona dataset</button>.
			</p>
			<p>
				You may choose the language you want definitions to use, and filter by the words'
				appearances in books and recognition among the toki pona community.
			</p>
			<p>
				The website is available as free, open source software, under the GPL-3 license. It is built
				using <a href="https://kit.svelte.dev/" target="_blank" rel="noopener noreferrer"
					>SvelteKit</a
				>,
				<a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">tailwindcss</a
				>, and
				<a href="https://www.shadcn-svelte.com/" target="_blank" rel="noopener noreferrer"
					>shadcn-svelte</a
				>.
			</p>
		</AccordionContent>
	</AccordionItem>
	<AccordionItem value="survey">
		<AccordionTrigger>
			<span class="flex items-center gap-3">
				<SurveyIcon /> wile Linku (the survey)
			</span>
		</AccordionTrigger>
		<AccordionContent>
			<p>
				The survey is run annually every
				<a href="https://suno.pona.la" target="_blank" rel="noopener noreferrer"
					>suno pi toki pona</a
				>, anniversary of Toki Pona, and asks the community how they use Toki Pona and the words in
				it.
			</p>
			<p>
				This data is used to fill out <button on:click={switchTo("dataset")}>the dataset</button>
				with up to date information about how Toki Pona is used, to make the Linku dictionary provided
				by <button on:click={switchTo("website")}>the website</button> and
				<button on:click={switchTo("bot")}>the Discord bot</button> as accurate as possible.
			</p>
			<p>
				The survey is distributed via Google forms, and its execution and analysis are discussed in
				<a href="https://discord.gg/A3ZPqnHHsy" target="_blank" rel="noopener noreferrer"
					>kulupu Linku</a
				>.
			</p>

			<Button
				href="https://github.com/lipu-linku/ijo/blob/main/survey/2023/results.md"
				target="_blank"
				rel="noopener noreferrer"
				class="whitespace-nowrap"
				variant="secondary"
			>
				See the 2023 Word Survey results here!
			</Button>
		</AccordionContent>
	</AccordionItem>
</Accordion>

<Button
	variant="secondary"
	href="https://discord.gg/A3ZPqnHHsy"
	target="_blank"
	rel="noopener noreferrer"
	class="flex items-center gap-[1ch]"
>
	<DiscordIcon /> kulupu Linku (the Discord server!)
</Button>

<p>
	Also see <a class="underline" href="https://nimi.li" target="_blank" rel="noopener noreferrer"
		>nimi.li</a
	>, a third party frontend for the website created by ijo Tani.
</p>
