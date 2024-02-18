<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { Word } from "@kulupu-linku/sona";
	import SpeakerIcon from "~icons/lucide/volume-2";

	export let audio: Word["audio"];
	$: kalaAsi = audio.find((it) => it.author === "kala_asi");

	function play() {
		new Audio(kalaAsi?.link).play();
	}
</script>

{#if kalaAsi}
	<Button size="icon" variant="outline" class="align-middle" on:click={play}>
		<SpeakerIcon aria-label="Speaker icon" />
	</Button>
{/if}
