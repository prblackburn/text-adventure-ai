import { useCallback, useEffect, useRef, useState } from "react";

const SPEED_MS = 18;

function isNewEntry(key: string, entryId: number): boolean {
  if (typeof window === "undefined") return false;
  return entryId > Number(sessionStorage.getItem(key) ?? 0);
}

export function useTypewriter(text: string, entryId: number, sessionId: string) {
  const key = `tw:${sessionId}`;

  // Read sessionStorage synchronously so the initial render starts empty for
  // new entries — no flash of full text before animation begins.
  // Server always returns full text; suppressHydrationWarning on the element
  // handles the server/client mismatch for new entries.
  const [displayed, setDisplayed] = useState(() =>
    isNewEntry(key, entryId) ? "" : text
  );
  const [done, setDone] = useState(() => !isNewEntry(key, entryId));

  const skipRef = useRef<() => void>(() => {});
  const skip = useCallback(() => skipRef.current(), []);

  useEffect(() => {
    if (!isNewEntry(key, entryId)) return;

    sessionStorage.setItem(key, String(entryId));

    let cancelled = false;
    let i = 0;

    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;

      const intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, SPEED_MS);

      skipRef.current = () => {
        clearInterval(intervalId);
        setDisplayed(text);
        setDone(true);
      };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      skipRef.current();
    };
  }, [entryId, key, text]);

  return { displayed, done, skip };
}
