"use client";
import { useState, useEffect } from "react";
import { ANIMALS, CATEGORIES } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxWrong, sfxTap, sfxCelebrate } from "./sfx";
import { speak } from "./speak";

const shuffled = [...ANIMALS, ...ANIMALS].sort(() => Math.random() - 0.5).slice(0, 8);

export default function Phase1({ onComplete }: { onComplete: () => void }) {
  const [queue, setQueue] = useState(shuffled);
  const [sorted, setSorted] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<"idle" | "happy" | "confused" | "celebrate">("idle");

  const current = queue[0];
  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="celebrate" size={120} />
        <h2 className="text-3xl font-bold">Robi is learning!</h2>
        <p className="text-lg opacity-80">You taught Robi {sorted} animals. Let&apos;s see if Robi can guess!</p>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("Let's see if I can guess now!"); onComplete(); }}>Next →</button>
      </div>
    );
  }

  const Svg = current.Svg;

  useEffect(() => { speak("What animal is this?"); }, [current.id]);

  const pick = (cat: string) => {
    const correct = cat === current.category;
    if (correct) {
      sfxCorrect();
      setMood("happy");
      setFeedback("✅ Correct! Robi learned a new " + current.label + "!");
      speak("Correct! I learned a new " + current.label + "!").then(() => {
        setFeedback(""); setMood("idle");
        setQueue((q) => q.slice(1));
        setSorted((s) => s + 1);
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
      <h2 className="text-3xl font-bold">🏷️ Phase 1: Teach Robi!</h2>
      <RobotBuddy mood={mood} size={80} />
      <div className="text-sm opacity-70">{sorted} / {shuffled.length} taught</div>
      <div className="progress-track w-64">
        <div className="progress-fill" style={{ width: `${(sorted / shuffled.length) * 100}%` }} />
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
