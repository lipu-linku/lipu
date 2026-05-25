import { query } from "$app/server";
import {
	categoriesCodec,
	defaultCategories,
	type sortingDirection,
	type sortingMethod,
} from "$lib/state.svelte";
import type { Word } from "@kulupu-linku/sona";
import MiniSearch from "minisearch";
import * as z from "zod";

import { getSandbox, getWords } from "./words.remote";

// adapted directly from jan Tani's excellent nimi.li project with their permission:
// https://github.com/cubedhuang/sona-nimi/blob/master/src/routes/(words)/%2Bpage.svelte

export const wordSearch = query(
	z.object({
		locale: z.string(),
		query: z.string(),
		sandbox: z.boolean().default(false),
		categories: categoriesCodec.out.default(defaultCategories),
		list: z.string().array().default([]),
		sorting: z.enum(["alphabetical", "usage"]).default("alphabetical"),
		direction: z.enum(["descending", "ascending"]).default("ascending"),
	}),
	async ({ locale, query, sandbox, categories, list, sorting, direction }) => {
		const words = { ...(await getWords(locale)), ...(await getSandbox(locale)) };
		const new_query = query
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLocaleLowerCase()
			.trim();

		const initialFilteredWords = Object.values(words).filter((w) => {
			if (sandbox !== (w.usage_category === "sandbox")) return false;
			if (w.usage_category !== "sandbox" && !categories[w.usage_category]) return false;
			if (list.length > 0 && !list.includes(w.word)) return false;

			return true;
		});

		if (new_query === "")
			return initialFilteredWords.sort((a, b) => sortWords(sorting, direction, a, b));

		let minisearch = new MiniSearch({
			fields: [
				"word",
				"ku_data",
				"source_lang",
				"author",
				"see_also",
				`translations.definition`,
				`translations.etymology`,
				`translations.commentary`,
			],
			extractField: (word: Word, field) => {
				let nested_field = field.startsWith("translations")
					? word.translations[field.slice(12) as keyof Word["translations"]]
					: word[field as keyof Word];
				if (Array.isArray(nested_field)) nested_field = nested_field.join(", ");
				return nested_field ?? "";
			},
			searchOptions: {
				boost: { word: 100, [`translations.definition`]: 5 },
				prefix: true,
				fuzzy: 0.2,
			},
		});
		minisearch.addAll(initialFilteredWords);
		const scored = minisearch
			.search(new_query)
			.map((it) => ({ ...words[it.id], score: it.score }));

		const sorted = scored.sort((a, b) =>
			a.score !== b.score ? b.score - a.score : sortWords(sorting, direction, a, b),
		);

		return sorted;
	},
);

function sortWords(
	method: (typeof sortingMethod)["current"],
	direction: (typeof sortingDirection)["current"],
	a: Word,
	b: Word,
) {
	const dir = direction === "ascending" ? 1 : -1;

	switch (method) {
		case "alphabetical":
			return dir * a.word.toLowerCase().localeCompare(b.word.toLowerCase());
		case "usage":
			return dir * ((Object.values(a.usage).at(-1) ?? 0) - (Object.values(b.usage).at(-1) ?? 0));
		default:
			throw method satisfies never;
	}
}
