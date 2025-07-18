import { entries } from "$lib/utils";
import { client } from "@kulupu-linku/sona/client";
import type { PageServerLoad } from "./$types";

const openLicenses = ["GPL", "MIT", "OFL", "CC"];

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		fonts: entries(
			await client({ fetch })
				.v1.fonts.$get()
				.then((r) => r.json()),
		).filter(([, it]) => openLicenses.some((l) => it.license.startsWith(l))),
	};
};
