"use client";

export const ANIMALS = [
  { id: "cat", label: "Cat", lottie: "/animal-sorter-quest/animations/cat.json", color: "#f97316", category: "cat" },
  { id: "dog", label: "Dog", lottie: "/animal-sorter-quest/animations/dog.json", color: "#3b82f6", category: "dog" },
  { id: "bird", label: "Bird", lottie: "/animal-sorter-quest/animations/bird.json", color: "#22c55e", category: "bird" },
  { id: "fish", label: "Fish", lottie: "/animal-sorter-quest/animations/fish.json", color: "#06b6d4", category: "fish" },
  { id: "rabbit", label: "Rabbit", lottie: "/animal-sorter-quest/animations/rabbit.json", color: "#a855f7", category: "rabbit" },
] as const;

export const CATEGORIES = ["cat", "dog", "bird", "fish", "rabbit"] as const;

export const GUESS_ROUNDS = [
  { animal: "cat", robotGuess: "cat", correct: true },
  { animal: "dog", robotGuess: "dog", correct: true },
  { animal: "rabbit", robotGuess: "cat", correct: false, reason: "It has fur and pointy ears like a cat!" },
  { animal: "bird", robotGuess: "bird", correct: true },
  { animal: "fish", robotGuess: "bird", correct: false, reason: "It moves fast like a bird!" },
  { animal: "dog", robotGuess: "cat", correct: false, reason: "It has four legs and fur like a cat!" },
  { animal: "cat", robotGuess: "cat", correct: true },
  { animal: "rabbit", robotGuess: "rabbit", correct: true },
];

export const TRICKY_ROUNDS = [
  { emoji: "🦊", label: "Fox", options: ["cat", "dog"], answer: "dog", reason: "Foxes are in the dog family!" },
  { emoji: "🐧", label: "Penguin", options: ["bird", "fish"], answer: "bird", reason: "Penguins are birds that swim!" },
  { emoji: "🦇", label: "Bat", options: ["bird", "rabbit"], answer: "rabbit", reason: "Bats are mammals, not birds!" },
  { emoji: "🐢", label: "Turtle", options: ["fish", "rabbit"], answer: "rabbit", reason: "Turtles live on land too — not a fish!" },
  { emoji: "🦭", label: "Seal", options: ["dog", "fish"], answer: "dog", reason: "Seals are closer to dogs than fish!" },
];
