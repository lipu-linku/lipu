<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Select from "$lib/components/ui/select";
	import { cn } from "$lib/utils";
	import type { Languages } from "@kulupu-linku/sona";

	import LanguagesIcon from "~icons/lucide/languages";

	interface Props {
		localeList: Languages;
		selected: keyof Languages;
		triggerClass?: string;
		contentClass?: string;
	}

	const { localeList, selected, triggerClass = "", contentClass = "" }: Props = $props();

	const items = $derived(
		new Map(
			Object.entries(localeList).map(
				([id, lang]) => [id, lang.name.endonym ?? lang.name.en] as const,
			),
		),
	);
</script>

<Select.Root
	type="single"
	value={selected}
	onValueChange={(item) => {
		if (item) {
			localStorage.setItem("lang", item);
			const url = new URL($page.url);
			url.searchParams.set("lang", item);
			goto(url);
		}
	}}
>
	<Select.Trigger
		class={cn(
			"overflow-ellipsis md:max-w-48 md:w-fit bg-background md:justify-start gap-2",
			triggerClass,
		)}
	>
		<LanguagesIcon aria-label="Languages icon" class="size-4" />
		{items.get(selected)}
	</Select.Trigger>

	<Select.Content class={contentClass}>
		{#each items as [value, label] (value)}
			<Select.Item {label} {value}>{label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
