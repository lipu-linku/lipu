<script>
    export let word;
    export let selected_language;

	$: definition_available = word['def'][selected_language]
    $: definition = definition_available ? word['def'][selected_language] : "(en) " + word['def']['en'];

	$: link = word['luka_pona'] ? word['luka_pona']['mp4'] : ""

</script>

<div class={"card " + word['usage_category']}>

	<dt>{word['word']}</dt>
	<div class="shaded">{word['usage_category']} · {word['book']}</div>
	<dd class={definition_available ? "" : "shaded"}>{definition}</dd>
	<video
		onerror="this.style.display='none'"
		src={link}
		preload="metadata"
		controls="controls"
		onclick="this.play()"
		style="display: block;"
	></video>
</div>

<style>
	.card {
		text-align: center;
	}
	dt {
		display: inline-block;
		font-size: 150%;
		color: var(--highlight-color);
		font-weight: bold;
		font-style: italic;
		vertical-align: middle;
	}
	dd {
		margin: unset;
	}
	.shaded {
		color: var(--shade-color);
	}
	video {
		margin: 10px auto;
		max-width: 100%;
		/*height: 160px;*/
	}
</style>
