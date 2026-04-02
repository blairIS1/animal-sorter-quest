"use client";
import { useState } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Phase3 from "./Phase3";
import Phase4 from "./Phase4";
import TrainingAnimation from "./TrainingAnimation";
import TrainingSummary from "./TrainingSummary";
import Phase1Eva from "./Phase1Eva";
import Phase2Eva from "./Phase2Eva";
import Phase3Eva from "./Phase3Eva";
import Phase4Eva from "./Phase4Eva";
import { ModeContext, Mode } from "./ModeContext";
import { TrainingData } from "./data";

type Phase = "train" | "animate" | "summary" | "test" | "tricky" | "draw";

export default function AnimalSorter({ onComplete, mode }: { onComplete: () => void; mode: Mode }) {
  const [phase, setPhase] = useState<Phase | number>(mode === "eva" ? 1 : "train");
  const [training, setTraining] = useState<TrainingData>({});

  return (
    <ModeContext.Provider value={mode}>
      {mode === "eva" ? (
        <>
          {phase === 1 && <Phase1Eva onComplete={() => setPhase(2)} />}
          {phase === 2 && <Phase2Eva onComplete={() => setPhase(3)} />}
          {phase === 3 && <Phase3Eva onComplete={() => setPhase(4)} />}
          {phase === 4 && <Phase4Eva onComplete={onComplete} />}
        </>
      ) : (
        <>
          {phase === "train" && (
            <Phase1 onComplete={(data) => {
              // Merge with existing training data for retrain loop
              setTraining((prev) => {
                const merged = { ...prev };
                for (const [k, v] of Object.entries(data)) merged[k] = (merged[k] || 0) + v;
                return merged;
              });
              setPhase("animate");
            }} />
          )}
          {phase === "animate" && <TrainingAnimation training={training} onComplete={() => setPhase("summary")} />}
          {phase === "summary" && <TrainingSummary training={training} onComplete={() => setPhase("test")} />}
          {phase === "test" && (
            <Phase2 training={training} onComplete={(needsRetrain) => {
              if (needsRetrain) {
                setPhase("train"); // #3 — retrain loop, keeps existing training data
              } else {
                setPhase("tricky");
              }
            }} />
          )}
          {phase === "tricky" && <Phase3 onComplete={() => setPhase("draw")} />}
          {phase === "draw" && <Phase4 onComplete={onComplete} />}
        </>
      )}
    </ModeContext.Provider>
  );
}
