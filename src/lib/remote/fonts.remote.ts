import { getRequestEvent, query } from "$app/server";
import { entries } from "$lib/utils";
import { client } from "@kulupu-linku/sona/v2/client";
import { error } from "@sveltejs/kit";
import { z } from "zod";

const openLicenses = ["GPL", "MIT", "OFL", "CC"];

export const getFonts = query(async () => {
	const { fetch } = getRequestEvent();

	return entries(
		await client({ fetch })
			.v2.fonts.$get()
			.then((r) => r.json()),
	).filter(([, it]) => openLicenses.some((l) => it.license.startsWith(l)));
});

export const getFont = query(z.string(), async (font) => {
	const { fetch } = getRequestEvent();
	return await client({ fetch })
		.v2.fonts[":font"].$get({ param: { font } })
		.then((r) =>
			r.ok
				? r.json()
				: error(404, { message: `Couldn't fetch font named ${font} from the server` }),
		);
});
