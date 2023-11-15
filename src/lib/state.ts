import { persisted } from "svelte-persisted-store/dist/index.mjs";
import { writable } from "svelte/store";
import type { UsageCategory } from "./types";

export const siteLanguage = persisted("langauge", "en");

export const searchQuery = writable("");

export const categories = persisted<Record<UsageCategory, boolean>>("usage_categories", {
	core: true,
	widespread: true,
	common: false,
	uncommon: false,
	rare: false,
	obscure: false,
});

export const writingSystem = persisted<"sitelen_pona" | "sitelen_sitelen">(
	"writing_system",
	"sitelen_pona",
);
