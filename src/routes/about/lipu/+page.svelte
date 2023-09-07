<script lang="ts">
</script>

<div class="page_width_limiter">
	<a class="navlink" href="about">Go back</a>
	<h1>
		lipu Linku (the <a href="https://linku.la">website</a>)
	</h1>
	<p>
		The <a href="https://linku.la">website</a> is for browsing the dictionary in a nicely presented /
		filtered way.
	</p>
	<p>
		The data is loaded from the
		<a href="about/jasima">mirror / database</a>.
	</p>
	<p>
		You may choose the language you want definitions to use, and filter by the words' appearances in
		books.
	</p>
	<p>Entries use the following template:</p>
	<div class="entry" style="border: solid var(--shade-color) 2px; padding: 5px">
		<div class="sourcelanguage">Source language</div>
		<div class="creator">Creator</div>
		<div class="etymology">Etymology</div>
		<div class="coined">Date (era) coined</div>
		<div class="sitelenpona" style="font-family: inherit; font-size: inherit">sitelen pona</div>
		<div class="book">book appearances</div>
		<div class="sitelensitelen">sitelen sitelen</div>
		<div class="recognition">recognition as a percentage (plus date)</div>
		<div class="word">toki pona word</div>
		<div class="definition">Definitions of the word</div>
		<div class="seealso">{`see other toki pona words`}</div>

		<details open={true}>
			<summary>more info</summary>
			<div class="details">
				<div class="commentary">
					Commentary, which does not fit in another category, but is important for understanding the
					specifics of the word
				</div>
				<div class="kudata">A free sample of ku data</div>
				<div class="sitelenponaetymology">Etymology of the sitelen pona</div>
				<div class="lukapona">luka pona</div>
				<div class="ucsur" style="font-size: 100%">UCSUR codepoint</div>
				<a
					class="audio_kalaasi"
					href="http://antetokipona.infinityfreeapp.com/kalama/kalaasi/ala.mp3">kala asi audio</a
				><a
					class="audio_janlakuse"
					href="http://antetokipona.infinityfreeapp.com/kalama/jlakuse/ala.mp3">jan lakuse audio</a
				>
			</div>
		</details>
	</div>
</div>

<style>
</style>
