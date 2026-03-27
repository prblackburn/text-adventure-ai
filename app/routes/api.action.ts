import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getSession, getTurns, addTurn, updateSessionBeat, updateCompletedConditions, updateInventory, updateNpcState } from "../lib/db";
import { classifyIntent } from "../game/classifier";
import { buildSystemPrompt, buildUserPrompt } from "../game/promptBuilder";
import { BEATS, getBeat } from "../game/beats";
import { streamText } from "../lib/stream";
import { getRules } from "../game/worldRules";
import { buildCacheKey, getCachedResponse, setCachedResponse } from "../lib/responseCache";
import { isRateLimited } from "../lib/rateLimit";
import type { WorldSeed, BeatScene, NpcStateMap } from "../game/types";

function isEntityPresent(subject: string | undefined, scene: BeatScene, inventory: string[] = []): boolean {
  if (!subject) return true; // no subject — nothing to validate
  const s = normalizeSubject(subject);
  const inItems = scene.items.some((i) => { const n = normalizeSubject(i); return n.includes(s) || s.includes(n); });
  const inChars = scene.characters.some((c) => { const name = c.name.toLowerCase(); return name.includes(s) || s.includes(name); });
  const inInventory = inventory.some((i) => { const n = normalizeSubject(i); return n.includes(s) || s.includes(n); });
  return inItems || inChars || inInventory;
}

function extractConditionsMet(response: string): { cleanResponse: string; conditionIds: string[] } {
  const match = response.match(/\[CONDITIONS_MET:\s*(\[.*?\])\]\s*$/s);
  if (!match) return { cleanResponse: response.trim(), conditionIds: [] };
  try {
    const ids = JSON.parse(match[1]) as string[];
    return { cleanResponse: response.replace(match[0], "").trim(), conditionIds: ids };
  } catch {
    return { cleanResponse: response.trim(), conditionIds: [] };
  }
}

function normalizeSubject(s: string): string {
  return s
    .toLowerCase()
    .replace(/^(to|with|at|about|from|for|on|in)\s+/, '')
    .replace(/^(the|a|an)\s+/, '');
}

function matchNpcInScene(subject: string | undefined, scene: BeatScene | undefined): string | undefined {
  if (!subject || !scene) return undefined;
  const s = normalizeSubject(subject);
  return scene.characters.find((c) => {
    const name = c.name.toLowerCase();
    return name.includes(s) || s.includes(name);
  })?.name;
}

