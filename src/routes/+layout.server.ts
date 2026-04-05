import type { LayoutServerLoad } from "./$types";

export const load = (({ locals }) => {
	return { locale: locals.locale };
}) satisfies LayoutServerLoad;
