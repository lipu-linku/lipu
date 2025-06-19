<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Textarea } from "$lib/components/ui/textarea";
	import { ucsur_map } from "$lib/ucsur";
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

	const wordsByLength = Object.entries(ucsur_map).toSorted(([a], [b]) => b.length - a.length);
	function converter(from: string): ConverterResult {
		wordsByLength.forEach(([word, { codepoint }]) => {
			from = from.replaceAll(word, codepoint);
		});

		return {
			type: "ok",
			value: from,
		};
	}

	let result = $derived(converter(value.current));
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center space-x-1.5">
			<Card.Title id="sp-to-ucsur" class="text-2xl me-auto"><h2>UCSUR Converter</h2></Card.Title>

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

	<Card.Content class="h-max flex flex-col gap-4">
		<Textarea bind:value={value.current} placeholder="tomo lipu lon seme" />

		<span
			class="whitespace-pre-line min-h-9 inline-block data-ok:font-sitelen-seli-kiwen text-2xl"
			data-ok={result.type === "ok" || undefined}
		>
			{result.type === "ok" ? result.value : result.message}
		</span>
	</Card.Content>
</Card.Root>
