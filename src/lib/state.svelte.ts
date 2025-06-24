import { fromEntries, keys } from "$lib/utils";
import type { UsageCategory } from "@kulupu-linku/sona/utils";
import { PersistedState } from "runed";
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
		const enabled = list.split(",").filter(Boolean);

		return fromEntries(keys(defaultCategories).map((k) => [k, enabled.includes(k)]));
	},
	serialize: (obj: typeof defaultCategories) =>
		keys(obj)
			.filter((k) => obj[k])
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
			serialize: (s) => s,
		},
	},
);

export const etymologiesEnabled = new PersistedState("etymologies_enabled", true);
export const onlyFavorites = new PersistedState("only_favorites", false);

export const fontSentence = new PersistedState("font_sentence", "󱦀󱥾󱤧󱦅󱤉󱦁 · jan li pana e moku tawa sina");
