<script lang="ts">
	import { Button, type ButtonProps } from "$lib/components/ui/button";
	import { cn } from "$lib/components/ui/utils";

	type $$Props = ButtonProps & { href: string; inline?: boolean };

	export let href: string;
	export let inline = true;
	let className = "";
	export { className as class };
</script>

<Button
	variant="link"
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class={cn("[font-size:inherit]", inline && "h-4 p-0", className)}
	{...$$restProps}
>
	<slot />
</Button>
