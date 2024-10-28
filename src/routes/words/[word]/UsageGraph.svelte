<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Word } from "@kulupu-linku/sona";
	import { scaleTime } from "d3-scale";
	import { Axis, Chart, Highlight, Points, Spline, Svg, Tooltip } from "layerchart";
	import type { ComponentProps } from "svelte";

	interface Props {
		data: Word["usage"];
	}

	const { data }: Props = $props();

	const tickLabelProps: ComponentProps<Axis>["tickLabelProps"] = {
		class: "fill-current font-semibold m-3",
	};

	const plots = $derived(
		Object.entries(data).map(([date, v]) => ({ date: new Date(date), value: v })),
	);
</script>

<Chart
	data={plots}
	x="date"
	xScale={scaleTime()}
	y="value"
	yDomain={[0, 100]}
	tooltip={{ mode: "bisect-x" }}
	padding={{ left: 16, bottom: 24 }}
>
	<Svg>
		<Axis
			placement="left"
			grid={{ class: "stroke-muted" }}
			format={(d) => `${d}%`}
			{tickLabelProps}
		/>
		<Axis
			placement="bottom"
			rule={{ class: "stroke-muted" }}
			format={(d) => d.toLocaleDateString("en", { month: "short", year: "numeric" })}
			tickLabelProps={{ class: cn(tickLabelProps.class, "max-md:hidden") }}
		/>
		<Spline class="stroke-2 stroke-primary" />
		<Points data={plots} class="fill-primary" />
		<Highlight points lines={{ class: "stroke-secondary" }} />
	</Svg>

	<Tooltip.Root
		classes={{
			container: "border",
		}}
	>
		{#snippet children(data: { date: Date; value: number })}
			<Tooltip.Header>
				{data.date.toLocaleDateString("en", { month: "short", year: "numeric" })}
			</Tooltip.Header>
			<Tooltip.Item label="Usage" value="{data.value}%" />
		{/snippet}
	</Tooltip.Root>
</Chart>
