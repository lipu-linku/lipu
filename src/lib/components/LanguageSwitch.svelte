<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { language } from "$lib/state";
	import type { Linku } from "$lib/types";
	import { entries } from "$lib/utils";
	import clsx from "clsx";
	import LanguagesIcon from "~icons/lucide/languages";

	export let localeList: Linku["languages"];
</script>

<select
	class={clsx(
		buttonVariants.base,
		buttonVariants.variants.variant.outline,
		buttonVariants.variants.size.default,
		"w-48 overflow-ellipsis"
	)}
	bind:value={$language}
>
	{#each entries(localeList) as [locale, language] (locale)}
		<option value={locale}>{language.name_endonym}</option>
	{/each}
</select>

<Button variant="outline" size="icon" aria-label="Select language">
	<LanguagesIcon aria-label="Languages icon" />
</Button>
