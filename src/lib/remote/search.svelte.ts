import { categories, sortingDirection, sortingMethod } from "$lib/state.svelte";
import type { Word } from "@kulupu-linku/sona";
import MiniSearch from "minisearch";

// adapted directly from jan Tani's excellent nimi.li project with their permission:
// https://github.com/cubedhuang/sona-nimi/blob/master/src/routes/(words)/%2Bpage.svelte

const normalizeQuery = (q: string) =>
	q
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLocaleLowerCase()
		.trim();

function sortWords(a: Word, b: Word) {
	const dir = sortingDirection.current === "ascending" ? 1 : -1;

	switch (sortingMethod.current) {
		case "alphabetical":
			return dir * a.word.toLowerCase().localeCompare(b.word.toLowerCase());
		case "usage":
			return dir * ((Object.values(a.usage).at(-1) ?? 0) - (Object.values(b.usage).at(-1) ?? 0));
	}
}

function buildMiniSearch(words: Word[]) {
	const ms = new MiniSearch({
		fields: [
			"word",
			"ku_data",
			"source_lang",
			"author",
			"see_also",
			"translations.definition",
			"translations.etymology",
			"translations.commentary",
		],
		extractField: (word: Word, field) => {
			let nested_field = field.startsWith("translations")
				? word.translations[field.slice(13) as keyof Word["translations"]] // strip "translations." prefix
				: word[field as keyof Word];
			if (Array.isArray(nested_field)) nested_field = nested_field.join(", ");
			return nested_field ?? "";
		},
		searchOptions: {
			boost: { word: 100, "translations.definition": 5 },
			prefix: true,
			fuzzy: 0.2,
		},
	});
	ms.addAll(words);
	return ms;
}

/**
 * Pure search+sort over a pre-fetched word map.
 * Safe to call from both the browser and server endpoints (e.g. suggestions.json).
 */
export function searchWords(words: Record<string, Word>, query: string): Word[] {
	const q = normalizeQuery(query);
	const all = Object.values(words);

	if (q === "") return all.toSorted(sortWords);

	return buildMiniSearch(all)
		.search(q)
		.map((it) => ({ ...words[it.id], score: it.score }))
		.sort((a, b) => (a.score !== b.score ? b.score - a.score : sortWords(a, b)));
}

/**
 * Reactive search pipeline. Construct it synchronously during component init
 * (so internal $effects in dependencies are not orphaned), pass getter
 * functions for the inputs that change, then read `.results` in your template.
 *
 * The MiniSearch index is rebuilt only when the filtered word set changes —
 * NOT on every keystroke.
 */
export class WordSearch {
	#words: () => Record<string, Word>;
	#q: () => string;

	constructor(words: () => Record<string, Word>, q: () => string) {
		this.#words = words;
		this.#q = q;
	}

	#filtered = $derived.by(() =>
		Object.values(this.#words()).filter(
			(w) => w.usage_category === "sandbox" || categories.current[w.usage_category],
		),
	);

	#index = $derived.by(() => buildMiniSearch(this.#filtered));

	results = $derived.by(() => {
		const q = normalizeQuery(this.#q());
		if (q === "") return this.#filtered.toSorted(sortWords);

		const wordsMap = this.#words();
		return this.#index
			.search(q)
			.map((it) => ({ ...wordsMap[it.id], score: it.score }))
			.sort((a, b) => (a.score !== b.score ? b.score - a.score : sortWords(a, b)));
	});
}
