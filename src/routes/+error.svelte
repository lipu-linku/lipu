<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import { m } from "$lib/paraglide";
</script>

<main class="min-h-dvh flex flex-col items-center justify-center gap-4 max-w-[33%] mx-auto">
	<h1 class="text-5xl font-semibold">{m.error_heading({ code: $page.status })}</h1>
	<p class="text-xl">{$page.error?.message}</p>

	{#if $page.error?.closest}
		{@const closest = $page.error.closest}
		<p>{m.did_you_mean()}</p>
		<ul class="flex items-center justify-center flex-wrap gap-2">
			{#each closest as word}
				<li>
					<Button size="sm" variant="outline" href="/words/{word}">{word}</Button>
				</li>
			{/each}
		</ul>
	{/if}

	<Button href="/" variant="outline">{m.go_home()}</Button>
</main>
