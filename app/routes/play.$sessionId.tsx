import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { getSession, getTurns } from "../lib/db";
import { GameLog } from "../components/GameLog";
import { InputBar } from "../components/InputBar";
import { BeatProgress } from "../components/BeatProgress";
import { BEATS } from "../game/beats";

export const meta: MetaFunction = () => [{ title: "Play — Ashveil" }];

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { env } = context.cloudflare;
  const session = await getSession(env.DB, params.sessionId!);
  if (!session) throw new Response("Session not found", { status: 404 });
  const turns = await getTurns(env.DB, params.sessionId!);
  return { session, turns };
}

export default function Play() {
  const { session, turns } = useLoaderData<typeof loader>();

  const entries = turns.map((t) => ({
    id: t.id,
    player: t.player_input,
    ai: t.ai_response,
  }));

  return (
    <main>
      <BeatProgress beats={BEATS} currentBeat={session.current_beat} />
      <GameLog entries={entries} />
      <InputBar sessionId={session.id} />
    </main>
  );
}
