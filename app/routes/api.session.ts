import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { createSession } from "../lib/db";
import { generateSeed } from "../game/worldSeed";

export async function action({ request, context }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const id = crypto.randomUUID();
  const formData = await request.formData();
  const rawIndex = formData.get('seedIndex');
  const parsedIndex = rawIndex !== null ? Number(rawIndex) : undefined;
  const seedIndex = parsedIndex !== undefined && [0, 1, 2].includes(parsedIndex) ? parsedIndex : undefined;
  const { seed, ruleIndex } = generateSeed(seedIndex);
  await createSession(env.text_adventure_ai_db, { id, world_seed: JSON.stringify({ ...seed, ruleIndex }), current_beat: 0 });
  return redirect(`/play/${id}`);
}
