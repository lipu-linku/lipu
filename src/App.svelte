<script>
	import Entry from './Entry.svelte';
	import Navbar from './Navbar.svelte';

	import search from './search.js';

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
	$: sorted_filtered_dictionary = search(dictionary, query)

	let lightmode = false;
	$: if (lightmode) {
		document.documentElement.classList.add("lightmode");
	} else {
		document.documentElement.classList.remove("lightmode");
	}
</script>

<div>
	<Navbar bind:query bind:lightmode/>
	<div class="width_limiter">
		{#each Object.entries(sorted_filtered_dictionary) as [key, word], key}
			<!--{#if word["usage_category"] != "obscure"}-->
			<Entry {word}/>
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
</style>
