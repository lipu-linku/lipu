import { dev } from "$app/environment";

export const prerender = true;

export type RawPost = {
	title: string;
	subtitle: string;
	author: string;
	date: Date;
	published: boolean;
};

export type Post = {
	title: string;
	subtitle: string;
	author:
		| string
		| {
				name: string;
				blog?: string;
				avatar_url: string;
		  };
	date: Date;
	published: boolean;
};

export const load = async () => {
	const raw = import.meta.glob<RawPost>("./posts/*.svx", { eager: true, import: "metadata" });
	const posts = Object.fromEntries(
		await Promise.all(
			Object.entries(raw)
				.map(async ([path, data]) => {
					const githubAuthor = await fetch(`https://api.github.com/users/${data.author}`)
						.then<Post["author"]>((r) => r.json())
						.catch(() => data.author);

					return [
						path.match(/\.\/posts\/(.+)\.svx/)?.[1]!,
						{
							...data,
							date: new Date(data.date),
							author: githubAuthor,
						},
					] as const;
				})
				.filter(async (p) => dev || (await p)[1].published),
		),
	);

	return {
		posts,
	};
};
