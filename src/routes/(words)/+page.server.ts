import type { Linku } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => ({
	linku: await fetch("/data").then<Linku>((res) => res.json()),
})) satisfies PageServerLoad;
