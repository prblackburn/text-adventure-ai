import type { Beat } from "../game/types";
import * as styles from "./BeatProgress.css";

interface Props {
  beats: Beat[];
  currentBeat: number;
}

export function BeatProgress({ beats, currentBeat }: Props) {
  return (
    <div className={styles.beatProgress}>
      {beats.map((b) => (
        <span key={b.id} className={b.id === currentBeat ? styles.current : b.id < currentBeat ? styles.active : styles.inactive}>
          {b.name}
        </span>
      ))}
    </div>
  );
}
