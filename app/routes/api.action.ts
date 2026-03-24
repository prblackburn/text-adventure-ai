import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getSession, getTurns, addTurn } from "../lib/db";
import { classifyIntent } from "../game/classifier";
import { buildSystemPrompt, buildUserPrompt } from "../game/promptBuilder";
import { getBeat } from "../game/beats";
import { streamText } from "../lib/stream";
import type { WorldSeed } from "../game/types";

export async function action({ request, context }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const formData = await request.formData();
  const input = (formData.get("input") as string | null)?.trim();
  const sessionId = formData.get("sessionId") as string | null;

  if (!input || !sessionId) return new Response("Bad request", { status: 400 });

  const session = await getSession(env.text_adventure_ai_db, sessionId);
  if (!session) return new Response("Session not found", { status: 404 });

  const turns = await getTurns(env.text_adventure_ai_db, sessionId);
  const seed = JSON.parse(session.world_seed) as WorldSeed;
  const beat = getBeat(session.current_beat);
  const intent = classifyIntent(input);

  const system = buildSystemPrompt(seed, beat);
  const userPrompt = buildUserPrompt({
    seed,
    beat,
    history: turns.map((t) => ({ player: t.player_input, ai: t.ai_response })),
    intent,
  });

  let aiResponse = "";
  await streamText(env.ANTHROPIC_API_KEY, [{ role: "user", content: userPrompt }], system, (chunk) => {
    aiResponse += chunk;
  });

  await addTurn(env.text_adventure_ai_db, {
    session_id: sessionId,
    player_input: input,
    ai_response: aiResponse,
    intent: intent.type,
    beat: beat.id,
  });

  return redirect(`/play/${sessionId}`);
}
