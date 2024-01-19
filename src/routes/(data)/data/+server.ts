import type { Linku } from "$lib/types";
import { json } from "@sveltejs/kit";

export const GET = async () => {
	const data = await fetch("https://linku.la/jasima/data.json").then<Linku>((r) => r.json());

	return json(data);
};
