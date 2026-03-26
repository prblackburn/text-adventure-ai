import { useLocation } from "react-router";
import * as styles from "./InputBar.css";

interface Props {
  sessionId: string;
  disabled?: boolean;
}

export function InputBar({ sessionId, disabled }: Props) {
  const { search } = useLocation();
  return (
    <form method="post" action="/api/action" className={styles.inputBar}>
      <input type="hidden" name="sessionId" value={sessionId} />
      {search && <input type="hidden" name="_search" value={search} />}
      <input
        type="text"
        name="input"
        autoFocus
        autoComplete="off"
        disabled={disabled}
        maxLength={200}
        placeholder="What do you do?"
      />
      <button type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
}
