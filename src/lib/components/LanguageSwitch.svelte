<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Select from "$lib/components/ui/select";
	import { entries } from "$lib/utils";
	import type { Languages } from "@kulupu-linku/sona";
	import LanguagesIcon from "~icons/lucide/languages";

	export let localeList: Languages;
	export let selected: keyof Languages;

	$: items = Object.entries(localeList).map(([locale, lang]) => ({
		value: locale,
		label: lang.name.endonym,
	}));
</script>

<Select.Root
	{items}
	selected={{ value: localeList[selected].locale, label: localeList[selected].name.endonym }}
	onSelectedChange={(item) => {
		if (item) {
			localStorage.setItem("lang", item.value);
			const url = new URL($page.url);
			url.searchParams.set("lang", item.value);
			goto(url);
		}
	}}
>
	<Select.Trigger class="max-w-48 w-auto justify-start gap-2">
		<LanguagesIcon aria-label="Languages icon" class="size-4" />
		<Select.Value class="line-clamp-1 overflow-ellipsis">
			{localeList[selected].name.endonym}
		</Select.Value>
	</Select.Trigger>

	<Select.Content sameWidth={false} class="max-h-[50dvh] overflow-y-scroll">
		{#each entries(localeList) as [locale, language] (locale)}
			<Select.Item label={language.name.endonym} value={locale}>
				{language.name.endonym}
			</Select.Item>
		{/each}
	</Select.Content>

	<Select.Input />
</Select.Root>
