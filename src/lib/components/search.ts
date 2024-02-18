import {
	entries,
	filterValues,
	fromEntries,
	getTranslatedData,
	mapValues,
	normalize,
} from "$lib/utils";
import type { Words } from "@kulupu-linku/sona";
import type { UsageCategory } from "@kulupu-linku/sona/utils";
import { distance } from "fastest-levenshtein";

// adapted directly from jan Tani's excellent nimi.li project with their permission:
// https://github.com/cubedhuang/sona-nimi/blob/master/src/routes/(words)/%2Bpage.svelte

export const wordSearch = (
	query: string,
	words: Words,
	categories: Record<UsageCategory, boolean>,
	wordList: string[] | undefined = undefined,
	language: string = "en",
): Words => {
	query = normalize(query);

	const initialFilteredWords = filterValues(
		words,
		(_, w) => categories[w.usage_category] && (wordList?.includes(w.word) ?? true),
	);

	if (query === "") return initialFilteredWords;

	const scoreFilter = (word: Words[string]) =>
		Boolean(
			basicScore(word.word, query) ||
				basicScore(getTranslatedData(word, "definitions", language), query) ||
				basicScore(word.ku_data ? Object.keys(word.ku_data).join(", ") : "", query) ||
				basicScore(getTranslatedData(word, "etymology", language).join(", "), query) ||
				basicScore(word.source_language, query) ||
				basicScore(word.creator.join(", "), query) ||
				basicScore(getTranslatedData(word, "commentary", language), query),
		);

	const filtered = filterValues(initialFilteredWords, (_, w) => scoreFilter(w));
	const scored = mapValues(filtered, (w) => [w, wordScore(w, query, language)] as const);
	const sorted = fromEntries(entries(scored).sort(([, [, a]], [, [, b]]) => b - a));
	const onlyWords = mapValues(sorted, ([w]) => w);

	return onlyWords;
};

const wordScore = (word: Words[string], query: string, language: string) => {
	let score = 0;

	score += basicScore(word.word, query) * 100;
	score += basicScore(getTranslatedData(word, "definitions", language), query) * 50;
	score += basicScore(word.ku_data ? Object.keys(word.ku_data).join(", ") : "", query) * 40;
	score += basicScore(getTranslatedData(word, "etymology", language).join(", "), query) * 30;
	score += basicScore(word.source_language, query) * 20;
	score += basicScore(word.creator.join(", "), query) * 10;
	score += basicScore(getTranslatedData(word, "commentary", language), query) * 5;

	return score;
};

const basicScore = (text: string | undefined, query: string) => {
	if (!text) return 0;

	const includes = text.includes(query);
	const dist = distance(query, text);
	const maxDist = text.length / 3;

	// words which don't include the query and are too far away
	// are not worth much
	if (!includes && dist > maxDist) return 0;

	let score = 1;

	// converts the distance to a 1-3 scale
	if (dist <= maxDist) score += ((maxDist - dist) / maxDist) * 2;
	if (includes) score++;

	return score;
};
