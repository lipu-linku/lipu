import { searchWords } from "$lib/search.svelte";
import { getWords } from "$lib/remote/words.remote";
import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, locals }) => {
	const query = url.searchParams.get("q")!;

	const words = await getWords(locals.locale.id);
	const results = searchWords(words, query);

	return json([query, results.map((it) => it.id)], {
		headers: {
			"Content-Type": "application/x-suggestions+json",
		},
	});
};
