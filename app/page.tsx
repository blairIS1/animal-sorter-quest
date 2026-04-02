"use client";
import { useState } from "react";
import AnimalSorter from "./quests/animal-sorter";
import RobotBuddy from "./quests/animal-sorter/RobotBuddy";
import { sfxTap, sfxCelebrate } from "./quests/animal-sorter/sfx";
import { speak } from "./quests/animal-sorter/speak";
import Confetti from "./quests/animal-sorter/Confetti";
import { Mode } from "./quests/animal-sorter/ModeContext";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<Mode>("baker");

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <Confetti active={true} />
        <RobotBuddy mood="celebrate" size={140} />
        <h1 className="text-4xl font-bold text-center">You did it!</h1>
        <p className="text-lg opacity-80 text-center max-w-md">
          You taught Robi to recognize animals — just like real AI engineers at Google!
        </p>
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

        {/* Mode selector */}
        <div className="flex gap-3">
          <button
            className="btn flex flex-col items-center gap-1 px-6 py-3"
            style={{ background: mode === "baker" ? "var(--accent)" : "var(--card)", color: mode === "baker" ? "#0f172a" : "white" }}
            onClick={() => { sfxTap(); setMode("baker"); }}
          >
            <span className="text-2xl">🧒</span>
            <span className="text-sm font-bold">Baker Mode</span>
            <span className="text-xs opacity-70">Age 7+</span>
          </button>
          <button
            className="btn flex flex-col items-center gap-1 px-6 py-3"
            style={{ background: mode === "eva" ? "var(--accent)" : "var(--card)", color: mode === "eva" ? "#0f172a" : "white" }}
            onClick={() => { sfxTap(); setMode("eva"); }}
          >
            <span className="text-2xl">👶</span>
            <span className="text-sm font-bold">Eva Mode</span>
            <span className="text-xs opacity-70">Age 3+</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 text-left opacity-70 max-w-sm">
          <span>🏷️ Phase 1: Teach Robi what animals are</span>
          <span>🤖 Phase 2: Check if Robi learned correctly</span>
          <span>🤔 Phase 3: Tricky animals that confuse even AI!</span>
          <span>🎨 Phase 4: Draw your own animal!</span>
        </div>
        <button className="btn btn-primary text-xl mt-2" onClick={() => {
          sfxTap();
          speak("intro.mp3").then(() => {
            setStarted(true);
          });
        }}>
          Start Quest! 🚀
        </button>
      </div>
    );
  }

  return <AnimalSorter onComplete={() => { sfxCelebrate(); setDone(true); }} mode={mode} />;
}
