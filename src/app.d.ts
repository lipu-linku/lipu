/// <reference types="unplugin-icons/types/svelte" />
/// <reference types="vite-plugin-pwa/svelte" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />

import type { Words } from "@kulupu-linku/sona/v1";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			closest?: string[];
		}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface PageState {
			words?: Words;
		}
	}
}

export {};
