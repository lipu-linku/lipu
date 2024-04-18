import { Book, CoinedEra } from "@kulupu-linku/sona/utils";
import { z } from "zod";

export const schemas = {
	word: z.object({
		word: z.string().min(1),
		author_verbatim: z.string().min(1).optional(),
		author_verbatim_source: z.string().min(1).optional(),
		book: Book.default("none"),
		coined_era: CoinedEra.optional(),
		coined_year: z.string().optional(),
		creator: z.string().min(1).array().min(1).optional(),
		see_also: z.string().min(1).array().min(1).optional(),
		resources: z
			.object({
				sona_pona: z.string().url().optional(),
			})
			.optional(),
		representations: z.object({
			sitelen_emosi: z.string().emoji().min(1).optional(),
			sitelen_jelo: z.array(z.string().emoji().min(1)).min(1).optional(),
			ligatures: z.array(z.string().min(1)).min(1).optional(),
			sitelen_sitelen: z
				.object({
					file: z
						.instanceof(File, { message: "Please upload a file." })
						.refine((f) => f.type === "image/jpeg", { message: "Please upload a JPEG image." }),
					author: z.string().min(1),
				})
				.optional(),
		}),
		source_language: z.string().min(1).optional(),
		definition: z.string().min(1),
		commentary: z.string().min(1).optional(),
		sitelen_pona_etymology: z.string().min(1).optional(),
		etymology: z
			.object({
				language: z.string().min(1),
				word: z.string().min(1).optional(),
				definition: z.string().min(1).optional(),
				alt: z.string().min(1).optional(),
			})
			.array()
			.min(1)
			.optional(),
		audio: z
			.object({
				author: z.string().min(1),
				file: z
					.instanceof(File, { message: "Please upload a file." })
					.refine((f) => f.type === "audio/mpeg", { message: "Please upload an MP3 audio file." }),
			})
			.array()
			.min(1)
			.optional(),
	}),
} as const satisfies Record<string, z.ZodType>;

export type FormSchema<K extends keyof typeof schemas> = (typeof schemas)[K];
