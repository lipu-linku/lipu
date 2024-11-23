<script module lang="ts">
	export type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | "10" | "11" | "12";
</script>

<script lang="ts">
	import * as Select from "$lib/components/ui/select";
	import type { ControlAttrs } from "formsnap";
	import { Input } from "./ui/input";

	type Props = ControlAttrs & {
		value: `${number}-${Month}`;
		required?: boolean;
		class?: string;
	};
	let { value = $bindable(), required, id, name, class: className = "", ...rest }: Props = $props();

	let year = $state(new Date().getFullYear());
	let month = $state<Month>((new Date().getMonth() + 1).toString().padStart(2, "0") as Month);
</script>

<div class={className}>
	<Select.Root {required} type="single" bind:value={month}>
		<Select.Trigger>
			{new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(`0-${month}-1`))}
		</Select.Trigger>

		<Select.Content>
			<Select.Item value="01">January</Select.Item>
			<Select.Item value="02">February</Select.Item>
			<Select.Item value="03">March</Select.Item>
			<Select.Item value="04">April</Select.Item>
			<Select.Item value="05">May</Select.Item>
			<Select.Item value="06">June</Select.Item>
			<Select.Item value="07">July</Select.Item>
			<Select.Item value="08">August</Select.Item>
			<Select.Item value="09">September</Select.Item>
			<Select.Item value="10">October</Select.Item>
			<Select.Item value="11">November</Select.Item>
			<Select.Item value="12">December</Select.Item>
		</Select.Content>
	</Select.Root>

	<Input
		type="number"
		bind:value={year}
		min={2000}
		max={2099}
		{required}
		id="{id}-year"
		name="{name}-year"
		{...rest}
	/>
</div>
