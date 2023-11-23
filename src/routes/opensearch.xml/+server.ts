import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
	return new Response(`<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>lipu Linku Search</ShortName>
  <Description>Search lipu Linku, the toki pona dictionary</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/x-icon">${url.origin}/favicon.png</Image>
  <Url type="text/html" method="get" template="${url.origin}/?q={searchTerms}"/>
  <Url type="application/opensearchdescription+xml" rel="self" template="${url.origin}/opensearch.xml" />
</OpenSearchDescription>`);
};
