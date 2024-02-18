import { client } from "@kulupu-linku/sona/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	return { fonts: await client.v1.fonts.$get().then((r) => r.json()) };
};
