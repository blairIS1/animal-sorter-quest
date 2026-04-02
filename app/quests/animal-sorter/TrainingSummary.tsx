"use client";
import { ANIMALS, CATEGORIES, TrainingData } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxTap } from "./sfx";
import { speak } from "./speak";
import { useRobotName } from "./ModeContext";

export default function TrainingSummary({ training, onComplete }: { training: TrainingData; onComplete: () => void }) {
  const rn = useRobotName();
  const total = Object.values(training).reduce((a, b) => a + b, 0);
  const missing = CATEGORIES.filter((c) => !training[c]);

  // Bias detection: if one category has >50% of all data
  const maxCat = CATEGORIES.reduce((a, b) => ((training[a] || 0) > (training[b] || 0) ? a : b));
  const maxCount = training[maxCat] || 0;
  const isBiased = total > 0 && maxCount / total > 0.5;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
      <RobotBuddy mood="thinking" size={100} />
      <h2 className="text-3xl font-bold">🧠 {rn}&apos;s Training Data</h2>
      <p className="text-lg opacity-80 text-center max-w-md">
        You fed {rn} <b>{total}</b> examples. Here&apos;s what {rn}&apos;s brain looks like:
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

      {/* #4 — Bias Warning */}
      {isBiased && (
        <div className="rounded-xl p-4 max-w-sm text-center" style={{ background: "rgba(251,191,36,0.15)", border: "2px solid #fbbf24" }}>
          <p className="text-base font-bold" style={{ color: "#fbbf24" }}>⚠️ Bias Detected!</p>
          <p className="text-sm opacity-80 mt-1">
            Most of {rn}&apos;s data is about <b className="capitalize">{maxCat}s</b> ({Math.round((maxCount / total) * 100)}%).
            That&apos;s called <b>bias</b> — {rn} might think everything is a {maxCat}!
          </p>
          <p className="text-xs opacity-60 mt-1">
            Real AI has this problem too. If you only show it cats, it thinks the whole world is cats!
          </p>
        </div>
      )}

      {!isBiased && missing.length > 0 && (
        <p className="text-base opacity-70 text-center max-w-sm mt-2">
          ⚠️ {rn} has <b>no data</b> for {missing.join(", ")}!
          <br />It might get those wrong...
        </p>
      )}

      {!isBiased && missing.length === 0 && (
        <p className="text-base opacity-70 text-center max-w-sm mt-2">
          {rn} has data for every animal — nice! But more data = smarter AI.
        </p>
      )}

      <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("lets_guess.mp3").then(onComplete); }}>
        Let&apos;s Test {rn}! →
      </button>
    </div>
  );
}
