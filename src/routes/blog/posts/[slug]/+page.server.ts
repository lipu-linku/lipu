import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import type { Post } from "../../+page.server";
import type { Component } from "svelte";
import { render } from "svelte/server";

export const prerender = true;

export const load = async ({ params }) => {
	try {
		const { default: component, metadata }: { default: Component; metadata: Post } = await import(
			`../${params.slug}.svx`
		);

		if (!dev && !metadata.published) error(404, { message: "Post does not exist" });

		const { body, head } = render(component);

		const githubAuthor = await fetch(`https://api.github.com/users/${metadata.author}`)
			.then<Post["author"] | string>((r) => r.ok ? r.json() : metadata.author)
			.catch(() => metadata.author);

		return {
			slug: params.slug,
			post: {
				...metadata,
				date: new Date(metadata.date),
				author: githubAuthor,
			},
			body,
			head,
		};
	} catch (e) {
		console.error(e);
		error(404, { message: "Post does not exist" });
	}
};
