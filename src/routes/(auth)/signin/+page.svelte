<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { signIn } from "@auth/sveltekit/client";
	import GithubIcon from "~icons/lucide/github";
</script>

<main class="m-auto flex flex-col items-center justify-center gap-4">
	<h1 class="text-6xl font-bold">Signing in…</h1>
	<p class="text-balance">
		If you have not been redirected automatically, please click this button:
	</p>
	<Button on:click={() => signIn("github")}>
		Sign in with <GithubIcon class="ms-1 inline-block" aria-label="GitHub" />
	</Button>
</main>
