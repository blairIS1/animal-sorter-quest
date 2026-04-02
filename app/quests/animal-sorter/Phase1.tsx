"use client";
import { useState, useEffect, useRef } from "react";
import { ANIMALS, CATEGORIES } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxWrong, sfxTap } from "./sfx";
import { speak } from "./speak";
import Confetti, { Sparkle } from "./Confetti";
import { useMode } from "./ModeContext";

const makeQueue = () => [...ANIMALS, ...ANIMALS].sort(() => Math.random() - 0.5);

export default function Phase1({ onComplete }: { onComplete: () => void }) {
  const mode = useMode();
  const [queue] = useState(() => makeQueue().slice(0, mode === "eva" ? 4 : 8));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<"idle" | "happy" | "confused" | "celebrate">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const done = idx >= queue.length;
  const current = queue[idx];
  const spokenRef = useRef(-1);

  useEffect(() => {
    if (!done && spokenRef.current !== idx) {
      spokenRef.current = idx;
      speak("What animal is this?");
    }
  }, [idx, done]);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="celebrate" size={120} />
        <h2 className="text-3xl font-bold">Robi is learning!</h2>
        <p className="text-lg opacity-80">You taught Robi {queue.length} animals. Let&apos;s see if Robi can guess!</p>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("Let's see if I can guess now!").then(onComplete); }}>Next →</button>
      </div>
    );
  }

  const Svg = current.Svg;

  const pick = (cat: string) => {
    if (cat === current.category) {
      sfxCorrect();
      setMood("happy");
      setShowConfetti(true);
      setFeedback("✅ Correct! Robi learned a new " + current.label + "!");
      speak("Correct! I learned a new " + current.label + "!").then(() => {
        setFeedback(""); setMood("idle"); setShowConfetti(false);
        setIdx((i) => i + 1);
      });
    } else {
      sfxWrong();
      setMood("confused");
      setFeedback("❌ That's a " + current.label + ", not a " + cat + "!");
      speak("Oops! That's a " + current.label + ", not a " + cat + "!").then(() => {
        setFeedback(""); setMood("idle");
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <Confetti active={showConfetti} />
      <h2 className="text-3xl font-bold">🏷️ Phase 1: Teach Robi!</h2>
      <RobotBuddy mood={mood} size={80} />
      <div className="text-sm opacity-70">{idx} / {queue.length} taught</div>
      <div className="progress-track w-64">
        <div className="progress-fill" style={{ width: `${(idx / queue.length) * 100}%` }} />
      </div>

      <div className="my-2 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `3px solid ${current.color}` }}>
        <Svg size={120} />
      </div>
      <div className="text-xl font-semibold">What animal is this?</div>
      <div className="text-lg min-h-[2em] font-semibold">{feedback}</div>

      {!feedback && (
        <div className="flex flex-wrap justify-center gap-3 fade-in">
          {CATEGORIES.map((cat) => {
            const a = ANIMALS.find((x) => x.category === cat)!;
            const BtnSvg = a.Svg;
            return (
              <button key={cat} className="btn flex flex-col items-center gap-1 px-5 py-3" style={{ background: "var(--card)" }} onClick={() => { sfxTap(); pick(cat); }}>
                <BtnSvg size={40} />
                <span className="text-sm capitalize">{cat}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
