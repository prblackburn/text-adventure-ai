import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getSession, getTurns, addTurn } from "../lib/db";
import { classifyIntent } from "../game/classifier";
import { buildSystemPrompt, buildUserPrompt } from "../game/promptBuilder";
import { getBeat } from "../game/beats";
import { streamText } from "../lib/stream";
import { getRules } from "../game/worldRules";
import { buildCacheKey, getCachedResponse, setCachedResponse } from "../lib/responseCache";
import type { WorldSeed, BeatScene } from "../game/types";

function isEntityPresent(subject: string | undefined, scene: BeatScene): boolean {
  if (!subject) return true; // no subject — nothing to validate
  const s = subject.toLowerCase();
  const inItems = scene.items.some((i) => i.toLowerCase().includes(s));
  const inChars = scene.characters.some((c) => c.name.toLowerCase().includes(s));
  return inItems || inChars;
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const formData = await request.formData();
  const input = (formData.get("input") as string | null)?.trim();
  const sessionId = formData.get("sessionId") as string | null;

  if (!input || !sessionId) return new Response("Bad request", { status: 400 });

  const session = await getSession(env.text_adventure_ai_db, sessionId);
  if (!session) return new Response("Session not found", { status: 404 });

  const turns = await getTurns(env.text_adventure_ai_db, sessionId);
  const stored = JSON.parse(session.world_seed) as WorldSeed & { ruleIndex?: number };
  const { ruleIndex, ...seed } = stored;
  const beat = getBeat(session.current_beat);
  const intent = classifyIntent(input);

  const rules = ruleIndex !== undefined ? getRules(ruleIndex) : undefined;
  const scene: BeatScene | undefined = rules?.scenes[beat.id];

  // Pre-flight: if the player targets an entity not present in this scene, skip LLM
  if (scene && intent.subject && !isEntityPresent(intent.subject, scene)) {
    const aiResponse = `There's no ${intent.subject} here.`;
    await addTurn(env.text_adventure_ai_db, {
      session_id: sessionId,
      player_input: input,
      ai_response: aiResponse,
      intent: intent.type,
      beat: beat.id,
    });
    return redirect(`/play/${sessionId}`);
  }

  // Cache lookup for generic examine/explore actions
  const cacheKey = buildCacheKey(intent);
  if (cacheKey) {
    const cached = await getCachedResponse(env.text_adventure_ai_db, beat.id, cacheKey);
    if (cached) {
      await addTurn(env.text_adventure_ai_db, {
        session_id: sessionId,
        player_input: input,
        ai_response: cached,
        intent: intent.type,
        beat: beat.id,
      });
      return redirect(`/play/${sessionId}`);
    }
  }

  // LLM call
  const system = buildSystemPrompt(seed, beat, rules);
  const userPrompt = buildUserPrompt({
    seed,
    beat,
    history: turns.map((t) => ({ player: t.player_input, ai: t.ai_response })),
    intent,
  });

  let aiResponse = "";
  await streamText(env.GROQ_API_KEY, [{ role: "user", content: userPrompt }], system, (chunk) => {
    aiResponse += chunk;
  });

  // Store cacheable responses for future players
  if (cacheKey) {
    await setCachedResponse(env.text_adventure_ai_db, beat.id, cacheKey, aiResponse);
  }

  await addTurn(env.text_adventure_ai_db, {
    session_id: sessionId,
    player_input: input,
    ai_response: aiResponse,
    intent: intent.type,
    beat: beat.id,
  });

  return redirect(`/play/${sessionId}`);
}
