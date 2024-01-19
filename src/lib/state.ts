import { browser } from "$app/environment";
import { persisted } from "svelte-persisted-store/dist/index.mjs";
import { writable } from "svelte/store";
import type { UsageCategory } from "./types";

export const language = persisted(
	"lang",
	browser ? navigator.language || navigator.languages[0] : "en",
);

export const searchQuery = writable(
	browser ? new URLSearchParams(window.location.search).get("q") ?? "" : "",
);

export const defaultCategories: Record<UsageCategory, boolean> = {
	core: true,
	widespread: true,
	common: false,
	uncommon: false,
	rare: false,
	obscure: false,
};

export const categories = persisted("categories", defaultCategories);

export const writingSystem = persisted<"sitelen_pona" | "sitelen_sitelen">(
	"writing_system",
	"sitelen_pona",
);

export const fontSentence = persisted("font_sentence", "jan li pana e moku tawa sina");