function matchItem(subject: string, items: string[]): string | undefined {
  const s = normalizeSubject(subject);
  return items.find((i) => {
    const norm = normalizeSubject(i);
    return norm.includes(s) || s.includes(norm);
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const formData = await request.formData();
  const input = (formData.get("input") as string | null)?.trim();
  const sessionId = formData.get("sessionId") as string | null;
  const search = (formData.get("_search") as string | null) ?? "";

  if (!input || !sessionId) return new Response("Bad request", { status: 400 });

  const playUrl = (path: string) => `${path}${search}`;

  const session = await getSession(env.text_adventure_ai_db, sessionId);
  if (!session) return new Response("Session not found", { status: 404 });

  const turns = await getTurns(env.text_adventure_ai_db, sessionId);
  const stored = JSON.parse(session.world_seed) as WorldSeed & { ruleIndex?: number };
  const { ruleIndex, ...seed } = stored;
  const beat = getBeat(session.current_beat);
  const intent = classifyIntent(input);

  const rules = ruleIndex !== undefined ? getRules(ruleIndex) : undefined;
  const scene: BeatScene | undefined = rules?.scenes[beat.id];

  const existingCompleted: string[] = JSON.parse(session.completed_conditions ?? "[]");
  const inventory: string[] = JSON.parse(session.inventory ?? "[]");
  const npcState: NpcStateMap = JSON.parse(session.npc_state ?? "{}");

  const history = turns.filter((t) => t.intent !== "intro").map((t) => ({ player: t.player_input, ai: t.ai_response }));

  const ip = request.headers.get('CF-Connecting-IP') ?? '127.0.0.1';
  if (await isRateLimited(env.SESSION_CACHE, ip)) {
    await addTurn(env.text_adventure_ai_db, {
      session_id: sessionId,
      player_input: input,
      ai_response: 'You pause, overwhelmed. Collect your thoughts before pressing on.',
      intent: intent.type,
      beat: beat.id,
    });
    return redirect(playUrl(`/play/${sessionId}`));
  }

  // pick_up: deterministic inventory mutation, LLM narrates
  if (intent.type === "pick_up") {
    if (!intent.subject) {
      await addTurn(env.text_adventure_ai_db, { session_id: sessionId, player_input: input, ai_response: "Pick up what?", intent: intent.type, beat: beat.id });
      return redirect(playUrl(`/play/${sessionId}`));
    }
    const sceneItems = scene?.items ?? [];
    const matchedItem = matchItem(intent.subject, sceneItems);
    const alreadyHeld = matchItem(intent.subject, inventory);

    if (!matchedItem) {
      await addTurn(env.text_adventure_ai_db, { session_id: sessionId, player_input: input, ai_response: `There's no ${intent.subject} here to pick up.`, intent: intent.type, beat: beat.id });
      return redirect(playUrl(`/play/${sessionId}`));
    }
    if (alreadyHeld) {
      await addTurn(env.text_adventure_ai_db, { session_id: sessionId, player_input: input, ai_response: `You're already carrying the ${alreadyHeld}.`, intent: intent.type, beat: beat.id });
      return redirect(playUrl(`/play/${sessionId}`));
    }

    const newInventory = [...inventory, matchedItem];
    await updateInventory(env.text_adventure_ai_db, sessionId, newInventory);

    const system = buildSystemPrompt(seed, beat, rules, newInventory, npcState);
    const userPrompt = buildUserPrompt({ seed, beat, history, intent });
    let aiResponse = "";
    await streamText(env.GROQ_API_KEY, [{ role: "user", content: userPrompt }], system, (chunk) => { aiResponse += chunk; });
    const { cleanResponse, conditionIds } = extractConditionsMet(aiResponse);
    const allCompleted = conditionIds.length > 0 ? [...new Set([...existingCompleted, ...conditionIds])] : existingCompleted;
    if (conditionIds.length > 0) await updateCompletedConditions(env.text_adventure_ai_db, sessionId, allCompleted);
    await addTurn(env.text_adventure_ai_db, { session_id: sessionId, player_input: input, ai_response: cleanResponse, intent: intent.type, beat: beat.id });
    await checkAndAdvanceBeat(env.text_adventure_ai_db, sessionId, beat.id, scene, allCompleted);
    return redirect(playUrl(`/play/${sessionId}`));
  }

  // drop: deterministic inventory mutation, LLM narrates
  if (intent.type === "drop") {
    if (!intent.subject) {
      await addTurn(env.text_adventure_ai_db, { session_id: sessionId, player_input: input, ai_response: "Drop what?", intent: intent.type, beat: beat.id });
      return redirect(playUrl(`/play/${sessionId}`));
    }
    const matchedItem = matchItem(intent.subject, inventory);

    if (!matchedItem) {
      await addTurn(env.text_adventure_ai_db, { session_id: sessionId, player_input: input, ai_response: `You're not carrying anything like that.`, intent: intent.type, beat: beat.id });
      return redirect(playUrl(`/play/${sessionId}`));
    }

    const newInventory = inventory.filter((i) => i !== matchedItem);
    await updateInventory(env.text_adventure_ai_db, sessionId, newInventory);

    const system = buildSystemPrompt(seed, beat, rules, newInventory, npcState);
    const userPrompt = buildUserPrompt({ seed, beat, history, intent });
    let aiResponse = "";
    await streamText(env.GROQ_API_KEY, [{ role: "user", content: userPrompt }], system, (chunk) => { aiResponse += chunk; });
    const { cleanResponse, conditionIds } = extractConditionsMet(aiResponse);
    const allCompleted = conditionIds.length > 0 ? [...new Set([...existingCompleted, ...conditionIds])] : existingCompleted;
    if (conditionIds.length > 0) await updateCompletedConditions(env.text_adventure_ai_db, sessionId, allCompleted);
    await addTurn(env.text_adventure_ai_db, { session_id: sessionId, player_input: input, ai_response: cleanResponse, intent: intent.type, beat: beat.id });
    await checkAndAdvanceBeat(env.text_adventure_ai_db, sessionId, beat.id, scene, allCompleted);
    return redirect(playUrl(`/play/${sessionId}`));
  }

  // Pre-flight: if the player targets an entity not present in this scene or inventory, skip LLM
  if (scene && intent.subject && (intent.type === "examine" || intent.type === "interact" || intent.type === "use" || intent.type === "dialogue" || intent.type === "combat") && !isEntityPresent(intent.subject, scene, inventory)) {
    const aiResponse = `There's no ${intent.subject} here.`;
    await addTurn(env.text_adventure_ai_db, {
      session_id: sessionId,
      player_input: input,
      ai_response: aiResponse,
      intent: intent.type,
      beat: beat.id,
    });
    return redirect(playUrl(`/play/${sessionId}`));
  }

  // Cache lookup for generic examine/explore actions (scoped per theme)
  const cacheKey = buildCacheKey(intent, ruleIndex);
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
      // Cached responses don't complete conditions — check advancement with existing state
      await checkAndAdvanceBeat(env.text_adventure_ai_db, sessionId, beat.id, scene, existingCompleted);
      return redirect(playUrl(`/play/${sessionId}`));
    }
  }

  // LLM call
  const system = buildSystemPrompt(seed, beat, rules, inventory, npcState);
  const userPrompt = buildUserPrompt({ seed, beat, history, intent });

  let aiResponse = "";
  await streamText(env.GROQ_API_KEY, [{ role: "user", content: userPrompt }], system, (chunk) => {
    aiResponse += chunk;
  });

  // Extract and strip any conditions-met marker from the LLM response
  const { cleanResponse, conditionIds } = extractConditionsMet(aiResponse);

  // Merge newly completed conditions with existing ones
  const allCompleted = conditionIds.length > 0
    ? [...new Set([...existingCompleted, ...conditionIds])]
    : existingCompleted;

  if (conditionIds.length > 0) {
    await updateCompletedConditions(env.text_adventure_ai_db, sessionId, allCompleted);
  }

  // Update NPC disposition when the player directly interacts with a character
  if (intent.type === "dialogue" || intent.type === "interact" || intent.type === "combat") {
    const npcName = matchNpcInScene(intent.subject, scene);
    if (npcName) {
      const current = npcState[npcName] ?? { disposition: 0, interactionCount: 0 };
      const delta = intent.type === "combat" ? -1 : 1;
      const updatedNpcState: NpcStateMap = {
        ...npcState,
        [npcName]: {
          disposition: Math.max(-2, Math.min(2, current.disposition + delta)),
          interactionCount: current.interactionCount + 1,
        },
      };
      await updateNpcState(env.text_adventure_ai_db, sessionId, updatedNpcState);
    }
  }

  // Store cacheable responses for future players
  if (cacheKey) {
    await setCachedResponse(env.text_adventure_ai_db, beat.id, cacheKey, cleanResponse);
  }

  await addTurn(env.text_adventure_ai_db, {
    session_id: sessionId,
    player_input: input,
    ai_response: cleanResponse,
    intent: intent.type,
    beat: beat.id,
  });
  await checkAndAdvanceBeat(env.text_adventure_ai_db, sessionId, beat.id, scene, allCompleted);

  return redirect(playUrl(`/play/${sessionId}`));
}

async function checkAndAdvanceBeat(
  db: D1Database,
  sessionId: string,
  currentBeatId: number,
  scene: BeatScene | undefined,
  completedConditions: string[],
): Promise<void> {
  if (currentBeatId >= BEATS.length - 1) return;
  if (!scene || scene.completionConditions.length === 0) return;
  const required = scene.completionConditions.map((c) => c.id);
  const done = new Set(completedConditions);
  if (required.every((id) => done.has(id))) {
    await updateSessionBeat(db, sessionId, currentBeatId + 1);
  }
}
