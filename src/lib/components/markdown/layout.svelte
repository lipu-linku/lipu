<script module lang="ts">
	import h1 from "./h1.svelte";
	import h2 from "./h2.svelte";
	import h3 from "./h3.svelte";
	import h4 from "./h4.svelte";
	import h5 from "./h5.svelte";
	import h6 from "./h6.svelte";
	import pre from "./pre.svelte";
	import table from "./table.svelte";
	import tr from "./tr.svelte";
	import th from "./th.svelte";
	import td from "./td.svelte";
	import a from "./a.svelte";
	import blockquote from "./blockquote.svelte";

	export { h1, h2, h3, h4, h5, h6, pre, table, tr, th, td, a, blockquote };
</script>

<script lang="ts">
	let { children } = $props();
</script>

{@render children()}
