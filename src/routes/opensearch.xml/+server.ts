import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
	return new Response(`<?xml version="1.0" encoding="UTF-8" ?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>lipu Linku</ShortName>
  <Description>Search lipu Linku &middot; a toki pona dictionary</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/x-icon">${url.origin}/favicon.png</Image>
  <Url type="text/html" method="get" template="${url.origin}/?q={searchTerms}"></Url>
</OpenSearchDescription>`);
};
