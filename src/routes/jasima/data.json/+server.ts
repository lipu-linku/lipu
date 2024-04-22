import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	const r = await fetch(
		"https://raw.githubusercontent.com/lipu-linku/jasima/main/data.json"
	).then(r => r.json());

	setHeaders({ "Cache-Control": "s-maxage=31536000" });

	return json(r);
};
