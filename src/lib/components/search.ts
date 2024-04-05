import { fuzzyMatch, normalize } from "$lib/utils";
import type { Language, LocalizedWord, Words } from "@kulupu-linku/sona";
import { getTranslatedData, type UsageCategory } from "@kulupu-linku/sona/utils";
import { distance } from "fastest-levenshtein";

// adapted directly from jan Tani's excellent nimi.li project with their permission:
// https://github.com/cubedhuang/sona-nimi/blob/master/src/routes/(words)/%2Bpage.svelte

export const wordSearch = (
	query: string,
	words: Words,
	categories: Record<UsageCategory, boolean>,
	wordList: string[] | undefined = undefined,
	language: Language["id"] = "en",
): LocalizedWord[] => {
	query = normalize(query);

	const initialFilteredWords = Object.values(words).filter(
		(w) => categories[w.usage_category] && (wordList?.includes(w.word) ?? true),
	);

	if (query === "")
		return initialFilteredWords.sort((a, b) =>
			a.word.toLowerCase().localeCompare(b.word.toLowerCase()),
		);

	const scoreFilter = (word: LocalizedWord) =>
		Boolean(
			wordScore(word.word, query) ||
				dataScore(getTranslatedData(word, "definition", language), query) ||
				dataScore(word.ku_data ? Object.keys(word.ku_data).join(", ") : "", query) ||
				dataScore(getTranslatedData(word, "etymology", language).join(", "), query) ||
				dataScore(word.source_language, query) ||
				dataScore(word.creator.join(", "), query) ||
				dataScore(getTranslatedData(word, "commentary", language), query),
		);

	const filtered = initialFilteredWords.filter((w) => scoreFilter(w));
	const scored = filtered.map((w) => [w, wordDataScore(w, query, language)] as const);
	const sorted = scored.sort(([, a], [, b]) => b - a);
	const onlyWords = sorted.map(([w]) => w);

	return onlyWords;
};

const wordDataScore = (word: LocalizedWord, query: string, language: string) => {
	let score = 0;

	score += wordScore(word.word, query) * 100;
	score += dataScore(getTranslatedData(word, "definition", language), query) * 50;
	score += dataScore(word.ku_data ? Object.keys(word.ku_data).join(", ") : "", query) * 40;
	score += dataScore(getTranslatedData(word, "etymology", language).join(", "), query) * 30;
	score += dataScore(word.source_language, query) * 20;
	score += dataScore(word.creator.join(", "), query) * 10;
	score += dataScore(getTranslatedData(word, "commentary", language), query) * 5;

	return score;
};

const fuzzyScore = (text: string | undefined, query: string) => {
	if (!text) return 0;
	return fuzzyMatch(text, query) ? 2 : 0; // 1 for base, 1 for match
};

const includesScore = (text: string | undefined, query: string) => {
	if (!text) return 0;
	return text.includes(query) ? 2 : 0;
};

const distanceScore = (text: string | undefined, query: string) => {
	if (!text) return 0;

	const dist = distance(query, text);
	const maxDist = text.length / 3;
	if (dist > maxDist) return 0;
	return 1 + ((maxDist - dist) / maxDist) * 2;
};

const wordScore = (text: string | undefined, query: string) => {
	return fuzzyScore(text, query) + distanceScore(text, query);
};

const dataScore = (text: string | undefined, query: string) => {
	return includesScore(text, query) + distanceScore(text, query);
};
