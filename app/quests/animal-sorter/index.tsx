"use client";
import { useState } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Phase3 from "./Phase3";
import Phase4 from "./Phase4";
import TrainingSummary from "./TrainingSummary";
import Phase1Eva from "./Phase1Eva";
import Phase2Eva from "./Phase2Eva";
import Phase3Eva from "./Phase3Eva";
import Phase4Eva from "./Phase4Eva";
import { ModeContext, Mode } from "./ModeContext";
import { TrainingData } from "./data";

export default function AnimalSorter({ onComplete, mode }: { onComplete: () => void; mode: Mode }) {
  const [phase, setPhase] = useState(1);
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
          {phase === 1 && <Phase1 onComplete={(data) => { setTraining(data); setPhase(1.5); }} />}
          {phase === 1.5 && <TrainingSummary training={training} onComplete={() => setPhase(2)} />}
          {phase === 2 && <Phase2 training={training} onComplete={() => setPhase(3)} />}
          {phase === 3 && <Phase3 onComplete={() => setPhase(4)} />}
          {phase === 4 && <Phase4 onComplete={onComplete} />}
        </>
      )}
    </ModeContext.Provider>
  );
}
