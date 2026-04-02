"use client";
import { useState, useRef } from "react";
import { FEATURES, CATEGORIES, ANIMALS } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxTap, sfxCorrect, sfxCelebrate } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";
import { useRobotName } from "./ModeContext";

const COLORS = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c", "#f472b6", "#ffffff"];

const ALL_FEATURES = ["Has fur", "Has feathers", "Has scales", "Has wings", "Has fins", "Four legs", "Two legs", "No legs", "Lives in water", "Hops", "Small", "Medium"];

// Simple feature-matching classifier — pick the category with most matching features
function classify(selected: string[]): { guess: string; confidence: number; reasoning: string[] } {
  let best = "cat";
  let bestScore = 0;
  const reasoning: string[] = [];

  for (const cat of CATEGORIES) {
    const feat = FEATURES[cat];
    const matches = feat.has.filter((f) => selected.includes(f));
    const score = matches.length;
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }

  const feat = FEATURES[best];
  for (const f of selected) {
    if (feat.has.includes(f)) reasoning.push(`✅ ${f} → matches ${best}`);
    else reasoning.push(`⚠️ ${f} → doesn't match`);
  }

  const confidence = selected.length === 0 ? 10 : Math.min(95, Math.round((bestScore / selected.length) * 100));
  return { guess: best, confidence, reasoning };
}

export default function Phase4({ onComplete }: { onComplete: () => void }) {
  const rn = useRobotName();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#4ade80");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [step, setStep] = useState<"draw" | "features" | "result">("draw");
  const [result, setResult] = useState<{ guess: string; confidence: number; reasoning: string[] } | null>(null);
  const isDrawing = useRef(false);

  const startDraw = (e: React.PointerEvent) => {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const r = canvasRef.current!.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const r = canvasRef.current!.getBoundingClientRect();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
    ctx.stroke();
    setDrawing(true);
  };

  const stopDraw = () => { isDrawing.current = false; };

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, 250, 250);
    setDrawing(false);
  };

  const toggleFeature = (f: string) => {
    setSelectedFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const submitFeatures = () => {
    sfxTap();
    const r = classify(selectedFeatures);
    setResult(r);
    setStep("result");
    sfxCelebrate();
  };

  if (step === "result" && result) {
    const guessAnimal = ANIMALS.find((a) => a.id === result.guess)!;
    const GuessIcon = guessAnimal.Svg;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
        <Confetti active={true} />
        <RobotBuddy mood="celebrate" size={100} />
        <h2 className="text-2xl font-bold">🚀 {rn}&apos;s Deployment Result</h2>

        <div className="flex items-center gap-3">
          <GuessIcon size={48} />
          <span className="text-xl">{rn} thinks your <b>{name || "animal"}</b> is a <b style={{ color: guessAnimal.color }}>{guessAnimal.label}</b>!</span>
        </div>

        <div className="text-lg">Confidence: <b>{result.confidence}%</b></div>

        <div className="rounded-xl p-3 text-sm max-w-sm" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="text-xs opacity-50 mb-2">{rn}&apos;s reasoning:</div>
          {result.reasoning.map((r, i) => <div key={i}>{r}</div>)}
        </div>

        <p className="text-base opacity-70 text-center max-w-sm">
          {result.confidence >= 70
            ? `${rn} is pretty confident! The features matched well.`
            : `${rn} isn't sure — the features didn't match any animal perfectly. Real AI struggles with new things too!`}
        </p>

        <p className="text-sm opacity-50 text-center max-w-sm">
          Now {rn} knows what a <b>{name || "new animal"}</b> looks like. You just deployed AI to the real world! 🌍
        </p>

        <button className="btn btn-success mt-2" onClick={() => { sfxTap(); speak("thank_you.mp3").then(onComplete); }}>
          Finish Quest! 🎉
        </button>
      </div>
    );
  }

  if (step === "features") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
        <h2 className="text-2xl font-bold">🔍 Describe Your Animal</h2>
        <RobotBuddy mood="thinking" size={80} />
        <p className="text-sm opacity-70 text-center max-w-sm">
          Pick the features your <b>{name}</b> has. {rn} will use these to classify it!
        </p>

        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {ALL_FEATURES.map((f) => (
            <button key={f} className="rounded-full px-3 py-1.5 text-sm font-semibold" style={{
              background: selectedFeatures.includes(f) ? "rgba(74,222,128,0.3)" : "var(--card)",
              border: selectedFeatures.includes(f) ? "2px solid #4ade80" : "2px solid transparent",
            }} onClick={() => { sfxTap(); toggleFeature(f); }}>
              {selectedFeatures.includes(f) ? "✅" : "⬜"} {f}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary mt-2"
          style={{ opacity: selectedFeatures.length > 0 ? 1 : 0.4 }}
          disabled={selectedFeatures.length === 0}
          onClick={submitFeatures}
        >
          Let {rn} Classify! 🤖
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <h2 className="text-2xl font-bold">🚀 Phase 4: Deploy {rn}!</h2>
      <RobotBuddy mood="thinking" size={80} />
      <p className="opacity-70 text-center max-w-sm text-sm">
        A new animal arrived! Draw it, name it, and {rn} will try to classify it using what it learned.
      </p>

      <canvas
        ref={canvasRef} width={250} height={250}
        style={{ borderRadius: 16, background: "#1e293b", border: "3px solid var(--accent)", touchAction: "none", cursor: "crosshair" }}
        onPointerDown={startDraw} onPointerMove={draw} onPointerUp={stopDraw} onPointerLeave={stopDraw}
      />

      <div className="flex gap-2">
        {COLORS.map((c) => (
          <button key={c} onClick={() => setColor(c)} style={{
            width: 32, height: 32, borderRadius: "50%", background: c,
            border: color === c ? "3px solid white" : "3px solid transparent",
          }} />
        ))}
      </div>

      <button className="text-sm opacity-70 underline" onClick={clear}>Clear drawing</button>

      <input
        type="text" placeholder="Name your animal..." value={name}
        onChange={(e) => setName(e.target.value)} maxLength={20}
        style={{ background: "var(--card)", border: "2px solid var(--accent)", borderRadius: 12, padding: "10px 16px", color: "white", fontSize: "1.1rem", textAlign: "center", width: 220 }}
      />

      <button
        className="btn btn-primary mt-2"
        style={{ opacity: drawing && name.trim() ? 1 : 0.4 }}
        disabled={!drawing || !name.trim()}
        onClick={() => { sfxTap(); setStep("features"); }}
      >
        Next: Describe It →
      </button>
    </div>
  );
}
