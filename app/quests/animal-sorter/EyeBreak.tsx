"use client";
import { useState, useEffect, useRef } from "react";
import RobotBuddy from "./RobotBuddy";
import { sfxTap } from "./sfx";

const INTERVAL_MS = 10 * 60 * 1000; // 10 min (shorter for hyperopia)
const BREAK_SECONDS = 20;

export default function EyeBreak({ children }: { children: React.ReactNode }) {
  const [breaking, setBreaking] = useState(false);
  const [countdown, setCountdown] = useState(BREAK_SECONDS);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    timer.current = setInterval(() => setBreaking(true), INTERVAL_MS);
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    if (!breaking) return;
    setCountdown(BREAK_SECONDS);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [breaking]);

  if (breaking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-8 fade-in">
        <RobotBuddy mood={countdown > 0 ? "idle" : "celebrate"} size={120} />
        <h2 className="text-3xl font-bold">👀 Eye Break!</h2>
        <p className="text-lg opacity-80 text-center max-w-sm">
          Look at something far away — out the window, across the room!
        </p>
        {countdown > 0 ? (
          <div className="text-6xl font-bold" style={{ color: "var(--accent)" }}>{countdown}</div>
        ) : (
          <button className="btn btn-success" onClick={() => { sfxTap(); setBreaking(false); }}>
            👀 Eyes refreshed! Continue →
          </button>
        )}
        <p className="text-sm opacity-50">This helps your eyes stay healthy!</p>
      </div>
    );
  }

  return <>{children}</>;
}
