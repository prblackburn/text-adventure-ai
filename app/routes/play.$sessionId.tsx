import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import * as styles from "./play.$sessionId.css";
import { getSession, getTurns, addTurn } from "../lib/db";
import { GameLog } from "../components/GameLog";
import { InputBar } from "../components/InputBar";
import { BeatProgress } from "../components/BeatProgress";
import { DevOverlay } from "../components/DevOverlay";
import { BEATS } from "../game/beats";
import { getRules } from "../game/worldRules";
import { buildIntroPrompt } from "../game/promptBuilder";
import { generateText } from "../lib/stream";
import type { WorldSeed } from "../game/types";

export const meta: MetaFunction = () => [{ title: "Play — Ashveil" }];

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { env } = context.cloudflare;
  const session = await getSession(env.text_adventure_ai_db, params.sessionId!);
  if (!session) throw new Response("Session not found", { status: 404 });

  const stored = JSON.parse(session.world_seed) as WorldSeed & { ruleIndex?: number };
  const { ruleIndex, ...seed } = stored;
  const rules = ruleIndex !== undefined ? getRules(ruleIndex) : undefined;

  // Generate intro on first visit only
  const existingTurns = await getTurns(env.text_adventure_ai_db, params.sessionId!);
  if (existingTurns.length === 0) {
    try {
      const scene = rules?.scenes[0];
      const { system, user } = buildIntroPrompt(seed, scene);
      const introText = await generateText(
        env.GROQ_API_KEY,
        [{ role: "user", content: user }],
        system,
        220
      );
      await addTurn(env.text_adventure_ai_db, {
        session_id: params.sessionId!,
        player_input: "",
        ai_response: introText,
        intent: "intro",
        beat: 0,
      });
    } catch (err) {
      console.error("Intro generation failed:", err);
    }
  }

  const turns = await getTurns(env.text_adventure_ai_db, params.sessionId!);

  const url = new URL(request.url);
  const devMode = url.searchParams.has("dev");
  const devRules = devMode ? rules : undefined;

  const completedConditions: string[] = JSON.parse(session.completed_conditions ?? "[]");

  return { session, turns, seed, ruleIndex, rules: devRules, devMode, completedConditions };
}

export default function Play() {
  const { session, turns, seed, ruleIndex, rules, devMode, completedConditions } = useLoaderData<typeof loader>();

  const entries = turns.map((t) => ({
    id: t.id,
    player: t.player_input,
    ai: t.ai_response,
  }));

  return (
    <main className={styles.play}>
      <BeatProgress beats={BEATS} currentBeat={session.current_beat} />
      <GameLog entries={entries} sessionId={session.id} />
      <InputBar sessionId={session.id} />
      {devMode && (
        <DevOverlay
          sessionId={session.id}
          seed={seed}
          ruleIndex={ruleIndex}
          currentBeat={session.current_beat}
          beats={BEATS}
          turns={turns}
          rules={rules}
          createdAt={session.created_at}
          completedConditions={completedConditions}
        />
      )}
    </main>
  );
}
