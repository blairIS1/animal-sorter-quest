"use client";
import { CatSVG, DogSVG, BirdSVG, FishSVG, RabbitSVG } from "./AnimalSVGs";

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

// How many correct labels per category Baker provided in Phase 1
export type TrainingData = Record<string, number>;

// Confusion rules: when Robi doesn't have enough data, it confuses similar animals
const CONFUSIONS: Record<string, { with: string; reason: string }> = {
  rabbit: { with: "cat", reason: "It has fur and pointy ears — looks like a cat to me!" },
  cat: { with: "rabbit", reason: "Small and furry — maybe it's a rabbit?" },
  fish: { with: "bird", reason: "It moves fast — could be a bird!" },
  bird: { with: "fish", reason: "It's small and smooth — maybe a fish?" },
  dog: { with: "cat", reason: "Four legs and fur — looks like a cat!" },
};

// Generate guess rounds dynamically based on training data
// More training data for a category → higher chance Robi guesses correctly
export function generateGuessRounds(training: TrainingData) {
  const rounds: { animal: string; robotGuess: string; correct: boolean; reason?: string }[] = [];

  // Each category gets tested once, shuffled
  const cats = [...CATEGORIES].sort(() => Math.random() - 0.5);
  for (const cat of cats) {
    const count = training[cat] || 0;
    // 0 examples → 20% correct, 1 → 50%, 2+ → 85%
    const accuracy = count === 0 ? 0.2 : count === 1 ? 0.5 : 0.85;
    const correct = Math.random() < accuracy;

    if (correct) {
      rounds.push({ animal: cat, robotGuess: cat, correct: true });
    } else {
      const confusion = CONFUSIONS[cat] || { with: "cat", reason: "I'm not sure!" };
      rounds.push({ animal: cat, robotGuess: confusion.with, correct: false, reason: confusion.reason });
    }
  }

  // Add 3 more random rounds (weighted toward low-data categories)
  const lowData = cats.filter((c) => (training[c] || 0) <= 1);
  const pool = lowData.length > 0 ? lowData : cats;
  for (let i = 0; i < 3; i++) {
    const cat = pool[Math.floor(Math.random() * pool.length)];
    const count = training[cat] || 0;
    const accuracy = count === 0 ? 0.2 : count === 1 ? 0.5 : 0.85;
    const correct = Math.random() < accuracy;

    if (correct) {
      rounds.push({ animal: cat, robotGuess: cat, correct: true });
    } else {
      const confusion = CONFUSIONS[cat] || { with: "cat", reason: "I'm not sure!" };
      rounds.push({ animal: cat, robotGuess: confusion.with, correct: false, reason: confusion.reason });
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
