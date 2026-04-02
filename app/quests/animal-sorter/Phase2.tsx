"use client";
import { useState, useEffect, useRef } from "react";
import { ANIMALS, FEATURES, TrainingData, generateGuessRounds, GuessRound } from "./data";
import RobotBuddy from "./RobotBuddy";
import { sfxCorrect, sfxWrong, sfxTap, sfxThink } from "./sfx";
import { speak } from "./speak";
import Confetti from "./Confetti";

function ConfidenceMeter({ value }: { value: number }) {
  const color = value >= 70 ? "#4ade80" : value >= 45 ? "#fbbf24" : "#ef4444";
  return (
    <div className="flex items-center gap-2 w-48">
      <span className="text-xs opacity-60 w-20">Confidence:</span>
      <div className="progress-track flex-1">
        <div className="progress-fill" style={{ width: `${value}%`, background: color, transition: "width 0.5s" }} />
      </div>
      <span className="text-sm font-bold" style={{ color }}>{value}%</span>
    </div>
  );
}

function FeatureList({ round }: { round: GuessRound }) {
  const guessFeatures = FEATURES[round.robotGuess];
  const actualFeatures = FEATURES[round.animal];
  if (!guessFeatures) return null;

  return (
    <div className="rounded-xl p-3 text-sm max-w-xs" style={{ background: "rgba(255,255,255,0.05)" }}>
      <div className="text-xs opacity-50 mb-1">Robi sees:</div>
      <div className="flex flex-wrap gap-1">
        {round.features.map((f) => {
          const isShared = round.misleading?.includes(f);
          return (
            <span key={f} className="rounded-full px-2 py-0.5 text-xs" style={{
              background: isShared ? "rgba(251,191,36,0.2)" : "rgba(74,222,128,0.2)",
              color: isShared ? "#fbbf24" : "#4ade80",
            }}>
              {isShared ? "⚠️" : "✅"} {f}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Phase2({ training, onComplete }: { training: TrainingData; onComplete: (needsRetrain: boolean) => void }) {
  const [rounds] = useState(() => generateGuessRounds(training));
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [correctionNote, setCorrectionNote] = useState("");
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
    const needsRetrain = corrections >= 3;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 fade-in">
        <RobotBuddy mood={needsRetrain ? "confused" : "celebrate"} size={120} />
        <h2 className="text-3xl font-bold">Robi scored {pct}%!</h2>
        <p className="text-lg opacity-80 text-center max-w-md">
          {corrections === 0
            ? "Perfect! Robi got every one right — great training data!"
            : `You corrected ${corrections} mistake${corrections > 1 ? "s" : ""}. ${needsRetrain ? "Robi needs more training data!" : "Robi learned from each correction!"}`}
        </p>
        <div className="progress-track w-64">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* #3 — Retrain option when score is low */}
        {needsRetrain ? (
          <div className="flex gap-3 mt-4">
            <button className="btn" style={{ background: "var(--accent)", color: "#0f172a" }} onClick={() => { sfxTap(); onComplete(true); }}>
              🔄 Retrain Robi!
            </button>
            <button className="btn" style={{ background: "var(--card)" }} onClick={() => { sfxTap(); speak("tricky_round.mp3").then(() => onComplete(false)); }}>
              Continue anyway →
            </button>
          </div>
        ) : (
          <button className="btn btn-success mt-4" onClick={() => { sfxTap(); speak("tricky_round.mp3").then(() => onComplete(false)); }}>
            Next → Tricky Round!
          </button>
        )}
      </div>
    );
  }

  const round = rounds[idx];
  const animal = ANIMALS.find((a) => a.id === round.animal)!;
  const guessAnimal = ANIMALS.find((a) => a.id === round.robotGuess)!;
  const Svg = animal.Svg;
  const dataCount = training[round.animal] || 0;

  const advance = () => { setFeedback(""); setCorrectionNote(""); setMood("thinking"); setShowConfetti(false); setIdx((i) => i + 1); };

  const respond = (userSaysCorrect: boolean) => {
    if (round.correct && userSaysCorrect) {
      sfxCorrect(); setMood("happy"); setShowConfetti(true);
      setFeedback("✅ Yep! Robi got it right!");
      speak("got_it_right.mp3").then(advance);
    } else if (round.correct && !userSaysCorrect) {
      sfxThink(); setMood("confused");
      setFeedback("🤔 Actually, Robi WAS right! It's a " + animal.label + "!");
      speak("was_right.mp3").then(advance);
    } else if (!round.correct && !userSaysCorrect) {
      sfxCorrect(); setMood("happy"); setShowConfetti(true);
      setFeedback("👏 Good catch! " + round.reason);
      setCorrectionNote(round.correction || "");
      setCorrections((c) => c + 1);
      speak("good_catch.mp3").then(() => setTimeout(advance, 1500));
    } else {
      sfxWrong(); setMood("confused");
      setFeedback("❌ Robi was wrong! " + round.reason);
      setCorrectionNote(round.correction || "");
      setCorrections((c) => c + 1);
      speak("i_was_wrong.mp3").then(() => setTimeout(advance, 1500));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-8 fade-in">
      <Confetti active={showConfetti} />
      <h2 className="text-3xl font-bold">🤖 Phase 2: Robi Guesses!</h2>
      <RobotBuddy mood={mood} size={80} />
      <div className="text-sm opacity-70">{idx + 1} / {rounds.length}</div>

      <div className="my-1 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `3px solid ${animal.color}` }}>
        <Svg size={120} />
      </div>

      <div className="text-sm opacity-50">
        Robi trained on {dataCount} {animal.label.toLowerCase()}{dataCount !== 1 ? "s" : ""}
      </div>

      {/* #5 — Feature checklist */}
      <FeatureList round={round} />

      {/* #2 — Confidence meter */}
      <ConfidenceMeter value={round.confidence} />

      <div className="text-xl text-center">
        Robi: &quot;I&apos;m {round.confidence}% sure it&apos;s a... <b style={{ color: guessAnimal.color }}>{guessAnimal.label}!</b>&quot;
      </div>
      <div className="text-lg min-h-[1.5em] font-semibold text-center max-w-md">{feedback}</div>
      {/* #5 — Show correction note after wrong guess */}
      {correctionNote && <div className="text-base text-center max-w-md fade-in" style={{ color: "#4ade80" }}>{correctionNote}</div>}

      {!feedback && (
        <div className="flex gap-4 fade-in">
          <button className="btn text-xl" style={{ background: "var(--success)", color: "#0f172a" }} onClick={() => { sfxTap(); respond(true); }}>✅ Correct!</button>
          <button className="btn text-xl" style={{ background: "#ef4444" }} onClick={() => { sfxTap(); respond(false); }}>❌ Wrong!</button>
        </div>
      )}
    </div>
  );
}
