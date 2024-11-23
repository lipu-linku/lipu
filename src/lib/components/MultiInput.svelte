<script lang="ts">
	import X from "~icons/lucide/x";
	import { Badge } from "$lib/components/ui/badge";
	import type { HTMLInputAttributes } from "svelte/elements";

	interface Props extends HTMLInputAttributes {
		value?: string[];
	}

	let { value = $bindable([]), ...rest }: Props = $props();

	let inputRef: HTMLInputElement | undefined = $state();
	let inputValue = $state("");

	const preventDefaultAndStop = (event: Event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const removeTag = (idx: number) => {
		value = [...value.slice(0, idx), ...value.slice(idx + 1)];
	};

	const addTag = () => {
		const trimmedValue = inputValue.trim();
		if (trimmedValue && !value.includes(trimmedValue)) {
			value = [...value, trimmedValue];
		}

		inputValue = "";
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (!inputRef) return;

		switch (e.key) {
			case "Enter":
				preventDefaultAndStop(e);
				addTag();
				break;
			case "Backspace":
			case "Delete":
				if (inputRef.value === "") value = value.slice(0, -1);
				break;
			case "Escape":
				inputRef.blur();
				break;
		}
	};
</script>

<div class="h-auto overflow-visible bg-transparent">
	<div
		class="border-input ring-offset-background focus-within:ring-ring group rounded-md border px-2 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2"
	>
		<div class="flex flex-wrap gap-1">
			{#each value as tag, idx}
				<Badge variant="secondary">
					{tag}
					<button
						class="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
						onmousedown={preventDefaultAndStop}
						onkeydown={(e) => e.key === "Enter" && removeTag(idx)}
						onclick={(e) => {
							preventDefaultAndStop(e);
							removeTag(idx);
						}}
					>
						<X class="text-muted-foreground hover:text-foreground h-3 w-3" />
					</button>
				</Badge>
			{/each}
			<input
				class="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
				onkeydown={handleKeyDown}
				bind:this={inputRef}
				bind:value={inputValue}
				{...rest}
			/>
		</div>
	</div>
</div>
