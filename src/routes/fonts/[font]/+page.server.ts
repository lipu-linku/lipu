import { client } from "@kulupu-linku/sona/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
	return {
		font: await client({ fetch })
			.v1.fonts[":font"].$get({ param: params })
			.then((r) => r.json()),
	};
};
