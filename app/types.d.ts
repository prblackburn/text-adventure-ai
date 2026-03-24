/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  SESSION_CACHE: KVNamespace;
  ANTHROPIC_API_KEY: string;
}

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}
