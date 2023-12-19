import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { distance } from "fastest-levenshtein";
import type { Linku } from "$lib/types";

export const load: PageServerLoad = async ({ params: { word }, parent }) => {
	const {
		linku: { data: dictionary },
	} = await parent();

	const wordData = dictionary[word];

	if (!wordData) {
		const closest = Object.keys(dictionary)
			.map((key) => ({ key, distance: distance(key, word) }))
			.filter(({ key, distance }) => distance < 3 || key.startsWith(word))
			.sort((a, b) => a.distance - b.distance)
			.slice(0, 15)
			.map(({ key }) => key);

		// long queries should display less results
		if (word.length >= 10) closest.pop();

		// prioritize kijetesantakalu for long queries
		if (word.length >= 15) closest.push("kijetesantakalu");

		error(404, { message: `Word not found!`, closest });
	}

	return {
		word: wordData,
	};
};
