<script>
	import Entry from './Entry.svelte';
	import Navbar from './Navbar.svelte';
	import Filter from './Filter.svelte';

	import search from './search.js';

	let lightmode = false;
	$: if (lightmode) {
		document.documentElement.classList.add("lightmode");
	} else {
		document.documentElement.classList.remove("lightmode");
	}

	function Get(yourUrl) {
		var Httpreq = new XMLHttpRequest();
		Httpreq.open("GET", yourUrl, false);
		Httpreq.send(null);
		return Httpreq.responseText;
	}
	const bundle_url = "https://linku.la/jasima/data.json";
	const bundle = JSON.parse(Get(bundle_url));

	const dictionary = bundle["data"];
	const languages = bundle["languages"];

	let query = "";

	let selected_language = "en";

    let categories = [
        {"name": "core", "checked": true},
        {"name": "widespread", "checked": true},
        {"name": "common", "checked": false},
        {"name": "uncommon", "checked": false},
        {"name": "rare", "checked": false},
        {"name": "obscure", "checked": false},
    ]

    $: categories_short = Object.fromEntries(Array.from(categories, (item) => {return [item.name, item.checked]}))

	$: sorted_filtered_dictionary = search(dictionary, query, categories_short)
</script>

<div class="app">
	<Navbar bind:query bind:lightmode bind:selected_language {languages}/>
	<div class="width_limiter">
		<a id="survey" href="https://linku.la/wile/">
			2023 Word Survey:
			Let&nbsp;us&nbsp;know&nbsp;what&nbsp;words&nbsp;you&nbsp;use!
        </a>
		<Filter bind:categories/>
		{#each Object.entries(sorted_filtered_dictionary) as [key, word], key}
			<!--{#if word["usage_category"] != "obscure"}-->
			<Entry {word} {selected_language}/>
			<!--<entry class={word["usage_category"]}>
				<entry_title>
					<word>{word['word']}</word>
					<icon_container>
						<icon></icon>
						<icon></icon>
						<icon></icon>
						<icon></icon>
					</icon_container>
				</entry_title>
				<definition>{word['def']['en']}</definition>
			</entry>-->

			<!--{/if}-->
		{/each}
	</div>
</div>

<style>
	@font-face {
		font-family: "sitelen seli kiwen";
		font-style: normal;
		font-weight: 400;
		src: url(https://raw.githubusercontent.com/lipu-linku/nasin-sitelen/main/sitelenselikiwenasuki.ttf);
	}
	.app {
		margin: 0 auto;
		padding: 0;
	}
	.width_limiter {
		display: block;
		margin: auto;
		padding: 0 10px;
		max-width: 840px;
	}
	#survey {
		display: block;
		text-align: center;
		font-size: 1.2em;
		font-weight: bold;
		margin-top: 1rem;
	}
</style>
