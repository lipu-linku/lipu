import { client } from "@kulupu-linku/sona/client";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, fetch }) => {
	const { language } = await parent();

	return {
		words: await client({ fetch })
			.v1.words.$get({ query: { lang: language.id } })
			.then((r) => r.json()),
	};
};
