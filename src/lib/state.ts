import { browser } from "$app/environment";
import type { UsageCategory } from "@kulupu-linku/sona/utils";
import { persisted } from "svelte-persisted-store/dist/index.mjs";
import { writable } from "svelte/store";

export const searchQuery = writable(
	browser ? new URLSearchParams(window.location.search).get("q") ?? "" : "",
);

export const defaultCategories: Record<Exclude<UsageCategory, "sandbox">, boolean> = {
	core: true,
	common: true,
	uncommon: false,
	obscure: false,
};

export const categories = persisted("categories", defaultCategories);

export const writingSystem = persisted<"sitelen_pona" | "sitelen_sitelen">(
	"writing_system",
	"sitelen_pona",
);

export const fontSentence = persisted("font_sentence", "jan li pana e moku tawa sina");
