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
