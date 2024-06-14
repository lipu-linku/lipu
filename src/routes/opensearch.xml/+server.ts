import type { RequestHandler } from "./$types";
import logo from "$lib/assets/icon-light.png?url";

export const GET: RequestHandler = async ({ url }) => {
	return new Response(
		`<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>lipu Linku</ShortName>
  <Description>Search lipu Linku, the toki pona dictionary</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="256" height="256" type="image/png">${logo}</Image>
  <Url type="text/html" method="get" template="${url.origin}/?q={searchTerms}" />
  <Url type="application/x-suggestions+json" method="get" template="${url.origin}/suggestions.json?q={searchTerms}" />
  <Url type="application/opensearchdescription+xml" rel="self" template="${url.origin}/opensearch.xml" />
  <Query role="example" searchTerms="toki" />
  <Query role="example" searchTerms="pona" />
  <Query role="example" searchTerms="kijetesantakalu" />
  <Contact>theonlytails@theonlytails.com</Contact>
  <Developer>The Linku Project</Developer>
  <Developer>TheOnlyTails</Developer>
</OpenSearchDescription>`,
		{
			headers: {
				"Content-Type": "application/opensearchdescription+xml",
			},
		},
	);
};
