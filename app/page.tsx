"use client";
import { useState } from "react";
import AnimalSorter from "./quests/animal-sorter";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <div className="text-8xl">🏆</div>
        <h1 className="text-4xl font-bold text-center">You did it!</h1>
        <p className="text-lg opacity-80 text-center max-w-md">
          You taught a robot to recognize animals — just like real AI engineers at Google!
        </p>
        <button className="btn btn-primary mt-4" onClick={() => { setStarted(false); setDone(false); }}>
          Play Again 🔄
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 fade-in">
        <div className="text-8xl">🐾</div>
        <h1 className="text-4xl font-bold text-center">Animal Sorter Quest</h1>
        <p className="text-lg text-center opacity-70 max-w-md">
          A baby robot just woke up and doesn't know any animals. Can you teach it?
        </p>
        <div className="flex flex-col gap-2 text-left opacity-70 max-w-sm">
          <span>🏷️ Phase 1: Teach the robot what animals are</span>
          <span>🤖 Phase 2: Check if the robot learned correctly</span>
          <span>🤔 Phase 3: Tricky animals that confuse even AI!</span>
        </div>
        <button className="btn btn-primary text-xl mt-4" onClick={() => setStarted(true)}>
          Start Quest! 🚀
        </button>
      </div>
    );
  }

  return <AnimalSorter onComplete={() => setDone(true)} />;
}
