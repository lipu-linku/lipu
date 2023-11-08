import type { Linku } from "$lib/types";
import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ fetch, url, setHeaders }) => {
	try {
		const rawData = await fetch("/data").then<Linku>((res) => res.json());
		const dictWithIds = Object.fromEntries(
			Object.entries(rawData.data).map(([id, w]) => [id, { ...w, id }]),
		);

		return { linku: { ...rawData, data: dictWithIds } };
	} catch {
		throw error(500, {
			message: "Dictionary data could not be receieved!",
		});
	}
}) satisfies LayoutServerLoad;
