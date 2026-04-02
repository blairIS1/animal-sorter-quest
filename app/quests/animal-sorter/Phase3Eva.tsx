"use client";
import { useState } from "react";
import { EVA_ANIMALS } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxTap, sfxCelebrate } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";

// "What sound does this animal make?" — tap the right sound
const SOUND_ROUNDS = [
  { animal: "cat", emoji: "🐱", sound: "Meow!", wrong: "Woof!" },
  { animal: "dog", emoji: "🐶", sound: "Woof!", wrong: "Blub!" },
  { animal: "fish", emoji: "🐟", sound: "Blub!", wrong: "Meow!" },
];

export default function Phase3Eva({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const done = idx >= SOUND_ROUNDS.length;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <Confetti active={true} />
        <RobotBuddy mood="celebrate" size={140} />
        <h2 className="text-3xl font-bold">🎉 Amazing!</h2>
        <p className="text-xl opacity-80">You know all the animal sounds!</p>
        <button className="btn btn-success mt-4 eva-btn" onClick={() => { sfxTap(); speak("thank_you.mp3").then(onComplete); }}>
          Next →
        </button>
      </div>
    );
  }

  const round = SOUND_ROUNDS[idx];
  const choices = [round.sound, round.wrong].sort(() => Math.random() - 0.5);

  const pick = (choice: string) => {
    if (choice === round.sound) {
      sfxCorrect();
      setShowConfetti(true);
      setFeedback("⭐ Yes! " + round.emoji + " says " + round.sound);
      setTimeout(() => {
        setFeedback(""); setShowConfetti(false);
        setIdx((i) => i + 1);
      }, 2000);
    } else {
      setFeedback("Hmm, try again! 😊");
      setTimeout(() => setFeedback(""), 1200);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <Confetti active={showConfetti} />
      <h2 className="text-2xl font-bold">🔊 Animal Sounds!</h2>
      <RobotBuddy mood="confused" size={100} />

      <div className="text-9xl my-4">{round.emoji}</div>
      <div className="text-2xl font-semibold">What does it say?</div>
      <div className="text-xl min-h-[2em] font-semibold text-center">{feedback}</div>

      {!feedback && (
        <div className="flex gap-6 fade-in">
          {choices.map((s) => (
            <button key={s} className="btn eva-btn text-2xl" style={{ background: "var(--card)" }} onClick={() => { sfxTap(); pick(s); }}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
