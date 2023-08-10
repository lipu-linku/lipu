<script>
    export let word;
    export let selected_language;

    import AudioButton from './AudioButton.svelte';

    $: sp = word['sitelen_pona'] ? word['sitelen_pona'].split(' ')[0] : "";
    $: audio = word['audio'];

	$: definition_available = word['def'][selected_language]
    $: definition = definition_available ? word['def'][selected_language] : "(en) " + word['def']['en'];

</script>

<div class={"entry " + word['usage_category']}>

	<div class="sp">{sp}</div>
	<div class="word_main">
		<div class="word_info">
			<dt>{word['word']}</dt>
			<span>
				<span>{word['usage_category']}</span>
				<span> · </span>
				<span>{word['book']}</span>
				{#if word['audio']}
				<span> · </span>
				<AudioButton {audio}/>
				{/if}
				<span> · </span>
				<span>more</span>
			</span>
		</div>
		<dd class={definition_available ? "" : "shaded"}>{definition}</dd>
	</div>
</div>

<style>
	.entry {
		display: flex;
		flex-direction: row;
		padding: 7px 7px 7px 0px;
		border-left-width: 2px;
		border-left-style: solid;
		margin: 10px 0px;
		border-top: 1px solid var(--border-color);
	}
	.word_info {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: baseline;
	}
	.word_main {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.core {
		border-left-color: #dedede;
	}
	.widespread {
		border-left-color: #b5b5b5;
	}
	.common {
		border-left-color: #949494;
	}
	.uncommon {
		border-left-color: #6b6a6b;
	}
	.rare {
		border-left-color: #4a4a4a;
	}
	.obscure {
		border-left-color: #292929;
	}
	.sp {
		display: inline-block;
        font-family: "sitelen seli kiwen";
        font-size: 50px;
        width: 60px;
        text-align: center;
		vertical-align: middle;
		margin: 0px 10px;
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
