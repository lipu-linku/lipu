import { browser } from "$app/environment";
import { getLocale } from "$lib/remote/lang.remote";

import type { LayoutLoad } from "./$types";

export const load = (async ({ data }) => {
	if (!browser) return { locale: data.locale };
	const storedLocale = localStorage.getItem("lang");
	const locale =
		(storedLocale !== undefined && storedLocale !== null
			? await getLocale(storedLocale)
			: undefined) ??
		(await resolveLocaleFromNavigator()) ??
		data.locale;

	return { locale };
}) satisfies LayoutLoad;

async function resolveLocaleFromNavigator() {
	for (const preferredLocale of navigator.languages) {
		try {
			return await getLocale(preferredLocale);
		} catch {}
	}
	return undefined;
}
