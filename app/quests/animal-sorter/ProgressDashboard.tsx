"use client";
import { useEffect, useState } from "react";
import { ANIMALS, TRICKY_ROUNDS } from "./data";
import { loadMastery, getMasteryLevel, type MasteryData } from "./mastery";

const LEVEL_CONFIG = {
  new:      { color: "#475569", bg: "rgba(71,85,105,0.2)", label: "New",       icon: "❓" },
  learning: { color: "#fbbf24", bg: "rgba(251,191,36,0.15)", label: "Learning", icon: "📖" },
  familiar: { color: "#38bdf8", bg: "rgba(56,189,248,0.15)", label: "Familiar", icon: "💡" },
  mastered: { color: "#4ade80", bg: "rgba(74,222,128,0.15)", label: "Mastered", icon: "⭐" },
};

const ALL_TRACKABLE = [
  ...ANIMALS.map((a) => ({ id: a.id, label: a.label, Svg: a.Svg, color: a.color })),
  ...TRICKY_ROUNDS.map((t) => ({ id: t.label.toLowerCase(), label: t.label, emoji: t.emoji, color: "#94a3b8" })),
];

export default function ProgressDashboard() {
  const [mastery, setMastery] = useState<MasteryData | null>(null);

  useEffect(() => { setMastery(loadMastery()); }, []);

  if (!mastery) return null;

  const total = ALL_TRACKABLE.length;
  const masteredCount = ALL_TRACKABLE.filter((a) => getMasteryLevel(a.id) === "mastered").length;
  const pct = total > 0 ? Math.round((masteredCount / total) * 100) : 0;

  return (
    <div className="w-full max-w-sm">
      {/* Overall progress */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm opacity-60">Mastery:</span>
        <div className="progress-track flex-1">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-bold">{masteredCount}/{total}</span>
      </div>

      {/* Animal cards */}
      <div className="flex flex-wrap justify-center gap-2">
        {ALL_TRACKABLE.map((item) => {
          const level = getMasteryLevel(item.id);
          const cfg = LEVEL_CONFIG[level];
          const data = mastery.animals[item.id];
          const streak = data ? `${data.correct}/${data.total}` : "—";

          return (
            <div key={item.id} className="flex flex-col items-center gap-1 rounded-xl p-2" style={{
              background: cfg.bg,
              border: `2px solid ${cfg.color}`,
              width: 72,
              opacity: level === "new" ? 0.5 : 1,
              transition: "opacity 0.3s",
            }}>
              {"Svg" in item ? <item.Svg size={32} /> : <span className="text-2xl">{item.emoji}</span>}
              <span className="text-xs font-semibold">{item.label}</span>
              <span className="text-xs" style={{ color: cfg.color }}>{cfg.icon} {streak}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 mt-2">
        {(["new", "learning", "familiar", "mastered"] as const).map((l) => (
          <span key={l} className="text-xs opacity-60">
            {LEVEL_CONFIG[l].icon} {LEVEL_CONFIG[l].label}
          </span>
        ))}
      </div>
    </div>
  );
}
