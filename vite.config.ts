import { sveltekit } from "@sveltejs/kit/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import { paraglide } from "@inlang/paraglide-js-adapter-sveltekit/vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglide({
			project: "./project.inlang",
			outdir: "./src/paraglide",
		}),
		Icons({
			compiler: "svelte",
			defaultClass: "icon",
		}),
	],
	build: {
		cssMinify: "lightningcss",
	},
});
