export function keys<T extends object>(o: T): (keyof T)[] {
	return Object.keys(o) as (keyof T)[];
}

export function entries<K extends PropertyKey, V>(obj: Record<K, V>): [K, V][] {
	return Object.entries(obj) as [K, V][];
}

export function fromEntries<K extends PropertyKey, V>(arr: [K, V][]): Record<K, V> {
	return Object.fromEntries(arr) as Record<K, V>;
}

export function filterValues<K extends PropertyKey, V>(
	obj: Record<K, V>,
	func: (key: K, value: V) => boolean,
): Record<K, V> {
	return fromEntries(entries(obj).filter(([k, v]) => func(k, v)));
}

export function mapValues<K extends PropertyKey, V, R>(
	obj: Record<K, V>,
	func: (value: V) => R,
): Record<K, R> {
	return fromEntries(entries(obj).map(([k, v]) => [k, func(v)]));
}

export const normalize = (str: string) =>
	str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLocaleLowerCase()
		.trim();

export const fuzzyMatch = (text: string, query: string) => {
	let lastMatch = -1;
	for (const char of query) {
		lastMatch = text.indexOf(char, lastMatch + 1);
		if (lastMatch === -1) {
			return false;
		}
	}
	return true;
};
