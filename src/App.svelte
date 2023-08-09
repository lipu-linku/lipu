<script>
	import Entry from './Entry.svelte';

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

</script>

<main>
	{#each Object.entries(dictionary) as [key, word]}
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
</main>

<style>
	@font-face {
		font-family: "sitelen seli kiwen";
		font-style: normal;
		font-weight: 400;
		src: url(https://raw.githubusercontent.com/lipu-linku/nasin-sitelen/main/sitelenselikiwenasuki.ttf);
	}
	main {
		margin: 0 auto;
		padding: 0 10px;
		max-width: 840px;
	}
</style>
