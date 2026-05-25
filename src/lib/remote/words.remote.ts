import { getRequestEvent, query } from "$app/server";
import { client } from "@kulupu-linku/sona/client";
import { error } from "@sveltejs/kit";
import { distance } from "fastest-levenshtein";
import z from "zod";

const localeSchema = z.string().optional();

export const getWords = query(localeSchema, async (locale) => {
	const { fetch, locals } = getRequestEvent();
	const localeId = locale ?? locals.locale.id;

	return await client({ fetch })
		.v2.words.$get({ query: { lang: localeId } })
		.then((r) => r.json());
});

export const getSandbox = query(localeSchema, async (locale) => {
	const { fetch, locals } = getRequestEvent();

	const localeId = locale ?? locals.locale.id;

	return await client({ fetch })
		.v2.sandbox.words.$get({ query: { lang: localeId } })
		.then((r) => r.json());
});

export const getWord = query(
	z.object({
		word: z.string(),
		locale: localeSchema,
	}),
	async ({ word, locale }) => {
		const words = { ...(await getWords(locale)), ...(await getSandbox(locale)) };

		const foundWord = words[word];
		if (foundWord) return foundWord;

		const closest = Object.keys(words)
			.map((key) => ({ key, distance: distance(key, word) }))
			.filter(({ key, distance }) => distance < 3 || key.startsWith(word))
			.sort((a, b) => a.distance - b.distance)
			.slice(0, 15)
			.map(({ key }) => key);

		// long queries should display less results
		if (word.length >= 10) closest.pop();

		// prioritize kijetesantakalu for long queries
		if (word.length >= 15) closest.push("kijetesantakalu");

		error(404, { message: `Word ${word} not found!`, closest });
	},
);
