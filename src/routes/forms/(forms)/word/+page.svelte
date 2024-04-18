<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
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

<form method="POST" use:enhance>
	<Form.Field {form} name="word">
		<Form.Control let:attrs>
			<Form.Label>Word</Form.Label>
			<Input {...attrs} bind:value={$formData.word} />
		</Form.Control>
		<Form.Description>What word are you submitting?</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
