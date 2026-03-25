import type { Beat } from "../game/types";

interface Props {
  beats: Beat[];
  currentBeat: number;
}

export function BeatProgress({ beats, currentBeat }: Props) {
  return (
    <div className="beat-progress">
      {beats.map((b) => (
        <span key={b.id} className={b.id === currentBeat ? "current" : b.id < currentBeat ? "active" : "inactive"}>
          {b.name}
        </span>
      ))}
    </div>
  );
}
