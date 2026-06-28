import { createContext, onMount } from "svelte";
import { MediaQuery } from "svelte/reactivity";

export type SelectMode = "native" | "bits";

/**
 * Styling for the closed control, applied to the native `<select>` so it
 * matches the bits-ui trigger on the mobile path.
 */
export const selectTriggerBaseClass =
	"flex h-9 w-fit cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none transition-[color,box-shadow] select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

/**
 * Coordinates which implementation the compound `Select.*` components render:
 *   - viewport >= md (768px) -> bits-ui portal
 *   - viewport < md          -> native `<select>` (native popup)
 *
 * The mode is resolved only after mount, so the first client render always
 * matches the SSR/no-JS baseline (the functional native `<select>`) and there
 * is no hydration mismatch.
 */
export class SelectContext {
	#mounted = $state(false);
	#isDesktop = new MediaQuery("(min-width: 768px)");

	/** The trigger's class, registered by `Select.Trigger` for the Root `<select>`. */
	triggerClass = $state<string | undefined>(undefined);

	constructor() {
		onMount(() => {
			this.#mounted = true;
		});
	}

	get mode(): SelectMode {
		return this.#mounted && this.#isDesktop.current ? "bits" : "native";
	}
}

export const [useSelectContext, setSelectContext] = createContext<SelectContext>();
