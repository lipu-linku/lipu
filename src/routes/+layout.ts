import { browser } from "$app/environment";
import { client } from "@kulupu-linku/sona/v1/client";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url, fetch }) => {
	const param = url.searchParams.get("lang");

	const localKey =
		param ??
		(browser
			? (localStorage.getItem("lang") ?? (navigator.language || navigator.languages[0]))
			: "en");

	let currentLanguage;

	const localLanguage = await client({ fetch }).v1.languages[":language"].$get({
		param: { language: localKey },
	});

	if (localLanguage.ok) {
		currentLanguage = (await localLanguage.json()).data;
	} else {
		console.error((await localLanguage.json()).message);

		const english = await client({ fetch }).v1.languages[":language"].$get({
			param: { language: "en" },
		});

		if (!english.ok) error(400, `Could not recover from wrong language code: ${localLanguage}`);

		currentLanguage = (await english.json()).data;
	}

	if (browser && !localStorage.getItem("lang")) localStorage.setItem("lang", currentLanguage.id);

	return {
		languages: await client({ fetch })
			.v1.languages.$get()
			.then((r) => r.json()),
		language: currentLanguage,
	};
};
