import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [paraglide({ project: './project.inlang', outdir: './src/lib/paraglide' }),
		sveltekit(),
		Icons({
			compiler: "svelte",
			defaultClass: "icon",
		}),
		SvelteKitPWA({
			srcDir: "./src",
			strategies: "generateSW",
			registerType: "autoUpdate",
			scope: "/",
			base: "/",
			includeAssets: ["favicon.ico", "favicon.png"],
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
			},
			manifest: {
				name: "lipu Linku",
				short_name: "Linku",
				description: "An interactive Toki Pona dictionary",
				theme_color: "#979797",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
				start_url: "/",
				scope: "/",
				display: "standalone",
			},
			devOptions: {
				type: "module",
				enabled: false,
				navigateFallback: "/",
			},
			pwaAssets: {
				config: true,
			},
		}),
	],
	build: {
		cssMinify: "lightningcss",
	},
});
