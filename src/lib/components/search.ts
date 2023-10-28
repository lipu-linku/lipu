import type { BookName, Linku, UsageCategory } from "$lib/types";

export const search = (
	dictionary: Linku["data"],
	query: string,
	categories: Record<UsageCategory, boolean>,
	selectedBooks: Record<BookName, boolean>,
) =>
	Object.fromEntries(
		Object.entries(dictionary).filter(
			([_, word]) =>
				categories[word.usage_category] && word.word.includes(query) && selectedBooks[word.book],
		),
	);
