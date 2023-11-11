<script lang="ts">
	import TableIcon from "~icons/lucide/table-2";
	import RobotIcon from "~icons/mdi/robot-excited";
	import DatabaseIcon from "~icons/lucide/database";
	import WebIcon from "~icons/lucide/globe";
	import DiscordIcon from "~icons/simple-icons/discord";
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger,
	} from "$lib/components/ui/accordion";
	import { Button } from "$lib/components/ui/button";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { page } from "$app/stores";

	let openAccordion: "sheet" | "bot" | "database" | "website" | undefined;
</script>

<h1 class="font-medium text-4xl">About Linku</h1>

<p>
	Linku is a <a href="/about/nimi">sheet</a>, a
	<a href="/about/ilo">bot</a>, a <a href="/about/jasima">database</a> and a
	<a href="/about/lipu">website</a>, put together by kala Asi for the purpose of displaying toki
	pona dictionary information.
</p>

<p>
	ku data is provided by
	<a href="http://tokipona.org/nimi_pu.txt">tokipona.org</a>.
</p>

<Accordion
	bind:value={openAccordion}
	class="w-[65%] [&_:is(a,_button):not([data-bits-button-root],_[data-bits-accordion-trigger])]:underline [&_[data-bits-accordion-content]>div]:flex [&_[data-bits-accordion-content]>div]:flex-col [&_[data-bits-accordion-content]>div]:gap-3"
>
	<AccordionItem value="sheet">
		<!-- these class names disable the rotation on the first icon,  -->
		<AccordionTrigger>
			<span class="flex items-center gap-3">
				<TableIcon /> nimi Linku (the sheet)
			</span>
		</AccordionTrigger>
		<AccordionContent>
			<p>
				The sheet is where you go to add new data. Everyone has access to viewing and commenting,
				but not editing (this is a form of moderation, to avoid potential abuse).
			</p>
			<p>
				The sheet is owned by me (kala Asi) and changes are discussed on the
				<a target="_blank" href="https://discord.gg/A3ZPqnHHsy">Linku discord server</a>.
			</p>
			<p>
				Changes to the sheet get mirrored to the
				<button role="link" class="underline" on:click={() => (openAccordion = "database")}
					>database</button
				>.
			</p>
			<p>The Info sheet contains useful/important info! Make sure to read it.</p>
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
				variant="outline"
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
	<AccordionItem value="database">
		<AccordionTrigger>
			<span class="flex items-center gap-3">
				<DatabaseIcon /> jasima Linku (the mirror / database)
			</span>
		</AccordionTrigger>
		<AccordionContent>
			<p>
				The database is a kind of "public interface", where the data from the
				<button on:click={() => (openAccordion = "sheet")}>sheet</button> is republished in a readily
				accessible json format. It can be imported by anyone for their own needs.
			</p>
			<p>To import the database on your website, use this in a javascript file:</p>
			<pre><code
					>const bundle = await fetch("https://linku.la/jasima/data.json").then(r => r.json())</code
				></pre>
			<p>
				Note that any changes made in the
				<button on:click={() => (openAccordion = "sheet")}>sheet</button> will be automatically propagated
				to the database!
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
				<button on:click={() => (openAccordion = "database")}>mirror/database</button>.
			</p>
			<p>
				You may choose the language you want definitions to use, and filter by the words'
				appearances in books and recognition among the toki pona community.
			</p>
			<p>
				The website is available as free, open source software, under the GPL-3 license. It is built
				using <a href="https://kit.svelte.dev/" target="_blank">SvelteKit</a>,
				<a href="https://tailwindcss.com/" target="_blank">tailwindcss</a>, and
				<a href="https://www.shadcn-svelte.com/" target="_blank">shadcn-svelte</a>.
			</p>
		</AccordionContent>
	</AccordionItem>
</Accordion>

<Button
	variant="ghost"
	href="https://discord.gg/A3ZPqnHHsy"
	target="_blank"
	class="flex items-center gap-[1ch]"
>
	<DiscordIcon /> Discord server (contact us there!)
</Button>
