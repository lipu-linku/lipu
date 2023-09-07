export default function search(dictionary, query, categories) {
	const filtered = Object.entries(dictionary).filter(([key, word]) =>
		filter_word(word, query, categories)
	);
	return Object.fromEntries(filtered);
}

function filter_word(word, query, categories) {
	if (!categories[word.usage_category]) {
		return false;
	}
	// basic substring search. TODO: replace with better stuff
	return word['word'].includes(query);
}
