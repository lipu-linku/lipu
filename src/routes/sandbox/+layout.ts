import { client } from "@kulupu-linku/sona/v1/client";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, fetch }) => {
	const { languages, language } = await parent();

	const langParam = language.id === "en" ? "en" : `${language.id},en`;
	return {
		words: await client({ fetch })
			.v1.sandbox.$get({ query: { lang: langParam } })
			.then((r) => r.json()),
		languages,
		language,
	};
};
