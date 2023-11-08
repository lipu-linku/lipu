import BasicViewIcon from "$lib/assets/basic.png";
import GridViewIcon from "$lib/assets/grid.png";
import LukaPonaIcon from "$lib/assets/luka-pona.png";
import { persisted } from "svelte-persisted-store/dist/index.mjs";
import { writable } from "svelte/store";
import type { UsageCategory, BookName } from "./types";

export const siteLanguage = persisted("langauge", "en");

export const viewTypes = {
	basic: {
		name: "Basic view",
		icon: BasicViewIcon,
	},
	grid: {
		name: "Grid view",
		icon: GridViewIcon,
	},
	lukaPona: {
		name: "luka pona view",
		icon: LukaPonaIcon,
	},
} as const;
export const viewType = persisted<keyof typeof viewTypes>("view_type", "basic");

export const searchQuery = writable("");

export const books = persisted<Record<BookName, boolean>>("books", {
	pu: true,
	"ku suli": true,
	"ku lili": false,
	none: false,
});

export const categories = persisted<Record<UsageCategory, boolean>>("usage_categories", {
	core: true,
	widespread: true,
	common: false,
	uncommon: false,
	rare: false,
	obscure: false,
});
