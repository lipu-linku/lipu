<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import BackIcon from "~icons/lucide/arrow-left";
</script>

<Button
	class="absolute top-4 left-4"
	href={$page.route.id === "/about" ? "/" : "/about"}
	variant="ghost"
	size="icon"
>
	<BackIcon class="h-11 w-11" />
</Button>

<main class="flex flex-col items-center justify-center gap-4 min-h-screen [&_a]:underline">
	<slot />
</main>
