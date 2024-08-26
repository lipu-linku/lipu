import { browser } from "$app/environment";
import { client } from "@kulupu-linku/sona/client";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import type { Language } from "@kulupu-linku/sona";

export const load: LayoutLoad = async ({ url, fetch }) => {
	const param = url.searchParams.get("lang");

	const localLanguage =
		param ??
		(browser
			? (localStorage.getItem("lang") ?? (navigator.language || navigator.languages[0]))
			: "en");

	const response = await client({ fetch }).v1.languages[":language"].$get({
		param: { language: localLanguage },
	});

	let currentLanguage: Language;
	if (response.ok) {
		currentLanguage = (await response.json()).data;
	} else {
		console.error(response.json().then((it) => it.message));

		const defaultLang = await client({ fetch }).v1.languages[":language"].$get({
			param: { language: "en" },
		});

		currentLanguage = defaultLang.ok
			? (await defaultLang.json()).data
			: error(400, `Could not recover from wrong language code: ${localLanguage}`);
	}

	if (browser && !localStorage.getItem("lang")) localStorage.setItem("lang", currentLanguage.id);

	return {
		languages: await client({ fetch })
			.v1.languages.$get()
			.then((r) => r.json()),
		language: currentLanguage,
	};
};
