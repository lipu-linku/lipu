import type { Linku } from "$lib/types";
import { json } from "@sveltejs/kit";

export const GET = async () => {
	const data = await fetch(
		"https://raw.githubusercontent.com/lipu-linku/jasima/main/data.json",
	).then<Linku>((r) => r.json());

	return json(data);
};
