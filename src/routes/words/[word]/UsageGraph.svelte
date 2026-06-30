<script lang="ts">
	import * as Chart from "$lib/components/ui/chart";
	import { useLocale } from "$lib/state.svelte";
	import type { Word } from "@kulupu-linku/sona/v2";
	import type { UsageCategory } from "@kulupu-linku/sona/v2/utils";
	import { scaleThreshold } from "d3-scale";
	import { Highlight, LineChart, Points, Rule } from "layerchart";

	const { data }: { data: Word["usage"] } = $props();

	const lang = useLocale();

	// The horizontal threshold lines: each `y` is the lower bound where its
	// category begins, so the line doubles as a boundary marker for that category.
	const categoryRules = [
		{ y: 5, category: "obscure" },
		{ y: 30, category: "uncommon" },
		{ y: 60, category: "common" },
		{ y: 90, category: "core" },
	] as const;

	const usageToCategory = (usage: number): UsageCategory => {
		for (const { y, category } of categoryRules.toSorted((a, b) => b.y - a.y)) {
			if (usage >= y) return category;
		}
		return "sandbox";
	};

	const categoryColor = (v: number) => `var(--color-category-${usageToCategory(v)})`;

	const plots = $derived(
		Object.entries(data).map(([date, v]) => ({
			date: new Date(date),
			value: v,
			color: `var(--color-${usageToCategory(v)})`,
		})),
	);

	const segments = $derived(
		plots.slice(0, -1).map((from, i) => {
			const to = plots[i + 1];
			return { from, to, fromColor: categoryColor(from.value), toColor: categoryColor(to.value) };
		}),
	);

	// Intermediate stops to approximate an oklch gradient inside an SVG linearGradient
	// (SVG gradients don't natively interpolate in oklch, so we precompute stops via color-mix).
	const gradientStops = Array.from({ length: 11 }, (_, k) => k / 10);

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
		xNice
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
			grid: { yTicks: 10 },
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

		{#snippet marks({ context })}
			<defs>
				{#each segments as seg, i (i)}
					{@const x1 = context.xScale(seg.from.date)}
					{@const y1 = context.yScale(seg.from.value)}
					{@const x2 = context.xScale(seg.to.date)}
					{@const y2 = context.yScale(seg.to.value)}
					<linearGradient
						id="usage-gradient-{i}"
						gradientUnits="userSpaceOnUse"
						{x1}
						{y1}
						{x2}
						{y2}
					>
						{#each gradientStops as t}
							<stop
								offset="{t * 100}%"
								stop-color="color-mix(in oklch, {seg.fromColor}, {seg.toColor} {t * 100}%)"
							/>
						{/each}
					</linearGradient>
				{/each}
			</defs>
			{#each segments as seg, i (i)}
				<line
					x1={context.xScale(seg.from.date)}
					y1={context.yScale(seg.from.value)}
					x2={context.xScale(seg.to.date)}
					y2={context.yScale(seg.to.value)}
					stroke="url(#usage-gradient-{i})"
					stroke-width="2"
					stroke-linecap="round"
				/>
			{/each}
		{/snippet}

		{#snippet tooltip()}
			<Chart.Tooltip nameKey="usage" indicator="line">
				{#snippet formatter({ item, value })}
					{const dateLabel = $derived(
						// @ts-expect-error
						item.label?.toLocaleDateString(lang.current, { month: "long", year: "numeric" }),
					)}
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

		{#snippet highlight({ context })}
			{#if context.tooltip.data}
				<Highlight lines points={{ fill: categoryColor(context.y(context.tooltip.data)) }} />
			{/if}
		{/snippet}

		{#snippet rule({ context })}
			<!-- The cutoff date where the question in the survey changed -->
			<Rule
				x={new Date(2021, 11, 31)}
				stroke="var(--color-destructive)"
				strokeWidth={2}
				stroke-dasharray={4}
				stroke-linecap="round"
			/>

			{#each categoryRules as { y, category } (category)}
				<Rule
					{y}
					stroke="var(--color-category-{category})"
					stroke-opacity={0.5}
					strokeWidth={2}
					stroke-linecap="round"
				/>
				<text
					x={context.width}
					y={context.yScale(y) - 4}
					text-anchor="end"
					class="text-xs font-medium"
					fill="var(--color-category-foreground-{category})"
				>
					{config[category].label}
				</text>
			{/each}
		{/snippet}
	</LineChart>
</Chart.Container>
