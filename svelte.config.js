import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		serviceWorker: {
			register: false,
		},
		experimental: {
			remoteFunctions: true,
		},
		alias: {
			$locales: "src/locales",
		},
	},
	compilerOptions: {
		experimental: {
			async: true,
		},
	},
};

export default config;
