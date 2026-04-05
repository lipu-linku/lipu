import { wordSearch } from "$lib/remote/search.remote";
import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, locals }) => {
	const query = url.searchParams.get("q")!;

	const results = await wordSearch({ locale: locals.locale.id, query });

	return json([query, results.map((it) => it.id)], {
		headers: {
			"Content-Type": "application/x-suggestions+json",
		},
	});
};
