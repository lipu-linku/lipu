<script lang="ts">
	import * as Chart from "$lib/components/ui/chart";
	import type { Word } from "@kulupu-linku/sona";
	import type { UsageCategory } from "@kulupu-linku/sona/utils";
	import { Highlight, LineChart, Points, Rule } from "layerchart";
	import { scaleThreshold } from "d3-scale";

	interface Props {
		data: Word["usage"];
	}

	const { data }: Props = $props();

	const usageToCategory = (usage: number): UsageCategory => {
		if (usage >= 90) return "core";
		if (usage >= 60) return "common";
		if (usage >= 30) return "uncommon";
		if (usage >= 5) return "obscure";
		return "sandbox";
	};

	const plots = $derived(
		Object.entries(data).map(([date, v]) => ({
			date: new Date(date),
			value: v,
			color: `var(--color-${usageToCategory(v)})`,
		})),
	);

	const config = {
		usage: { label: "Usage", color: "" },
		core: { label: "Core", color: "var(--color-category-core)" },
		common: { label: "Common", color: "var(--color-category-common)" },
		uncommon: { label: "Uncommon", color: "var(--color-category-uncommon)" },
		obscure: { label: "Obscure", color: "var(--color-category-obscure)" },
		sandbox: { label: "Sandbox", color: "var(--color-category-sandbox)" },
	} satisfies Chart.ChartConfig;
</script>

<Chart.Container {config}>
	<LineChart
		data={plots}
		x="date"
		y="value"
		yDomain={[0, 100]}
		padding={{ left: 16 }}
		c="value"
		cScale={scaleThreshold()}
		cDomain={[5, 30, 60, 90]}
		cRange={[
			"var(--color-category-sandbox)",
			"var(--color-category-obscure)",
			"var(--color-category-uncommon)",
			"var(--color-category-common)",
			"var(--color-category-core)",
		]}
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
			<Chart.Tooltip nameKey="usage" indicator="line">
				{#snippet formatter({ item, value, name })}
					<div
						style="--color-bg: {item.payload?.color}; --color-border: {item.payload?.color};"
						class="border-(--color-border) bg-(--color-bg) shrink-0 rounded-[2px] h-full w-1"
					></div>
					<div class="flex flex-1 items-center gap-3 shrink-0 justify-between leading-none">
						<div class="grid gap-1.5">
							<div class="font-medium">
								{// @ts-ignore
								item.label?.toLocaleDateString("en", { month: "long", year: "numeric" })}
							</div>
							<span class="text-muted-foreground"
								>{config[usageToCategory(value as number)].label}</span
							>
						</div>
						<span class="text-foreground font-mono font-medium tabular-nums">
							{value}%
						</span>
					</div>
				{/snippet}
			</Chart.Tooltip>
		{/snippet}
		{#snippet points()}
			<Points r={8} class="stroke-muted-foreground" />
		{/snippet}
		{#snippet rule()}
			<Rule
				x={new Date(2021, 11, 31)}
				class="stroke-2 stroke-destructive [stroke-dasharray:4] [stroke-linecap:round]"
			/>
		{/snippet}
	</LineChart>
</Chart.Container>
