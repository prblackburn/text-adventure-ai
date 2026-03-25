import { useCallback, useEffect, useRef, useState } from "react";

const SPEED_MS = 18;

function isNewEntry(key: string, entryId: number): boolean {
  if (typeof window === "undefined") return false;
  return entryId > Number(sessionStorage.getItem(key) ?? 0);
}

export function useTypewriter(
  text: string,
  entryId: number,
  sessionId: string,
  isLatest: boolean
) {
  const key = `tw:${sessionId}`;

  // Server: render the latest entry empty so the browser never displays full
  // text before React hydrates — prevents the flash. All other entries render
  // full text (they're already seen). Client: sessionStorage decides whether
  // to animate (new) or show immediately (already seen).
  const [displayed, setDisplayed] = useState(() => {
    if (typeof window === "undefined") return isLatest ? "" : text;
    return isNewEntry(key, entryId) ? "" : text;
  });
  const [done, setDone] = useState(() => {
    if (typeof window === "undefined") return !isLatest;
    return !isNewEntry(key, entryId);
  });

  const skipRef = useRef<() => void>(() => {});
  const skip = useCallback(() => skipRef.current(), []);

  useEffect(() => {
    if (!isNewEntry(key, entryId)) {
      // Already seen — make sure full text is showing (handles the
      // isLatest-but-not-new case after a page refresh).
      setDisplayed(text);
      setDone(true);
      return;
    }

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
