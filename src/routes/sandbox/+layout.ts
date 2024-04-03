import type { LayoutLoad } from "./$types";
import { client } from "@kulupu-linku/sona/client";

export const load: LayoutLoad = async ({ parent, fetch }) => {
	const { languages, language } = await parent();

	return {
		words: await client({ fetch })
			.v1.sandbox.$get({ query: { lang: language.id } })
			.then((r) => r.json()),
		languages,
		language,
	};
};
