import { client } from "@kulupu-linku/sona/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	setHeaders({ "Cache-Control": "s-maxage=31536000" });

	return await client({ fetch }).jasima.$get();
};
