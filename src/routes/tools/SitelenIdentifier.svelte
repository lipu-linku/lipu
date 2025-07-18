<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Select from "$lib/components/ui/select";
	import { PersistedState } from "runed";
	import InfoIcon from "~icons/lucide/info";

	const elementOptions = {
		"1": "1 element",
		"2": "2 connected elements",
		"2d": "2 disconnected elements",
		"3": "3 connected elements",
		"3d": "3 disconnected elements",
		"4": "4 connected elements",
		"4d": "4 disconnected elements",
		"5": "5 connected elements",
		"5d": "5 disconnected elements",
		"6": "6 elements",
		"7": "7 connected elements",
		"7d": "7 disconnected elements",
		"8": "8 elements",
		"9": "9 elements",
		"12": "12 elements",
	} as const;
	type Elements = keyof typeof elementOptions;

	const loopOptions = {
		zero: "0 Loops",
		one: "1 Loop",
		more: "2+ Loops",
	};
	type Loops = keyof typeof loopOptions;

	type WordRef = string | [link: string, glyph: string];

	const glyphMap = new Map<`${Elements} ${Loops}` | Elements, WordRef[]>([
		["1 zero", ["ike", "la", "linja", "lupa", "nasa", "nena", "pona"]],
		["1 one", ["ijo", "kala", "mi", "nimi", "ona", "sina", "palisa"]],
		["1 more", ["ale", "esun", "jaki", "unpa"]],
		[
			"2 zero",
			["ala", "en", "li", "lili", "luka", "pi", "suli", "taso", "te", "to", "wan", "wile"],
		],
		["2d zero", ["kon", "kute", "lon", "n", "sama", "seme", "telo", "tu"]],
		["2 one", ["kili", "lape", "lawa", "mun", "pilin"]],
		["2 more", ["kasi", "mama", "misikeke"]],
		["2d one", ["a", "lukin", "meli", "o"]],
		["2d more", ["sike"]],
		[
			"3 zero",
			["anu", "jasima", "ken", "lete", "nasin", "ni", "noka", "pini", "poki", "supa", "tan"],
		],
		["3 one", ["jan", "jo", "ma", "mani", "pali", "soko"]],
		["3 more", ["musi"]],
		["3d zero", ["kipisi", "meso", "mute", "powe", "sin"]],
		["3d one", ["lanpan", "tenpo", "uta", "wawa"]],
		["3d more", ["kulupu"]],
		["4 zero", ["awen", "kama", "nanpa", "sijelo", "tawa", "utala"]],
		[
			"4d zero",
			[
				"anpa",
				"ante",
				"e",
				"epiku",
				"insa",
				"kin",
				"monsi",
				"poka",
				"seli",
				"sewi",
				["sewi", "sewi2"],
				"sinpin",
				"weka",
			],
		],
		["4 one", ["kule", "lipu", "open", "tonsi"]],
		["4d one", ["moku", "toki"]],
		["4d more", ["mu", "oko", "olin"]],
		["5 zero", ["selo"]],
		["5d zero", ["majuna", "namako", "pana", "suwi", "waso"]],
		["5 one", ["kiwen", "ko", "len", "mije", "suno", "tomo", "walo"]],
		["5d one", ["kalama", "moli"]],
		["5 more", ["akesi", "alasa", "ilo", "kokosila", "laso", "pimeja"]],
		["5d more", ["apeja", "loje"]],
		["6", ["akesi", "kiki", "pan", "pipi", "su"]],
		["7", ["jelo", "kepeken", "pakala"]],
		["7d", ["sitelen", "sona", "soweli"]],
		["8", ["ku", "leko", "linluwi", "monsuta", ["mute", "mute2"]]],
		["9", ["pu"]],
		["12", ["kijetesantakalu"]],
	]);

	let elements = new PersistedState<Elements>("tools-sp-identifier-elements", "1");
	let loops = new PersistedState<Loops>("tools-sp-identifier-loops", "zero");
	const disableLoops = $derived(
		elements.current === "6" ||
			elements.current === "7" ||
			elements.current === "7d" ||
			elements.current === "8" ||
			elements.current === "9" ||
			elements.current === "12",
	);

	const selected = $derived(
		(disableLoops
			? glyphMap.get(elements.current)
			: glyphMap.get(`${elements.current} ${loops.current}`)) ?? [],
	);
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center space-x-1.5">
			<Card.Title id="sp-identifier" class="text-2xl me-auto"><h2>Sitelen Pona Identifier</h2></Card.Title>

			<Button
				variant="ghost"
				size="icon"
				href="https://tokipona.org/sitelen_pona.html"
				target="_blank"
				rel="noopener noreferrer"
			>
				<InfoIcon />
			</Button>
		</div>

		<Card.Description>Based on jan Sonja's original sitelen pona lookup table</Card.Description>
	</Card.Header>

	<Card.Content class="flex flex-col gap-4">
		<div class="flex items-center justify-center gap-2">
			<Select.Root allowDeselect={false} type="single" bind:value={elements.current}>
				<Select.Trigger class={buttonVariants({ variant: "outline" })}>
					{elementOptions[elements.current]}
				</Select.Trigger>
				<Select.Content>
					{#each Object.entries(elementOptions).sort(([, a], [, b]) => parseInt(a.split(" ")[0]) - parseInt(b.split(" ")[0])) as [option, label] (option)}
						<Select.Item value={option} {label}>{label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<Select.Root
				allowDeselect={false}
				disabled={disableLoops}
				type="single"
				bind:value={loops.current}
			>
				<Select.Trigger class={buttonVariants({ variant: "outline" })}>
					{loopOptions[loops.current]}
				</Select.Trigger>
				<Select.Content>
					{#each Object.entries(loopOptions) as [option, label] (option)}
						<Select.Item value={option} {label}>{label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="grid grid-cols-5 place-content-center gap-3">
			{#each selected as word}
				{@const [id, glyph] = Array.isArray(word) ? word : [word, word]}
				<Button class="flex-col gap-1 h-fit" href="/words/{id}" variant="ghost">
					<span>{id}</span>
					<span class="font-sitelen-seli-kiwen text-3xl">{glyph}</span>
				</Button>
			{:else}
				<span class="col-span-full text-muted-foreground text-center">No results!</span>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
