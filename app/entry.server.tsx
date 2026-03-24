import { ServerRouter } from "react-router";
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext
) {
  const stream = await renderToReadableStream(<ServerRouter context={routerContext} url={request.url} />, {
    signal: request.signal,
    onError(error) {
      console.error(error);
      responseStatusCode = 500;
    },
  });

  responseHeaders.set("Content-Type", "text/html");

  return new Response(stream, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
