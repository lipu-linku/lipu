import { client } from "@kulupu-linku/sona/v1/client";

export const load = async ({ parent, fetch }) => {
	const { language } = await parent();

	return {
		words: await client({ fetch })
			.v1.words.$get({ query: { lang: language.id } })
			.then((r) => r.json()),
	};
};
