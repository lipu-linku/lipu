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
				{@const author = post.author}
				<svelte:element
					this={post.author.blog ? "a" : "span"}
					href={post.author.blog || undefined}
					target={post.author.blog ? "_blank" : undefined}
					rel={post.author.blog ? "noopener noreferrer author" : undefined}
					class="align-"
				>
					<Avatar class="align-middle me-1 size-6 inline-block">
						{#snippet child({ props })}
							<span {...props}>
								<AvatarImage
									class="size-6 rounded-full"
									src={author.avatar_url}
									alt="{author.name} avatar"
								/>
								<AvatarFallback>
									{author.name.substring(0, 2).toLocaleUpperCase()}
								</AvatarFallback>
							</span>
						{/snippet}
					</Avatar>
					{post.author.name}
				</svelte:element>
			{:else}
				{post.author}
			{/if}
		</span>
		<span>
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
