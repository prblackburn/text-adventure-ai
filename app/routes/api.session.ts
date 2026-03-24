import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { createSession } from "../lib/db";
import { generateSeed } from "../game/worldSeed";

export async function action({ context }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const id = crypto.randomUUID();
  const seed = generateSeed();
  await createSession(env.text_adventure_ai_db, { id, world_seed: JSON.stringify(seed), current_beat: 0 });
  return redirect(`/play/${id}`);
}
