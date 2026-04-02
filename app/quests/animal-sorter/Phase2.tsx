"use client";
import { useState, useEffect, useRef } from "react";
import { ANIMALS, GUESS_ROUNDS } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxWrong, sfxTap, sfxThink } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";

export default function Phase2({ onComplete }: { onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [corrections, setCorrections] = useState(0);
  const [mood, setMood] = useState<"thinking" | "happy" | "confused">("thinking");
  const spokenRef = useRef(-1);
  const done = idx >= GUESS_ROUNDS.length;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!done && spokenRef.current !== idx) {
      spokenRef.current = idx;
      const g = ANIMALS.find((a) => a.id === GUESS_ROUNDS[idx].robotGuess)!;
      speak("think_" + g.category + ".mp3");
    }
  }, [idx, done]);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="celebrate" size={120} />
        <h2 className="text-3xl font-bold">Robi is getting smarter!</h2>
        <p className="text-lg opacity-80">You corrected {corrections} mistakes. Robi learned from each one!</p>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("tricky_round.mp3").then(() => onComplete(corrections)); }}>Next → Tricky Round!</button>
      </div>
    );
  }

  const round = GUESS_ROUNDS[idx];
  const animal = ANIMALS.find((a) => a.id === round.animal)!;
  const guessAnimal = ANIMALS.find((a) => a.id === round.robotGuess)!;
  const Svg = animal.Svg;

  const advance = () => { setFeedback(""); setMood("thinking"); setShowConfetti(false); setIdx((i) => i + 1); };

  const respond = (correct: boolean) => {
    if (round.correct && correct) {
      sfxCorrect(); setMood("happy"); setShowConfetti(true);
      setFeedback("✅ Yep! Robi got it right!");
      speak("got_it_right.mp3").then(advance);
    } else if (round.correct && !correct) {
      sfxThink(); setMood("confused");
      setFeedback("🤔 Actually, Robi WAS right! It's a " + animal.label + "!");
      speak("was_right.mp3").then(advance);
    } else if (!round.correct && !correct) {
      sfxCorrect(); setMood("happy"); setShowConfetti(true);
      setFeedback("👏 Good catch! " + round.reason);
      speak("good_catch.mp3").then(advance);
      setCorrections((c) => c + 1);
    } else {
      sfxWrong(); setMood("confused");
      setFeedback("❌ Robi was wrong! " + round.reason);
      speak("i_was_wrong.mp3").then(advance);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <Confetti active={showConfetti} />
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
