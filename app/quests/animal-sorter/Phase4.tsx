"use client";
import { useState, useRef } from "react";
import RobotBuddy from "./RobotBuddy";
import { sfxTap, sfxCorrect, sfxCelebrate } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";

const COLORS = ["#f87171", "#fbbf24", "#4ade80", "#38bdf8", "#a78bfa", "#fb923c", "#f472b6", "#ffffff"];

export default function Phase4({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#4ade80");
  const [submitted, setSubmitted] = useState(false);
  const [robiGuess, setRobiGuess] = useState("");
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

  const submit = () => {
    if (!name.trim()) return;
    sfxTap();
    const guesses = ["a fluffy cloud", "a super cool dragon", "a wiggly worm", "a baby dinosaur", "a space alien", "a magical unicorn"];
    const guess = guesses[Math.floor(Math.random() * guesses.length)];
    setRobiGuess(guess);
    setSubmitted(true);
    speak("Hmm, is that " + guess + "? No wait, you said it's a " + name + "! I'll remember that! " + name + " is now in my brain!").then(() => {
      sfxCelebrate();
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
        <Confetti active={true} />
        <RobotBuddy mood="celebrate" size={120} />
        <h2 className="text-3xl font-bold">Robi learned: {name}!</h2>
        <p className="text-lg opacity-80 text-center max-w-md">
          Robi thought it was {robiGuess}... but now Robi knows it&apos;s a <b>{name}</b>! You just taught AI something brand new!
        </p>
        <canvas ref={canvasRef} width={250} height={250} style={{ borderRadius: 16, background: "#1e293b", border: "3px solid var(--accent)" }} />
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("Thank you for everything! You're an amazing teacher!").then(onComplete); }}>
          Finish Quest! 🎉
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <h2 className="text-3xl font-bold">🎨 Phase 4: Create Your Own!</h2>
      <RobotBuddy mood="thinking" size={80} />
      <p className="opacity-70 text-center max-w-md">
        Draw a new animal and name it! Robi will try to guess what it is.
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
        onClick={submit}
      >
        Show Robi! 🤖
      </button>
    </div>
  );
}
