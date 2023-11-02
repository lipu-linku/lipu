import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { wordSearch } from "$lib/components/search";

export const prerender = false

export const load: PageServerLoad = async ({ url, parent }) => {
	const query = url.searchParams.get("q");

	if (!query) throw redirect(300, "/");

	const {
		linku: { data: dictionary },
	} = await parent();
	const words = Object.values(dictionary).map((w) => w.word);

	if (words.includes(query)) throw redirect(301, `/words/${query}`);

	return {
		results: wordSearch(
			query,
			Object.values(dictionary),
			{
				pu: true,
				"ku suli": true,
				"ku lili": true,
				none: true,
			},
			{
				core: true,
				widespread: true,
				common: true,
				uncommon: true,
				rare: true,
				obscure: true,
			},
		),
		query,
	};
};
