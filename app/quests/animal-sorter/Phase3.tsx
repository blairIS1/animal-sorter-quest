"use client";
import { useState, useEffect } from "react";
import { TRICKY_ROUNDS, ANIMALS } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxWrong, sfxTap, sfxCelebrate } from "./sfx";
import { speak } from "./speak";

export default function Phase3({ onComplete }: { onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<"confused" | "happy" | "celebrate">("confused");

  useEffect(() => { if (TRICKY_ROUNDS[idx]) speak("Hmm, I'm not sure about this " + TRICKY_ROUNDS[idx].label); }, [idx]);

  const round = TRICKY_ROUNDS[idx];
  if (!round) {
    const pct = Math.round((score / TRICKY_ROUNDS.length) * 100);
    sfxCelebrate();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="celebrate" size={140} />
        <h2 className="text-3xl font-bold text-center">Quest Complete!</h2>
        <p className="text-xl">Robi&apos;s brain is <b>{pct}%</b> accurate!</p>
        <p className="text-lg opacity-80 text-center max-w-md">
          Even tricky animals are hard for AI! Real Google AI learns from millions of photos — just like you taught Robi today!
        </p>
        <div className="progress-track w-64">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); onComplete(score); }}>🏠 Back to Menu</button>
      </div>
    );
  }

  const pick = (choice: string) => {
    sfxTap();
    if (choice === round.answer) {
      setScore((s) => s + 1);
      sfxCorrect(); setMood("happy");
      setFeedback("✅ " + round.reason);
      speak(round.reason);
    } else {
      sfxWrong(); setMood("confused");
      setFeedback("❌ " + round.reason);
      speak("Not quite! " + round.reason);
    }
    setTimeout(() => { setFeedback(""); setMood("confused"); setIdx((i) => i + 1); }, 2200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <h2 className="text-3xl font-bold">🤔 Phase 3: Tricky Animals!</h2>
      <RobotBuddy mood={mood} size={80} />
      <div className="text-sm opacity-70">{idx + 1} / {TRICKY_ROUNDS.length}</div>

      <div className="text-8xl my-2">{round.emoji}</div>
      <div className="text-2xl font-semibold">{round.label}</div>
      <div className="text-lg opacity-70">Robi: &quot;Hmm... I&apos;m not sure about this one!&quot;</div>
      <div className="text-lg min-h-[2em] font-semibold text-center max-w-md">{feedback}</div>

      {!feedback && (
        <div className="flex gap-4 fade-in">
          {round.options.map((opt) => {
            const a = ANIMALS.find((x) => x.id === opt)!;
            const BtnSvg = a.Svg;
            return (
              <button key={opt} className="btn flex flex-col items-center gap-2 px-8 py-4" style={{ background: "var(--card)" }} onClick={() => pick(opt)}>
                <BtnSvg size={48} />
                <span className="capitalize">{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
