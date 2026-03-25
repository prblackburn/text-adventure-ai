import { useEffect, useRef } from "react";

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
    <div className="game-log">
      {entries.map((e) => (
        <div key={e.id} className="entry">
          <p className="player-input">
            <em>&gt; {e.player}</em>
          </p>
          <p className="ai-response">{e.ai}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
