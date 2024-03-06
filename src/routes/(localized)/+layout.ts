import { browser } from "$app/environment";
import { client } from "@kulupu-linku/sona/client";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url, fetch }) => {
	const languages = await client({ fetch })
		.v1.languages.$get()
		.then((r) => r.json());
	const param = url.searchParams.get("lang");

	const localLanguage =
		languages[
			param ?? browser
				? localStorage.getItem("lang") ?? (navigator.language || navigator.languages[0])
				: "en"
		];

	const currentLanguage = await client({ fetch })
		.v1.languages[":language"].$get({ param: { language: localLanguage.id } })
		.then((r) => r.json());

	if (!currentLanguage.ok) error(400, currentLanguage);
	if (browser && !localStorage.getItem("lang")) localStorage.setItem("lang", localLanguage.id);

	return {
		languages,
		language: currentLanguage.data ?? localLanguage,
	};
};
