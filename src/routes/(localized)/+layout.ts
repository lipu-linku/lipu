import { browser } from "$app/environment";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
	const localLanguage = browser
		? localStorage.getItem("lang") ?? (navigator.language || navigator.languages[0])
		: "en";

	if (browser && !localStorage.getItem("lang")) localStorage.setItem("lang", localLanguage);

	return {
		...data,
		language: data.language ?? localLanguage,
	};
};
