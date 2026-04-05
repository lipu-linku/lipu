import { getRequestEvent, query } from "$app/server";
import { client } from "@kulupu-linku/sona/client";
import * as z from "zod";

export const getGlyphs = query(z.string(), async (lang) => {
	const { fetch } = getRequestEvent();

	return await client({ fetch })
		.v2.glyphs.$get({ query: { lang } })
		.then((r) => r.json());
});

export const getGlyph = query.batch(
	z.object({ glyph: z.string(), lang: z.string() }),
	async (data) => {
		const glyphs = await getGlyphs(data[0].lang);

		return (id) => glyphs[id.glyph];
	},
);
