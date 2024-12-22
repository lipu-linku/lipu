<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import * as Select from "$lib/components/ui/select";

	import CopyIcon from "~icons/lucide/copy";

	type ConverterResult =
		| {
				type: "ok";
				value: string;
		  }
		| { type: "err"; message: string };

	let value = $state(0);

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

		const hundreds = Math.floor(from / 100);
		const rest = Math.floor(from % 100);
		const fraction = (from - rest) / 0.01;

		let result = [];

		if (hundreds >= 100) {
			const hundredsWords = nasin_nanpa_pona(hundreds);
			if (hundredsWords.type === "err") return hundredsWords;
			result.push((hundredsWords.value = " ale"));
		} else if (hundreds > 0) {
			const hundredsWords = pu_precise(hundreds);
			if (hundredsWords.type === "err") return hundredsWords;
			result.push((hundredsWords.value = " ale"));
		}

		if (rest > 0) {
			const restWords = pu_precise(rest);
			if (restWords.type === "err") return restWords;
			result.push(restWords.value);
		}

		if (fraction > 0) {
			const fractionWords = nasin_nanpa_pona(fraction);
			if (fractionWords.type === "err") return fractionWords;
			result.push("ala " + fractionWords.value.replace(/^ala/, "ale"));
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

	let converter = $state<keyof typeof converters>("pu (precise)");

	let result = $derived(converters[converter](value));
</script>

<Card.Root>
	<Card.Header class="flex-row items-center justify-between">
		<Card.Title level={2}>Number Converter</Card.Title>

		<Button
			variant="ghost"
			size="icon"
			disabled={result.type === "err"}
			onclick={() => (result.type === "ok" ? navigator.clipboard.writeText(result.value) : {})}
		>
			<CopyIcon />
		</Button>
	</Card.Header>

	<Card.Content class="flex flex-col gap-4">
		<div class="grid grid-cols-[1fr_min-content] gap-2">
			<Input type="number" bind:value placeholder="123" />
			<Select.Root type="single" bind:value={converter}>
				<Select.Trigger class={buttonVariants({ variant: "outline" })}>{converter}</Select.Trigger>
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
