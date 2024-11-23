import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { fontFormSchema } from "./schema";

export const load = async () => {
	return {
		form: await superValidate(zod(fontFormSchema)),
	};
};

export const actions = {
	fontForm: async ({ request }) => {
		const form = await superValidate(request, zod(fontFormSchema));

		if (!form.valid) return fail(400, { form });

		return message(form, "Font submitted successfully!");
	},
};
