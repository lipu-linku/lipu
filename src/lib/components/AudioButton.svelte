<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { WordAudio } from "@kulupu-linku/sona/v1";
	import SpeakerIcon from "~icons/lucide/volume-2";

	interface Props {
		audio: WordAudio;
	}

	const { audio }: Props = $props();

	function play() {
		new Audio(audio[Math.floor(Math.random() * audio.length)].link).play();
	}
</script>

{#if audio.length > 0}
	<Button size="icon" variant="outline" class="align-middle" onclick={play}>
		<SpeakerIcon aria-label="Speaker icon" />
	</Button>
{/if}
