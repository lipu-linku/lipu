<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { mode, toggleMode } from "mode-watcher";
	import BackIcon from "~icons/lucide/arrow-left";
	import DarkModeIcon from "~icons/lucide/moon";
	import LightModeIcon from "~icons/lucide/sun";
</script>

<Button class="absolute top-4 left-4 p-2" href="/" variant="ghost" size="icon">
	<BackIcon class="h-12 w-12" />
</Button>

<Button
	class="absolute top-4 right-4 p-2"
	variant="ghost"
	size="icon"
	on:click={toggleMode}
	aria-label="Toggle theme"
>
	{#if $mode === "light"}
		<DarkModeIcon />
	{:else}
		<LightModeIcon />
	{/if}
</Button>

<main class="my-2 flex flex-col items-center justify-center gap-4 min-h-dvh">
	<slot />
</main>
