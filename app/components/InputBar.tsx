interface Props {
  sessionId: string;
  disabled?: boolean;
}

export function InputBar({ sessionId, disabled }: Props) {
  return (
    <form method="post" action="/api/action" className="input-bar">
      <input type="hidden" name="sessionId" value={sessionId} />
      <input
        type="text"
        name="input"
        autoFocus
        autoComplete="off"
        disabled={disabled}
        placeholder="What do you do?"
      />
      <button type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
}
