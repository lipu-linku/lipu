<script lang="ts">
	import type { NavbarLink } from "./Navbar.svelte";

	interface Props {
		links: Record<string, NavbarLink>;
		children?: import("svelte").Snippet;
	}

	const { children }: Props = $props();
</script>

<div class="hidden w-full md:flex md:items-center">
	<div class="flex-1 flex justify-end">
		{@render children?.()}
	</div>
</div>
