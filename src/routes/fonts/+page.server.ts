import { client } from "@kulupu-linku/sona/client";
import type { PageServerLoad } from "./$types";
import { entries } from "$lib/utils";

const openLicenses = [];

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		fonts: entries(
			await client({ fetch })
				.v1.fonts.$get()
				.then((r) => r.json()),
		).filter(([, it]) => openLicenses.includes(it.license)),
	};
};
