import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === "/words") return Response.redirect(event.url.origin + "/");

	return await resolve(event);
};
