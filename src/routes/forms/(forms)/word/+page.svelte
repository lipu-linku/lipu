<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { Separator } from "$lib/components/ui/separator";
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { schemas } from "../schemas";

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(schemas.word),
		dataType: "json",
	});

	const { form: formData, enhance } = form;
</script>

<form class="flex w-full flex-1 flex-col gap-3 p-4" method="POST" use:enhance>
	<div class="flex flex-col gap-2">
		<h1 class="text-4xl font-semibold">Submit new word</h1>
		<p class="text-balance text-sm text-muted-foreground">
			This form submits a word to the <ExternalLink href="https://github.com/lipu-linku/sona">
				sona Linku
			</ExternalLink> repository on GitHub.
		</p>
	</div>

	<Separator />

	<div class="grid grid-cols-2 gap-4">
		<section class="flex flex-col justify-center gap-3">
			<h2 class="text-2xl font-medium">Meaning and usage</h2>
			<Form.Field {form} name="word">
				<Form.Control let:attrs>
					<Form.Label>Word</Form.Label>
					<Input {...attrs} bind:value={$formData.word} />
				</Form.Control>
				<Form.Description>What word are you submitting?</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="definition">
				<Form.Control let:attrs>
					<Form.Label>Definition</Form.Label>
					<Input {...attrs} bind:value={$formData.definition} />
				</Form.Control>
				<Form.Description>What does this word mean?</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</section>
	</div>

	<Separator />

	<p class="text-sm text-muted-foreground">
		By submitting this form, you agree that all media included in it (audio, images, video, etc.)
		will be uploaded to the <ExternalLink href="https://github.com/lipu-linku/ijo">
			ijo Linku
		</ExternalLink> repository on GitHub, and licensed under the free <ExternalLink
			href="https://creativecommons.org/licenses/by-sa/4.0/"
		>
			CC BY-SA 3.0 or 4.0
		</ExternalLink> licenses.
	</p>
	<Form.Button>Submit</Form.Button>
</form>
