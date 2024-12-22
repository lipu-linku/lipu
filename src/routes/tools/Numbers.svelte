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
		const ale = Math.floor(from / 100);
		const mute = Math.floor((from - ale * 100) / 20);
		const luka = Math.floor((from - ale * 100 - mute * 20) / 5);
		const tu = Math.floor((from - ale * 100 - mute * 20 - luka * 5) / 2);
		const wan = from - ale * 100 - mute * 20 - luka * 5 - tu * 2;

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

		// let digitsAfterDecimal = 0;

		let result = [];

		while (from > 0) {
			let word = pu_precise(from % 100);
			if (word.type === "ok") result.push(word.value);
			else return word;
			console.log(from);

			from /= 100;
		}

		return {
			type: "ok",
			value: result.join(" "),
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
		"pu (abberviated)": (from: number) => {
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
			<Input type="number" bind:value={value.current} placeholder="123" />
			<Select.Root type="single" bind:value={converter.current}>
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
			<span class="font-sitelen-pona text-2xl">{result.value}</span>
		{/if}
	</Card.Content>
</Card.Root>
