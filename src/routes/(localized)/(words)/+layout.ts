import { client } from "@kulupu-linku/sona/client";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent }) => {
	const { language } = await parent();

	return {
		words: await client.v1.words.$get({ query: { lang: language } }).then(async (r) => r.json()),
	};
};
