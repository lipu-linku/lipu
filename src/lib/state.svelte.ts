import { browser } from "$app/environment";
import type { UsageCategory } from "@kulupu-linku/sona/utils";
import { writable } from "svelte/store";
import { entries, fromEntries } from "$lib/utils";

type Serializer<T> = { parse: (from: string) => T; stringify: (from: T) => string };

const persisted = <T>(
	key: string,
	initialValue: T,
	options: { serializer?: Serializer<T> } = {},
) => {
	const { serializer = { parse: (s) => JSON.parse(s) as T, stringify: (s) => JSON.stringify(s) } } =
		options;

	let computedInitial: T;
	if (browser) {
		const initial = localStorage.getItem(key);
		computedInitial = initial ? serializer.parse(initial) : initialValue;
	} else {
		computedInitial = initialValue;
	}

	let value = $state(computedInitial);

	$effect.root(() => {
		$effect(() => {
			localStorage.setItem(key, serializer.stringify(value));
		});
	});

	return {
		value,
		reset() {
			value = initialValue;
		},
	};
};

export const searchQuery = $state({
	value: browser ? (new URLSearchParams(window.location.search).get("q") ?? "") : "",
});

export const defaultCategories: Record<Exclude<UsageCategory, "sandbox">, boolean> = {
	core: true,
	common: true,
	uncommon: false,
	obscure: false,
};

export const categoriesSerializer: Serializer<typeof defaultCategories> = {
	parse: (list) => {
		const keys = list.split(",");
		const entries = fromEntries(
			keys.map((it) => [it as keyof typeof defaultCategories, true] as const),
		);

		return {
			...defaultCategories,
			...entries,
		};
	},
	stringify: (obj) =>
		entries(obj)
			.filter(([, on]) => on)
			.map(([key]) => key)
			.join(","),
};

export const categories = persisted("categories", defaultCategories, {
	serializer: categoriesSerializer,
});

export const favorites = persisted<Set<string>>("favorites", new Set(), {
	serializer: {
		parse: (text) => {
			const noPadding = /,*(.*),*/.exec(text)?.[1] ?? "";
			return new Set(noPadding !== "" ? noPadding.split(",") : []);
		},
		stringify: (obj) => [...obj.values()].join(","),
	},
});

export const writingSystem = persisted<"sitelen_pona" | "sitelen_sitelen">(
	"writing_system",
	"sitelen_pona",
);

export const etymologiesEnabled = persisted("etymologies_enabled", true);
export const onlyFavorites = persisted("only_favorites", false);

export const fontSentence = persisted("font_sentence", "jan li pana e moku tawa sina");
