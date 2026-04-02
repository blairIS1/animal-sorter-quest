"use client";
import { useState, useEffect, useRef } from "react";
import { ANIMALS, CATEGORIES, TrainingData } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxWrong, sfxTap } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";

// Guarantee all 5 animals appear at least once, then fill remaining 3 slots randomly
const makeQueue = () => {
  const base = [...ANIMALS];
  const extras = [...ANIMALS].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...base, ...extras].sort(() => Math.random() - 0.5);
};

export default function Phase1({ onComplete }: { onComplete: (data: TrainingData) => void }) {
  const [queue] = useState(makeQueue);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<"idle" | "happy" | "confused" | "celebrate">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [training, setTraining] = useState<TrainingData>({});
  const [shrinkScale, setShrinkScale] = useState(1);
  const shrinkRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const spokenRef = useRef(-1);
  const done = idx >= queue.length;
  const current = queue[idx];

  // #1 — Shrinking animal: starts at scale 1 (160px) → shrinks to ~0.56 (90px) over 3s
  useEffect(() => {
    if (done || feedback) return;
    setShrinkScale(1);
    const start = Date.now();
    const duration = 3000;
    shrinkRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      setShrinkScale(1 - t * 0.44); // 1.0 → 0.56
    }, 50);
    return () => clearInterval(shrinkRef.current);
  }, [idx, done, feedback]);

  useEffect(() => {
    if (!done && spokenRef.current !== idx) {
      spokenRef.current = idx;
      speak("what_animal.mp3");
    }
  }, [idx, done]);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="celebrate" size={120} />
        <h2 className="text-3xl font-bold">Robi is learning!</h2>
        <p className="text-lg opacity-80">You taught Robi {queue.length} animals. Let&apos;s see if Robi can guess!</p>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("lets_guess.mp3").then(() => onComplete(training)); }}>Next →</button>
      </div>
    );
  }

  const Svg = current.Svg;
  const svgSize = Math.round(160 * shrinkScale);

  const pick = (cat: string) => {
    clearInterval(shrinkRef.current);
    if (cat === current.category) {
      sfxCorrect();
      setMood("happy");
      setShowConfetti(true);
      setTraining((t) => ({ ...t, [cat]: (t[cat] || 0) + 1 }));
      setFeedback("✅ Correct! Robi learned a new " + current.label + "!");
      speak("correct_" + current.category + ".mp3").then(() => {
        setFeedback(""); setMood("idle"); setShowConfetti(false);
        setIdx((i) => i + 1);
      });
    } else {
      sfxWrong();
      setMood("confused");
      setFeedback("❌ That's a " + current.label + ", not a " + cat + "!");
      speak("oops_" + current.category + ".mp3").then(() => {
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

      <div className="my-2 p-4 rounded-2xl flex items-center justify-center" style={{
        background: "rgba(255,255,255,0.05)",
        border: `3px solid ${current.color}`,
        width: 180, height: 180,
      }}>
        <div style={{ transition: "transform 0.05s linear", transform: `scale(${shrinkScale})` }}>
          <Svg size={160} />
        </div>
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
