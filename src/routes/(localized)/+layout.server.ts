import { keys } from "$lib/utils";
import { client } from "@kulupu-linku/sona/client";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ url }) => {
	const languages = await client.v1.languages.$get().then((r) => r.json());
	const currentLanguage = url.searchParams.get("lang");
	if (currentLanguage && !keys(languages).includes(currentLanguage)) {
		error(400, {
			message: `${currentLanguage} is not a valid language code or is not supported by Linku.`,
		});
	}

	return {
		languages,
		language: currentLanguage,
	};
};
