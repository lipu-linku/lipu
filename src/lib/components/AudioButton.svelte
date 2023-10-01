<script lang="ts">
    export let audio: Record<string, string>;

    let audio_elem: HTMLAudioElement | null = null;

    function play() {
        audio_elem?.play();
    }
</script>

{#if audio?.kala_asi}
    <audio src={audio['kala_asi']} bind:this={audio_elem} />
    <button class="interactible" on:click={play}> 🔊 </button>
{/if}

<style>
    button {
        background-color: inherit;
        border: none;
        font-size: inherit;
    }
</style>

