<script lang="ts">
	import * as Chart from "$lib/components/ui/chart";
	import type { Word } from "@kulupu-linku/sona";
	import { Highlight, LineChart } from "layerchart";

	interface Props {
		data: Word["usage"];
	}

	const { data }: Props = $props();

	const plots = $derived(
		Object.entries(data).map(([date, v]) => ({ date: new Date(date), value: v })),
	);
</script>

<Chart.Container config={{ usage: { label: "Usage", color: "" } }}>
	<LineChart
		points={{ r: 8 }}
		data={plots}
		x="date"
		y="value"
		padding={{ left: 16 }}
		props={{
			highlight: { lines: true },
			xAxis: {
				format: (d: Date) => d.toLocaleDateString("en", { month: "short", year: "2-digit" }),
			},
			yAxis: {
				format: (d) => `${d}%`,
			},
		}}
	>
		{#snippet belowMarks()}
			<Highlight lines={{ class: "stroke-muted" }} />
		{/snippet}
		{#snippet tooltip()}
			<Chart.Tooltip
				nameKey="usage"
				labelFormatter={(val: Date) =>
					val.toLocaleDateString("en", { month: "long", year: "numeric" })}
			/>
		{/snippet}
	</LineChart>
</Chart.Container>
