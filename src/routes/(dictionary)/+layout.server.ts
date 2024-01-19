import type { Linku } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
	try {
		const rawData = await fetch("/data").then<Linku>((res) => res.json());
		const dictWithIds = Object.fromEntries(
			Object.entries(rawData.data).map(([id, w]) => [id, { ...w, id }]),
		);

		return { linku: { ...rawData, data: dictWithIds } };
	} catch {
		error(500, {
			message: "Dictionary data could not be receieved!",
		});
	}
}) satisfies LayoutServerLoad;
