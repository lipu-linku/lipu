<script>
    export let word;

    const sp = word['sitelen_pona'] ? word['sitelen_pona'].split(' ')[0] : "";
    const book_src =
    {
        "pu": "./assets/pu.svg",
        "ku suli": "./assets/ku-suli.svg",
        "ku lili": "./assets/ku-lili.svg",
        "none": "./assets/lipu-ala.svg",
    }[word['book']]
</script>

<entry class={word["usage_category"]}>
    <entry_text>
        <word>{word['word']}</word>
        <definition>{word['def']['en']}</definition>
    </entry_text>
    <icon_container>
        {#if sp}
        <icon>
            {sp}
        </icon>
        {/if}
        <icon>
            <img src={book_src}>
        </icon>
        <icon>
            <img src="./assets/kalama.svg">
        </icon>
        <icon>
            <img src="./assets/sona-mute.svg">
        </icon>
    </icon_container>
</entry>

<style>
	entry {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 5px 15px;
		border-left-width: 5px;
		border-left-style: solid;
		margin: 10px 0px;
		border-top: 1px solid var(--border-color);
	}
	.core {
		border-left-color: #fead76;
	}
	.widespread {
		border-left-color: #f97b5d;
	}
	.common {
		border-left-color: #e75362;
	}
	.uncommon {
		border-left-color: #b63679;
	}
	.rare {
		border-left-color: #7f2481;
	}
	.obscure {
		border-left-color: #50127b;
	}
	word {
		display: inline-block;
		font-size: 150%;
		color: var(--highlight-color);
		font-weight: bold;
		font-style: italic;
	}
	icon_container {
        display: flex;
        flex-direction: row;
        align-items: center;
	}
	icon {
        font-family: "sitelen seli kiwen";
        font-size: 46px;
        text-align: center;
		width: 40px;
		height: 40px;
		margin: 2px;
		/*background-color: var(--border-color);
		border-radius: 5px;*/
	}
	icon > img {
        height: 100%;
        width: 100%;
        margin: auto;
	}
	definition {
		display: block;
	}
</style>
