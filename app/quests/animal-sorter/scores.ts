"use client";

const KEY = "animal-sorter-quest-scores";

export type GameScore = {
  date: string;
  mode: string;
  completions: number;
};

function load(): GameScore {
  if (typeof window === "undefined") return { date: "", mode: "", completions: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { date: "", mode: "", completions: 0 };
  } catch { return { date: "", mode: "", completions: 0 }; }
}

function save(s: GameScore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function recordCompletion(mode: string): number {
  const s = load();
  s.completions += 1;
  s.mode = mode;
  s.date = new Date().toISOString();
  save(s);
  return s.completions;
}

export function getCompletions(): number {
  return load().completions;
}
