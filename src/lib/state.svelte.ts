import { entries, fromEntries } from "$lib/utils";
import type { UsageCategory } from "@kulupu-linku/sona/utils";
import * as devalue from "devalue";
import { PersistedState } from "runed";
import { SvelteSet } from "svelte/reactivity";
import { queryParameters } from "sveltekit-search-params";

export const queryParams = queryParameters();

export const defaultCategories: Record<Exclude<UsageCategory, "sandbox">, boolean> = {
	core: true,
	common: true,
	uncommon: false,
	obscure: false,
};

export const categoriesSerializer = {
	deserialize: (list: string) => {
		const keys = list?.split(",") ?? [];
		const entries = fromEntries(
			keys.map((it) => [it as keyof typeof defaultCategories, true] as const),
		);

		return {
			...defaultCategories,
			...entries,
		};
	},
	serialize: (obj: typeof defaultCategories) =>
		entries(obj)
			.filter(([, on]) => on)
			.map(([key]) => key)
			.join(","),
};

export const categories = new PersistedState("categories", defaultCategories, {
	serializer: categoriesSerializer,
});

export const favorites = new PersistedState<string[]>("favorites", [], {
	serializer: {
		deserialize: (list) => list.split(",").filter(Boolean),
		serialize: (obj) => obj.join(","),
	},
});

export const writingSystem = new PersistedState<"sitelen_pona" | "sitelen_sitelen">(
	"writing_system",
	"sitelen_pona",
	{
		serializer: {
			deserialize: (s) => s as "sitelen_pona" | "sitelen_sitelen",
			serialize: (s) => s
		}
	}
);

export const etymologiesEnabled = new PersistedState("etymologies_enabled", true);
export const onlyFavorites = new PersistedState("only_favorites", false);

export const fontSentence = new PersistedState("font_sentence", "jan li pana e moku tawa sina");
