<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Textarea } from "$lib/components/ui/textarea";
	import { PersistedState } from "runed";

	import CopyIcon from "~icons/lucide/copy";
	import InfoIcon from "~icons/lucide/info";

	type ConverterResult =
		| {
				type: "ok";
				value: string;
		  }
		| { type: "err"; message: string };

	let value = new PersistedState("tools-sp-ucsur-value", "");

	const ucsur_map = {
		a: "\uDB86\uDD00",
		akesi: "\uDB86\uDD01",
		ala: "\uDB86\uDD02",
		alasa: "\uDB86\uDD03",
		ale: "\uDB86\uDD04",
		anpa: "\uDB86\uDD05",
		ante: "\uDB86\uDD06",
		anu: "\uDB86\uDD07",
		awen: "\uDB86\uDD08",
		e: "\uDB86\uDD09",
		en: "\uDB86\uDD0A",
		esun: "\uDB86\uDD0B",
		ijo: "\uDB86\uDD0C",
		ike: "\uDB86\uDD0D",
		ilo: "\uDB86\uDD0E",
		insa: "\uDB86\uDD0F",
		jaki: "\uDB86\uDD10",
		jan: "\uDB86\uDD11",
		jelo: "\uDB86\uDD12",
		jo: "\uDB86\uDD13",
		kala: "\uDB86\uDD14",
		kalama: "\uDB86\uDD15",
		kama: "\uDB86\uDD16",
		kasi: "\uDB86\uDD17",
		ken: "\uDB86\uDD18",
		kepeken: "\uDB86\uDD19",
		kili: "\uDB86\uDD1a",
		kiwen: "\uDB86\uDD1b",
		ko: "\uDB86\uDD1c",
		kon: "\uDB86\uDD1d",
		kule: "\uDB86\uDD1e",
		kulupu: "\uDB86\uDD1f",
		kute: "\uDB86\uDD20",
		la: "\uDB86\uDD21",
		lape: "\uDB86\uDD22",
		laso: "\uDB86\uDD23",
		lawa: "\uDB86\uDD24",
		len: "\uDB86\uDD25",
		lete: "\uDB86\uDD26",
		li: "\uDB86\uDD27",
		lili: "\uDB86\uDD28",
		linja: "\uDB86\uDD29",
		lipu: "\uDB86\uDD2a",
		loje: "\uDB86\uDD2b",
		lon: "\uDB86\uDD2c",
		luka: "\uDB86\uDD2d",
		lukin: "\uDB86\uDD2e",
		lupa: "\uDB86\uDD2f",
		ma: "\uDB86\uDD30",
		mama: "\uDB86\uDD31",
		mani: "\uDB86\uDD32",
		meli: "\uDB86\uDD33",
		mi: "\uDB86\uDD34",
		mije: "\uDB86\uDD35",
		moku: "\uDB86\uDD36",
		moli: "\uDB86\uDD37",
		monsi: "\uDB86\uDD38",
		mu: "\uDB86\uDD39",
		mun: "\uDB86\uDD3a",
		musi: "\uDB86\uDD3b",
		mute: "\uDB86\uDD3c",
		nanpa: "\uDB86\uDD3d",
		nasa: "\uDB86\uDD3e",
		nasin: "\uDB86\uDD3f",
		nena: "\uDB86\uDD40",
		ni: "\uDB86\uDD41",
		nimi: "\uDB86\uDD42",
		noka: "\uDB86\uDD43",
		o: "\uDB86\uDD44",
		olin: "\uDB86\uDD45",
		ona: "\uDB86\uDD46",
		open: "\uDB86\uDD47",
		pakala: "\uDB86\uDD48",
		pali: "\uDB86\uDD49",
		palisa: "\uDB86\uDD4a",
		pan: "\uDB86\uDD4b",
		pana: "\uDB86\uDD4c",
		pi: "\uDB86\uDD4d",
		pilin: "\uDB86\uDD4e",
		pimeja: "\uDB86\uDD4f",
		pini: "\uDB86\uDD50",
		pipi: "\uDB86\uDD51",
		poka: "\uDB86\uDD52",
		poki: "\uDB86\uDD53",
		pona: "\uDB86\uDD54",
		pu: "\uDB86\uDD55",
		sama: "\uDB86\uDD56",
		seli: "\uDB86\uDD57",
		selo: "\uDB86\uDD58",
		seme: "\uDB86\uDD59",
		sewi: "\uDB86\uDD5a",
		sijelo: "\uDB86\uDD5b",
		sike: "\uDB86\uDD5c",
		sin: "\uDB86\uDD5d",
		sina: "\uDB86\uDD5e",
		sinpin: "\uDB86\uDD5f",
		sitelen: "\uDB86\uDD60",
		sona: "\uDB86\uDD61",
		soweli: "\uDB86\uDD62",
		suli: "\uDB86\uDD63",
		suno: "\uDB86\uDD64",
		supa: "\uDB86\uDD65",
		suwi: "\uDB86\uDD66",
		tan: "\uDB86\uDD67",
		taso: "\uDB86\uDD68",
		tawa: "\uDB86\uDD69",
		telo: "\uDB86\uDD6a",
		tenpo: "\uDB86\uDD6b",
		toki: "\uDB86\uDD6c",
		tomo: "\uDB86\uDD6d",
		tu: "\uDB86\uDD6e",
		unpa: "\uDB86\uDD6f",
		uta: "\uDB86\uDD70",
		utala: "\uDB86\uDD71",
		walo: "\uDB86\uDD72",
		wan: "\uDB86\uDD73",
		waso: "\uDB86\uDD74",
		wawa: "\uDB86\uDD75",
		weka: "\uDB86\uDD76",
		wile: "\uDB86\uDD77",
		namako: "\uDB86\uDD78",
		kin: "\uDB86\uDD79",
		oko: "\uDB86\uDD7a",
		kipisi: "\uDB86\uDD7b",
		leko: "\uDB86\uDD7c",
		monsuta: "\uDB86\uDD7d",
		tonsi: "\uDB86\uDD7e",
		jasima: "\uDB86\uDD7f",
		kijetesantakalu: "\uDB86\uDD80",
		soko: "\uDB86\uDD81",
		meso: "\uDB86\uDD82",
		epiku: "\uDB86\uDD83",
		kokosila: "\uDB86\uDD84",
		lanpan: "\uDB86\uDD85",
		n: "\uDB86\uDD86",
		misikeke: "\uDB86\uDD87",
		pake: "\uDB86\uDDa0",
		apeja: "\uDB86\uDDa1",
		majuna: "\uDB86\uDDa2",
		powe: "\uDB86\uDDa3",
		"[": "\uDB86\uDD90",
		"]": "\uDB86\uDD91",
		"-": "\u200D",
		"+": "\u200D",
		"^": "\uDB86\uDD95",
		"*": "\uDB86\uDD96",
		"(": "\uDB86\uDD97",
		")": "\uDB86\uDD98",
		"{": "\uDB86\uDD9a",
		"}": "\uDB86\uDD9b",
		".": "\uDB86\uDD9c",
		":": "\uDB86\uDD9d",
	};

	const wordsByLength = Object.entries(ucsur_map).toSorted(([a], [b]) => b.length - a.length);
	function converter(from: string): ConverterResult {
		wordsByLength.forEach(([word, charCode]) => {
			from = from.replaceAll(word, charCode);
		});

		return {
			type: "ok",
			value: from,
		};
	}

	let result = $derived(converter(value.current));
</script>

<Card.Root>
	<Card.Header class="pt-4">
		<div class="flex items-center space-x-1.5">
			<Card.Title id="sp-to-ucsur" class="me-auto" level={2}>UCSUR Converter</Card.Title>

			<Button
				variant="ghost"
				size="icon"
				disabled={result.type === "err"}
				onclick={() => (result.type === "ok" ? navigator.clipboard.writeText(result.value) : {})}
			>
				<CopyIcon />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				href="https://www.kreativekorp.com/ucsur/charts/sitelen.html"
				target="_blank"
				rel="noopener noreferrer"
			>
				<InfoIcon />
			</Button>
		</div>

		<Card.Description>
			Converts from latin text to sitelen pona Unicode characters, according to the UCSUR standard
		</Card.Description>
	</Card.Header>

	<Card.Content class="h-full flex flex-col gap-4">
		<Textarea bind:value={value.current} placeholder="tomo lipu lon seme" />

		<span
			class="whitespace-pre-line inline-block data-ok:font-sitelen-ucsur text-2xl"
			data-ok={result.type === "ok" || undefined}
		>
			{result.type === "ok" ? result.value : result.message}
		</span>
	</Card.Content>
</Card.Root>
