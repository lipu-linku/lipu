import { keys } from "$lib/utils";
import { client } from "@kulupu-linku/sona/client";
import type { RequestHandler } from "./$types";

export const GET = (async ({ fetch }) => {
	const words = await client({ fetch }).v1.words.$get({ query: {} });
	const sandbox = await client({ fetch }).v1.sandbox.$get({ query: {} });

	return new Response(render([...keys(words), ...keys(sandbox)]), {
		headers: {
			"Content-Type": "application/xml",
		},
	});
}) satisfies RequestHandler;

const render = (words: string[]) =>
	`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://linku.la/</loc></url>
<url><loc>https://linku.la/about</loc></url>
<url><loc>https://linku.la/sandbox</loc></url>
<url><loc>https://linku.la/fonts</loc></url>
${words.map((word) => `<url><loc>https://linku.la/words/${word}</loc></url>`).join("")}
</urlset>`;
