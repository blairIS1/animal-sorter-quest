"use client";

const KEY = "animal-sorter-mastery";

// Per-animal: correct/total attempts + last seen timestamp
export type AnimalMastery = {
  correct: number;
  total: number;
  lastSeen: number; // Date.now()
};

export type MasteryData = {
  animals: Record<string, AnimalMastery>;
  completions: number;
  lastPlayed: string;
};

function blank(): MasteryData {
  return { animals: {}, completions: 0, lastPlayed: "" };
}

export function loadMastery(): MasteryData {
  if (typeof window === "undefined") return blank();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : blank();
  } catch { return blank(); }
}

function save(m: MasteryData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(m));
}

export function recordResult(animal: string, correct: boolean) {
  const m = loadMastery();
  const a = m.animals[animal] || { correct: 0, total: 0, lastSeen: 0 };
  a.total += 1;
  if (correct) a.correct += 1;
  a.lastSeen = Date.now();
  m.animals[animal] = a;
  save(m);
}

export function recordCompletion(mode: string): number {
  const m = loadMastery();
  m.completions += 1;
  m.lastPlayed = new Date().toISOString();
  save(m);
  return m.completions;
}

export function getCompletions(): number {
  return loadMastery().completions;
}

// Mastery level: 0-2 correct = learning, 3-4 = familiar, 5+ = mastered
export function getMasteryLevel(animal: string): "new" | "learning" | "familiar" | "mastered" {
  const m = loadMastery();
  const a = m.animals[animal];
  if (!a || a.total === 0) return "new";
  if (a.correct < 3) return "learning";
  if (a.correct < 5) return "familiar";
  return "mastered";
}

// Return animals sorted by weakness (fewest correct, oldest seen first)
export function getWeakest(categories: readonly string[]): string[] {
  const m = loadMastery();
  return [...categories].sort((a, b) => {
    const ma = m.animals[a] || { correct: 0, total: 0, lastSeen: 0 };
    const mb = m.animals[b] || { correct: 0, total: 0, lastSeen: 0 };
    // Fewer correct = weaker = comes first
    if (ma.correct !== mb.correct) return ma.correct - mb.correct;
    // Older = needs review more
    return ma.lastSeen - mb.lastSeen;
  });
}
