<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Select from "$lib/components/ui/select";
	import { cn } from "$lib/utils";
	import type { Languages } from "@kulupu-linku/sona";

	import LanguagesIcon from "~icons/lucide/languages";

	export let localeList: Languages;
	export let selected: keyof Languages;

	export let triggerClass = "";
	export let contentClass = "";

	$: items = Object.entries(localeList).map(([id, lang]) => ({
		value: id,
		label: lang.name.endonym ?? lang.name.en,
	}));

	$: selectedItem = localeList[selected];
	$: label = selectedItem.name.endonym ?? selectedItem.name.en;
</script>

<Select.Root
	{items}
	selected={{ value: selectedItem.id, label }}
	onSelectedChange={(item) => {
		if (item) {
			localStorage.setItem("lang", item.value);
			const url = new URL($page.url);
			url.searchParams.set("lang", item.value);
			goto(url);
		}
	}}
>
	<Select.Trigger
		class={cn("md:max-w-48 md:w-auto bg-background md:justify-start gap-2", triggerClass)}
	>
		<LanguagesIcon aria-label="Languages icon" class="size-4" />
		<Select.Value class="line-clamp-1 overflow-ellipsis">
			{label}
		</Select.Value>
	</Select.Trigger>

	<Select.Content sameWidth={false} class={cn("max-h-[50dvh] overflow-y-scroll", contentClass)}>
		{#each items as { value, label } (value)}
			<Select.Item {label} {value}>{label}</Select.Item>
		{/each}
	</Select.Content>

	<Select.Input />
</Select.Root>
