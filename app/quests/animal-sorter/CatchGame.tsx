"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ANIMALS } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxTap } from "./sfx";
import Confetti from "./Confetti";

const ROUNDS = 3;
const SPEED_MS = 4000; // time to cross screen

export default function CatchGame({ onComplete }: { onComplete: () => void }) {
  const [round, setRound] = useState(0);
  const [caught, setCaught] = useState(0);
  const [posX, setPosX] = useState(-15);
  const [animal, setAnimal] = useState(() => ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
  const [tapped, setTapped] = useState(false);
  const [done, setDone] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const dirRef = useRef(Math.random() > 0.5 ? 1 : -1); // random direction

  const startRound = useCallback(() => {
    const a = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const dir = Math.random() > 0.5 ? 1 : -1;
    dirRef.current = dir;
    setAnimal(a);
    setTapped(false);
    setPosX(dir === 1 ? -15 : 115);

    const start = Date.now();
    clearInterval(animRef.current);
    animRef.current = setInterval(() => {
      const t = (Date.now() - start) / SPEED_MS;
      if (t >= 1) {
        clearInterval(animRef.current);
        // Missed — move to next round
        setRound((r) => {
          const next = r + 1;
          if (next >= ROUNDS) { setDone(true); return next; }
          return next;
        });
        return;
      }
      const x = dir === 1 ? -15 + t * 130 : 115 - t * 130;
      setPosX(x);
    }, 30);
  }, []);

  useEffect(() => {
    startRound();
    return () => clearInterval(animRef.current);
  }, [startRound]);

  // Start next round when round changes (but not on mount or done)
  const prevRound = useRef(0);
  useEffect(() => {
    if (round > prevRound.current && !done) {
      prevRound.current = round;
      setTimeout(startRound, 500);
    }
  }, [round, done, startRound]);

  const handleTap = () => {
    if (tapped) return;
    setTapped(true);
    clearInterval(animRef.current);
    sfxCorrect();
    setCaught((c) => c + 1);
    setTimeout(() => {
      setRound((r) => {
        const next = r + 1;
        if (next >= ROUNDS) { setDone(true); return next; }
        return next;
      });
    }, 600);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
        <Confetti active={caught > 0} />
        <RobotBuddy mood="celebrate" size={100} />
        <h2 className="text-2xl font-bold">👀 You caught {caught}/{ROUNDS}!</h2>
        <p className="text-base opacity-70">Great eye tracking!</p>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); onComplete(); }}>
          Continue →
        </button>
      </div>
    );
  }

  const Svg = animal.Svg;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <h2 className="text-2xl font-bold">👀 Catch the Animal!</h2>
      <RobotBuddy mood="happy" size={60} />
      <p className="text-sm opacity-60">Tap the animal as it runs by! ({round + 1}/{ROUNDS})</p>

      <div className="relative w-full overflow-hidden" style={{ height: 160, maxWidth: 500 }}>
        <button
          onClick={handleTap}
          disabled={tapped}
          className="absolute"
          style={{
            left: `${posX}%`,
            top: "50%",
            transform: `translateY(-50%) scaleX(${dirRef.current === 1 ? 1 : -1}) ${tapped ? "scale(1.3)" : ""}`,
            transition: tapped ? "transform 0.3s" : undefined,
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            opacity: tapped ? 0.5 : 1,
          }}
        >
          <Svg size={80} />
        </button>
      </div>

      {tapped && <div className="text-xl font-bold fade-in" style={{ color: "var(--success)" }}>⭐ Caught!</div>}
    </div>
  );
}
