import { persisted } from "svelte-persisted-store/dist/index.mjs";
import { writable } from "svelte/store";
import { localUrlStore } from "./localUrlStore";
import type { UsageCategory } from "./types";
import { browser } from "$app/environment";

export const language = localUrlStore(
	"lang",
	browser ? navigator.language || navigator.languages[0] : "en",
	{
		encode: (l) => l,
		decode: (l) => l,
	},
);

export const searchQuery = writable(
	browser ? new URLSearchParams(window.location.search).get("q") ?? "" : "",
);

const defaultCategories: Record<UsageCategory, boolean> = {
	core: true,
	widespread: true,
	common: false,
	uncommon: false,
	rare: false,
	obscure: false,
};

export const categories = localUrlStore("categories", defaultCategories);

export const writingSystem = persisted<"sitelen_pona" | "sitelen_sitelen">(
	"writing_system",
	"sitelen_pona",
);

export const fontSentence = persisted("font_sentence", "jan li pana e moku tawa sina");
