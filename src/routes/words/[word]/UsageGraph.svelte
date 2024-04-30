<script lang="ts">
	import type { Word } from "@kulupu-linku/sona";
	import { Chart, Svg, Axis, Spline, Highlight, Tooltip, TooltipItem } from "layerchart";

	export let data: Word["usage"];

	$: plots = Object.entries(data).map(([date, v]) => ({ date: new Date(date), value: v }));
</script>

<div class="h-[600px] p-4 border rounded">
	<Chart
		data={plots}
		x="date"
		y="value"
		yDomain={[0, 100]}
		yNice
		tooltip={{ mode: "bisect-x" }}
		padding={{ left: 16, bottom: 24 }}
	>
		<Svg>
			<Axis placement="left" grid rule />
			<Axis
				placement="bottom"
				format={(d) => new Date(d).toLocaleDateString("en", { month: "short", year: "numeric" })}
				rule
			/>
			<Spline class="stroke-2 stroke-primary" />
			<Highlight points lines />
		</Svg>

		<Tooltip
			classes={{
				container: "border",
			}}
			header={({ date }) => date.toLocaleDateString("en", { month: "short", year: "numeric" })}
			let:data
		>
			<TooltipItem label="Usage" value="{data.value}%" />
		</Tooltip>
	</Chart>
</div>
