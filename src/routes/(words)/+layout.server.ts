import type { Linku } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
	try {
		const linku = await fetch("/data").then<Linku>((res) => res.json());

		return {
			linku: {
				...linku,
				data: Object.fromEntries(Object.entries(linku.data).map(([id, w]) => [id, { ...w, id }])),
			},
		};
	} catch {
		throw error(500, {
			message: "Dictionary data could not be receieved!",
		});
	}
}) satisfies LayoutServerLoad;
