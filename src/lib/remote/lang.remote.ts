import { command, getRequestEvent, query } from "$app/server";
import { client } from "@kulupu-linku/sona/v2/client";
import { error } from "@sveltejs/kit";
import * as z from "zod";

export const getLocales = query(async () => {
	const { platform } = getRequestEvent();

	return await client({ fetch: platform?.env.SONA_API.fetch })
		.v2.languages.$get()
		.then((r) => r.json());
});

export const getLocale = query(z.string(), async (locale) => {
	const { platform } = getRequestEvent();
	const res = await client({ fetch: platform?.env.SONA_API.fetch }).v2.languages[":language"].$get({
		param: { language: locale },
	});

	if (!res.ok) error(404, { message: `Language ${locale} does not exists` });
	return (await res.json()).data;
});

export const updateLocale = command(z.string(), async (locale) => {
	const { cookies } = getRequestEvent();
	cookies.set("lang", locale, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax",
	});
});
