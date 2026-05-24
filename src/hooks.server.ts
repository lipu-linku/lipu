import { getLocale } from "$lib/remote/lang.remote";
import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
	const cookieLocale = event.cookies.get("lang");
	const locale =
		((cookieLocale && (await getLocale(cookieLocale))) || undefined) ??
		(await resolveLocaleFromAcceptLanguage(event.request.headers.get("accept-language"))) ??
		(await getLocale("en"));

	event.cookies.set("lang", locale.id, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax",
	});

	event.locals.locale = locale;

	return await resolve(event);
}) satisfies Handle;

async function resolveLocaleFromAcceptLanguage(header: string | null) {
	if (!header) return undefined;
	const candidates = header.split(",").map((s) => s.split(";")[0]!.trim());
	for (const candidate of candidates) {
		try {
			return await getLocale(candidate);
		} catch {}
	}
	return undefined;
}
