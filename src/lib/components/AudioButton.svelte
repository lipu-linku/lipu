<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { Word } from "$lib/types";
	import SpeakerIcon from "~icons/lucide/volume-2";

	export let audio: Word["audio"];

	function play() {
		new Audio(audio!.kala_asi).play();
	}
</script>

{#if audio?.kala_asi}
	<Button size="icon" variant="outline" class="align-middle" on:click={play}>
		<SpeakerIcon />
	</Button>
{/if}
