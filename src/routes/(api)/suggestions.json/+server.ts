import { wordSearch } from "$lib/components/search.svelte";
import { client } from "@kulupu-linku/sona/client";
import { json } from "@sveltejs/kit";
import { SvelteSet } from "svelte/reactivity";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, fetch }) => {
  const query = url.searchParams.get("q")!;
  const lang = url.searchParams.get("lang") ?? "en";
  const words = await client({ fetch })
    .v1.words.$get({ query: { lang } })
    .then((r) => r.json());
  const sandbox = await client({ fetch })
    .v1.sandbox.$get({ query: { lang } })
    .then((r) => r.json());

  const results = wordSearch(
    query,
    { ...sandbox, ...words },
    {
      core: true,
      common: true,
      uncommon: true,
      obscure: false,
      sandbox: false,
    },
    new SvelteSet(),
    false,
    undefined,
    lang
  );

  return json([query, results.map((it) => it.id)], {
    headers: {
      "Content-Type": "application/x-suggestions+json",
    },
  });
};
