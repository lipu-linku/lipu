import { categoriesCodec, defaultCategories } from "$lib/state.svelte";
import { normalize } from "$lib/utils";
import type { Word } from "@kulupu-linku/sona";
import MiniSearch from "minisearch";
import * as z from "zod";
import { getSandbox, getWords } from "./words.remote";
import { query } from "$app/server";

// adapted directly from jan Tani's excellent nimi.li project with their permission:
// https://github.com/cubedhuang/sona-nimi/blob/master/src/routes/(words)/%2Bpage.svelte

export const wordSearch = query(
	z.object({
		query: z.string(),
		lang: z.string(),
		sandbox: z.boolean().default(false),
		favorites: z.string().array().default([]),
		categories: categoriesCodec.out.default(defaultCategories),
		list: z.string().array().default([]),
		onlyFavorites: z.boolean().default(false),
	}),
	async ({ query, lang, sandbox, favorites, categories, list, onlyFavorites }) => {
		const words = { ...(await getWords(lang)), ...(await getSandbox(lang)) };
		query = normalize(query);

		const initialFilteredWords = Object.values(words)
			.map((w) => ({ ...w, isFavorite: favorites.includes(w.id) }))
			.filter((w) => {
				if (sandbox && w.usage_category !== "sandbox") return false;
				if (w.usage_category !== "sandbox" && !categories[w.usage_category]) return false;
				if (list.length > 0 && !list.includes(w.word)) return false;
				if (onlyFavorites && !w.isFavorite) return false;

				return true;
			});

		if (query === "")
			return initialFilteredWords.sort((a, b) => {
				if (a.isFavorite && !b.isFavorite) return -1;
				if (!a.isFavorite && b.isFavorite) return 1;
				return a.word.toLowerCase().localeCompare(b.word.toLowerCase());
			});

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
			extractField: (word: Word & { isFavorite: boolean }, field) => {
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
			.search(query)
			.map((it) => ({ ...initialFilteredWords[it.id], score: it.score }));

		const sorted = scored.sort((a, b) => {
			if (a.isFavorite && !b.isFavorite) return -1;
			if (!a.isFavorite && b.isFavorite) return 1;
			if (a.score !== b.score) return b.score - a.score;
			return a.word.toLowerCase().localeCompare(b.word.toLowerCase());
		});

		return sorted;
	},
);
