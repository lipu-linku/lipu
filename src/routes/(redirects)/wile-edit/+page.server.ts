import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	redirect(
		301,
		`https://docs.google.com/forms/d/e/1FAIpQLSesQwaXLalGZxj8bouYRKF8njK1qMXrxfTcdP9u8USj_LUIqw/viewform`,
	);
};
