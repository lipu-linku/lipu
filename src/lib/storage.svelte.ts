// from https://github.com/Rich-Harris/local-storage-test/blob/main/src/lib/storage.svelte.ts
import { tick } from "svelte";

export type Serializer<T> = { parse: (from: string) => T; stringify: (from: T) => string };

export class LocalStorage<T> {
	#key: string;
	#version = $state(0);
	#listeners = 0;
	#value: T | undefined;
	#serializer: Serializer<T | undefined>;
	#initial: T | undefined;

	#handler = (e: StorageEvent) => {
		if (e.storageArea !== localStorage) return;
		if (e.key !== this.#key) return;

		this.#version += 1;
	};

	constructor(key: string, initial?: T, serializer?: Serializer<T | undefined>) {
		this.#key = key;
		this.#value = initial;
		this.#initial = initial;
		this.#serializer = serializer ?? {
			parse: (s): T => JSON.parse(s),
			stringify: (obj) => JSON.stringify(obj),
		};

		if (typeof localStorage !== "undefined") {
			if (localStorage.getItem(key) === null) {
				localStorage.setItem(key, this.#serializer.stringify(initial));
			}
		}
	}

	get current(): T {
		this.#version;

		const root =
			typeof localStorage !== "undefined"
				? this.#serializer.parse(localStorage.getItem(this.#key) as any)
				: this.#value;

		const proxies = new WeakMap();

		const proxy = (value: unknown) => {
			if (typeof value !== "object" || value === null) {
				return value;
			}

			let p = proxies.get(value);

			if (!p) {
				p = new Proxy(value, {
					get: (target, property) => {
						return proxy(Reflect.get(target, property));
					},
					set: (target, property, value) => {
						Reflect.set(target, property, value);

						if (typeof localStorage !== "undefined") {
							localStorage.setItem(this.#key, this.#serializer.stringify(root));
						}

						return true;
					},
				});

				proxies.set(value, p);
			}

			return p;
		};

		if ($effect.tracking()) {
			$effect(() => {
				if (this.#listeners === 0) {
					window.addEventListener("storage", this.#handler);
				}

				this.#listeners += 1;

				return () => {
					tick().then(() => {
						this.#listeners -= 1;
						if (this.#listeners === 0) {
							window.removeEventListener("storage", this.#handler);
						}
					});
				};
			});
		}

		return proxy(root);
	}

	set current(value) {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(this.#key, this.#serializer.stringify(value));
		}

		this.#version += 1;
	}

	reset() {
		if (this.#initial) this.current = this.#initial;
	}
}
