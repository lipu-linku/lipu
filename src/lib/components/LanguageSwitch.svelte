<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Select from "$lib/components/ui/select";
	import type { Languages } from "@kulupu-linku/sona";

	import LanguagesIcon from "~icons/lucide/languages";

	export let localeList: Languages;
	export let selected: keyof Languages;

	$: items = Object.entries(localeList).map(([id, lang]) => ({
		value: id,
		label: lang.name.endonym,
	}));
</script>

<Select.Root
	{items}
	selected={{ value: localeList[selected].id, label: localeList[selected].name.endonym }}
	onSelectedChange={(item) => {
		if (item) {
			localStorage.setItem("lang", item.value);
			const url = new URL($page.url);
			url.searchParams.set("lang", item.value);
			goto(url);
		}
	}}
>
	<Select.Trigger class="md:max-w-48 md:w-auto bg-background md:justify-start gap-2">
		<LanguagesIcon aria-label="Languages icon" class="size-4" />
		<Select.Value class="line-clamp-1 overflow-ellipsis">
			{localeList[selected].name.endonym}
		</Select.Value>
	</Select.Trigger>

	<Select.Content sameWidth={false} class="max-h-[50dvh] overflow-y-scroll">
		{#each items as { value, label } (value)}
			<Select.Item {label} {value}>{label}</Select.Item>
		{/each}
	</Select.Content>

	<Select.Input />
</Select.Root>
