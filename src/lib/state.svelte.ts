import { browser } from "$app/environment";
import { fromEntries, keys } from "$lib/utils";
import type { UsageCategory } from "@kulupu-linku/sona/v2/utils";
import { PersistedState } from "runed";
import { createSearchParamsSchema, useSearchParams, type ReturnUseSearchParams } from "runed/kit";
import { createContext } from "svelte";
import * as z from "zod";

export const language = new PersistedState(
	"lang",
	browser ? navigator.language || navigator.languages[0] : "en",
	{
		serializer: {
			serialize: (value) => value,
			deserialize: (value) => value,
		},
	},
);

export const dir = new PersistedState<"ltr" | "rtl">("dir", "ltr");

export const categoriesCodec = z.codec(
	z.string().optional(),
	z.object({
		core: z.boolean().default(true),
		common: z.boolean().default(true),
		uncommon: z.boolean().default(false),
		obscure: z.boolean().default(false),
	}),
	{
		decode: (list) => {
			if (!list) return {};
			const enabled = list.split(",").filter(Boolean);

			return fromEntries(keys(defaultCategories).map((k) => [k, enabled.includes(k)]));
		},
		encode: (obj) =>
			obj
				? keys(obj)
						.filter((k) => obj[k])
						.join(",")
				: undefined,
	},
);

export const queryParamsSchema = createSearchParamsSchema({
	q: { type: "string", default: "" },
	categories: {
		type: "object",
		objectType: {
			core: true,
			common: true,
			uncommon: false,
			obscure: false,
		},
	},
	list: { type: "array", arrayType: "string", default: [] },
	lang: { type: "string" },
	sort: { type: "string" },
	reverse: { type: "boolean" },
});

export const defaultCategories: Record<Exclude<UsageCategory, "sandbox">, boolean> = {
	core: true,
	common: true,
	uncommon: false,
	obscure: false,
};

export const categories = new PersistedState("categories", defaultCategories, {
	serializer: {
		deserialize: categoriesCodec.decode,
		serialize: (val) => categoriesCodec.encode(val) ?? "{}",
	},
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
			deserialize: (s) =>
				s.replace(/^"+/g, "").replace(/"+$/g, "") as "sitelen_pona" | "sitelen_sitelen",
			serialize: (s) => s.replace(/^"+/g, "").replace(/"+$/g, ""),
		},
	},
);

export const etymologiesEnabled = new PersistedState("etymologies_enabled", true);
export const onlyFavorites = new PersistedState("only_favorites", false);

export const fontSentence = new PersistedState(
	"font_sentence",
	"󱦀󱥾󱤧󱦅󱤉󱦁 · jan li pana e moku tawa sina",
);
