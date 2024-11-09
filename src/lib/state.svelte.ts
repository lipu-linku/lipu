import { browser } from "$app/environment";
import { entries, fromEntries } from "$lib/utils";
import type { UsageCategory } from "@kulupu-linku/sona/utils";
import { LocalStorage, type Serializer } from "./storage.svelte";

export const searchQuery = $state({
	value: browser ? (new URLSearchParams(window.location.search).get("q") ?? "") : "",
});

export const defaultCategories: Record<Exclude<UsageCategory, "sandbox">, boolean> = {
	core: true,
	common: true,
	uncommon: false,
	obscure: false,
};

export const categoriesSerializer: Serializer<typeof defaultCategories | undefined> = {
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
		entries(obj ?? defaultCategories)
			.filter(([, on]) => on)
			.map(([key]) => key)
			.join(","),
};

export const categories = new LocalStorage("categories", defaultCategories, categoriesSerializer);

export const favorites = new LocalStorage("favorites", new Set<string>(), {
	parse: (text) => {
		const noPadding = /,*(.*),*/.exec(text)?.[1] ?? "";
		return new Set(noPadding !== "" ? noPadding.split(",") : []);
	},
	stringify: (obj) => [...(obj?.values() ?? [])].join(","),
});

export const writingSystem = new LocalStorage<"sitelen_pona" | "sitelen_sitelen">(
	"writing_system",
	"sitelen_pona",
);

export const etymologiesEnabled = new LocalStorage("etymologies_enabled", true);
export const onlyFavorites = new LocalStorage("only_favorites", false);

export const fontSentence = new LocalStorage("font_sentence", "jan li pana e moku tawa sina");
