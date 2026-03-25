import { useEffect, useRef } from "react";
import * as styles from "./GameLog.css";
import { useTypewriter } from "../hooks/useTypewriter";

export interface GameLogEntry {
  id: number;
  player: string;
  ai: string;
}

interface Props {
  entries: GameLogEntry[];
  sessionId: string;
}

function TypewriterEntry({
  entry,
  sessionId,
}: {
  entry: GameLogEntry;
  sessionId: string;
}) {
  const isNew = useRef(() => {
    if (typeof window === "undefined") return false;
    const key = `tw:${sessionId}`;
    const seen = Number(sessionStorage.getItem(key) ?? 0);
    if (entry.id > seen) {
      sessionStorage.setItem(key, String(entry.id));
      return true;
    }
    return false;
  }).current();

  const { displayed, done, skip } = useTypewriter(entry.ai, isNew);

  return (
    <div className={styles.entry}>
      <p className={styles.playerInput}>
        <em>&gt; {entry.player}</em>
      </p>
      <p
        className={styles.aiResponse}
        onClick={done ? undefined : skip}
        style={done ? undefined : { cursor: "pointer" }}
        title={done ? undefined : "Click to skip"}
      >
        {displayed}
        {!done && <span className={styles.cursor}>▌</span>}
      </p>
    </div>
  );
}

export function GameLog({ entries, sessionId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length]);

  return (
    <div className={styles.gameLog}>
      {entries.map((e) => (
        <TypewriterEntry key={e.id} entry={e} sessionId={sessionId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
