import { getRequestEvent, query } from "$app/server";
import { client } from "@kulupu-linku/sona/client";
import { error } from "@sveltejs/kit";
import * as z from "zod";

export const getGlyphs = query(async () => {
	const { platform, locals } = getRequestEvent();

	return await client({ fetch: platform?.env.SONA_API.fetch })
		.v2.glyphs.$get({ query: { lang: locals.locale.id } })
		.then((r) => r.json());
});

export const getSandboxGlyphs = query(async () => {
	const { platform, locals } = getRequestEvent();

	return await client({ fetch: platform?.env.SONA_API.fetch })
		.v2.sandbox.glyphs.$get({ query: { lang: locals.locale.id } })
		.then((r) => r.json());
});

export const getGlyph = query(z.string(), async (glyph) => {
	const { platform, locals } = getRequestEvent();

	const res = await client({ fetch: platform?.env.SONA_API.fetch }).v2.glyphs[":glyph"].$get({
		param: { glyph },
		query: { lang: locals.locale.id },
	});

	if (res.ok) return (await res.json()).data;

	const sandbox = await client({ fetch: platform?.env.SONA_API.fetch }).v2.sandbox.glyphs[":glyph"].$get({
		param: { glyph },
		query: { lang: locals.locale.id },
	});

	if (sandbox.ok) return (await sandbox.json()).data;

	error(404, `Glyph ${glyph} not found`);
});
