import { client } from "@kulupu-linku/sona/v1/client";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
	return {
		font: await client({ fetch })
			.v1.fonts[":font"].$get({ param: params })
			.then((r) =>
				r.ok
					? r.json()
					: error(500, { message: `Couldn't fetch font named ${params.font} from the server` }),
			),
	};
};
