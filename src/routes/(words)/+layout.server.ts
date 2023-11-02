import type { Linku } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
	const linku = await fetch("/data").then<Linku>((res) => res.json());

	return {
		linku: {
			...linku,
			data: Object.fromEntries(Object.entries(linku.data).map(([id, w]) => [id, { ...w, id }])),
		},
	};
}) satisfies LayoutServerLoad;
