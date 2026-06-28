import { client } from "@kulupu-linku/sona/v2/client";

export const FALLBACK_LOCALE = "en";

const AVAILABLE_TTL = 1000 * 60 * 60; // 1 hour

// The set of available locale ids is global configuration, not request-specific
// state, so it is safe to memoize across requests within an isolate.
let availableCache: { ids: Set<string>; expires: number } | undefined;

/**
 * Fetches the set of locale ids the dictionary supports, memoized with a TTL so
 * locale negotiation costs at most one API round-trip per hour instead of one
 * per candidate per request.
 */
export async function getAvailableLocaleIds(fetch: typeof globalThis.fetch): Promise<Set<string>> {
	if (availableCache && availableCache.expires > Date.now()) return availableCache.ids;

	try {
		const locales = await client({ fetch })
			.v2.languages.$get()
			.then((r) => r.json());
		const ids = new Set(Object.keys(locales));
		availableCache = { ids, expires: Date.now() + AVAILABLE_TTL };
		return ids;
	} catch {
		// On a transient API failure, reuse the last good list if we have one so a
		// blip doesn't reset everyone to the fallback locale.
		return availableCache?.ids ?? new Set([FALLBACK_LOCALE]);
	}
}

/**
 * Resolves the best supported locale for a request from, in order of priority:
 * an explicit cookie, the `Accept-Language` header (q-value sorted, with
 * base-language fallback), and finally {@link FALLBACK_LOCALE}.
 */
export function negotiateLocale({
	available,
	cookie,
	acceptLanguage,
}: {
	available: Set<string>;
	cookie: string | undefined;
	acceptLanguage: string | null;
}): string {
	if (cookie && available.has(cookie)) return cookie;

	// Case-insensitive lookup from a normalized tag back to the canonical id.
	const canonical = new Map([...available].map((id) => [id.toLowerCase(), id]));

	for (const tag of parseAcceptLanguage(acceptLanguage)) {
		const exact = canonical.get(tag);
		if (exact) return exact;

		const base = canonical.get(tag.split("-")[0]!);
		if (base) return base;
	}

	return available.has(FALLBACK_LOCALE)
		? FALLBACK_LOCALE
		: (available.values().next().value ?? FALLBACK_LOCALE);
}

/** Parses an `Accept-Language` header into tags ordered by descending q-value. */
function parseAcceptLanguage(header: string | null): string[] {
	if (!header) return [];

	return header
		.split(",")
		.map((part) => {
			const [tag, ...params] = part.trim().split(";");
			const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
			const quality = q ? Number.parseFloat(q.slice(2)) : 1;
			return { tag: tag!.trim().toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 };
		})
		.filter((entry) => entry.tag && entry.tag !== "*" && entry.quality > 0)
		.sort((a, b) => b.quality - a.quality)
		.map((entry) => entry.tag);
}
