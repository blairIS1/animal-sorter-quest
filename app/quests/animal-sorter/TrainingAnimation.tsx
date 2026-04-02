"use client";
import { useState, useEffect } from "react";
import { TrainingData, CATEGORIES, ANIMALS } from "./data";
import RobotBuddy from "./RobotBuddy";

export default function TrainingAnimation({ training, onComplete }: { training: TrainingData; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");
  const total = Object.values(training).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const steps = 20;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(Math.round((step / steps) * 100));
      if (step >= steps) {
        clearInterval(interval);
        setPhase("done");
        setTimeout(onComplete, 800);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <RobotBuddy mood="thinking" size={120} />
      <h2 className="text-3xl font-bold">
        {phase === "loading" ? "⚙️ Robi is training..." : "✅ Training complete!"}
      </h2>

      <div className="flex gap-2 my-2">
        {CATEGORIES.map((cat) => {
          const count = training[cat] || 0;
          const a = ANIMALS.find((x) => x.category === cat)!;
          const Svg = a.Svg;
          return (
            <div key={cat} className="flex flex-col items-center gap-1" style={{ opacity: count > 0 ? 1 : 0.3 }}>
              <Svg size={28} />
              <span className="text-xs">{count}</span>
            </div>
          );
        })}
      </div>

      <p className="text-lg opacity-70">
        Processing {total} example{total !== 1 ? "s" : ""}...
      </p>

      <div className="progress-track w-72">
        <div className="progress-fill" style={{ width: `${progress}%`, transition: "width 0.15s linear" }} />
      </div>
      <div className="text-sm opacity-50">{progress}%</div>

      {phase === "loading" && (
        <div className="text-sm opacity-50 training-dots">
          Analyzing features ● Building brain ● Learning patterns
        </div>
      )}
    </div>
  );
}
