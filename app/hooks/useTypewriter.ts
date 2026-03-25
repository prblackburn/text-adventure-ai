import { useCallback, useEffect, useRef, useState } from "react";

const SPEED_MS = 18;

export function useTypewriter(text: string, entryId: number, sessionId: string) {
  const [displayed, setDisplayed] = useState(text);
  const [done, setDone] = useState(true);
  const skipRef = useRef<() => void>(() => {});

  const skip = useCallback(() => skipRef.current(), []);

  useEffect(() => {
    const key = `tw:${sessionId}`;
    const seen = Number(sessionStorage.getItem(key) ?? 0);
    if (entryId <= seen) return;

    sessionStorage.setItem(key, String(entryId));

    let cancelled = false;

    // Use rAF so setState is called inside an async callback, not directly in
    // the effect body — satisfies react-hooks/set-state-in-effect.
    // rAF also only fires in the browser, so this is SSR-safe.
    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      let i = 0;
      setDisplayed("");
      setDone(false);

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
  }, [entryId, sessionId, text]);

  return { displayed, done, skip };
}
