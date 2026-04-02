"use client";
import { ANIMALS, CATEGORIES, TrainingData } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxTap } from "./sfx";
import { speak } from "./speak";

export default function TrainingSummary({ training, onComplete }: { training: TrainingData; onComplete: () => void }) {
  const total = Object.values(training).reduce((a, b) => a + b, 0);
  const missing = CATEGORIES.filter((c) => !training[c]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <RobotBuddy mood="thinking" size={100} />
      <h2 className="text-3xl font-bold">🧠 Robi&apos;s Training Data</h2>
      <p className="text-lg opacity-80 text-center max-w-md">
        You fed Robi <b>{total}</b> examples. Here&apos;s what Robi&apos;s brain looks like:
      </p>

      <div className="flex flex-col gap-3 w-72">
        {CATEGORIES.map((cat) => {
          const count = training[cat] || 0;
          const a = ANIMALS.find((x) => x.category === cat)!;
          const Svg = a.Svg;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={cat} className="flex items-center gap-3">
              <Svg size={32} />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{cat}</span>
                  <span>{count === 0 ? "⚠️ no data!" : `${count} example${count > 1 ? "s" : ""}`}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: count === 0 ? "#ef4444" : undefined,
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {missing.length > 0 && (
        <p className="text-base opacity-70 text-center max-w-sm mt-2">
          ⚠️ Robi has <b>no data</b> for {missing.map((m) => m).join(", ")}!
          <br />It might get those wrong...
        </p>
      )}

      {missing.length === 0 && (
        <p className="text-base opacity-70 text-center max-w-sm mt-2">
          Robi has data for every animal — nice! But more data = smarter AI.
        </p>
      )}

      <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("lets_guess.mp3").then(onComplete); }}>
        Let&apos;s Test Robi! →
      </button>
    </div>
  );
}
