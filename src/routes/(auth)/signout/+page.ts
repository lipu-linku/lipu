import { signOut } from "@auth/sveltekit/client";
import type { PageLoad } from "./$types";
import { browser } from "$app/environment";

export const load: PageLoad = async () => {
	if (browser) signOut();
};
