/// <reference types="unplugin-icons/types/svelte" />

import type { Words } from "@kulupu-linku/sona";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
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
