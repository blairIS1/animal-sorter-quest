"use client";
import { useState, useEffect, useRef } from "react";
import { TRICKY_ROUNDS, ANIMALS } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxWrong, sfxTap, sfxCelebrate } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";
import { recordResult } from "./mastery";
import { useRobotName } from "./ModeContext";

export default function Phase3({ onComplete }: { onComplete: (score: number) => void }) {
  const rn = useRobotName();
  const [rounds] = useState(() => [...TRICKY_ROUNDS].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [mood, setMood] = useState<"confused" | "happy" | "celebrate">("confused");
  const spokenRef = useRef(-1);
  const done = idx >= rounds.length;
  const [showConfetti, setShowConfetti] = useState(false);

  const TRICKY_AUDIO: Record<string, string> = { Fox: "not_sure_fox.mp3", Penguin: "not_sure_penguin.mp3", Bat: "not_sure_bat.mp3", Turtle: "not_sure_turtle.mp3", Seal: "not_sure_seal.mp3" };
  const REASON_AUDIO: Record<string, string> = { "Foxes are in the dog family!": "foxes_dog.mp3", "Penguins are birds that swim!": "penguins_bird.mp3", "Bats are mammals, not birds!": "bats_mammal.mp3", "Turtles live on land too — not a fish!": "turtles_land.mp3", "Seals are closer to dogs than fish!": "seals_dog.mp3" };

  useEffect(() => {
    if (!done && spokenRef.current !== idx) {
      spokenRef.current = idx;
      speak(TRICKY_AUDIO[rounds[idx].label] || "not_sure_fox.mp3");
    }
  }, [idx, done]);

  if (done) {
    const pct = Math.round((score / rounds.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="celebrate" size={140} />
        <h2 className="text-3xl font-bold text-center">Quest Complete!</h2>
        <p className="text-xl">{rn}&apos;s brain is <b>{pct}%</b> accurate!</p>
        <p className="text-lg opacity-80 text-center max-w-md">
          Even tricky animals are hard for AI! Real AI learns from millions of photos — just like you taught {rn} today!
        </p>
        <div className="progress-track w-64">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("thank_you.mp3").then(() => onComplete(score)); }}>🏠 Back to Menu</button>
      </div>
    );
  }

  const round = rounds[idx];
  const advance = () => { setFeedback(""); setMood("confused"); setShowConfetti(false); setIdx((i) => i + 1); };

  const pick = (choice: string) => {
    sfxTap();
    if (choice === round.answer) {
      setScore((s) => s + 1);
      sfxCorrect(); setMood("happy"); setShowConfetti(true);
      recordResult(round.label.toLowerCase(), true);
      setFeedback("✅ " + round.reason);
      speak(REASON_AUDIO[round.reason] || "foxes_dog.mp3").then(advance);
    } else {
      sfxWrong(); setMood("confused");
      recordResult(round.label.toLowerCase(), false);
      setFeedback("❌ " + round.reason);
      speak("not_quite.mp3").then(() => speak(REASON_AUDIO[round.reason] || "foxes_dog.mp3")).then(advance);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <Confetti active={showConfetti} />
      <h2 className="text-3xl font-bold">🤔 Phase 3: Tricky Animals!</h2>
      <RobotBuddy mood={mood} size={80} />
      <div className="text-sm opacity-70">{idx + 1} / {rounds.length}</div>

      <div className="text-8xl my-2">{round.emoji}</div>
      <div className="text-2xl font-semibold">{round.label}</div>
      <div className="text-lg opacity-70">{rn}: &quot;Hmm... I&apos;m not sure about this one!&quot;</div>
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
