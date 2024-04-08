<script lang="ts">
	import type { Word } from "@kulupu-linku/sona";
	import { Chart, registerables } from "chart.js";
	import type { Action } from "svelte/action";

	export let data: Word["usage"];

	$: plots = Object.entries(data).map(([date, v]) => ({ date: new Date(date), value: v }));

	const chart: Action<HTMLCanvasElement> = (el) => {
		Chart.register(...registerables);

		Chart.defaults.borderColor = `hsl(${getComputedStyle(document.body).getPropertyValue("--muted-foreground")})`;

		const chart = new Chart(el, {
			type: "line",
			data: {
				labels: plots.map((it) =>
					it.date.toLocaleDateString("en", { month: "short", year: "numeric" }),
				),
				datasets: [
					{
						data: plots.map((it) => it.value),
					},
				],
			},
			options: {
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						usePointStyle: true,
						callbacks: {
							label: (item) => item.formattedValue + "%",
						},
					},
				},
				scales: {
					y: {
						min: 0,
						max: 100,
						position: "left",
					},
					x: {
						position: "bottom",
					},
				},
			},
		});

		return {
			destroy: () => chart.destroy(),
		};
	};
</script>

<canvas use:chart></canvas>
