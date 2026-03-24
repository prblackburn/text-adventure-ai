/// <reference types="@cloudflare/workers-types" />

import { createRequestHandler } from "react-router";

// @ts-expect-error - virtual module resolved by Vite at build time
import * as build from "virtual:react-router/server-build";

export interface Env {
  DB: D1Database;
  SESSION_CACHE: KVNamespace;
  ANTHROPIC_API_KEY: string;
}

const handler = createRequestHandler(build);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handler(request, { cloudflare: { env, ctx } });
  },
} satisfies ExportedHandler<Env>;
