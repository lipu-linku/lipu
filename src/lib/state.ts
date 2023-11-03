import BasicViewIcon from "$lib/assets/basic.png";
import GridViewIcon from "$lib/assets/grid.png";
import LukaPonaIcon from "$lib/assets/luka-pona.png";
import { persisted } from "svelte-persisted-store/dist/index.mjs";
import { writable } from "svelte/store";

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
