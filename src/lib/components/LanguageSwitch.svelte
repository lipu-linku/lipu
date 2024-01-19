<script lang="ts">
	import * as Select from "$lib/components/ui/select";
	import { language } from "$lib/state";
	import { entries } from "$lib/utils";
	import type { Linku } from "$lib/types";
	import LanguagesIcon from "~icons/lucide/languages";

	export let localeList: Linku["languages"];

	$: items = Object.entries(localeList).map(([locale, lang]) => ({
		value: locale,
		label: lang.name_endonym,
	}));

	$: selected = items.find(({ value }) => value === $language)!;
</script>

<Select.Root
	{items}
	{selected}
	onSelectedChange={(item) => {
		if (item) {
			$language = item.value;
		}
	}}
>
	<Select.Trigger class="max-w-48 w-auto justify-start gap-2">
		<LanguagesIcon class="size-4" />
		<Select.Value class="line-clamp-1 overflow-ellipsis">
			{localeList[$language].name_endonym}
		</Select.Value>
	</Select.Trigger>

	<Select.Content sameWidth={false} class="max-h-[50dvh] overflow-y-scroll">
		{#each entries(localeList) as [locale, language] (locale)}
			<Select.Item label={language.name_endonym} value={locale}>
				{language.name_endonym}
			</Select.Item>
		{/each}
	</Select.Content>

	<Select.Input />
</Select.Root>
