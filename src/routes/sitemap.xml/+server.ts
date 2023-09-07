import type { RequestHandler } from './$types';

export const GET = (async ({ fetch }) => {
	const data = await fetch('/data').then((res) => res.json());
	const words = Object.keys(data.data);

	return new Response(render(words), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}) satisfies RequestHandler;

const render = (words: string[]) =>
	`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://linku.la/</loc></url>
<url><loc>https://linku.la/about</loc></url>
${words.map((word) => `<url><loc>https://linku.la/${word}</loc></url>`).join('')}
</urlset>`;
