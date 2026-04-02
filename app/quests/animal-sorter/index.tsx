"use client";
import { useState } from "react";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Phase3 from "./Phase3";
import Phase4 from "./Phase4";
import { ModeContext, Mode } from "./ModeContext";

export default function AnimalSorter({ onComplete, mode }: { onComplete: () => void; mode: Mode }) {
  const [phase, setPhase] = useState(1);

  return (
    <ModeContext.Provider value={mode}>
      {phase === 1 && <Phase1 onComplete={() => setPhase(2)} />}
      {phase === 2 && <Phase2 onComplete={() => setPhase(3)} />}
      {phase === 3 && <Phase3 onComplete={() => setPhase(4)} />}
      {phase === 4 && <Phase4 onComplete={onComplete} />}
    </ModeContext.Provider>
  );
}
