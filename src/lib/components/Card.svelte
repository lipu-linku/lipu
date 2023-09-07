<script>
    export let word;
    export let selected_language;

    import AudioButton from './AudioButton.svelte';

    $: sp = word['sitelen_pona'] ? word['sitelen_pona'].split(' ')[0] : "";
    $: audio = word['audio'];

	$: definition_available = word['def'][selected_language]
    $: definition = definition_available ? word['def'][selected_language] : "(en) " + word['def']['en'];

    // temporary hack: reduce definitions by chopping off "| ALT"s
    $: definition = definition.split("|")[0].trim()

</script>

<div class={"card " + word['usage_category']}>

	<div class="sp">{sp}</div>
	<dt>{word['word']}</dt>
	<div class="shaded">{word['usage_category']} · {word['book']}</div>
	<dd class={definition_available ? "" : "shaded"}>{definition}</dd>
</div>

<style>
	.card {
		text-align: center;
	}
	.sp {
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: "sitelen seli kiwen";
		font-size: 530%;
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
</style>
