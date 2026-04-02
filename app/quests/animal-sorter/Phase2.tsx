"use client";
import { useState, useEffect, useRef } from "react";
import { ANIMALS, TrainingData, generateGuessRounds } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxWrong, sfxTap, sfxThink } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";

export default function Phase2({ training, onComplete }: { training: TrainingData; onComplete: () => void }) {
  const [rounds] = useState(() => generateGuessRounds(training));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [corrections, setCorrections] = useState(0);
  const [mood, setMood] = useState<"thinking" | "happy" | "confused">("thinking");
  const spokenRef = useRef(-1);
  const done = idx >= rounds.length;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!done && spokenRef.current !== idx) {
      spokenRef.current = idx;
      const g = ANIMALS.find((a) => a.id === rounds[idx].robotGuess)!;
      speak("think_" + g.category + ".mp3");
    }
  }, [idx, done, rounds]);

  if (done) {
    const correct = rounds.length - corrections;
    const pct = Math.round((correct / rounds.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood="celebrate" size={120} />
        <h2 className="text-3xl font-bold">Robi scored {pct}%!</h2>
        <p className="text-lg opacity-80 text-center max-w-md">
          {corrections === 0
            ? "Perfect! Robi got every one right — great training data!"
            : `You corrected ${corrections} mistake${corrections > 1 ? "s" : ""}. ${corrections >= 3 ? "Robi needed more training data!" : "Robi learned from each correction!"}`}
        </p>
        <div className="progress-track w-64">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("tricky_round.mp3").then(onComplete); }}>Next → Tricky Round!</button>
      </div>
    );
  }

  const round = rounds[idx];
  const animal = ANIMALS.find((a) => a.id === round.animal)!;
  const guessAnimal = ANIMALS.find((a) => a.id === round.robotGuess)!;
  const Svg = animal.Svg;
  const dataCount = training[round.animal] || 0;

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
      setCorrections((c) => c + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 fade-in">
      <Confetti active={showConfetti} />
      <h2 className="text-3xl font-bold">🤖 Phase 2: Robi Guesses!</h2>
      <RobotBuddy mood={mood} size={80} />
      <div className="text-sm opacity-70">{idx + 1} / {rounds.length}</div>

      <div className="my-2 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `3px solid ${animal.color}` }}>
        <Svg size={120} />
      </div>

      <div className="text-sm opacity-50">
        Robi trained on {dataCount} {animal.label.toLowerCase()}{dataCount !== 1 ? "s" : ""}
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
