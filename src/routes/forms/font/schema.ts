import type { Month } from "$lib/components/MonthYearSelect.svelte";
import { z } from "zod";

export const fontFormSchema = z.object({
	name: z.string().min(1),
	creator: z.string().min(1).array(),
	license: z.string().min(1),
	last_updated: z
		.string()
		.refine((s): s is `${number}-${Month}` => /^\d+-(0[1-9]|1[0-2])$/.test(s)),
	fontfile: z.instanceof(File, { message: "Please upload a file." }),
});
