<script lang="ts">
	import { viewTypes, viewType } from "$lib/state";
	import {
		Select,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectContent,
		SelectValue,
	} from "$lib/components/ui/select";
</script>

<Select>
	<SelectTrigger>
		<SelectValue placeholder={viewTypes[$viewType].name} />
	</SelectTrigger>
	<SelectContent>
		{#each Object.entries(viewTypes) as [key, view]}
			<SelectItem value={key}>{view.name}</SelectItem>
		{/each}
	</SelectContent>
	<SelectInput bind:value={$viewType} />
</Select>
