import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";
import { SvelteKitAuth } from "@auth/sveltekit";
import Github from "@auth/sveltekit/providers/github";

export const {
	handle: handleAuth,
	signIn,
	signOut,
} = SvelteKitAuth({
	providers: [
		Github({
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			authorization: { params: { scope: "public_repo read:user" } },
		}),
	],
	pages: {
		signIn: "/signin",
	},
});
