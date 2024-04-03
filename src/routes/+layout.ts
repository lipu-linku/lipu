import { browser } from "$app/environment";
import { client } from "@kulupu-linku/sona/client";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url, fetch }) => {
	const param = url.searchParams.get("lang");

	const localLanguage =
		param ??
		(browser
			? localStorage.getItem("lang") ?? (navigator.language || navigator.languages[0])
			: "en");

	let currentLanguage = await client({ fetch })
		.v1.languages[":language"].$get({ param: { language: localLanguage } })
		.then((r) => r.json());

	if (!currentLanguage.ok) {
		console.error(currentLanguage.message);

		currentLanguage = await client({ fetch })
			.v1.languages[":language"].$get({ param: { language: "en" } })
			.then((r) => r.json());

		if (!currentLanguage.ok)
			error(400, `Could not recover from wrong language code: ${localLanguage}`);
	}

	if (browser && !localStorage.getItem("lang"))
		localStorage.setItem("lang", currentLanguage.data.id);

	return {
		languages: await client({ fetch })
			.v1.languages.$get()
			.then((r) => r.json()),
		language: currentLanguage.data,
	};
};
