import { useEffect, useRef } from "react";
import * as styles from "./GameLog.css";

export interface GameLogEntry {
  id: number;
  player: string;
  ai: string;
}

interface Props {
  entries: GameLogEntry[];
}

export function GameLog({ entries }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length]);

  return (
    <div className={styles.gameLog}>
      {entries.map((e) => (
        <div key={e.id} className={styles.entry}>
          <p className={styles.playerInput}>
            <em>&gt; {e.player}</em>
          </p>
          <p className={styles.aiResponse}>{e.ai}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
