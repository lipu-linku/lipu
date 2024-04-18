import { handleAuth } from "$lib/auth.server";
import { type Handle } from "@sveltejs/kit";

export const handle: Handle = handleAuth;
