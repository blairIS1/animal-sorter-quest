"use client";
import { useState, useEffect, useRef } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Phase3 from "./Phase3";
import Phase4 from "./Phase4";
import TrainingAnimation from "./TrainingAnimation";
import TrainingSummary from "./TrainingSummary";
import CatchGame from "./CatchGame";
import Phase1Eva from "./Phase1Eva";
import Phase2Eva from "./Phase2Eva";
import Phase3Eva from "./Phase3Eva";
import Phase4Eva from "./Phase4Eva";
import { ModeContext, Mode } from "./ModeContext";
import { TrainingData } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxTap } from "./sfx";

const SESSION_LIMIT_MS = 12 * 60 * 1000; // 12 minutes

type Phase = "train" | "animate" | "summary" | "catch1" | "test" | "catch2" | "tricky" | "draw";

export default function AnimalSorter({ onComplete, mode }: { onComplete: () => void; mode: Mode }) {
  const [phase, setPhase] = useState<Phase | number>(mode === "toddler" ? 1 : "train");
  const [training, setTraining] = useState<TrainingData>({});
  const [resting, setResting] = useState(false);
  const startTime = useRef(Date.now());

  // Check session limit between phases
  const nextPhase = (next: Phase | number) => {
    if (Date.now() - startTime.current > SESSION_LIMIT_MS) {
      setResting(true);
    } else {
      setPhase(next);
    }
  };

  // Rest screen
  if (resting) {
    return (
      <ModeContext.Provider value={mode}>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
          <RobotBuddy mood="idle" size={120} />
          <h2 className="text-3xl font-bold text-center">Robi needs a rest! 😴</h2>
          <p className="text-lg opacity-80 text-center max-w-md">
            Great job! You&apos;ve been playing for a while. Take a break — run around, get a snack, and come back later!
          </p>
          <button className="btn btn-success mt-4" onClick={() => { sfxTap(); onComplete(); }}>
            🏠 Back to Menu
          </button>
        </div>
      </ModeContext.Provider>
    );
  }

  return (
    <ModeContext.Provider value={mode}>
      {mode === "toddler" ? (
        <>
          {phase === 1 && <Phase1Eva onComplete={() => nextPhase(2)} />}
          {phase === 2 && <Phase2Eva onComplete={() => nextPhase(3)} />}
          {phase === 3 && <Phase3Eva onComplete={() => nextPhase(4)} />}
          {phase === 4 && <Phase4Eva onComplete={onComplete} />}
        </>
      ) : (
        <>
          {phase === "train" && (
            <Phase1 onComplete={(data) => {
              setTraining((prev) => {
                const merged = { ...prev };
                for (const [k, v] of Object.entries(data)) merged[k] = (merged[k] || 0) + v;
                return merged;
              });
              nextPhase("animate");
            }} />
          )}
          {phase === "animate" && <TrainingAnimation training={training} onComplete={() => nextPhase("summary")} />}
          {phase === "summary" && <TrainingSummary training={training} onComplete={() => nextPhase("catch1")} />}
          {phase === "catch1" && <CatchGame onComplete={() => nextPhase("test")} />}
          {phase === "test" && (
            <Phase2 training={training} onComplete={(needsRetrain) => {
              if (needsRetrain) {
                nextPhase("train");
              } else {
                nextPhase("catch2");
              }
            }} />
          )}
          {phase === "catch2" && <CatchGame onComplete={() => nextPhase("tricky")} />}
          {phase === "tricky" && <Phase3 onComplete={() => nextPhase("draw")} />}
          {phase === "draw" && <Phase4 onComplete={onComplete} />}
        </>
      )}
    </ModeContext.Provider>
  );
}
