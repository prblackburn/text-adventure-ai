import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { getSession, getTurns } from "../lib/db";
import { GameLog } from "../components/GameLog";
import { InputBar } from "../components/InputBar";
import { BeatProgress } from "../components/BeatProgress";
import { DevOverlay } from "../components/DevOverlay";
import { BEATS } from "../game/beats";
import { getRules } from "../game/worldRules";
import type { WorldSeed } from "../game/types";

export const meta: MetaFunction = () => [{ title: "Play — Ashveil" }];

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { env } = context.cloudflare;
  const session = await getSession(env.text_adventure_ai_db, params.sessionId!);
  if (!session) throw new Response("Session not found", { status: 404 });
  const turns = await getTurns(env.text_adventure_ai_db, params.sessionId!);

  const url = new URL(request.url);
  const devMode = url.searchParams.has("dev");

  const stored = JSON.parse(session.world_seed) as WorldSeed & { ruleIndex?: number };
  const { ruleIndex, ...seed } = stored;
  const rules = devMode && ruleIndex !== undefined ? getRules(ruleIndex) : undefined;

  return { session, turns, seed, ruleIndex, rules, devMode };
}

export default function Play() {
  const { session, turns, seed, ruleIndex, rules, devMode } = useLoaderData<typeof loader>();

  const entries = turns.map((t) => ({
    id: t.id,
    player: t.player_input,
    ai: t.ai_response,
  }));

  return (
    <main className="play">
      <BeatProgress beats={BEATS} currentBeat={session.current_beat} />
      <GameLog entries={entries} />
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
        />
      )}
    </main>
  );
}
