import type { BookName, UsageCategory, Word } from "$lib/types";
import { normalize } from "$lib/utils";
import { distance } from "fastest-levenshtein";

// adapted directly from jan Tani's excellent nimi.li project with their permission:
// https://github.com/cubedhuang/sona-nimi/blob/master/src/routes/(words)/%2Bpage.svelte

export const wordSearch = (
	query: string,
	words: Word[],
	categories: Record<UsageCategory, boolean>,
	language: string = "en",
): Word[] => {
	query = normalize(query);

	const initialFilteredWords = words.filter((w) => categories[w.usage_category]);

	if (query === "") return initialFilteredWords;

	const scoreFilter = (word: Word) =>
		basicScore(word.word, query) ||
		basicScore(word.def[language] ?? word.def.en, query) ||
		basicScore(word.ku_data, query) ||
		basicScore(word.etymology, query) ||
		basicScore(word.source_language, query) ||
		basicScore(word.creator, query) ||
		basicScore(word.commentary, query);

	return initialFilteredWords
		.filter(scoreFilter)
		.map((w) => [w, wordScore(w, query, language)] as [Word, number])
		.sort(([_, a], [_1, b]) => b - a)
		.map(([w, _]) => w);
};

const wordScore = (word: Word, query: string, language: string) => {
	let score = 0;

	score += basicScore(word.word, query) * 100;
	score += basicScore(word.def[language] ?? word.def.en, query) * 50;
	score += basicScore(word.ku_data, query) * 40;
	score += basicScore(word.etymology, query) * 30;
	score += basicScore(word.source_language, query) * 20;
	score += basicScore(word.creator, query) * 10;
	score += basicScore(word.commentary, query) * 5;

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
