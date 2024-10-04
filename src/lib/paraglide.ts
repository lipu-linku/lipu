export * as m from "$lib/paraglide/messages";

/**
 * Performs some basic formatting on the content:
 * - `$text$`: the text enclosed may not wrap between lines.
 * - `*text*` and `_text_`: italic text.
 * - `**text**` and `__text__`: bold text.
 */
export const basicMarkdownProcessing = (content: string) =>
	content
		.replaceAll(
			/\$(.+)\$/g,
			(val) => `<span class="md:whitespace-nowrap">${val.substring(1, val.length - 1)}</span>`,
		)
		.replaceAll(
			/\*\*(.+)\*\*|__(.+)__/g,
			(val) => `<strong>${val.substring(2, val.length - 2)}</strong>`,
		)
		.replaceAll(/_(.+)_|\*(.+)\*/g, (val) => `<i>${val.substring(1, val.length - 1)}</i>`);
