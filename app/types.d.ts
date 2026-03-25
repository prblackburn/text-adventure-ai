/// <reference types="@cloudflare/workers-types" />

export interface Env {
  text_adventure_ai_db: D1Database;
  SESSION_CACHE: KVNamespace;
  GROQ_API_KEY: string;
}

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}
