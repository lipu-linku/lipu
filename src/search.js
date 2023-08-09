
export default function search(dictionary, query) {
    const filtered = Object.entries(dictionary).filter(([key, word]) => filter_word(word, query));
    return Object.fromEntries(filtered)
}

function filter_word(word, query) {
    return word['word'].includes(query)
}
