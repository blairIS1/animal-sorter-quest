"use client";
import { useRef, useState } from "react";
import RobotBuddy from "./RobotBuddy";
import { sfxTap, sfxCelebrate } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";
import { useRobotName } from "./ModeContext";

const COLORS = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8"];

export default function Phase4Eva({ onComplete }: { onComplete: () => void }) {
  const rn = useRobotName();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#4ade80");
  const [drawing, setDrawing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
    ctx.stroke();
    setDrawing(true);
  };

  const stopDraw = () => { isDrawing.current = false; };

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, 280, 280);
    setDrawing(false);
  };

  const submit = () => {
    sfxTap();
    setSubmitted(true);
    sfxCelebrate();
    speak("thank_you.mp3");
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
        <Confetti active={true} />
        <RobotBuddy mood="celebrate" size={140} />
        <h2 className="text-3xl font-bold">🎨 Wow, beautiful!</h2>
        <p className="text-xl opacity-80">{rn} loves your drawing!</p>
        <button className="btn btn-success mt-4 eva-btn" onClick={() => { sfxTap(); onComplete(); }}>
          Finish! 🎉
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <h2 className="text-2xl font-bold">🎨 Draw for {rn}!</h2>
      <RobotBuddy mood="happy" size={80} />

      <canvas
        ref={canvasRef} width={280} height={280}
        style={{ borderRadius: 16, background: "#1e293b", border: "4px solid var(--accent)", touchAction: "none", cursor: "crosshair" }}
        onPointerDown={startDraw} onPointerMove={draw} onPointerUp={stopDraw} onPointerLeave={stopDraw}
      />

      <div className="flex gap-4">
        {COLORS.map((c) => (
          <button key={c} onClick={() => setColor(c)} style={{
            width: 44, height: 44, borderRadius: "50%", background: c,
            border: color === c ? "4px solid white" : "4px solid transparent",
          }} />
        ))}
      </div>

      <button className="text-sm opacity-70 underline" onClick={clear}>Clear</button>

      <button
        className="btn btn-primary mt-2 eva-btn"
        style={{ opacity: drawing ? 1 : 0.4 }}
        disabled={!drawing}
        onClick={submit}
      >
        Show {rn}! 🤖
      </button>
    </div>
  );
}
