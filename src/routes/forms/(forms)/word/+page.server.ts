import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { schemas } from "../schemas";
import { fail } from "@sveltejs/kit";
import type { Word } from "@kulupu-linku/sona";
import * as Taplo from "@taplo/lib";

export const load: PageServerLoad = async () => ({
	form: await superValidate(zod(schemas.word)),
});

export const actions: Actions = {
	submit: async (event) => {
		const form = await superValidate(event, zod(schemas.word));

		if (!form.valid) return fail(400, { form });

		const { data } = form;
		const toml = await Taplo.Taplo.initialize();

		const word: Word = {
			id: data.word,
			author_verbatim: data.author_verbatim ?? "",
			author_verbatim_source: data.author_verbatim_source ?? "",
			book: data.book,
			coined_era: data.coined_era ?? "",
			coined_year: data.coined_year ?? "",
			creator: data.creator ?? [],
			see_also: data.see_also ?? [],
			resources: data.resources ? { sona_pona: data.resources.sona_pona } : undefined,
			representations:
				Object.keys(data.representations).length > 0
					? {
							sitelen_emosi: data.representations.sitelen_emosi,
							sitelen_jelo: data.representations.sitelen_jelo,
							ligatures: data.representations.ligatures,
							sitelen_sitelen: data.representations.sitelen_sitelen
								? `https://raw.githubusercontent.com/lipu-linku/ijo/main/sitelensitelen/${data.representations.sitelen_sitelen.author.replace(/\s/g, "_")}/${data.word}.jpg`
								: undefined,
						}
					: undefined,
			source_language: data.source_language ?? "",
			usage_category: "sandbox",
			word: data.word,
			deprecated: false,
			etymology: data.etymology?.map((it) => ({ word: it.word, alt: it.alt })) ?? [],
			audio:
				data.audio?.map((it) => ({
					author: it.author,
					link: `https://raw.githubusercontent.com/lipu-linku/ijo/main/kalama/${it.author.replace(/\s/g, "_")}/${data.word}.mp3`,
				})) ?? [],
			usage: {},
		};

		Buffer.from("#:schema ../../api/generated/word.json\n" + toml.encode(word));

		return { form };
	},
};
