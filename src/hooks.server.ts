import { getAvailableLocaleIds, negotiateLocale } from "$lib/server/locale";
import type { Handle } from "@sveltejs/kit";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const handle = (async ({ event, resolve }) => {
	const available = await getAvailableLocaleIds(event.fetch);
	const cookieLocale = event.cookies.get("lang");

	const locale = negotiateLocale({
		available,
		cookie: cookieLocale,
		acceptLanguage: event.request.headers.get("accept-language"),
	});

	// Only write the cookie when it doesn't already match, so we don't reset its
	// expiry (and emit a Set-Cookie) on every single request.
	if (cookieLocale !== locale) {
		event.cookies.set("lang", locale, {
			path: "/",
			maxAge: LOCALE_COOKIE_MAX_AGE,
			sameSite: "lax",
		});
	}

	event.locals.locale = locale;

	return await resolve(event);
}) satisfies Handle;
