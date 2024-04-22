import { signIn } from "@auth/sveltekit/client";
import type { PageLoad } from "./$types";
import { browser } from "$app/environment";

export const load: PageLoad = async () => {
	if (browser) signIn("github");
};
