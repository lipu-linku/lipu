/// <reference types="unplugin-icons/types/svelte" />
/// <reference types="vite-plugin-pwa/svelte" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />

import type { Fetcher, Service } from "@cloudflare/workers-types";
import type { Words } from "@kulupu-linku/sona/v2";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			closest?: string[];
		}
		interface Locals {
			locale: string;
		}
		interface PageData {
			locale: string;
		}
		interface Platform {
			env: {
				SONA_API: Service;
				ASSETS: Fetcher;
			};
		}
		interface PageState {
			words?: Words;
		}
	}
}

export {};
