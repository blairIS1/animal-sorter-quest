"use client";
import { useState } from "react";
import { ANIMALS, GUESS_ROUNDS } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxWrong, sfxTap, sfxThink } from "./sfx";

export default function Phase2({ onComplete }: { onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [corrections, setCorrections] = useState(0);
  const [mood, setMood] = useState<"thinking" | "happy" | "confused">("thinking");

  const round = GUESS_ROUNDS[idx];
  if (!round) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="celebrate" size={120} />
        <h2 className="text-3xl font-bold">Robi is getting smarter!</h2>
        <p className="text-lg opacity-80">You corrected {corrections} mistakes. Robi learned from each one!</p>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); onComplete(corrections); }}>Next → Tricky Round!</button>
      </div>
    );
  }

  const animal = ANIMALS.find((a) => a.id === round.animal)!;
  const guessAnimal = ANIMALS.find((a) => a.id === round.robotGuess)!;
  const Svg = animal.Svg;

  const respond = (correct: boolean) => {
    if (round.correct && correct) {
      sfxCorrect(); setMood("happy");
      setFeedback("✅ Yep! Robi got it right!");
    } else if (round.correct && !correct) {
      sfxThink(); setMood("confused");
      setFeedback("🤔 Actually, Robi WAS right! It's a " + animal.label + "!");
    } else if (!round.correct && !correct) {
      sfxCorrect(); setMood("happy");
      setFeedback("👏 Good catch! It's a " + animal.label + ", not a " + guessAnimal.label + "! " + round.reason);
      setCorrections((c) => c + 1);
    } else {
      sfxWrong(); setMood("confused");
      setFeedback("❌ Hmm, Robi was wrong! It's a " + animal.label + ". " + round.reason);
    }
    setTimeout(() => { setFeedback(""); setMood("thinking"); setIdx((i) => i + 1); }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <h2 className="text-3xl font-bold">🤖 Phase 2: Robi Guesses!</h2>
      <RobotBuddy mood={mood} size={80} />
      <div className="text-sm opacity-70">{idx + 1} / {GUESS_ROUNDS.length}</div>

      <div className="my-2 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `3px solid ${animal.color}` }}>
        <Svg size={120} />
      </div>

      <div className="text-xl text-center">
        Robi: &quot;I think this is a... <b style={{ color: guessAnimal.color }}>{guessAnimal.label}!</b>&quot;
      </div>
      <div className="text-lg min-h-[2em] font-semibold text-center max-w-md">{feedback}</div>

      {!feedback && (
        <div className="flex gap-4 fade-in">
          <button className="btn text-xl" style={{ background: "var(--success)", color: "#0f172a" }} onClick={() => { sfxTap(); respond(true); }}>✅ Correct!</button>
          <button className="btn text-xl" style={{ background: "#ef4444" }} onClick={() => { sfxTap(); respond(false); }}>❌ Wrong!</button>
        </div>
      )}
    </div>
  );
}
