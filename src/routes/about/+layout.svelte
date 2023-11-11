<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import BackIcon from "~icons/lucide/arrow-left";
</script>

<Button class="absolute top-4 left-4 p-2" href="/" variant="ghost" size="icon">
	<BackIcon class="h-12 w-12" />
</Button>

<main class="flex flex-col items-center justify-center gap-4 min-h-screen">
	<slot />
</main>
