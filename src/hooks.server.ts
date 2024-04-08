import { i18n } from "$lib/i18n";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const handle: Handle = sequence(i18n.handle(), async ({ event, resolve }) => {
	if (event.url.pathname === "/words") return Response.redirect(event.url.origin + "/");

	return await resolve(event);
});
