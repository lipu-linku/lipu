import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { escapeSvelte } from "mdsvex";
import { createHighlighter } from "shiki";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import rehypeCallouts from "rehype-callouts";
import rehypeFigure from "rehype-figure";
import rehypeSlug from "rehype-slug";

const highlighter = await createHighlighter({
	themes: ["material-theme-palenight"],
	langs: ["javascript", "typescript", "json", "python"],
});

const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			layout: "$lib/components/markdown/layout.svelte",
			highlight: {
				highlighter: async (code, lang = "text") => {
					const html = escapeSvelte(
						highlighter.codeToHtml(code, { lang, theme: "material-theme-palenight" }),
					);
					return `<Components.pre code={\`${code}\`}>{@html \`${html}\`}</Components.pre>`;
				},
			},
			remarkPlugins: [remarkEmoji, remarkGfm],
			rehypePlugins: [rehypeCallouts, rehypeFigure, rehypeSlug],
		}),
	],
	kit: {
		adapter: adapter(),
		serviceWorker: { register: false },
	},
	extensions: [".svelte", ".svx"],
};

export default config;
