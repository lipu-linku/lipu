import { persisted } from "svelte-persisted-store/dist/index.mjs";
import { writable } from "svelte/store";
import { localUrlStore } from "./localUrlStore";
import type { UsageCategory } from "./types";
import { browser } from "$app/environment";

export const siteLanguage = persisted("langauge", "en");

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
