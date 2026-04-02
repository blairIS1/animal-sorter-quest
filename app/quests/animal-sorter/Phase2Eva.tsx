"use client";
import { useState, useEffect, useRef } from "react";
import { EVA_ANIMALS } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxTap, sfxCelebrate } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";

// Robi always guesses correctly — Eva just confirms with a big "Yes!" button
const ROUNDS = EVA_ANIMALS.map((a) => ({ animal: a.id, label: a.label, category: a.category }));

export default function Phase2Eva({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mood, setMood] = useState<"thinking" | "happy" | "celebrate">("thinking");
  const spokenRef = useRef(-1);
  const done = idx >= ROUNDS.length;

  useEffect(() => {
    if (!done && spokenRef.current !== idx) {
      spokenRef.current = idx;
      speak("think_" + ROUNDS[idx].category + ".mp3");
    }
  }, [idx, done]);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <Confetti active={true} />
        <RobotBuddy mood="celebrate" size={140} />
        <h2 className="text-3xl font-bold">🎉 Robi is so smart!</h2>
        <p className="text-xl opacity-80">You taught Robi all the animals!</p>
        <button className="btn btn-success mt-4 eva-btn" onClick={() => { sfxTap(); speak("thank_you.mp3").then(onComplete); }}>
          Next →
        </button>
      </div>
    );
  }

  const round = ROUNDS[idx];
  const animal = EVA_ANIMALS.find((a) => a.id === round.animal)!;
  const Svg = animal.Svg;

  const confirm = () => {
    sfxCorrect();
    setMood("happy");
    setShowConfetti(true);
    speak("got_it_right.mp3").then(() => {
      setShowConfetti(false);
      setMood("thinking");
      setIdx((i) => i + 1);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <Confetti active={showConfetti} />
      <h2 className="text-2xl font-bold">🤖 Robi Guesses!</h2>
      <RobotBuddy mood={mood} size={100} />

      <div className="my-2 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `4px solid ${animal.color}` }}>
        <Svg size={150} />
      </div>

      <div className="text-2xl text-center">
        Robi: &quot;It&apos;s a <b style={{ color: animal.color }}>{animal.label}!</b>&quot;
      </div>

      <button className="btn eva-btn text-2xl" style={{ background: "var(--success)", color: "#0f172a" }} onClick={() => { sfxTap(); confirm(); }}>
        ⭐ Yes! ⭐
      </button>
    </div>
  );
}
