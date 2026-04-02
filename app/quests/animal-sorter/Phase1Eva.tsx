"use client";
import { useState, useEffect, useRef } from "react";
import { EVA_ANIMALS, EVA_CATEGORIES, ANIMALS } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxTap } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";

export default function Phase1Eva({ onComplete }: { onComplete: () => void }) {
  const [queue] = useState(() => [...EVA_ANIMALS].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<"idle" | "happy" | "celebrate">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const spokenRef = useRef(-1);
  const done = idx >= queue.length;
  const current = queue[idx];

  // Pick 2 choices: the correct one + one random wrong one
  const choices = !done ? (() => {
    const wrong = EVA_CATEGORIES.filter((c) => c !== current.category);
    const pick = wrong[Math.floor(Math.random() * wrong.length)];
    return [current.category, pick].sort(() => Math.random() - 0.5);
  })() : [];

  useEffect(() => {
    if (!done && spokenRef.current !== idx) {
      spokenRef.current = idx;
      speak("what_animal.mp3");
    }
  }, [idx, done]);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="celebrate" size={140} />
        <h2 className="text-3xl font-bold">🎉 Yay!</h2>
        <p className="text-xl opacity-80">Robi learned {queue.length} animals!</p>
        <button className="btn btn-success mt-4 eva-btn" onClick={() => { sfxTap(); speak("lets_guess.mp3").then(onComplete); }}>
          Next →
        </button>
      </div>
    );
  }

  const Svg = current.Svg;

  const pick = (cat: string) => {
    if (cat === current.category) {
      sfxCorrect();
      setMood("happy");
      setShowConfetti(true);
      setFeedback("⭐ Yes! That's a " + current.label + "!");
      speak("correct_" + current.category + ".mp3").then(() => {
        setFeedback(""); setMood("idle"); setShowConfetti(false);
        setIdx((i) => i + 1);
      });
    } else {
      // Gentle redirect — no wrong buzzer, just a nudge
      setMood("idle");
      setFeedback("Hmm, try the other one! 😊");
      setTimeout(() => setFeedback(""), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <Confetti active={showConfetti} />
      <h2 className="text-2xl font-bold">🏷️ Teach Robi!</h2>
      <RobotBuddy mood={mood} size={100} />

      <div className="my-2 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `4px solid ${current.color}` }}>
        <Svg size={150} />
      </div>

      <div className="text-xl font-semibold min-h-[2em] text-center">{feedback}</div>

      {!feedback && (
        <div className="flex gap-6 fade-in">
          {choices.map((cat) => {
            const a = ANIMALS.find((x) => x.category === cat)!;
            const BtnSvg = a.Svg;
            return (
              <button key={cat} className="btn eva-btn flex flex-col items-center gap-2" style={{ background: "var(--card)" }} onClick={() => { sfxTap(); pick(cat); }}>
                <BtnSvg size={64} />
                <span className="text-lg capitalize">{cat}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
