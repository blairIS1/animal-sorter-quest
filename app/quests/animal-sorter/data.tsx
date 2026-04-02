"use client";
import { CatSVG, DogSVG, BirdSVG, FishSVG, RabbitSVG } from "./AnimalSVGs";

// Features each animal has — used for Robi's reasoning display
export const FEATURES: Record<string, { has: string[]; key: string }> = {
  cat:    { has: ["Has fur", "Four legs", "Pointy ears", "Small"],       key: "Purrs" },
  dog:    { has: ["Has fur", "Four legs", "Floppy ears", "Medium"],      key: "Barks" },
  bird:   { has: ["Has feathers", "Two legs", "Has wings", "Small"],     key: "Has beak" },
  fish:   { has: ["Has scales", "No legs", "Has fins", "Lives in water"], key: "Has gills" },
  rabbit: { has: ["Has fur", "Four legs", "Long ears", "Hops"],          key: "Twitchy nose" },
};

export const ANIMALS = [
  { id: "cat", label: "Cat", Svg: CatSVG, color: "#f97316", category: "cat" },
  { id: "dog", label: "Dog", Svg: DogSVG, color: "#92400e", category: "dog" },
  { id: "bird", label: "Bird", Svg: BirdSVG, color: "#22c55e", category: "bird" },
  { id: "fish", label: "Fish", Svg: FishSVG, color: "#06b6d4", category: "fish" },
  { id: "rabbit", label: "Rabbit", Svg: RabbitSVG, color: "#a855f7", category: "rabbit" },
] as const;

export const CATEGORIES = ["cat", "dog", "bird", "fish", "rabbit"] as const;

export const EVA_ANIMALS = ANIMALS.filter((a) => ["cat", "dog", "fish"].includes(a.id));
export const EVA_CATEGORIES = ["cat", "dog", "fish"] as const;

export type TrainingData = Record<string, number>;

// Confidence: 0 examples → 30%, 1 → 55%, 2+ → 90%
export function getConfidence(training: TrainingData, category: string): number {
  const count = training[category] || 0;
  return count === 0 ? 30 : count === 1 ? 55 : 90;
}

// Confusion rules
const CONFUSIONS: Record<string, { with: string; reason: string; misleading: string[] }> = {
  rabbit: { with: "cat",    reason: "It has fur and pointy ears — looks like a cat to me!", misleading: ["Has fur", "Four legs"] },
  cat:    { with: "rabbit", reason: "Small and furry — maybe it's a rabbit?",               misleading: ["Has fur", "Small"] },
  fish:   { with: "bird",   reason: "It moves fast — could be a bird!",                     misleading: ["Small"] },
  bird:   { with: "fish",   reason: "It's small and smooth — maybe a fish?",                misleading: ["Small"] },
  dog:    { with: "cat",    reason: "Four legs and fur — looks like a cat!",                 misleading: ["Has fur", "Four legs"] },
};

export type GuessRound = {
  animal: string;
  robotGuess: string;
  correct: boolean;
  reason?: string;
  confidence: number;
  features: string[];
  misleading?: string[];
  correction?: string;
};

export function generateGuessRounds(training: TrainingData): GuessRound[] {
  const rounds: GuessRound[] = [];

  const cats = [...CATEGORIES].sort(() => Math.random() - 0.5);
  for (const cat of cats) {
    const count = training[cat] || 0;
    const accuracy = count === 0 ? 0.2 : count === 1 ? 0.5 : 0.85;
    const confidence = getConfidence(training, cat);
    const correct = Math.random() < accuracy;
    const feat = FEATURES[cat];

    if (correct) {
      rounds.push({ animal: cat, robotGuess: cat, correct: true, confidence, features: feat.has });
    } else {
      const confusion = CONFUSIONS[cat] || { with: "cat", reason: "I'm not sure!", misleading: [] };
      rounds.push({
        animal: cat, robotGuess: confusion.with, correct: false,
        reason: confusion.reason, confidence: Math.max(20, confidence - 30),
        features: confusion.misleading, misleading: confusion.misleading,
        correction: `📝 Got it! I'll remember: ${feat.key} → ${ANIMALS.find((a) => a.id === cat)!.label}`,
      });
    }
  }

  // 3 extra rounds weighted toward low-data categories
  const lowData = cats.filter((c) => (training[c] || 0) <= 1);
  const pool = lowData.length > 0 ? lowData : cats;
  for (let i = 0; i < 3; i++) {
    const cat = pool[Math.floor(Math.random() * pool.length)];
    const count = training[cat] || 0;
    const accuracy = count === 0 ? 0.2 : count === 1 ? 0.5 : 0.85;
    const confidence = getConfidence(training, cat);
    const correct = Math.random() < accuracy;
    const feat = FEATURES[cat];

    if (correct) {
      rounds.push({ animal: cat, robotGuess: cat, correct: true, confidence, features: feat.has });
    } else {
      const confusion = CONFUSIONS[cat] || { with: "cat", reason: "I'm not sure!", misleading: [] };
      rounds.push({
        animal: cat, robotGuess: confusion.with, correct: false,
        reason: confusion.reason, confidence: Math.max(20, confidence - 30),
        features: confusion.misleading, misleading: confusion.misleading,
        correction: `📝 Got it! I'll remember: ${feat.key} → ${ANIMALS.find((a) => a.id === cat)!.label}`,
      });
    }
  }

  return rounds;
}

export const TRICKY_ROUNDS = [
  { emoji: "🦊", label: "Fox", options: ["cat", "dog"], answer: "dog", reason: "Foxes are in the dog family!" },
  { emoji: "🐧", label: "Penguin", options: ["bird", "fish"], answer: "bird", reason: "Penguins are birds that swim!" },
  { emoji: "🦇", label: "Bat", options: ["bird", "rabbit"], answer: "rabbit", reason: "Bats are mammals, not birds!" },
  { emoji: "🐢", label: "Turtle", options: ["fish", "rabbit"], answer: "rabbit", reason: "Turtles live on land too — not a fish!" },
  { emoji: "🦭", label: "Seal", options: ["dog", "fish"], answer: "dog", reason: "Seals are closer to dogs than fish!" },
];
