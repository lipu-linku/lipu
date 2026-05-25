<script lang="ts">
	import * as Chart from "$lib/components/ui/chart";
	import { lang } from "$lib/state.svelte";
	import type { Word } from "@kulupu-linku/sona/v2";
	import type { UsageCategory } from "@kulupu-linku/sona/v2/utils";
	import { scaleThreshold } from "d3-scale";
	import { Highlight, LineChart, Points, Rule } from "layerchart";

	const { data }: { data: Word["usage"] } = $props();

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

<Chart.Container {config} class="max-h-[90dvh] min-h-full">
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
				format: (d: Date) =>
					d.toLocaleDateString(lang.current, { month: "2-digit", year: "2-digit" }),
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
				{#snippet formatter({ item, value })}
					{@const dateLabel = // @ts-expect-error
						item.label?.toLocaleDateString(lang.current, { month: "long", year: "numeric" })}
					<div
						class="h-full w-1 shrink-0 rounded-xs border-3 border-(--color-border) bg-(--color-bg)"
						style:--color-bg={item.payload?.color}
						style:--color-border={item.payload?.color}
					></div>
					<div class="flex flex-1 shrink-0 items-center justify-between gap-3 leading-none">
						<div class="grid gap-1.5">
							<div class="font-medium">
								{dateLabel}
							</div>
							<span class="text-muted-foreground"
								>{config[usageToCategory(value as number)].label}</span
							>
						</div>
						<span class="font-mono font-medium text-foreground tabular-nums">
							{value}%
						</span>
					</div>
				{/snippet}
			</Chart.Tooltip>
		{/snippet}

		{#snippet points()}
			<Points class="stroke-muted-foreground md:[r:8px]" />
		{/snippet}

		{#snippet rule()}
			<!-- The cutoff date where the question in the survey changed -->
			<Rule
				x={new Date(2021, 11, 31)}
				class="stroke-destructive stroke-2 [stroke-dasharray:4] [stroke-linecap:round]"
			/>
		{/snippet}
	</LineChart>
</Chart.Container>
