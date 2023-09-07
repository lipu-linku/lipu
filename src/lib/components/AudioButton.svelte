<script lang="ts">
	export let audio;

	$: sound = (() => {
		if (audio['jan_lakuse']) {
			return new Object();
		}
		if (audio['kala_asi']) {
			return new Object();
		}
		return;
	})();

	const play = () => {
		if (sound) {
			sound.play();
		}
	};
</script>

<button on:click={play}>🔊</button>

<style>
	button {
		background-color: inherit;
		border: none;
		font-size: inherit;
	}
</style>
