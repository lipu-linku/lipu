<script>
    export let audio;

    const sound = (() => {
		if (audio['jan_lakuse']) {
			return new Audio(audio['jan_lakuse'])
		}
		if (audio['kala_asi']) {
			return new Audio(audio['kala_asi'])
		}
		return
    })()

    const play = () => {
		if (sound) {
			sound.play();
		}
    }
</script>

<button on:click={play}>🔊</button>

<style>
	button {
		background-color: inherit;
		border: none;
		font-size: inherit;
	}
</style>
