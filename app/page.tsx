"use client";
import { useState, useEffect } from "react";
import AnimalSorter from "./quests/animal-sorter";
import RobotBuddy from "./quests/animal-sorter/RobotBuddy";
import { sfxTap, sfxCelebrate } from "./quests/animal-sorter/sfx";
import { speak } from "./quests/animal-sorter/speak";
import Confetti from "./quests/animal-sorter/Confetti";
import { Mode } from "./quests/animal-sorter/ModeContext";
import { recordCompletion, getCompletions } from "./quests/animal-sorter/mastery";
import ProgressDashboard from "./quests/animal-sorter/ProgressDashboard";
import EyeBreak from "./quests/animal-sorter/EyeBreak";
import { startMusic, stopMusic } from "./quests/animal-sorter/music";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<Mode>("kid");
  const [completions, setCompletions] = useState(0);

  useEffect(() => { setCompletions(getCompletions()); }, []);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <Confetti active={true} />
        <RobotBuddy mood="celebrate" size={140} />
        <h1 className="text-4xl font-bold text-center">You did it!</h1>
        <p className="text-lg opacity-80 text-center max-w-md">
          You taught your robot to recognize animals — just like real AI engineers!
        </p>
        <ProgressDashboard />
        <p className="text-base opacity-60">🏆 Quests completed: {completions}</p>
        <button className="btn btn-primary mt-4" onClick={() => { sfxTap(); setStarted(false); setDone(false); }}>
          Play Again 🔄
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="idle" size={140} />
        <h1 className="text-4xl font-bold text-center">Animal Sorter Quest</h1>
        <p className="text-lg text-center opacity-70 max-w-md">
          Meet Robi! This baby robot just woke up and doesn&apos;t know any animals. Can you teach it?
        </p>
        {completions > 0 && <p className="text-sm opacity-50">🏆 Quests completed: {completions}</p>}

        {/* Mastery progress */}
        {completions > 0 && <ProgressDashboard />}

        {/* Mode selector */}
        <div className="flex gap-3">
          <button
            className="btn flex flex-col items-center gap-1 px-6 py-3"
            style={{ background: mode === "kid" ? "var(--accent)" : "var(--card)", color: mode === "kid" ? "#0f172a" : "white" }}
            onClick={() => { sfxTap(); setMode("kid"); }}
          >
            <span className="text-2xl">🧒</span>
            <span className="text-sm font-bold">Age 7+</span>
          </button>
          <button
            className="btn flex flex-col items-center gap-1 px-6 py-3"
            style={{ background: mode === "toddler" ? "var(--accent)" : "var(--card)", color: mode === "toddler" ? "#0f172a" : "white" }}
            onClick={() => { sfxTap(); setMode("toddler"); }}
          >
            <span className="text-2xl">👶</span>
            <span className="text-sm font-bold">Age 3+</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 text-left opacity-70 max-w-sm">
          <span>🏷️ Phase 1: Teach Robi what animals are</span>
          <span>🤖 Phase 2: Check if Robi learned correctly</span>
          <span>🤔 Phase 3: Tricky animals that confuse even AI!</span>
          <span>🎨 Phase 4: Draw your own animal!</span>
        </div>
        <div className="rounded-xl p-3 max-w-sm text-center" style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)" }}>
          <span className="text-sm">📏 Hold your tablet at arm&apos;s length — not too close!</span>
        </div>
        <button className="btn btn-primary text-xl mt-2" onClick={() => {
          sfxTap();
          speak("intro.mp3").then(() => {
            startMusic();
            setStarted(true);
          });
        }}>
          Start Quest! 🚀
        </button>
      </div>
    );
  }

  return <EyeBreak><AnimalSorter onComplete={() => { sfxCelebrate(); stopMusic(); setCompletions(recordCompletion(mode)); setDone(true); }} mode={mode} /></EyeBreak>;
}
