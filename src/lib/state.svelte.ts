import { browser } from "$app/environment";
import { entries, fromEntries } from "$lib/utils";
import type { UsageCategory } from "@kulupu-linku/sona/utils";
import { PersistedState } from "runed";
import { SvelteSet } from "svelte/reactivity";

export const searchQuery = $state({
	value: browser ? (new URLSearchParams(window.location.search).get("q") ?? "") : "",
});

export const defaultCategories: Record<Exclude<UsageCategory, "sandbox">, boolean> = {
	core: true,
	common: true,
	uncommon: false,
	obscure: false,
};

export const categoriesSerializer = {
	deserialize: (list: string) => {
		const keys = list.split(",");
		const entries = fromEntries(
			keys.map((it) => [it as keyof typeof defaultCategories, true] as const),
		);

		return {
			...defaultCategories,
			...entries,
		};
	},
	serialize: (obj: Record<keyof typeof defaultCategories, boolean>) =>
		entries(obj)
			.filter(([, on]) => on)
			.map(([key]) => key)
			.join(","),
};

export const categories = new PersistedState("categories", defaultCategories, {
	serializer: categoriesSerializer,
});

export const favorites = new PersistedState("favorites", new SvelteSet<string>(), {
	serializer: {
		deserialize: (text) => {
			const noPadding = /,*(.*),*/.exec(text)?.[1] ?? "";
			return new SvelteSet(noPadding !== "" ? noPadding.split(",") : []);
		},
		serialize: (obj) => [...(obj?.values() ?? [])].join(","),
	},
});

export const writingSystem = new PersistedState<"sitelen_pona" | "sitelen_sitelen">(
	"writing_system",
	"sitelen_pona",
);

export const etymologiesEnabled = new PersistedState("etymologies_enabled", true);
export const onlyFavorites = new PersistedState("only_favorites", false);

export const fontSentence = new PersistedState("font_sentence", "jan li pana e moku tawa sina");
