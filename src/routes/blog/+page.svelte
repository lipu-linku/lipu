<script lang="ts">
	import { AvatarImage, Avatar, AvatarFallback } from "$lib/components/ui/avatar";
	import * as Card from "$lib/components/ui/card";
	import type { Post } from "./+page.server";

	let { data } = $props();
</script>

<main
	class="w-full p-4 grid grid-cols-1 sm:grid-cols-3 auto-rows-min supports-[grid-template-rows:masonry]:grid-rows-[masonry] gap-4"
>
	{#each Object.entries(data.posts) as [slug, post] (slug)}
		{@render postCard(slug, post)}
	{/each}
</main>

{#snippet postCard(slug: string, post: Post)}
	<a href="/blog/posts/{slug}">
		<Card.Root class="hover:border-muted-foreground transition-colors border-2 hover:shadow-lg">
			<Card.Header>
				<Card.Title class="text-2xl"><h2>{post.title}</h2></Card.Title>
				<Card.Description class="text-base">{post.subtitle}</Card.Description>
			</Card.Header>

			<Card.Footer class="text-muted-foreground">
				<p>
					<span class="text-foreground">
						{#if typeof post.author === "object"}
							<Avatar class="align-middle size-6 inline-block">
								<AvatarImage src={post.author.avatar_url} alt="{post.author.name} avatar" />
								<AvatarFallback>
									{post.author.name.substring(0, 2).toLocaleUpperCase()}
								</AvatarFallback>
							</Avatar>
							<span class="align-middle">{post.author.name}</span>
						{:else}
							{post.author}
						{/if}
					</span>
					<span class="align-middle">
						on <time datetime={post.date.toISOString()}>
							{post.date.toLocaleDateString("en", { dateStyle: "long" })}
						</time>
					</span>
				</p>
			</Card.Footer>
		</Card.Root>
	</a>
{/snippet}
