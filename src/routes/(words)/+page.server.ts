import type { PageServerLoad } from './$types';

export const load = (({ fetch }) => {
	return fetch('/data').then((res) => res.json()) as Promise<JSON>;
}) satisfies PageServerLoad;
