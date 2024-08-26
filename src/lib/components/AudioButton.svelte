<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { WordAudio } from "@kulupu-linku/sona";
	import SpeakerIcon from "~icons/lucide/volume-2";
	import { m } from "$lib/paraglide";

	export let audio: WordAudio;

	function play() {
		new Audio(audio[Math.floor(Math.random() * audio.length)].link).play();
	}
</script>

{#if audio.length > 0}
	<Button size="icon" variant="outline" class="align-middle" on:click={play}>
		<SpeakerIcon aria-label={m.speaker_icon()} />
	</Button>
{/if}
