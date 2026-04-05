import { client } from "@kulupu-linku/sona/v2/client";
import { getRequestEvent, query } from "$app/server";

export const languages = query(async () => {
	const { fetch } = getRequestEvent();

	return await client({ fetch })
		.v2.languages.$get()
		.then((r) => r.json());
});
