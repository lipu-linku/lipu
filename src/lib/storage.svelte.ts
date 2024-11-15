import { browser } from "$app/environment";

export type Serializer<T> = {
	parse(from: string): T;
	stringify(from: T): string;
};

export const persisted = <T>(key: string, initial: T, serializer?: Serializer<T>) => {
	const { parse, stringify } = serializer ?? {
		parse: (from): T => JSON.parse(from),
		stringify: (from) => JSON.stringify(from),
	};
	function localState() {
		if (browser) {
			const local = localStorage.getItem(key);
			return local ? parse(local) : initial;
		} else {
			return initial;
		}
	}

	let value = $state(localState());

	$effect.root(() => {
		$effect(() => {
			localStorage.setItem(key, stringify(value));
		});
	});

	return {
		get value() {
			return value;
		},
		set value(update) {
			value = update;
		},
		reset() {
			value = initial;
		},
	};
};
