import { resolve } from "$app/paths";
import { getWord } from "$lib/remote/words.remote";
import { redirect } from "@sveltejs/kit";

export const load = async ({ params, locals }) => {
	await getWord({ word: params.word, locale: locals.locale.id });
	redirect(308, resolve(`/words/[word]`, params));
};
