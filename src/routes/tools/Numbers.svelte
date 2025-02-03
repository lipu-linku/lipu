<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select";
	import { PersistedState } from "runed";

	import CopyIcon from "~icons/lucide/copy";
	import InfoIcon from "~icons/lucide/info";

	type ConverterResult =
		| {
				type: "ok";
				value: string;
		  }
		| { type: "err"; message: string };

	let value = new PersistedState("tools-numbers-value", 0);

	function pu_precise(from: number): ConverterResult {
		if (from < 0 || !Number.isInteger(from))
			return { type: "err", message: `${from} cannot be represented using this system!` };
		if (from === 0) return { type: "ok", value: "ala" };

		const words = {
			ale: 100,
			mute: 20,
			luka: 5,
			tu: 2,
			wan: 1,
		};
		const ale = Math.floor(from / words.ale);
		const mute = Math.floor((from - ale * words.ale) / words.mute);
		const luka = Math.floor((from - ale * words.ale - mute * words.mute) / words.luka);
		const tu = Math.floor(
			(from - ale * words.ale - mute * words.mute - luka * words.luka) / words.tu,
		);
		const wan = from - ale * words.ale - mute * words.mute - luka * words.luka - tu * words.tu;

		return {
			type: "ok",
			value: [
				...Array.from({ length: ale }, () => "ale"),
				...Array.from({ length: mute }, () => "mute"),
				...Array.from({ length: luka }, () => "luka"),
				...Array.from({ length: tu }, () => "tu"),
				...Array.from({ length: wan }, () => "wan"),
			].join(" "),
		};
	}

	function nasin_nanpa_pona(from: number): ConverterResult {
		if (from < 0)
			return { type: "err", message: `${from} cannot be represented using this system!` };
		if (from === 0) return { type: "ok", value: "ala" };

		function sectionWords(raw: string): ConverterResult {
			let parts = [];
			for (let i = -raw.length % 2; i < raw.length; i += 2) {
				const digit = parseInt(raw.slice(i, i + 2));
				if (digit !== 0) {
					const words = pu_precise(digit);
					if (words.type === "err") return words;
					parts.push(words.value);
				}
				if (i + 2 < raw.length) parts.push("ale");
			}
			return { type: "ok", value: parts.join(" ") };
		}

		let [int, frac] = from.toString().split(".") as [string, string?];

		if (int.length % 2 === 1) int = "0" + int;
		if (frac && frac.length % 2 === 1) frac = "0" + frac;

		const intWords = sectionWords(int);
		if (intWords.type === "err") return intWords;
		if (!frac) return intWords;
		const fracWords = sectionWords(frac);
		if (fracWords.type === "err") return fracWords;

		return {
			type: "ok",
			value: `${intWords.value} ala ${fracWords.value}`.trim(),
		};
	}

	function seximal(from: number): ConverterResult {
		if (from < 0 || !Number.isInteger(from))
			return { type: "err", message: `${from} cannot be represented using this system!` };
		if (from === 0) return { type: "ok", value: "ala" };
		if (from === 6) return { type: "ok", value: "kulupu" };
		let digits = ["ala", "wan", "tu", "san", "po", "luka"];
		let result = [];
		let quotient = from;
		while (quotient > 0) {
			result.unshift(digits[quotient % 6]);
			quotient = Math.floor(quotient / 6);
		}

		return { type: "ok", value: result.join(" ") };
	}

	const converters = {
		"pu (simple)": (from: number) => (from < 3 ? pu_precise(from) : { type: "ok", value: "mute" }),
		"pu (precise)": pu_precise,
		"pu (abbreviated)": (from: number) => {
			const result = pu_precise(from);
			if (result.type === "err") return result;
			return {
				type: "ok",
				value: result.value
					.split(" ")
					.map((it) => {
						if (it === "ala") return "X";
						if (it === "wan") return "W";
						if (it === "tu") return "T";
						if (it === "luka") return "L";
						if (it === "mute") return "M";
						if (it === "ale") return "A";
					})
					.join(""),
			};
		},
		"nasin nanpa pona": nasin_nanpa_pona,
		seximal,
		kijetesantakalu: (from: number) => {
			const inSeximal = seximal(from);

			return inSeximal.type === "ok"
				? {
						type: "ok",
						value: inSeximal.value.replaceAll(/ala|wan|tu|san|po|luka/g, "kijetesantakalu"),
					}
				: inSeximal;
		},
	} as const satisfies Record<string, (from: number) => ConverterResult>;

	let converter = new PersistedState<keyof typeof converters>(
		"tools-numbers-converter",
		"pu (precise)",
	);

	let result = $derived(converters[converter.current](value.current));
</script>

<Card.Root>
	<Card.Header class="pt-4">
		<div class="flex items-center space-x-1.5">
			<Card.Title id="numbers" class="me-auto" level={2}>Number Converter</Card.Title>

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
				href="https://sona.pona.la/wiki/Number_systems"
				target="_blank"
				rel="noopener noreferrer"
			>
				<InfoIcon />
			</Button>
		</div>

		<Card.Description>
			Converts from decimal into different toki pona numeral systems
		</Card.Description>
	</Card.Header>

	<Card.Content class="flex flex-col gap-4">
		<div class="grid grid-cols-[1fr_min-content] gap-2">
			<Input
				type="number"
				bind:value={() => value.current, (v) => (value.current = v ?? 0)}
				placeholder="123"
			/>
			<Select.Root allowDeselect={false} type="single" bind:value={converter.current}>
				<Select.Trigger class={buttonVariants({ variant: "outline" })}>
					{converter.current}
				</Select.Trigger>
				<Select.Content>
					{#each Object.keys(converters) as converter (converter)}
						<Select.Item value={converter} label={converter} />
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<span class="text-balance">{result.type === "ok" ? result.value : result.message}</span>
		{#if result.type === "ok"}
			<span class="font-sitelen-seli-kiwen text-2xl">{result.value}</span>
		{/if}
	</Card.Content>
</Card.Root>
