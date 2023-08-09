<script>
    export let word;

    const sp = word['sitelen_pona'] ? word['sitelen_pona'].split(' ')[0] : "";

</script>

<entry class={word["usage_category"]}>

	<sp>{sp}</sp>
	<word_main>
		<word_info>
			<span>
				<word>{word['word']}</word>
			</span>
			<span style="height: 100%;">{word['usage_category']} · {word['book']} · 🔊 · more</span>
		</word_info>
		<definition>{word['def']['en']}</definition>
	</word_main>
</entry>

<style>
	entry {
		display: flex;
		flex-direction: row;
		padding: 10px 10px 10px 0px;
		border-left-width: 2px;
		border-left-style: solid;
		margin: 10px 0px;
		border-top: 1px solid var(--border-color);
	}
	word_info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: baseline;
	}
	word_main {
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
	sp {
		display: inline-block;
        font-family: "sitelen seli kiwen";
        font-size: 50px;
        width: 60px;
        text-align: center;
		vertical-align: middle;
		margin: 0px 10px;
	}
	word {
		display: inline-block;
		font-size: 150%;
		color: var(--highlight-color);
		font-weight: bold;
		font-style: italic;
		vertical-align: middle;
	}
	definition {
		display: block;
	}
</style>
