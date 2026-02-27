import { client } from "@kulupu-linku/sona/v1/client";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	const data = (await client({ fetch })
		.jasima.$get()
		.then((r) => r.json())) as unknown;
	setHeaders({ "Cache-Control": "s-maxage=31536000" });

	return json(data);
};
