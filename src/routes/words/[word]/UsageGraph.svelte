<script lang="ts">
	import { m } from "$lib/paraglide";
	import { cn } from "$lib/utils";
	import type { Word } from "@kulupu-linku/sona";
	import { scaleTime } from "d3-scale";
	import { Axis, Chart, Highlight, Points, Spline, Svg, Tooltip, TooltipItem } from "layerchart";
	import type { ComponentProps } from "svelte";

	export let data: Word["usage"];

	const tickLabelProps: ComponentProps<Axis>["tickLabelProps"] = {
		class: "fill-current font-semibold m-3",
	};

	$: plots = Object.entries(data).map(([date, v]) => ({ date: new Date(date), value: v }));
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

	<Tooltip
		classes={{
			container: "border",
		}}
		header={({ date }) => date.toLocaleDateString("en", { month: "short", year: "numeric" })}
		let:data
	>
		<TooltipItem label={m.usage_data_usage()} value="{data.value}%" />
	</Tooltip>
</Chart>
