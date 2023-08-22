<script lang="ts">
</script>

<div class="page_width_limiter">
	<a class="navlink" href="about">Go back</a>
	<h1>
		jasima Linku (the
		<a href="https://linku.la/jasima/data.json">mirror / database</a>)
	</h1>
	<p>
		The database is a kind of "public interface", where the data from the
		<a href="about/nimi">sheet</a> is republished in a readily accessible json format. It can be imported
		by anyone for their own needs.
	</p>
	<p>To import the database on your website, use this in a javascript file:</p>
	<p>
		<code> const bundle = JSON.parse(Get("https://linku.la/jasima/data.json")) </code>
	</p>
	<p>
		Note that any changes made in the <a href="about/nimi">sheet</a> will be automatically propagated
		to the database!
	</p>
</div>

<style>
</style>
