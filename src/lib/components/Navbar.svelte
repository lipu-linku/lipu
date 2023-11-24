<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import { Skeleton } from "$lib/components/ui/skeleton";

	import { mode, toggleMode } from "mode-watcher";

	import icon from "$lib/assets/icon.png";
	import InfoIcon from "~icons/lucide/info";
	import DarkModeIcon from "~icons/lucide/moon";
	import LightModeIcon from "~icons/lucide/sun";
</script>

<nav
	class="z-10 sticky top-0 flex items-center justify-between gap-2 bg-background p-4 border-b border-b-border"
>
	<header class="max-sm:mx-auto mr-2">
		<h1 class="flex items-center gap-4 my-0 sm:ml-auto">
			<Avatar class="rounded-none max-sm:hidden">
				<AvatarImage src={icon} class="invert dark:invert-0" alt="lipu Linku" />
				<AvatarFallback><Skeleton class="w-10 h-10 rounded-full" /></AvatarFallback>
			</Avatar>
			<a class="text-current font-semibold" href="/">lipu Linku</a>
		</h1>
	</header>

	<div class="flex-1 flex items-center gap-2">
		<slot />
	</div>

	<Button variant="outline" size="icon" on:click={toggleMode} aria-label="Toggle theme">
		{#if $mode === "light"}
			<DarkModeIcon />
		{:else}
			<LightModeIcon />
		{/if}
	</Button>

	<Button variant="outline" size="icon" href="/about" aria-label="About Linku">
		<InfoIcon />
	</Button>
</nav>
