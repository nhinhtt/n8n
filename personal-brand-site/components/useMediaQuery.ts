"use client";

import { useState, useEffect } from "react";

export function useIsMobile(query = "(max-width: 768px)") {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const m = window.matchMedia(query);
    setMatches(m.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(pointer: coarse)");
    setIsTouch(m.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);

  return isTouch;
}
