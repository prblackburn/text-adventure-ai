import { useState, useEffect, useCallback } from "react";

const SPEED_MS = 18;

export function useTypewriter(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState(active ? "" : text);
  const [done, setDone] = useState(!active);

  const skip = useCallback(() => {
    setDisplayed(text);
    setDone(true);
  }, [text]);

  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, SPEED_MS);
    return () => clearInterval(id);
  }, [text, active]);

  return { displayed, done, skip };
}
