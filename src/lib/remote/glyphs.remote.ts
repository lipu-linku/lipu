import { getRequestEvent, query } from "$app/server";
import { client } from "@kulupu-linku/sona/client";
import { error } from "@sveltejs/kit";
import * as z from "zod";

export const getGlyphs = query(async () => {
	const { fetch, locals } = getRequestEvent();

	return await client({ fetch })
		.v2.glyphs.$get({ query: { lang: locals.locale } })
		.then((r) => r.json());
});

export const getSandboxGlyphs = query(async () => {
	const { fetch, locals } = getRequestEvent();

	return await client({ fetch })
		.v2.sandbox.glyphs.$get({ query: { lang: locals.locale } })
		.then((r) => r.json());
});

export const getGlyph = query.batch(z.string(), async (_glyphs) => {
	const list = { ...(await getGlyphs()), ...(await getSandboxGlyphs()) };

	return (glyph) => list[glyph] ?? error(404, `Glyph ${glyph} not found`);
});
