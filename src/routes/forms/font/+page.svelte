<script lang="ts">
	import MonthYearSelect from "$lib/components/MonthYearSelect.svelte";
	import MultiInput from "$lib/components/MultiInput.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import SuperDebug, { fileProxy, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import BackIcon from "~icons/lucide/arrow-left";
	import { fontFormSchema } from "./schema";

	const { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(fontFormSchema),
	});

	const { form: formData, enhance } = form;
	const fontfile = fileProxy(formData, "fontfile");
</script>

<div class="flex-1 mx-auto grid grid-cols-[min-content_1fr] gap-4 p-8">
	<Button class="grid place-items-center" variant="ghost" size="icon" href="/forms">
		<BackIcon />
	</Button>

	<form enctype="multipart/form-data" method="POST" use:enhance>
		<h1 class="text-4xl font-semibold">Submit a Font</h1>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input required bind:value={$formData.name} {...props} />
				{/snippet}
			</Form.Control>
			<Form.Description>
				Your font's name. It's recommended to check existing fonts to make sure your name is unique.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="fontfile">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>File</Form.Label>
					<input
						class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						required
						type="file"
						accept="font/otf,font/ttf,font/woff,font/woff2"
						bind:files={$fontfile}
						{...props}
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>
				Your font's name. It's recommended to check existing fonts to make sure your name is unique.
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="creator">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Creator</Form.Label>
					<MultiInput required bind:value={$formData.creator} {...props} />
				{/snippet}
			</Form.Control>
			<Form.Description>The font's creators, separated by commas.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="last_updated">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Last Updated</Form.Label>
					<MonthYearSelect
						class="flex items-center justify-center gap-2"
						required
						bind:value={$formData.last_updated}
						{...props}
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>When was this font's last update?</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button>Submit</Form.Button>
	</form>
</div>

<SuperDebug data={$formData} />
