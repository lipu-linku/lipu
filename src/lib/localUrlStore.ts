import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { writable, type Writable } from "svelte/store";

type LocalUrlStoreOptions<T> = {
	encode: (from: T) => string;
	decode: (from: string) => T;
};

// thanks to @hugos68 on the svelte discord for helping me out with this
export function localUrlStore<T>(
	key: string,
	init: T,
	options?: LocalUrlStoreOptions<T>,
): Writable<T> {
	let { encode, decode } = options ?? {
		encode: JSON.stringify,
		decode: JSON.parse,
	};

	let storageStored: string | null = null;
	let urlStored: string | null = null;

	if (browser) {
		storageStored = localStorage.getItem(key);
		const searchParams = new URLSearchParams(window.location.search);
		urlStored = searchParams.get(key);
	}

	// URL params should take priority over local values
	if (urlStored) init = decode(urlStored);
	else if (storageStored) init = decode(storageStored);

	const { subscribe: _subscribe, set: _set, update: _update } = writable(init);

	function set(value: T) {
		syncURL(key, value, encode);
		syncStorage(key, value, encode);
		_set(value);
	}

	function update(updater: (old: T) => T) {
		_update((value) => {
			const newValue = updater(value);
			syncURL(key, newValue, encode);
			syncStorage(key, newValue, encode);
			return newValue;
		});
	}

	return {
		subscribe: _subscribe,
		set,
		update,
	};
}

function syncURL<T>(key: string, value: T, encode: (from: T) => string) {
	if (!browser) return;
	const url = new URL(window.location.href);
	url.searchParams.set(key, encode(value));
	goto(url, { replaceState: true, invalidateAll: true, keepFocus: true });
}

function syncStorage<T>(key: string, value: T, encode: (from: T) => string) {
	if (!browser) return;
	localStorage.setItem(key, encode(value));
}
