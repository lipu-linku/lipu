import { fromEntries, keys } from "$lib/utils";
import type { UsageCategory } from "@kulupu-linku/sona/v2/utils";
import { PersistedState } from "runed";
import { createSearchParamsSchema } from "runed/kit";
import * as z from "zod";

export const lang = $state({ current: "en" });

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
});

export const displayMethod = new PersistedState<"grid" | "compact">("display_method", "grid");

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

export const sortingMethod = new PersistedState<"alphabetical" | "usage">(
	"sorting_method",
	"alphabetical",
);

export const sortingDirection = new PersistedState<"descending" | "ascending">(
	"sorting_direction",
	"ascending",
);

export const etymologiesEnabled = new PersistedState("etymologies_enabled", true);

export const fontSentence = new PersistedState(
	"font_sentence",
	"󱦀󱥾󱤧󱦅󱤉󱦁 · jan li pana e moku tawa sina",
);
