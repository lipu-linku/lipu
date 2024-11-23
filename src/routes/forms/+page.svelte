<script lang="ts">
	import * as Card from "$lib/components/ui/card";
</script>

<main class="flex-1 flex flex-col items-center justify-center gap-4">
	<h1 class="text-4xl font-semibold">Submit new Data</h1>
	<p class="max-w-prose text-center text-balance">
		Linku is a collaborative project made by and for the community, and we encourage everyone to
		contribute back to it with your own ideas and information!
	</p>

	<ul class="max-w-md grid grid-cols-2 gap-4">
		<li>
			{@render formCard(
				"Word",
				"Submit a new word to the sandbox, documenting it for others.",
				"/forms/word",
			)}
		</li>

		<li>
			{@render formCard(
				"Font",
				"Submit a new font, allowing others to download and use it.",
				"/forms/font",
			)}
		</li>
	</ul>
</main>

{#snippet formCard(title: string, description: string, href: string)}
	<a {href}>
		<Card.Root class="max-w-48 transition-colors border-2 hover:border-zinc-300">
			<Card.Header>
				<Card.Title level={2}>{title}</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-balance">
					{description}
				</p>
			</Card.Content>
		</Card.Root>
	</a>
{/snippet}
