<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { signOut } from "@auth/sveltekit/client";
	import GithubIcon from "~icons/lucide/github";
</script>

<main class="m-auto flex flex-col items-center justify-center gap-4">
	<h1 class="text-6xl font-bold">Signing out…</h1>
	<p class="text-balance">
		If you have not been redirected automatically, please click this button:
	</p>
	<Button on:click={() => signOut()}>
		Sign out from <GithubIcon class="ms-1 inline-block" aria-label="GitHub" />
	</Button>
</main>
