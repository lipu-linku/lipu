<script lang="ts">
	import { page } from "$app/state";
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar/";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import ShareIcon from "~icons/lucide/share-2";

	let { data } = $props();
	let { body, head, post, slug } = $derived(data);

	const sharePost = async () => {
		if (!navigator.canShare) {
			await navigator.clipboard.writeText(page.url.toString());
		} else if (navigator.canShare({ text: page.url.toString() })) {
			await navigator.share({ text: page.url.toString() });
		}
	};
</script>

<main class="p-8 w-[50dvw] mx-auto flex flex-col gap-4 min-h-full">
	<h1
		class="flex items-center justify-between text-4xl font-semibold font-sitelen-seli-juniko text-balance tracking-tight"
	>
		<span>{post.title}</span>
		<Button variant="outline" size="icon" onclick={() => sharePost()}>
			<ShareIcon />
		</Button>
	</h1>
	<p class="text-muted-foreground font-medium text-xl">{post.subtitle}</p>

	<p>
		<span class="text-foreground">
			{#if typeof post.author === "object"}
				<svelte:element
					this={post.author.blog ? "a" : "span"}
					href={post.author.blog || undefined}
					target={post.author.blog ? "_blank" : undefined}
					rel={post.author.blog ? "noopener noreferrer author" : undefined}
				>
					<Avatar class="align-middle size-6 inline-block">
						<AvatarImage src={post.author.avatar_url} alt="{post.author.name} avatar" />
						<AvatarFallback>
							{post.author.name.substring(0, 2).toLocaleUpperCase()}
						</AvatarFallback>
					</Avatar>
					<span class="align-middle">{post.author.name}</span>
				</svelte:element>
			{:else}
				<span class="align-middle">{post.author}</span>
			{/if}
		</span>
		<span class="align-middle">
			on <time datetime={post.date.toISOString()}>
				{post.date.toLocaleDateString("en", { dateStyle: "long" })}
			</time>
		</span>
	</p>

	<Separator />

	<article
		class="
		markdown-article
    py-4 flex flex-col gap-8 text-neutral-300
    **:[p]:text-pretty"
	>
		{@html body}
	</article>
</main>

<svelte:head>
	<title>lipu Linku &middot; {post.title}</title>
	{@html head}
</svelte:head>

<style>
	@reference "../../../../app.css";

	:global {
		.markdown-article {
			.callout {
				@apply rounded-e-lg border-s-2 py-4 ps-6 text-neutral-200;

				border-color: var(--callout-color);
				background-color: color-mix(in oklab, var(--callout-color) 40%, transparent);

				&[data-callout="note"] {
					--callout-color: var(--color-blue-400);
				}

				&[data-callout="warning"] {
					--callout-color: var(--color-yellow-300);
				}

				&[data-callout="error"],
				&[data-callout="danger"],
				&[data-callout="caution"] {
					--callout-color: var(--color-red-300);
				}

				&[data-callout="tip"] {
					--callout-color: var(--color-green-300);
				}

				&[data-collapsible="true"] {
					@apply transition-[height];

					.callout-title .callout-fold-icon {
						@apply transition-transform;
					}

					&:open .callout-title .callout-fold-icon {
						@apply rotate-180;
					}
				}

				.callout-title {
					@apply flex items-center gap-2 text-xl font-semibold;
				}

				.callout-content {
					@apply pt-4 italic;
				}
			}

			figure {
				@apply flex flex-col items-center justify-center gap-2 overflow-x-auto;

				figcaption {
					@apply text-muted-foreground text-sm italic;
				}
			}
		}
	}
</style>
