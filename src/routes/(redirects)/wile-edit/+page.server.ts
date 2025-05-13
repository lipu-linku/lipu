import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	redirect(
		301,
		`https://docs.google.com/forms/d/e/1FAIpQLScxxw6LgonJXkyygq8L5zSsHJyCaO1D4eu7OyTrIujSpDaCXw/viewform`,
	);
};
