"use client";

const BASE = "/animal-sorter-quest/audio/";
let current: HTMLAudioElement | null = null;

export function speak(key: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") { resolve(); return; }
    if (current) { current.pause(); current = null; }
    const a = new Audio(BASE + key);
    current = a;
    a.onended = () => { current = null; resolve(); };
    a.onerror = () => { current = null; resolve(); };
    a.play().catch(() => resolve());
  });
}
